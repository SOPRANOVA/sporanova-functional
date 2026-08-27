CREATE TABLE `action_calls` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`actionDefinitionId` int NOT NULL,
	`conversationId` int,
	`channelId` int,
	`status` enum('pending','running','succeeded','failed','cancelled') NOT NULL DEFAULT 'pending',
	`input` json NOT NULL,
	`output` json,
	`errorMessage` text,
	`idempotencyKey` varchar(128),
	`startedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `action_calls_id` PRIMARY KEY(`id`),
	CONSTRAINT `action_calls_workspace_idempotency_unique` UNIQUE(`workspaceId`,`idempotencyKey`)
);
--> statement-breakpoint
CREATE TABLE `action_definitions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`agentId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`kind` enum('http_api','escalate_to_human','search_knowledge','create_ticket','custom') NOT NULL,
	`procedureOnly` boolean NOT NULL DEFAULT false,
	`configuration` json,
	`status` enum('enabled','disabled') NOT NULL DEFAULT 'enabled',
	`createdById` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `action_definitions_id` PRIMARY KEY(`id`),
	CONSTRAINT `action_definitions_workspace_agent_name_unique` UNIQUE(`workspaceId`,`agentId`,`name`)
);
--> statement-breakpoint
CREATE TABLE `channels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`agentId` int NOT NULL,
	`type` enum('web_widget','help_page','email','slack','whatsapp','api') NOT NULL,
	`label` varchar(160) NOT NULL,
	`status` enum('active','paused','unconfigured') NOT NULL DEFAULT 'unconfigured',
	`configuration` json,
	`secretReference` varchar(255),
	`createdById` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `channels_id` PRIMARY KEY(`id`),
	CONSTRAINT `channels_workspace_agent_label_unique` UNIQUE(`workspaceId`,`agentId`,`label`)
);
--> statement-breakpoint
CREATE TABLE `procedure_steps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`procedureId` int NOT NULL,
	`workspaceId` int NOT NULL,
	`position` int NOT NULL,
	`instruction` text NOT NULL,
	`actionDefinitionId` int,
	`branchCondition` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `procedure_steps_id` PRIMARY KEY(`id`),
	CONSTRAINT `procedure_steps_procedure_position_unique` UNIQUE(`procedureId`,`position`)
);
--> statement-breakpoint
CREATE TABLE `procedures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`agentId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`description` text,
	`triggerPhrases` json NOT NULL,
	`procedureOnly` boolean NOT NULL DEFAULT true,
	`status` enum('draft','active','disabled') NOT NULL DEFAULT 'draft',
	`createdById` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `procedures_id` PRIMARY KEY(`id`),
	CONSTRAINT `procedures_workspace_agent_name_unique` UNIQUE(`workspaceId`,`agentId`,`name`)
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workspaceId` int NOT NULL,
	`conversationId` int NOT NULL,
	`channelId` int,
	`subject` varchar(255) NOT NULL,
	`status` enum('open','pending','resolved','closed') NOT NULL DEFAULT 'open',
	`priority` enum('low','normal','high','urgent') NOT NULL DEFAULT 'normal',
	`assigneeUserId` int,
	`escalationReason` varchar(160),
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `action_calls` ADD CONSTRAINT `action_calls_workspaceId_workspaces_id_fk` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `action_calls` ADD CONSTRAINT `action_calls_actionDefinitionId_action_definitions_id_fk` FOREIGN KEY (`actionDefinitionId`) REFERENCES `action_definitions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `action_calls` ADD CONSTRAINT `action_calls_conversationId_conversations_id_fk` FOREIGN KEY (`conversationId`) REFERENCES `conversations`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `action_calls` ADD CONSTRAINT `action_calls_channelId_channels_id_fk` FOREIGN KEY (`channelId`) REFERENCES `channels`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `action_definitions` ADD CONSTRAINT `action_definitions_workspaceId_workspaces_id_fk` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `action_definitions` ADD CONSTRAINT `action_definitions_agentId_agents_id_fk` FOREIGN KEY (`agentId`) REFERENCES `agents`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `action_definitions` ADD CONSTRAINT `action_definitions_createdById_users_id_fk` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `channels` ADD CONSTRAINT `channels_workspaceId_workspaces_id_fk` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `channels` ADD CONSTRAINT `channels_agentId_agents_id_fk` FOREIGN KEY (`agentId`) REFERENCES `agents`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `channels` ADD CONSTRAINT `channels_createdById_users_id_fk` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `procedure_steps` ADD CONSTRAINT `procedure_steps_procedureId_procedures_id_fk` FOREIGN KEY (`procedureId`) REFERENCES `procedures`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `procedure_steps` ADD CONSTRAINT `procedure_steps_workspaceId_workspaces_id_fk` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `procedure_steps` ADD CONSTRAINT `procedure_steps_actionDefinitionId_action_definitions_id_fk` FOREIGN KEY (`actionDefinitionId`) REFERENCES `action_definitions`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `procedures` ADD CONSTRAINT `procedures_workspaceId_workspaces_id_fk` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `procedures` ADD CONSTRAINT `procedures_agentId_agents_id_fk` FOREIGN KEY (`agentId`) REFERENCES `agents`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `procedures` ADD CONSTRAINT `procedures_createdById_users_id_fk` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_workspaceId_workspaces_id_fk` FOREIGN KEY (`workspaceId`) REFERENCES `workspaces`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_conversationId_conversations_id_fk` FOREIGN KEY (`conversationId`) REFERENCES `conversations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_channelId_channels_id_fk` FOREIGN KEY (`channelId`) REFERENCES `channels`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_assigneeUserId_users_id_fk` FOREIGN KEY (`assigneeUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `action_calls_workspace_status_idx` ON `action_calls` (`workspaceId`,`status`);--> statement-breakpoint
CREATE INDEX `action_calls_action_created_idx` ON `action_calls` (`actionDefinitionId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `action_definitions_workspace_status_idx` ON `action_definitions` (`workspaceId`,`status`);--> statement-breakpoint
CREATE INDEX `action_definitions_agent_idx` ON `action_definitions` (`agentId`);--> statement-breakpoint
CREATE INDEX `channels_workspace_status_idx` ON `channels` (`workspaceId`,`status`);--> statement-breakpoint
CREATE INDEX `channels_agent_idx` ON `channels` (`agentId`);--> statement-breakpoint
CREATE INDEX `procedure_steps_workspace_idx` ON `procedure_steps` (`workspaceId`);--> statement-breakpoint
CREATE INDEX `procedures_workspace_status_idx` ON `procedures` (`workspaceId`,`status`);--> statement-breakpoint
CREATE INDEX `procedures_agent_idx` ON `procedures` (`agentId`);--> statement-breakpoint
CREATE INDEX `tickets_workspace_status_idx` ON `tickets` (`workspaceId`,`status`);--> statement-breakpoint
CREATE INDEX `tickets_workspace_priority_idx` ON `tickets` (`workspaceId`,`priority`);--> statement-breakpoint
CREATE INDEX `tickets_conversation_idx` ON `tickets` (`conversationId`);--> statement-breakpoint
CREATE INDEX `tickets_assignee_idx` ON `tickets` (`assigneeUserId`);