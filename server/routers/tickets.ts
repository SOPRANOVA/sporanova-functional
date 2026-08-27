import { and, desc, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { channels, conversations, memberships, tickets } from "../../drizzle/schema";
import { workspaceManagerProcedure, workspaceMemberProcedure, workspaceProcedure } from "../authz";
import { requireDb, writeAuditLog } from "../db";
import { router } from "../_core/trpc";

const workspaceIdInput = z.object({ workspaceId: z.number().int().positive() });

async function requireConversation(workspaceId: number, conversationId: number) {
  const db = await requireDb();
  const conversation = (await db.select().from(conversations).where(and(eq(conversations.id, conversationId), eq(conversations.workspaceId, workspaceId))).limit(1))[0];
  if (!conversation) throw new TRPCError({ code: "NOT_FOUND", message: "Conversation not found in this workspace." });
  return conversation;
}

async function requireWorkspaceMember(workspaceId: number, userId: number) {
  const db = await requireDb();
  const membership = (await db.select().from(memberships).where(and(eq(memberships.workspaceId, workspaceId), eq(memberships.userId, userId), eq(memberships.isActive, true))).limit(1))[0];
  if (!membership) throw new TRPCError({ code: "BAD_REQUEST", message: "The assignee must be an active member of this workspace." });
  return membership;
}

async function requireChannel(workspaceId: number, channelId: number) {
  const db = await requireDb();
  const channel = (await db.select().from(channels).where(and(eq(channels.id, channelId), eq(channels.workspaceId, workspaceId))).limit(1))[0];
  if (!channel) throw new TRPCError({ code: "NOT_FOUND", message: "Channel not found in this workspace." });
  return channel;
}

async function requireTicket(workspaceId: number, ticketId: number) {
  const db = await requireDb();
  const ticket = (await db.select().from(tickets).where(and(eq(tickets.id, ticketId), eq(tickets.workspaceId, workspaceId))).limit(1))[0];
  if (!ticket) throw new TRPCError({ code: "NOT_FOUND", message: "Ticket not found in this workspace." });
  return ticket;
}

export const ticketsRouter = router({
  list: workspaceProcedure
    .input(workspaceIdInput.extend({ status: z.enum(["open", "pending", "resolved", "closed"]).optional(), pageSize: z.number().int().min(1).max(50).default(25) }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      const conditions = [eq(tickets.workspaceId, ctx.workspaceId)];
      if (input.status) conditions.push(eq(tickets.status, input.status));
      return db.select().from(tickets).where(and(...conditions)).orderBy(desc(tickets.updatedAt)).limit(input.pageSize);
    }),

  get: workspaceProcedure.input(workspaceIdInput.extend({ ticketId: z.number().int().positive() })).query(({ ctx, input }) => requireTicket(ctx.workspaceId, input.ticketId)),

  // Called by the escalate_to_human action (see server/worker.ts) or directly
  // by a human agent taking over a conversation mid-flow.
  createFromConversation: workspaceMemberProcedure
    .input(
      workspaceIdInput.extend({
        conversationId: z.number().int().positive(),
        channelId: z.number().int().positive().optional(),
        subject: z.string().trim().min(2).max(255),
        priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
        escalationReason: z.string().trim().max(160).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await requireConversation(ctx.workspaceId, input.conversationId);
      if (input.channelId) await requireChannel(ctx.workspaceId, input.channelId);
      const db = await requireDb();
      const created = await db.insert(tickets).values({
        workspaceId: ctx.workspaceId,
        conversationId: input.conversationId,
        channelId: input.channelId,
        subject: input.subject,
        priority: input.priority,
        escalationReason: input.escalationReason,
        status: "open",
      });
      const id = Number(created[0].insertId);
      await writeAuditLog({ workspaceId: ctx.workspaceId, actorUserId: ctx.user.id, action: "ticket.created", resourceType: "ticket", resourceId: id });
      return requireTicket(ctx.workspaceId, id);
    }),

  assign: workspaceManagerProcedure
    .input(workspaceIdInput.extend({ ticketId: z.number().int().positive(), assigneeUserId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      await requireTicket(ctx.workspaceId, input.ticketId);
      await requireWorkspaceMember(ctx.workspaceId, input.assigneeUserId);
      const db = await requireDb();
      await db.update(tickets).set({ assigneeUserId: input.assigneeUserId, status: "pending" }).where(and(eq(tickets.id, input.ticketId), eq(tickets.workspaceId, ctx.workspaceId)));
      await writeAuditLog({ workspaceId: ctx.workspaceId, actorUserId: ctx.user.id, action: "ticket.assigned", resourceType: "ticket", resourceId: input.ticketId, metadata: { assigneeUserId: input.assigneeUserId } });
      return { success: true } as const;
    }),

  setStatus: workspaceMemberProcedure
    .input(workspaceIdInput.extend({ ticketId: z.number().int().positive(), status: z.enum(["open", "pending", "resolved", "closed"]) }))
    .mutation(async ({ ctx, input }) => {
      await requireTicket(ctx.workspaceId, input.ticketId);
      const db = await requireDb();
      await db
        .update(tickets)
        .set({ status: input.status, resolvedAt: input.status === "resolved" || input.status === "closed" ? new Date() : null })
        .where(and(eq(tickets.id, input.ticketId), eq(tickets.workspaceId, ctx.workspaceId)));
      await writeAuditLog({ workspaceId: ctx.workspaceId, actorUserId: ctx.user.id, action: `ticket.status_${input.status}`, resourceType: "ticket", resourceId: input.ticketId });
      return { success: true } as const;
    }),
});
