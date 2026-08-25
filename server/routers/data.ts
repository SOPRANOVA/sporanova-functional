import { and, desc, eq, isNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { dataSources, documents } from "../../drizzle/schema";
import { workspaceManagerProcedure, workspaceMemberProcedure, workspaceProcedure } from "../authz";
import { requireDb, writeAuditLog } from "../db";
import { storageDelete, storageGet, storagePut } from "../storage";
import { router } from "../_core/trpc";

const workspaceInput = z.object({ workspaceId: z.number().int().positive() });
const acceptedMimeTypes = new Set(["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"]);
const maximumUploadBytes = 10 * 1024 * 1024;

function normalizedName(name: string) {
  return name.replace(/[\\/\u0000-\u001f]/g, "_").replace(/\s+/g, " ").trim().slice(0, 255);
}

export function mimeMatchesBytes(mimeType: string, bytes: Buffer) {
  const prefix = bytes.subarray(0, 8).toString("utf8");
  if (mimeType === "application/pdf") return prefix.startsWith("%PDF-");
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") return bytes.subarray(0, 2).toString("utf8") === "PK";
  if (mimeType === "text/csv") return !bytes.subarray(0, Math.min(bytes.length, 2048)).includes(0);
  return false;
}

export const dataSourcesRouter = router({
  list: workspaceProcedure.input(workspaceInput).query(async ({ ctx }) => {
    const db = await requireDb();
    return db.select().from(dataSources).where(and(eq(dataSources.workspaceId, ctx.workspaceId), isNull(dataSources.deletedAt))).orderBy(desc(dataSources.updatedAt));
  }),

  create: workspaceManagerProcedure.input(workspaceInput.extend({ name: z.string().trim().min(2).max(160), type: z.string().trim().min(2).max(80) })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    const result = await db.insert(dataSources).values({ workspaceId: ctx.workspaceId, name: input.name, type: input.type, status: "disconnected", createdById: ctx.user.id });
    const id = Number(result[0].insertId);
    await writeAuditLog({ workspaceId: ctx.workspaceId, actorUserId: ctx.user.id, action: "data_source.created", resourceType: "dataSource", resourceId: id });
    return { id, status: "disconnected" as const };
  }),

  disconnect: workspaceManagerProcedure.input(workspaceInput.extend({ dataSourceId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    const source = (await db.select().from(dataSources).where(and(eq(dataSources.id, input.dataSourceId), eq(dataSources.workspaceId, ctx.workspaceId), isNull(dataSources.deletedAt))).limit(1))[0];
    if (!source) throw new TRPCError({ code: "NOT_FOUND", message: "Data source not found in this workspace." });
    await db.update(dataSources).set({ status: "disconnected" }).where(eq(dataSources.id, input.dataSourceId));
    await writeAuditLog({ workspaceId: ctx.workspaceId, actorUserId: ctx.user.id, action: "data_source.disconnected", resourceType: "dataSource", resourceId: input.dataSourceId });
    return { success: true };
  }),
});

export const documentsRouter = router({
  list: workspaceProcedure.input(workspaceInput).query(async ({ ctx }) => {
    const db = await requireDb();
    return db.select().from(documents).where(and(eq(documents.workspaceId, ctx.workspaceId), isNull(documents.deletedAt))).orderBy(desc(documents.createdAt));
  }),

  upload: workspaceMemberProcedure.input(workspaceInput.extend({ originalName: z.string().min(1).max(255), mimeType: z.string().max(120), dataBase64: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    if (!acceptedMimeTypes.has(input.mimeType)) throw new TRPCError({ code: "BAD_REQUEST", message: "This document type is not allowed." });
    const safeName = normalizedName(input.originalName);
    if (!safeName) throw new TRPCError({ code: "BAD_REQUEST", message: "A valid file name is required." });
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(input.dataBase64)) throw new TRPCError({ code: "BAD_REQUEST", message: "The upload payload is invalid." });
    const bytes = Buffer.from(input.dataBase64, "base64");
    if (!bytes.length || bytes.length > maximumUploadBytes) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Files must be between 1 byte and 10 MB." });
    if (!mimeMatchesBytes(input.mimeType, bytes)) throw new TRPCError({ code: "BAD_REQUEST", message: "The file contents do not match the declared document type." });
    const key = `workspaces/${ctx.workspaceId}/documents/${Date.now()}-${safeName}`;
    const stored = await storagePut(key, bytes, input.mimeType);
    const db = await requireDb();
    const result = await db.insert(documents).values({ workspaceId: ctx.workspaceId, originalName: safeName, mimeType: input.mimeType, sizeBytes: bytes.length, storageKey: stored.key, storageUrl: stored.url, status: "ready", uploadedById: ctx.user.id });
    const id = Number(result[0].insertId);
    await writeAuditLog({ workspaceId: ctx.workspaceId, actorUserId: ctx.user.id, action: "document.uploaded", resourceType: "document", resourceId: id, metadata: { sizeBytes: bytes.length, mimeType: input.mimeType } });
    return { id, originalName: safeName, status: "ready" as const, sizeBytes: bytes.length };
  }),

  accessUrl: workspaceProcedure.input(workspaceInput.extend({ documentId: z.number().int().positive() })).query(async ({ ctx, input }) => {
    const db = await requireDb();
    const document = (await db.select().from(documents).where(and(eq(documents.id, input.documentId), eq(documents.workspaceId, ctx.workspaceId), eq(documents.status, "ready"), isNull(documents.deletedAt))).limit(1))[0];
    if (!document) throw new TRPCError({ code: "NOT_FOUND", message: "Document not available in this workspace." });
    return storageGet(document.storageKey);
  }),

  delete: workspaceManagerProcedure.input(workspaceInput.extend({ documentId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    const document = (await db.select().from(documents).where(and(eq(documents.id, input.documentId), eq(documents.workspaceId, ctx.workspaceId), isNull(documents.deletedAt))).limit(1))[0];
    if (!document) throw new TRPCError({ code: "NOT_FOUND", message: "Document not found in this workspace." });
    await storageDelete(document.storageKey);
    await db.update(documents).set({ status: "deleted", deletedAt: new Date() }).where(eq(documents.id, input.documentId));
    await writeAuditLog({ workspaceId: ctx.workspaceId, actorUserId: ctx.user.id, action: "document.deleted", resourceType: "document", resourceId: input.documentId });
    return { success: true };
  }),
});

export const memoryRouter = router({
  summary: workspaceProcedure.input(workspaceInput).query(async ({ ctx }) => {
    const db = await requireDb();
    const [documentList, sourceList] = await Promise.all([
      db.select().from(documents).where(and(eq(documents.workspaceId, ctx.workspaceId), eq(documents.status, "ready"), isNull(documents.deletedAt))),
      db.select().from(dataSources).where(and(eq(dataSources.workspaceId, ctx.workspaceId), isNull(dataSources.deletedAt))),
    ]);
    return { documents: documentList.length, dataSources: sourceList.length, indexedChunks: 0, indexingAvailable: false };
  }),
});
