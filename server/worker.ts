import "dotenv/config";
import { and, eq, isNull } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { agentRuns, agents } from "../drizzle/schema";
import { requireDb, writeAuditLog } from "./db";
import { completeJob, claimNextJob, failJob } from "./jobs";
import { invokeLLM } from "./_core/llm";
import { ENV } from "./_core/env";

const workerId = process.env.WORKER_ID ?? `worker-${randomUUID().slice(0, 8)}`;
const pollMs = Number(process.env.WORKER_POLL_MS ?? 1500);

function responseText(content: unknown) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.filter((part): part is { type: "text"; text: string } => typeof part === "object" && part !== null && (part as { type?: unknown }).type === "text" && typeof (part as { text?: unknown }).text === "string").map(part => part.text).join("\n");
  return "";
}

async function processAgentRun(payload: Record<string, unknown>) {
  const runId = Number(payload.runId);
  const agentId = Number(payload.agentId);
  const workspaceId = Number(payload.workspaceId);
  const actorUserId = Number(payload.actorUserId);
  const instruction = String(payload.instruction ?? "");
  if (!Number.isInteger(runId) || !Number.isInteger(agentId) || !Number.isInteger(workspaceId) || !instruction) throw new Error("Invalid agent.run job payload");
  const db = await requireDb();
  const agent = (await db.select().from(agents).where(and(eq(agents.id, agentId), eq(agents.workspaceId, workspaceId), isNull(agents.deletedAt))).limit(1))[0];
  if (!agent) throw new Error("Agent no longer exists in the workspace");
  await db.update(agentRuns).set({ status: "running", progress: 20, startedAt: new Date() }).where(and(eq(agentRuns.id, runId), eq(agentRuns.workspaceId, workspaceId)));
  try {
    const result = await invokeLLM({ model: ENV.ai.model, messages: [{ role: "system", content: `You are the SOPRANOVA agent "${agent.name}". Purpose: ${agent.purpose}. Provide a precise operational response using only the context supplied.` }, { role: "user", content: instruction }], maxTokens: 1200 });
    const content = responseText(result.choices[0]?.message?.content) || "No response was produced.";
    await db.update(agentRuns).set({ status: "completed", progress: 100, output: { content }, completedAt: new Date() }).where(eq(agentRuns.id, runId));
    await db.update(agents).set({ lastActivityAt: new Date(), status: "idle" }).where(eq(agents.id, agentId));
    await writeAuditLog({ workspaceId, actorUserId, action: "agent.run_completed", resourceType: "agentRun", resourceId: runId, metadata: { agentId } });
  } catch (error) {
    await db.update(agentRuns).set({ status: "failed", progress: 100, errorMessage: "The configured AI provider could not complete this run.", completedAt: new Date() }).where(eq(agentRuns.id, runId));
    throw error;
  }
}

async function processOnce() {
  const job = await claimNextJob(workerId);
  if (!job) return false;
  try {
    if (job.type === "agent.run") await processAgentRun(job.payload);
    else throw new Error(`Unsupported job type: ${job.type}`);
    await completeJob(job.id);
  } catch (error) {
    await failJob(job, error);
    console.error(JSON.stringify({ event: "worker.job_failed", jobId: job.id, type: job.type, error: error instanceof Error ? error.message : "unknown" }));
  }
  return true;
}

async function loop() {
  try { while (await processOnce()) {} }
  catch (error) { console.error(JSON.stringify({ event: "worker.poll_error", error: error instanceof Error ? error.message : "unknown" })); }
  setTimeout(loop, pollMs);
}

console.info(JSON.stringify({ event: "worker.started", workerId, pollMs }));
loop();
