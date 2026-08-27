# SOPRANOVA Chatbase-Parity Gap Analysis

**Review status:** Attachment review completed against the repository state currently available on `main`.

## Executive finding

The supplied refactor plan is a useful target specification, but it does **not** describe the current repository accurately. The live repository already contains the multi-tenant core, RBAC, authentication, agents, conversations, data sources, documents, workflows, analytics, notifications, audit logging, and a standalone worker. However, the proposed Chatbase-parity domain is not yet implemented in the live repository.

The attached router archive contains scaffold code for `channels`, `procedures`, `actions`, and `tickets`, but those files are not present in the current repository and are not mounted in `server/routers.ts`. The current `drizzle/schema.ts` also does not contain the corresponding tables. The current `server/worker.ts` has no `processActionCall` handler or `action_call.execute` dispatch branch.

## Current state versus proposed state

| Area | Current repository | Attachment proposal | Gap |
|---|---|---|---|
| Multi-tenant core | Present with workspace authorization and RBAC | Reuse existing patterns | No structural gap identified |
| Knowledge/data | Present through data sources, documents, and worker sync/processing | Add connector types later | Mostly present |
| Agents/conversations | Present and workspace-scoped | Reuse as agent/channel foundation | Needs integration with channels/procedures |
| Channels | Not present in schema, routers, or UI | New `channels` table and router | Full implementation required |
| Procedures | Not present in schema, routers, or UI | New `procedures` and `procedure_steps` | Full implementation required |
| Actions | Not present in schema, routers, or UI | New definitions/calls and async execution | Full implementation required |
| Tickets/helpdesk | Not present in schema, routers, or UI | New native ticket system | Full implementation required |
| Worker action execution | No action-call handler | `processActionCall` and queue dispatch | Full implementation required |
| Frontend UI | Existing Agents/Data/Automation/etc. pages | Channels, procedure builder, actions, helpdesk | New UI required |
| External providers | Configurable adapters/backlog | Stripe/Shopify/Slack/WhatsApp/etc. | Must remain explicit backlog until credentials and contracts are supplied |

## Findings in the supplied router archive

The archive includes workspace-scoped router patterns and uses `workspaceProcedure`, `workspaceMemberProcedure`, and `workspaceManagerProcedure`. It also calls `writeAuditLog` for several sensitive mutations and queues action execution through `enqueueJob`. These choices are directionally consistent with the repository architecture.

The archive still requires a security and correctness review before integration. For example, ticket assignment checks that the ticket belongs to the workspace but does not visibly validate that `assigneeUserId` is an active member of that same workspace. Channel activation checks whether configuration exists, but existence alone may not prove that the configuration is valid for the channel type. Action input accepts arbitrary records, so each action kind needs server-side configuration validation and outbound request controls. These are implementation gates, not reasons to import the archive unchanged.

## Database and migration finding

The plan states that the new tables are already applied, but the current live schema does not contain `channels`, `procedures`, `procedure_steps`, `action_definitions`, `action_calls`, or `tickets`. Treat schema work and migrations as missing. Do not mark this work complete based on the attachment. Generate and inspect a real SQL migration, then apply it through the project migration workflow before declaring the backend ready.

## Worker finding

The existing worker supports agent runs, data-source sync, document processing, and workflow runs. It does not support action calls. The new action handler must be idempotent, claim jobs through the existing queue, enforce action status and workspace ownership, apply timeouts and bounded retries, avoid logging secrets, and create tickets only through a controlled path for escalation actions.

## Frontend finding

The existing public and authenticated Figma-aligned frontend can be extended without replacing the current design system. The first useful UI milestone is a minimal Agents extension for Procedures and Actions, followed by dedicated Channels and Helpdesk views. UI should use real tRPC procedures and honest loading, empty, error, disabled, and permission states. No external integration should appear active until it has a real configuration and test path.

## Recommended implementation order

1. Review and harden the supplied router contracts against the current schema and authorization helpers.
2. Add schema definitions and a real migration for the six new domain areas.
3. Integrate routers into `appRouter` and add authorization, audit, validation, and failure-path tests.
4. Add `processActionCall` and queue dispatch with idempotency, retries, timeouts, and escalation handling.
5. Build the minimum real frontend surfaces for Channels, Procedures, Actions, and Tickets using the existing Figma tokens.
6. Run migration verification, TypeScript checks, all tests, production build, and authenticated visual verification.
7. Keep Stripe, Shopify, Slack, WhatsApp, search_knowledge-as-action, model-cost metrics, and channel regression simulation as explicit backlog until the required provider decisions and credentials exist.

## Honest status

The attachments define a credible next phase, but they are not proof that the next phase is already implemented. The current repository should remain treated as the stable baseline until the schema, routers, worker, UI, migrations, tests, and documentation are integrated and verified.
