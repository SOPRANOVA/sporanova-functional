# SOPRANOVA Chatbase-Parity Refactor Plan

## Current milestone

The current implementation adds a workspace-scoped operations layer on top of the existing SOPRANOVA platform. It includes database tables and migration SQL for channels, procedures, procedure steps, action definitions, action calls, and tickets. The corresponding tRPC routers are mounted in the application router, and the protected Operations screen exposes real workspace data and mutations for Channels, Procedures, Actions, and Helpdesk.

The worker now dispatches `action_call.execute` jobs. HTTP actions use a bounded 15-second request timeout and bounded response output, ticket/escalation actions create workspace-scoped tickets, completed action calls are idempotently skipped, and pending/failed calls use an atomic status claim before execution. Unsupported action kinds fail explicitly instead of pretending to execute.

## Security gates

Every operation must use the existing workspace authorization procedures. Entity references must be checked against the current workspace before mutation or queue dispatch. Procedure steps may reference only actions belonging to the selected agent and workspace. Action invocations validate optional channel ownership. Ticket assignment validates that the assignee is an active member of the same workspace. Channel activation requires a type-specific configuration key and never becomes active merely because arbitrary JSON exists.

Secrets must never be stored in ordinary action or channel configuration JSON. Provider credentials belong in the configured secret mechanism and must be resolved only inside a provider adapter. Outbound HTTP actions must remain allowlisted or governed by deployment-level egress policy before production use; arbitrary public endpoint execution is suitable only for controlled development environments.

## Implemented domain surfaces

| Domain | Backend | Frontend | Verification |
|---|---|---|---|
| Channels | Schema, migration, list/create/update/status router, workspace checks, type-specific activation validation, audit events | Operations → Channels with create, activate, pause, JSON validation, loading/error/empty states | TypeScript and router isolation tests |
| Procedures | Schema, ordered steps, create/list/get/status/validate router, same-agent action validation, audit events | Operations → Procedures with create, activate/disable, trigger phrases, optional action link | TypeScript and router isolation tests |
| Actions | Schema, create/list/status/invoke/calls router, workspace checks, queue dispatch | Operations → Actions with create, enable/disable, invoke, honest unsupported-kind labels | TypeScript and worker tests |
| Action execution | Worker dispatch, atomic claim, HTTP timeout, bounded output, ticket escalation, failure persistence, audit | Status/errors surfaced through existing mutation flows | Worker integration tests |
| Helpdesk | Schema, list/get/create/assign/status router, conversation/channel/member checks, audit events | Operations → Helpdesk with create, status transitions, loading/error/empty states | TypeScript and router isolation tests |

## Remaining backlog

The actual Platform and Intelligence explainer videos remain deferred until video assets are available. Stripe, Shopify, Slack, WhatsApp, provider-specific authentication, knowledge-search actions, model-cost metrics, channel regression simulation, and production outbound-request allowlists require explicit provider decisions, credentials, and deployment policies. They must not be presented as active integrations before those gates pass.

## Verification gate before merge

Run `pnpm check`, `pnpm test`, `pnpm build`, and `git diff --check`. Perform authenticated visual verification of `/app/operations` at desktop and mobile widths, including each tab, modal validation error, loading/empty state, focus state, and responsive navigation. Review migration SQL for destructive statements and verify the target database schema before production rollout.

Merge through a feature branch and pull request. Do not push these changes directly to `main` without reviewing the diff and the verification output.
