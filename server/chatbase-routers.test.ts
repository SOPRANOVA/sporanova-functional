import { describe, expect, it, beforeEach, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getActiveMembership: vi.fn(),
  requireDb: vi.fn(),
  writeAuditLog: vi.fn(),
  enqueueJob: vi.fn(),
}));

vi.mock("./db", () => ({ getActiveMembership: mocks.getActiveMembership, requireDb: mocks.requireDb, writeAuditLog: mocks.writeAuditLog }));
vi.mock("./jobs", () => ({ enqueueJob: mocks.enqueueJob }));

import { channelsRouter } from "./routers/channels";
import { proceduresRouter } from "./routers/procedures";
import { actionsRouter } from "./routers/actions";
import { ticketsRouter } from "./routers/tickets";
import { router } from "./_core/trpc";
import type { TrpcContext } from "./_core/context";

const testRouter = router({ channels: channelsRouter, procedures: proceduresRouter, actions: actionsRouter, tickets: ticketsRouter });

function context(role: "owner" | "admin" | "member" | "viewer" = "member"): TrpcContext {
  return {
    user: { id: 41, openId: "user-41", name: "Test User", email: "test@example.com", loginMethod: "credentials", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function chain<T>(rows: T[]) {
  const query = (): Record<string, unknown> & PromiseLike<T[]> => {
    const result = {
      limit: async () => rows,
      orderBy: () => query(),
      then: (resolve: (value: T[]) => unknown, reject?: (reason: unknown) => unknown) => Promise.resolve(rows).then(resolve, reject),
    };
    return result;
  };
  return { from: () => ({ where: () => query() }) };
}

function dbMock(selectRows: unknown[][], insertId = 501) {
  let selectIndex = 0;
  const select = vi.fn(() => chain(selectRows[selectIndex++] ?? []));
  const insert = vi.fn(() => ({ values: vi.fn(async () => [{ insertId }]) }));
  const update = vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn(async () => ({ affectedRows: 1 })) })) }));
  const db = { select, insert, update };
  mocks.requireDb.mockResolvedValue(db);
  return { db, insert, update };
}

describe("Chatbase-parity router isolation contracts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getActiveMembership.mockResolvedValue({ workspaceId: 7, userId: 41, role: "admin", isActive: true });
    mocks.writeAuditLog.mockResolvedValue(undefined);
    mocks.enqueueJob.mockResolvedValue(801);
  });

  it("rejects a channel read when the membership belongs to another workspace", async () => {
    mocks.getActiveMembership.mockResolvedValue(null);
    const caller = testRouter.createCaller(context("admin"));
    await expect(caller.channels.list({ workspaceId: 7 })).rejects.toThrow("access to this workspace");
    expect(mocks.requireDb).not.toHaveBeenCalled();
  });

  it("rejects activating a channel without type-specific configuration", async () => {
    const { update } = dbMock([[{ id: 12, workspaceId: 7, type: "email", configuration: {}, status: "unconfigured" }]]);
    const caller = testRouter.createCaller(context("admin"));
    await expect(caller.channels.setStatus({ workspaceId: 7, channelId: 12, status: "active" })).rejects.toThrow("required settings");
    expect(update).not.toHaveBeenCalled();
  });

  it("rejects a procedure step linked to an action from another agent", async () => {
    const { insert } = dbMock([[{ id: 21, workspaceId: 7 }], []]);
    const caller = testRouter.createCaller(context("admin"));
    await expect(caller.procedures.create({ workspaceId: 7, agentId: 21, name: "Refund review", triggerPhrases: ["refund"], steps: [{ instruction: "Verify the request", actionDefinitionId: 999 }] })).rejects.toThrow("selected agent and workspace");
    expect(insert).not.toHaveBeenCalled();
  });

  it("rejects invoking an action with a channel from another workspace", async () => {
    const { insert } = dbMock([
      [{ id: 31, workspaceId: 7, agentId: 21, status: "enabled" }],
      [],
    ]);
    const caller = testRouter.createCaller(context());
    await expect(caller.actions.invoke({ workspaceId: 7, actionDefinitionId: 31, channelId: 88, input: {} })).rejects.toThrow("Channel not found");
    expect(insert).not.toHaveBeenCalled();
    expect(mocks.enqueueJob).not.toHaveBeenCalled();
  });

  it("rejects assigning a ticket to an inactive or cross-workspace user", async () => {
    const { update } = dbMock([
      [{ id: 41, workspaceId: 7, conversationId: 51, status: "open" }],
      [],
    ]);
    const caller = testRouter.createCaller(context("admin"));
    await expect(caller.tickets.assign({ workspaceId: 7, ticketId: 41, assigneeUserId: 99 })).rejects.toThrow("active member");
    expect(update).not.toHaveBeenCalled();
  });

  it("creates a ticket only from a workspace conversation and writes an audit event", async () => {
    const { insert } = dbMock([
      [{ id: 51, workspaceId: 7, title: "Conversation" }],
      [{ id: 71, workspaceId: 7, conversationId: 51, subject: "Needs review", status: "open" }],
    ], 71);
    const caller = testRouter.createCaller(context());
    await expect(caller.tickets.createFromConversation({ workspaceId: 7, conversationId: 51, subject: "Needs review", priority: "high" })).resolves.toMatchObject({ id: 71, workspaceId: 7 });
    expect(insert).toHaveBeenCalledTimes(1);
    expect(mocks.writeAuditLog).toHaveBeenCalledWith(expect.objectContaining({ action: "ticket.created", resourceId: 71, workspaceId: 7 }));
  });
});
