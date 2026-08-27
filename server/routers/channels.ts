import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { agents, channels } from "../../drizzle/schema";
import { workspaceManagerProcedure, workspaceProcedure } from "../authz";
import { requireDb, writeAuditLog } from "../db";
import { router } from "../_core/trpc";

const workspaceIdInput = z.object({ workspaceId: z.number().int().positive() });
const channelTypes = ["web_widget", "help_page", "email", "slack", "whatsapp", "api"] as const;

async function requireAgent(workspaceId: number, agentId: number) {
  const db = await requireDb();
  const agent = (await db.select().from(agents).where(and(eq(agents.id, agentId), eq(agents.workspaceId, workspaceId))).limit(1))[0];
  if (!agent) throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found in this workspace." });
  return agent;
}

function hasValidConfiguration(type: (typeof channelTypes)[number], configuration: Record<string, unknown> | null | undefined) {
  if (!configuration || Object.keys(configuration).length === 0) return false;
  const requiredKeyByType: Partial<Record<(typeof channelTypes)[number], string>> = {
    web_widget: "allowedOrigins",
    help_page: "path",
    email: "fromAddress",
    slack: "integrationId",
    whatsapp: "integrationId",
    api: "endpoint",
  };
  const requiredKey = requiredKeyByType[type];
  return requiredKey ? Boolean(configuration[requiredKey]) : true;
}

async function requireChannel(workspaceId: number, channelId: number) {
  const db = await requireDb();
  const channel = (await db.select().from(channels).where(and(eq(channels.id, channelId), eq(channels.workspaceId, workspaceId))).limit(1))[0];
  if (!channel) throw new TRPCError({ code: "NOT_FOUND", message: "Channel not found in this workspace." });
  return channel;
}

export const channelsRouter = router({
  list: workspaceProcedure.input(workspaceIdInput.extend({ agentId: z.number().int().positive().optional() })).query(async ({ ctx, input }) => {
    const db = await requireDb();
    const conditions = [eq(channels.workspaceId, ctx.workspaceId)];
    if (input.agentId) conditions.push(eq(channels.agentId, input.agentId));
    return db.select().from(channels).where(and(...conditions));
  }),

  create: workspaceManagerProcedure
    .input(
      workspaceIdInput.extend({
        agentId: z.number().int().positive(),
        type: z.enum(channelTypes),
        label: z.string().trim().min(2).max(160),
        configuration: z.record(z.string(), z.unknown()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await requireAgent(ctx.workspaceId, input.agentId);
      const db = await requireDb();
      const created = await db.insert(channels).values({
        workspaceId: ctx.workspaceId,
        agentId: input.agentId,
        type: input.type,
        label: input.label,
        configuration: input.configuration,
        status: "unconfigured",
        createdById: ctx.user.id,
      });
      const id = Number(created[0].insertId);
      await writeAuditLog({ workspaceId: ctx.workspaceId, actorUserId: ctx.user.id, action: "channel.created", resourceType: "channel", resourceId: id });
      return requireChannel(ctx.workspaceId, id);
    }),

  // A channel only goes "active" once its configuration has been explicitly
  // validated (e.g. widget domain allow-list, mailbox verified, Slack app
  // installed). Never flip status to active on create — see docs/refactor-plan.md.
  setStatus: workspaceManagerProcedure
    .input(workspaceIdInput.extend({ channelId: z.number().int().positive(), status: z.enum(["active", "paused"]) }))
    .mutation(async ({ ctx, input }) => {
      const channel = await requireChannel(ctx.workspaceId, input.channelId);
      if (input.status === "active" && !hasValidConfiguration(channel.type, channel.configuration)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Configure this channel with the required settings before activating it." });
      }
      const db = await requireDb();
      await db.update(channels).set({ status: input.status }).where(and(eq(channels.id, input.channelId), eq(channels.workspaceId, ctx.workspaceId)));
      await writeAuditLog({ workspaceId: ctx.workspaceId, actorUserId: ctx.user.id, action: `channel.status_${input.status}`, resourceType: "channel", resourceId: input.channelId });
      return { success: true } as const;
    }),

  update: workspaceManagerProcedure
    .input(workspaceIdInput.extend({ channelId: z.number().int().positive(), configuration: z.record(z.string(), z.unknown()) }))
    .mutation(async ({ ctx, input }) => {
      await requireChannel(ctx.workspaceId, input.channelId);
      const db = await requireDb();
      await db.update(channels).set({ configuration: input.configuration, status: "paused" }).where(and(eq(channels.id, input.channelId), eq(channels.workspaceId, ctx.workspaceId)));
      await writeAuditLog({ workspaceId: ctx.workspaceId, actorUserId: ctx.user.id, action: "channel.configuration_updated", resourceType: "channel", resourceId: input.channelId });
      return requireChannel(ctx.workspaceId, input.channelId);
    }),
});
