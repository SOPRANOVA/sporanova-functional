import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { authenticateWithPassword, createSession, publicUser, registerWithPassword, revokeSession, SESSION_COOKIE, sessionCookieOptions } from "./auth";
import { bootstrapWorkspace } from "./db";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { agentsRouter } from "./routers/agents";
import { analyticsRouter } from "./routers/analytics";
import { auditRouter, notificationsRouter } from "./routers/notifications";
import { conversationsRouter, intelligenceRouter } from "./routers/conversations";
import { dashboardRouter } from "./routers/dashboard";
import { dataSourcesRouter, documentsRouter, memoryRouter } from "./routers/data";
import { preferencesRouter, workspacesRouter } from "./routers/workspaces";
import { workflowsRouter } from "./routers/workflows";

const credentialsInput = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(12, "Use at least 12 characters.").max(128),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => (ctx.user ? publicUser(ctx.user) : null)),
    register: publicProcedure.input(credentialsInput.extend({ name: z.string().trim().min(2).max(160) })).mutation(async ({ ctx, input }) => {
      try {
        const user = await registerWithPassword(input);
        await bootstrapWorkspace(user);
        const session = await createSession(user.id);
        ctx.res.cookie(SESSION_COOKIE, session.token, sessionCookieOptions(session.expiresAt));
        return publicUser(user);
      } catch (error) {
        if (error instanceof Error && error.message === "EMAIL_ALREADY_REGISTERED") throw new TRPCError({ code: "CONFLICT", message: "An account already exists for this email." });
        throw error;
      }
    }),
    login: publicProcedure.input(credentialsInput).mutation(async ({ ctx, input }) => {
      const user = await authenticateWithPassword(input.email, input.password);
      if (!user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Email or password is incorrect." });
      const session = await createSession(user.id);
      ctx.res.cookie(SESSION_COOKIE, session.token, sessionCookieOptions(session.expiresAt));
      return publicUser(user);
    }),
    logout: publicProcedure.mutation(async ({ ctx }) => {
      const token = ctx.req.headers.cookie?.split(";").map(item => item.trim()).find(item => item.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);
      await revokeSession(token);
      ctx.res.clearCookie(SESSION_COOKIE, sessionCookieOptions());
      return { success: true } as const;
    }),
  }),
  workspaces: workspacesRouter,
  preferences: preferencesRouter,
  dashboard: dashboardRouter,
  conversations: conversationsRouter,
  intelligence: intelligenceRouter,
  agents: agentsRouter,
  dataSources: dataSourcesRouter,
  documents: documentsRouter,
  memory: memoryRouter,
  analytics: analyticsRouter,
  workflows: workflowsRouter,
  notifications: notificationsRouter,
  audit: auditRouter,
});

export type AppRouter = typeof appRouter;
