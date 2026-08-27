import { and, asc, eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { actionDefinitions, agents, procedureSteps, procedures } from "../../drizzle/schema";
import { workspaceManagerProcedure, workspaceProcedure } from "../authz";
import { requireDb, writeAuditLog } from "../db";
import { router } from "../_core/trpc";

const workspaceIdInput = z.object({ workspaceId: z.number().int().positive() });

async function requireAgent(workspaceId: number, agentId: number) {
  const db = await requireDb();
  const agent = (await db.select().from(agents).where(and(eq(agents.id, agentId), eq(agents.workspaceId, workspaceId))).limit(1))[0];
  if (!agent) throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found in this workspace." });
  return agent;
}

async function requireActionForAgent(workspaceId: number, agentId: number, actionDefinitionId: number) {
  const db = await requireDb();
  const action = (await db.select().from(actionDefinitions).where(and(eq(actionDefinitions.id, actionDefinitionId), eq(actionDefinitions.workspaceId, workspaceId), eq(actionDefinitions.agentId, agentId))).limit(1))[0];
  if (!action) throw new TRPCError({ code: "BAD_REQUEST", message: "Every procedure action must belong to the selected agent and workspace." });
  return action;
}

async function requireProcedure(workspaceId: number, procedureId: number) {
  const db = await requireDb();
  const procedure = (await db.select().from(procedures).where(and(eq(procedures.id, procedureId), eq(procedures.workspaceId, workspaceId))).limit(1))[0];
  if (!procedure) throw new TRPCError({ code: "NOT_FOUND", message: "Procedure not found in this workspace." });
  const steps = await db.select().from(procedureSteps).where(eq(procedureSteps.procedureId, procedureId)).orderBy(asc(procedureSteps.position));
  return { ...procedure, steps };
}

export const proceduresRouter = router({
  list: workspaceProcedure.input(workspaceIdInput.extend({ agentId: z.number().int().positive() })).query(async ({ ctx, input }) => {
    await requireAgent(ctx.workspaceId, input.agentId);
    const db = await requireDb();
    return db.select().from(procedures).where(and(eq(procedures.workspaceId, ctx.workspaceId), eq(procedures.agentId, input.agentId)));
  }),

  get: workspaceProcedure.input(workspaceIdInput.extend({ procedureId: z.number().int().positive() })).query(({ ctx, input }) => requireProcedure(ctx.workspaceId, input.procedureId)),

  // Only one Procedure is selected per conversation turn (the most relevant
  // trigger match) and at most one Action runs per turn. Sensitive flows
  // (refunds, cancellations, plan changes) MUST be procedureOnly=true so the
  // agent cannot improvise the sequence — see analysis §3 "Procedures" note.
  create: workspaceManagerProcedure
    .input(
      workspaceIdInput.extend({
        agentId: z.number().int().positive(),
        name: z.string().trim().min(2).max(160),
        description: z.string().trim().max(2000).optional(),
        triggerPhrases: z.array(z.string().trim().min(1).max(120)).min(1).max(20),
        procedureOnly: z.boolean().default(true),
        steps: z
          .array(
            z.object({
              instruction: z.string().trim().min(2).max(2000),
              actionDefinitionId: z.number().int().positive().optional(),
              branchCondition: z.string().trim().max(500).optional(),
            }),
          )
          .min(1)
          .max(30),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await requireAgent(ctx.workspaceId, input.agentId);
      const linkedActionIds = input.steps.map(step => step.actionDefinitionId).filter((id): id is number => id !== undefined);
      await Promise.all(linkedActionIds.map(actionDefinitionId => requireActionForAgent(ctx.workspaceId, input.agentId, actionDefinitionId)));
      const db = await requireDb();
      const created = await db.insert(procedures).values({
        workspaceId: ctx.workspaceId,
        agentId: input.agentId,
        name: input.name,
        description: input.description,
        triggerPhrases: input.triggerPhrases,
        procedureOnly: input.procedureOnly,
        status: "draft",
        createdById: ctx.user.id,
      });
      const procedureId = Number(created[0].insertId);
      await db.insert(procedureSteps).values(
        input.steps.map((step, index) => ({
          procedureId,
          workspaceId: ctx.workspaceId,
          position: index + 1,
          instruction: step.instruction,
          actionDefinitionId: step.actionDefinitionId,
          branchCondition: step.branchCondition,
        })),
      );
      await writeAuditLog({ workspaceId: ctx.workspaceId, actorUserId: ctx.user.id, action: "procedure.created", resourceType: "procedure", resourceId: procedureId });
      return requireProcedure(ctx.workspaceId, procedureId);
    }),

  setStatus: workspaceManagerProcedure
    .input(workspaceIdInput.extend({ procedureId: z.number().int().positive(), status: z.enum(["active", "disabled"]) }))
    .mutation(async ({ ctx, input }) => {
      const procedure = await requireProcedure(ctx.workspaceId, input.procedureId);
      if (input.status === "active" && procedure.steps.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "A procedure needs at least one step before activation." });
      }
      const db = await requireDb();
      await db.update(procedures).set({ status: input.status }).where(and(eq(procedures.id, input.procedureId), eq(procedures.workspaceId, ctx.workspaceId)));
      await writeAuditLog({ workspaceId: ctx.workspaceId, actorUserId: ctx.user.id, action: `procedure.status_${input.status}`, resourceType: "procedure", resourceId: input.procedureId });
      return { success: true } as const;
    }),

  // Regression-test helper: returns the trigger phrases and step count so a
  // per-channel test harness (web/email/slack) can assert the procedure
  // still resolves and every step's action is enabled in that channel.
  validateForChannel: workspaceProcedure
    .input(workspaceIdInput.extend({ procedureId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const procedure = await requireProcedure(ctx.workspaceId, input.procedureId);
      const db = await requireDb();
      const actionIds = procedure.steps.map(step => step.actionDefinitionId).filter((id): id is number => id !== null);
      const linkedActions = actionIds.length
        ? await db.select().from(actionDefinitions).where(and(eq(actionDefinitions.workspaceId, ctx.workspaceId), inArray(actionDefinitions.id, actionIds)))
        : [];
      const disabledActions = linkedActions.filter(action => action.status === "disabled").length;
      return { triggerPhrases: procedure.triggerPhrases ?? [], stepCount: procedure.steps.length, disabledActions };
    }),
});
