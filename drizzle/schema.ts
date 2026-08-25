import {
  boolean,
  decimal,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * SOPRANOVA identity records. Product-level permissions are determined by
 * workspace memberships, never by this global role alone.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }).default("credentials"),
  authProvider: varchar("authProvider", { length: 64 }).default("credentials").notNull(),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  jobTitle: varchar("jobTitle", { length: 160 }),
  avatarUrl: text("avatarUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const authSessions = mysqlTable(
  "auth_sessions",
  {
    id: varchar("id", { length: 64 }).primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("tokenHash", { length: 128 }).notNull().unique(),
    expiresAt: timestamp("expiresAt").notNull(),
    lastUsedAt: timestamp("lastUsedAt").defaultNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("auth_sessions_user_idx").on(table.userId), index("auth_sessions_expires_idx").on(table.expiresAt)],
);

export const passwordResetTokens = mysqlTable(
  "password_reset_tokens",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("tokenHash", { length: 128 }).notNull().unique(),
    expiresAt: timestamp("expiresAt").notNull(),
    usedAt: timestamp("usedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("password_reset_tokens_user_idx").on(table.userId), index("password_reset_tokens_expires_idx").on(table.expiresAt)],
);

export const oauthAccounts = mysqlTable(
  "oauth_accounts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    provider: varchar("provider", { length: 64 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    accessTokenEncrypted: text("accessTokenEncrypted"),
    refreshTokenEncrypted: text("refreshTokenEncrypted"),
    expiresAt: timestamp("expiresAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("oauth_accounts_provider_account_unique").on(table.provider, table.providerAccountId), index("oauth_accounts_user_idx").on(table.userId)],
);

export const organizations = mysqlTable(
  "organizations",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    companySize: varchar("companySize", { length: 32 }),
    createdById: int("createdById").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    deletedAt: timestamp("deletedAt"),
  },
  table => [uniqueIndex("organizations_slug_unique").on(table.slug)],
);

export const workspaces = mysqlTable(
  "workspaces",
  {
    id: int("id").autoincrement().primaryKey(),
    organizationId: int("organizationId").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    isDefault: boolean("isDefault").default(false).notNull(),
    createdById: int("createdById").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    deletedAt: timestamp("deletedAt"),
  },
  table => [
    uniqueIndex("workspaces_organization_slug_unique").on(table.organizationId, table.slug),
    index("workspaces_organization_idx").on(table.organizationId),
  ],
);

export const jobs = mysqlTable(
  "jobs",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").references(() => workspaces.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 80 }).notNull(),
    status: mysqlEnum("status", ["pending", "running", "completed", "failed"]).notNull().default("pending"),
    payload: json("payload").$type<Record<string, unknown>>().notNull(),
    attempts: int("attempts").notNull().default(0),
    maxAttempts: int("maxAttempts").notNull().default(3),
    runAt: timestamp("runAt").notNull().defaultNow(),
    lockedAt: timestamp("lockedAt"),
    lockedBy: varchar("lockedBy", { length: 128 }),
    completedAt: timestamp("completedAt"),
    lastError: text("lastError"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("jobs_dispatch_idx").on(table.status, table.runAt), index("jobs_workspace_idx").on(table.workspaceId, table.createdAt)],
);

export const memberships = mysqlTable(
  "memberships",
  {
    workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: mysqlEnum("role", ["owner", "admin", "member", "viewer"]).notNull().default("member"),
    isActive: boolean("isActive").notNull().default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    primaryKey({ columns: [table.workspaceId, table.userId], name: "memberships_workspace_user_pk" }),
    index("memberships_user_idx").on(table.userId),
    index("memberships_workspace_role_idx").on(table.workspaceId, table.role),
  ],
);

export const userPreferences = mysqlTable(
  "user_preferences",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    emailNotifications: boolean("emailNotifications").notNull().default(true),
    slackNotifications: boolean("slackNotifications").notNull().default(false),
    weeklyDigest: boolean("weeklyDigest").notNull().default(true),
    agentNotifications: boolean("agentNotifications").notNull().default(true),
    anomalyNotifications: boolean("anomalyNotifications").notNull().default(true),
    reportNotifications: boolean("reportNotifications").notNull().default(false),
    extendedContextWindow: boolean("extendedContextWindow").notNull().default(true),
    citeSources: boolean("citeSources").notNull().default(true),
    proactiveInsights: boolean("proactiveInsights").notNull().default(false),
    responseTone: mysqlEnum("responseTone", ["concise", "professional", "detailed"]).notNull().default("professional"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("user_preferences_user_workspace_unique").on(table.userId, table.workspaceId),
    index("user_preferences_workspace_idx").on(table.workspaceId),
  ],
);

export const agents = mysqlTable(
  "agents",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 160 }).notNull(),
    description: text("description"),
    purpose: text("purpose").notNull(),
    status: mysqlEnum("status", ["active", "idle", "paused", "error"]).notNull().default("idle"),
    configuration: json("configuration").$type<Record<string, unknown>>(),
    capabilities: json("capabilities").$type<string[]>(),
    createdById: int("createdById").notNull().references(() => users.id, { onDelete: "restrict" }),
    lastActivityAt: timestamp("lastActivityAt"),
    deletedAt: timestamp("deletedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("agents_workspace_name_unique").on(table.workspaceId, table.name),
    index("agents_workspace_status_idx").on(table.workspaceId, table.status),
  ],
);

export const agentRuns = mysqlTable(
  "agent_runs",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    agentId: int("agentId").notNull().references(() => agents.id, { onDelete: "cascade" }),
    status: mysqlEnum("status", ["pending", "running", "completed", "failed", "cancelled"]).notNull().default("pending"),
    triggerType: mysqlEnum("triggerType", ["manual", "workflow", "schedule", "data_sync"]).notNull().default("manual"),
    progress: int("progress").notNull().default(0),
    input: json("input").$type<Record<string, unknown>>(),
    output: json("output").$type<Record<string, unknown>>(),
    errorMessage: text("errorMessage"),
    idempotencyKey: varchar("idempotencyKey", { length: 128 }),
    startedAt: timestamp("startedAt"),
    completedAt: timestamp("completedAt"),
    createdById: int("createdById").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("agent_runs_workspace_idempotency_unique").on(table.workspaceId, table.idempotencyKey),
    index("agent_runs_agent_started_idx").on(table.agentId, table.startedAt),
    index("agent_runs_workspace_status_idx").on(table.workspaceId, table.status),
  ],
);

export const conversations = mysqlTable(
  "conversations",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    createdById: int("createdById").notNull().references(() => users.id, { onDelete: "cascade" }),
    lastMessageAt: timestamp("lastMessageAt").defaultNow().notNull(),
    deletedAt: timestamp("deletedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    index("conversations_workspace_last_message_idx").on(table.workspaceId, table.lastMessageAt),
    index("conversations_creator_idx").on(table.createdById),
  ],
);

export const messages = mysqlTable(
  "messages",
  {
    id: int("id").autoincrement().primaryKey(),
    conversationId: int("conversationId").notNull().references(() => conversations.id, { onDelete: "cascade" }),
    workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    authorUserId: int("authorUserId").references(() => users.id, { onDelete: "set null" }),
    role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
    kind: mysqlEnum("kind", ["question", "understanding", "insight", "recommendation", "action"]).notNull().default("question"),
    content: text("content").notNull(),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    index("messages_conversation_created_idx").on(table.conversationId, table.createdAt),
    index("messages_workspace_created_idx").on(table.workspaceId, table.createdAt),
  ],
);

export const messageSources = mysqlTable(
  "message_sources",
  {
    id: int("id").autoincrement().primaryKey(),
    messageId: int("messageId").notNull().references(() => messages.id, { onDelete: "cascade" }),
    workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 255 }).notNull(),
    sourceType: mysqlEnum("sourceType", ["document", "data_source", "metric", "manual"]).notNull(),
    sourceReference: varchar("sourceReference", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("message_sources_message_idx").on(table.messageId)],
);

export const insights = mysqlTable(
  "insights",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    severity: mysqlEnum("severity", ["low", "medium", "high"]).notNull().default("low"),
    category: varchar("category", { length: 80 }).notNull().default("insight"),
    status: mysqlEnum("status", ["open", "acknowledged", "resolved"]).notNull().default("open"),
    createdByAgentId: int("createdByAgentId").references(() => agents.id, { onDelete: "set null" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [index("insights_workspace_status_created_idx").on(table.workspaceId, table.status, table.createdAt)],
);

export const dataSources = mysqlTable(
  "data_sources",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 160 }).notNull(),
    type: varchar("type", { length: 80 }).notNull(),
    status: mysqlEnum("status", ["connected", "syncing", "failed", "disconnected"]).notNull().default("disconnected"),
    configuration: json("configuration").$type<Record<string, unknown>>(),
    recordCount: int("recordCount").notNull().default(0),
    sizeBytes: int("sizeBytes").notNull().default(0),
    lastSyncAt: timestamp("lastSyncAt"),
    lastError: text("lastError"),
    createdById: int("createdById").notNull().references(() => users.id, { onDelete: "restrict" }),
    deletedAt: timestamp("deletedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("data_sources_workspace_name_unique").on(table.workspaceId, table.name),
    index("data_sources_workspace_status_idx").on(table.workspaceId, table.status),
  ],
);

export const dataSourceRuns = mysqlTable(
  "data_source_runs",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    dataSourceId: int("dataSourceId").notNull().references(() => dataSources.id, { onDelete: "cascade" }),
    status: mysqlEnum("status", ["pending", "running", "completed", "failed", "cancelled"]).notNull().default("pending"),
    recordsProcessed: int("recordsProcessed").notNull().default(0),
    errorMessage: text("errorMessage"),
    startedAt: timestamp("startedAt"),
    completedAt: timestamp("completedAt"),
    createdById: int("createdById").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("data_source_runs_source_started_idx").on(table.dataSourceId, table.startedAt)],
);

export const dataRecords = mysqlTable(
  "data_records",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    dataSourceId: int("dataSourceId").notNull().references(() => dataSources.id, { onDelete: "cascade" }),
    externalId: varchar("externalId", { length: 255 }).notNull(),
    payload: json("payload").$type<Record<string, unknown>>().notNull(),
    searchableText: text("searchableText"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [uniqueIndex("data_records_source_external_unique").on(table.dataSourceId, table.externalId), index("data_records_workspace_source_idx").on(table.workspaceId, table.dataSourceId)],
);

export const documents = mysqlTable(
  "documents",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    originalName: varchar("originalName", { length: 255 }).notNull(),
    mimeType: varchar("mimeType", { length: 120 }).notNull(),
    sizeBytes: int("sizeBytes").notNull(),
    storageKey: varchar("storageKey", { length: 512 }).notNull(),
    storageUrl: text("storageUrl").notNull(),
    status: mysqlEnum("status", ["uploading", "processing", "ready", "failed", "deleted"]).notNull().default("uploading"),
    processingError: text("processingError"),
    uploadedById: int("uploadedById").notNull().references(() => users.id, { onDelete: "restrict" }),
    deletedAt: timestamp("deletedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("documents_storage_key_unique").on(table.storageKey),
    index("documents_workspace_status_created_idx").on(table.workspaceId, table.status, table.createdAt),
  ],
);

export const documentChunks = mysqlTable(
  "document_chunks",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    documentId: int("documentId").notNull().references(() => documents.id, { onDelete: "cascade" }),
    chunkIndex: int("chunkIndex").notNull(),
    content: text("content").notNull(),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("document_chunks_document_index_unique").on(table.documentId, table.chunkIndex),
    index("document_chunks_workspace_idx").on(table.workspaceId),
  ],
);

export const businessMetrics = mysqlTable(
  "business_metrics",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    metricDate: timestamp("metricDate").notNull(),
    metricKey: varchar("metricKey", { length: 80 }).notNull(),
    segment: varchar("segment", { length: 80 }).notNull().default("all"),
    metricValue: decimal("metricValue", { precision: 18, scale: 4 }).notNull(),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("business_metrics_workspace_date_key_segment_unique").on(table.workspaceId, table.metricDate, table.metricKey, table.segment),
    index("business_metrics_workspace_key_date_idx").on(table.workspaceId, table.metricKey, table.metricDate),
  ],
);

export const workflows = mysqlTable(
  "workflows",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 160 }).notNull(),
    description: text("description"),
    status: mysqlEnum("status", ["active", "paused", "draft", "archived"]).notNull().default("draft"),
    scheduleCronTaskUid: varchar("scheduleCronTaskUid", { length: 65 }),
    createdById: int("createdById").notNull().references(() => users.id, { onDelete: "restrict" }),
    deletedAt: timestamp("deletedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("workflows_workspace_name_unique").on(table.workspaceId, table.name),
    uniqueIndex("workflows_schedule_task_unique").on(table.scheduleCronTaskUid),
    index("workflows_workspace_status_idx").on(table.workspaceId, table.status),
  ],
);

export const workflowNodes = mysqlTable(
  "workflow_nodes",
  {
    id: int("id").autoincrement().primaryKey(),
    workflowId: int("workflowId").notNull().references(() => workflows.id, { onDelete: "cascade" }),
    nodeKey: varchar("nodeKey", { length: 80 }).notNull(),
    nodeType: mysqlEnum("nodeType", ["trigger", "intelligence", "condition", "action"]).notNull(),
    label: varchar("label", { length: 160 }).notNull(),
    description: text("description"),
    positionX: int("positionX").notNull().default(0),
    positionY: int("positionY").notNull().default(0),
    sortOrder: int("sortOrder").notNull().default(0),
    configuration: json("configuration").$type<Record<string, unknown>>(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("workflow_nodes_workflow_key_unique").on(table.workflowId, table.nodeKey),
    index("workflow_nodes_workflow_sort_idx").on(table.workflowId, table.sortOrder),
  ],
);

export const workflowRuns = mysqlTable(
  "workflow_runs",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    workflowId: int("workflowId").notNull().references(() => workflows.id, { onDelete: "cascade" }),
    status: mysqlEnum("status", ["pending", "running", "completed", "failed", "cancelled"]).notNull().default("pending"),
    triggerType: mysqlEnum("triggerType", ["manual", "event", "schedule"]).notNull().default("manual"),
    idempotencyKey: varchar("idempotencyKey", { length: 128 }),
    output: json("output").$type<Record<string, unknown>>(),
    errorMessage: text("errorMessage"),
    startedAt: timestamp("startedAt"),
    completedAt: timestamp("completedAt"),
    createdById: int("createdById").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    uniqueIndex("workflow_runs_workspace_idempotency_unique").on(table.workspaceId, table.idempotencyKey),
    index("workflow_runs_workflow_started_idx").on(table.workflowId, table.startedAt),
  ],
);

export const integrations = mysqlTable(
  "integrations",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    provider: varchar("provider", { length: 80 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    status: mysqlEnum("status", ["connected", "failed", "disconnected"]).notNull().default("disconnected"),
    secretReference: varchar("secretReference", { length: 255 }),
    configuration: json("configuration").$type<Record<string, unknown>>(),
    createdById: int("createdById").notNull().references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("integrations_workspace_provider_name_unique").on(table.workspaceId, table.provider, table.name),
    index("integrations_workspace_status_idx").on(table.workspaceId, table.status),
  ],
);

export const notifications = mysqlTable(
  "notifications",
  {
    id: int("id").autoincrement().primaryKey(),
    workspaceId: int("workspaceId").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    recipientUserId: int("recipientUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 80 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content").notNull(),
    relatedEntityType: varchar("relatedEntityType", { length: 80 }),
    relatedEntityId: varchar("relatedEntityId", { length: 80 }),
    readAt: timestamp("readAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    index("notifications_recipient_read_created_idx").on(table.recipientUserId, table.readAt, table.createdAt),
    index("notifications_workspace_created_idx").on(table.workspaceId, table.createdAt),
  ],
);

export const auditLogs = mysqlTable(
  "audit_logs",
  {
    id: int("id").autoincrement().primaryKey(),
    organizationId: int("organizationId").notNull().references(() => organizations.id, { onDelete: "cascade" }),
    workspaceId: int("workspaceId").references(() => workspaces.id, { onDelete: "set null" }),
    actorUserId: int("actorUserId").references(() => users.id, { onDelete: "set null" }),
    action: varchar("action", { length: 120 }).notNull(),
    resourceType: varchar("resourceType", { length: 80 }).notNull(),
    resourceId: varchar("resourceId", { length: 80 }),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [
    index("audit_logs_workspace_created_idx").on(table.workspaceId, table.createdAt),
    index("audit_logs_organization_created_idx").on(table.organizationId, table.createdAt),
    index("audit_logs_actor_created_idx").on(table.actorUserId, table.createdAt),
  ],
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type WorkspaceRole = typeof memberships.$inferSelect.role;
