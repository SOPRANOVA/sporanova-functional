import { and, desc, eq, isNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { notifications, users, workflowNodes, workflowRuns, workflows } from "../../drizzle/schema";
import { workspaceManagerProcedure, workspaceMemberProcedure, workspaceProcedure } from "../authz";
import { requireDb, writeAuditLog } from "../db";
import { sendEmail } from "../email";
import { router } from "../_core/trpc";

const workspaceInput = z.object({ workspaceId: z.number().int().positive() });
const nodeInput = z.object({
  nodeKey: z.string().trim().min(1).max(80),
  nodeType: z.enum(["trigger", "intelligence", "condition", "action"]),
  label: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional(),
  positionX: z.number().int().min(-10000).max(10000).default(0),
  positionY: z.number().int().min(-10000).max(10000).default(0),
  sortOrder: z.number().int().min(0).max(1000).default(0),
  configuration: z.record(z.string(), z.unknown()).optional(),
});

async function ensureWorkflow(workspaceId: number, workflowId: number) {
  const db = await requireDb();
  const workflow = (await db.select().from(workflows).where(and(eq(workflows.id, workflowId), eq(workflows.workspaceId, workspaceId), isNull(workflows.deletedAt))).limit(1))[0];
  if (!workflow) throw new TRPCError({ code: "NOT_FOUND", message: "Workflow not found in this workspace." });
  return workflow;
}

export const workflowsRouter = router({
  list: workspaceProcedure.input(workspaceInput).query(async ({ ctx }) => {
    const db = await requireDb();
    return db.select().from(workflows).where(and(eq(workflows.workspaceId, ctx.workspaceId), isNull(workflows.deletedAt))).orderBy(desc(workflows.updatedAt));
  }),

  get: workspaceProcedure.input(workspaceInput.extend({ workflowId: z.number().int().positive() })).query(async ({ ctx, input }) => {
    const workflow = await ensureWorkflow(ctx.workspaceId, input.workflowId);
    const db = await requireDb();
    const nodes = await db.select().from(workflowNodes).where(eq(workflowNodes.workflowId, workflow.id)).orderBy(workflowNodes.sortOrder);
    return { workflow, nodes };
  }),

  create: workspaceManagerProcedure
    .input(workspaceInput.extend({ name: z.string().trim().min(2).max(160), description: z.string().trim().max(4000).optional(), nodes: z.array(nodeInput).min(1).max(50) }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const result = await db.insert(workflows).values({ workspaceId: ctx.workspaceId, name: input.name, description: input.description, createdById: ctx.user.id });
      const workflowId = Number(result[0].insertId);
      await db.insert(workflowNodes).values(input.nodes.map(node => ({ workflowId, ...node })));
      await writeAuditLog({ workspaceId: ctx.workspaceId, actorUserId: ctx.user.id, action: "workflow.created", resourceType: "workflow", resourceId: workflowId });
      return { id: workflowId };
    }),

  update: workspaceManagerProcedure
    .input(workspaceInput.extend({ workflowId: z.number().int().positive(), name: z.string().trim().min(2).max(160).optional(), description: z.string().trim().max(4000).nullable().optional(), status: z.enum(["active", "paused", "draft", "archived"]).optional() }))
    .mutation(async ({ ctx, input }) => {
      await ensureWorkflow(ctx.workspaceId, input.workflowId);
      const db = await requireDb();
      const { workspaceId: _workspaceId, workflowId, ...changes } = input;
      await db.update(workflows).set(changes).where(and(eq(workflows.id, workflowId), eq(workflows.workspaceId, ctx.workspaceId)));
      await writeAuditLog({ workspaceId: ctx.workspaceId, actorUserId: ctx.user.id, action: "workflow.updated", resourceType: "workflow", resourceId: workflowId });
      return { success: true };
    }),

  runNow: workspaceMemberProcedure.input(workspaceInput.extend({ workflowId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const workflow = await ensureWorkflow(ctx.workspaceId, input.workflowId);
    if (workflow.status === "archived") throw new TRPCError({ code: "CONFLICT", message: "Archived workflows cannot be executed." });
    const db = await requireDb();
    const runResult = await db.insert(workflowRuns).values({ workspaceId: ctx.workspaceId, workflowId: workflow.id, status: "running", triggerType: "manual", startedAt: new Date(), createdById: ctx.user.id });
    const runId = Number(runResult[0].insertId);
    const actionNodes = await db.select().from(workflowNodes).where(and(eq(workflowNodes.workflowId, workflow.id), eq(workflowNodes.nodeType, "action"))).orderBy(workflowNodes.sortOrder);
    const executed: number[] = [];
    const unsupported: string[] = [];
    for (const node of actionNodes) {
      const config = (node.configuration ?? {}) as Record<string, unknown>;
      if (config.action === "create_notification" && typeof config.recipientUserId === "number" && typeof config.title === "string" && typeof config.content === "string") {
        await db.insert(notifications).values({ workspaceId: ctx.workspaceId, recipientUserId: config.recipientUserId, type: "workflow", title: config.title.slice(0, 255), content: config.content });
        const recipient = (await db.select().from(users).where(eq(users.id, config.recipientUserId)).limit(1))[0];
        if (recipient?.email) {
          await sendEmail({ to: recipient.email, subject: config.title.slice(0, 255), text: config.content });
        }
        executed.push(node.id);
      } else {
        unsupported.push(node.nodeKey);
      }
    }
    if (executed.length === 0) {
      const errorMessage = "This workflow has no configured executable notification action.";
      await db.update(workflowRuns).set({ status: "failed", errorMessage, output: { unsupportedNodes: unsupported }, completedAt: new Date() }).where(eq(workflowRuns.id, runId));
      throw new TRPCError({ code: "BAD_REQUEST", message: errorMessage });
    }
    const status = unsupported.length ? "failed" : "completed";
    const output = { executedNotificationNodes: executed, unsupportedNodes: unsupported };
    await db.update(workflowRuns).set({ status, output, errorMessage: unsupported.length ? "Some workflow nodes are not configured with a supported action." : null, completedAt: new Date() }).where(eq(workflowRuns.id, runId));
    await writeAuditLog({ workspaceId: ctx.workspaceId, actorUserId: ctx.user.id, action: status === "completed" ? "workflow.run_completed" : "workflow.run_partially_failed", resourceType: "workflowRun", resourceId: runId, metadata: { workflowId: workflow.id, ...output } });
    return { id: runId, status, output };
  }),

  runs: workspaceProcedure.input(workspaceInput.extend({ workflowId: z.number().int().positive(), pageSize: z.number().int().min(1).max(50).default(20) })).query(async ({ ctx, input }) => {
    await ensureWorkflow(ctx.workspaceId, input.workflowId);
    const db = await requireDb();
    return db.select().from(workflowRuns).where(and(eq(workflowRuns.workspaceId, ctx.workspaceId), eq(workflowRuns.workflowId, input.workflowId))).orderBy(desc(workflowRuns.createdAt)).limit(input.pageSize);
  }),
});
