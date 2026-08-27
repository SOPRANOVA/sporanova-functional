import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { actionCalls, actionDefinitions, agents, channels } from "../../drizzle/schema";
import { workspaceManagerProcedure, workspaceMemberProcedure, workspaceProcedure } from "../authz";
import { requireDb, writeAuditLog } from "../db";
import { enqueueJob } from "../jobs";
import { router } from "../_core/trpc";

const workspaceIdInput = z.object({ workspaceId: z.number().int().positive() });
const actionKinds = ["http_api", "escalate_to_human", "search_knowledge", "create_ticket", "custom"] as const;

async function requireAgent(workspaceId: number, agentId: number) {
  const db = await requireDb();
  const agent = (await db.select().from(agents).where(and(eq(agents.id, agentId), eq(agents.workspaceId, workspaceId))).limit(1))[0];
  if (!agent) throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found in this workspace." });
  return agent;
}

async function requireChannel(workspaceId: number, channelId: number) {
  const db = await requireDb();
  const channel = (await db.select().from(channels).where(and(eq(channels.id, channelId), eq(channels.workspaceId, workspaceId))).limit(1))[0];
  if (!channel) throw new TRPCError({ code: "NOT_FOUND", message: "Channel not found in this workspace." });
  return channel;
}

async function requireAction(workspaceId: number, actionDefinitionId: number) {
  const db = await requireDb();
  const action = (await db.select().from(actionDefinitions).where(and(eq(actionDefinitions.id, actionDefinitionId), eq(actionDefinitions.workspaceId, workspaceId))).limit(1))[0];
  if (!action) throw new TRPCError({ code: "NOT_FOUND", message: "Action not found in this workspace." });
  return action;
}

export const actionsRouter = router({
  list: workspaceProcedure.input(workspaceIdInput.extend({ agentId: z.number().int().positive() })).query(async ({ ctx, input }) => {
    await requireAgent(ctx.workspaceId, input.agentId);
    const db = await requireDb();
    return db.select().from(actionDefinitions).where(and(eq(actionDefinitions.workspaceId, ctx.workspaceId), eq(actionDefinitions.agentId, input.agentId)));
  }),

  create: workspaceManagerProcedure
    .input(
      workspaceIdInput.extend({
        agentId: z.number().int().positive(),
        name: z.string().trim().min(2).max(160),
        kind: z.enum(actionKinds),
        // procedureOnly=true means this action can only fire as a step
        // inside an active Procedure — never improvised from a free-form
        // reply. Payments, refunds and account changes should default true.
        procedureOnly: z.boolean().default(false),
        configuration: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await requireAgent(ctx.workspaceId, input.agentId);
      const db = await requireDb();
      const created = await db.insert(actionDefinitions).values({
        workspaceId: ctx.workspaceId,
        agentId: input.agentId,
        name: input.name,
        kind: input.kind,
        procedureOnly: input.procedureOnly,
        configuration: input.configuration,
        status: "enabled",
        createdById: ctx.user.id,
      });
      const id = Number(created[0].insertId);
      await writeAuditLog({ workspaceId: ctx.workspaceId, actorUserId: ctx.user.id, action: "action.created", resourceType: "action_definition", resourceId: id });
      return requireAction(ctx.workspaceId, id);
    }),

  setStatus: workspaceManagerProcedure
    .input(workspaceIdInput.extend({ actionDefinitionId: z.number().int().positive(), status: z.enum(["enabled", "disabled"]) }))
    .mutation(async ({ ctx, input }) => {
      await requireAction(ctx.workspaceId, input.actionDefinitionId);
      const db = await requireDb();
      await db.update(actionDefinitions).set({ status: input.status }).where(and(eq(actionDefinitions.id, input.actionDefinitionId), eq(actionDefinitions.workspaceId, ctx.workspaceId)));
      await writeAuditLog({ workspaceId: ctx.workspaceId, actorUserId: ctx.user.id, action: `action.status_${input.status}`, resourceType: "action_definition", resourceId: input.actionDefinitionId });
      return { success: true } as const;
    }),

  // Records the call and hands execution to the worker (server/worker.ts) —
  // action execution never blocks the chat request/response cycle, mirroring
  // the existing agentRuns pattern.
  invoke: workspaceMemberProcedure
    .input(
      workspaceIdInput.extend({
        actionDefinitionId: z.number().int().positive(),
        conversationId: z.number().int().positive().optional(),
        channelId: z.number().int().positive().optional(),
        input: z.record(z.string(), z.unknown()).default({}),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const action = await requireAction(ctx.workspaceId, input.actionDefinitionId);
      if (action.status === "disabled") throw new TRPCError({ code: "BAD_REQUEST", message: "This action is disabled." });
      if (input.channelId) await requireChannel(ctx.workspaceId, input.channelId);
      const db = await requireDb();
      const created = await db.insert(actionCalls).values({
        workspaceId: ctx.workspaceId,
        actionDefinitionId: input.actionDefinitionId,
        conversationId: input.conversationId,
        channelId: input.channelId,
        status: "pending",
        input: input.input,
      });
      const actionCallId = Number(created[0].insertId);
      await enqueueJob({ workspaceId: ctx.workspaceId, type: "action_call.execute", payload: { actionCallId } });
      return { actionCallId, status: "pending" } as const;
    }),

  calls: workspaceProcedure
    .input(workspaceIdInput.extend({ actionDefinitionId: z.number().int().positive(), pageSize: z.number().int().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      await requireAction(ctx.workspaceId, input.actionDefinitionId);
      const db = await requireDb();
      return db
        .select()
        .from(actionCalls)
        .where(and(eq(actionCalls.workspaceId, ctx.workspaceId), eq(actionCalls.actionDefinitionId, input.actionDefinitionId)))
        .orderBy(desc(actionCalls.createdAt))
        .limit(input.pageSize);
    }),
});
