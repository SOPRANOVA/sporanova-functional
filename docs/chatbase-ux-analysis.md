# Chatbase UX Reference Analysis for SOPRANOVA

## Purpose and boundary

This document analyses Chatbase as a **functional and information-architecture reference** for SOPRANOVA. It does not authorize copying Chatbase trademarks, logo, wording, customer identities, testimonials, screenshots, visual assets, or page-level trade dress. SOPRANOVA must remain an original light-mode enterprise-intelligence product.

## What the current Chatbase experience communicates

Chatbase positions the product around an end-to-end lifecycle rather than a single chatbot surface: **Build, Test, Deploy, Optimize**. The public homepage uses this lifecycle to connect data sources, agent instructions and guardrails with testing, omnichannel deployment, and measurable optimization. It repeatedly makes the next step obvious through paired primary and secondary CTAs. [1]

Its product model is correspondingly operational. The published playbook describes sources, actions, integrations, identity/contacts, embeds/API, and analytics as separate building blocks. It frames analytics around chats, topics, sentiment, and helpdesk, with human escalation as a first-class workflow. [2] [3]

> The useful pattern is not a visual imitation. It is the journey from trusted inputs, through controlled agent behavior, to deployment, monitoring, and human review.

## Reference patterns to adapt

| Chatbase pattern | SOPRANOVA adaptation | Required state |
|---|---|---|
| Build → Test → Deploy → Optimize lifecycle | Connect → Configure → Validate → Operate | Real workflow status, never decorative steps only |
| Agent role, instructions, guardrails, procedures, actions | Agent profile, policy, procedures, controlled actions | Workspace-scoped, permission-aware configuration |
| Cross-channel presence | Channels registry with honest configuration status | Do not label an external channel active unless configured and tested |
| Analytics as a product loop | Intelligence, Analytics, Decisions, Activity | Real query/metric data with loading, empty, and error states |
| Human helpdesk handoff | Tickets linked to conversations and agent escalations | Ticket ownership, status transitions, audit events |
| Repeated conversion CTA | One clear SOPRANOVA CTA per public section | Original copy and measurable product action |

## Recommended light-mode SOPRANOVA system

The public site should move away from a dark-page default. Use an off-white canvas (`#FAFAF8` or the existing warm ivory), navy text and data surfaces (`#1A1F3C`), and periwinkle as the primary interactive accent (`#6B7FBF`). Teal remains reserved for connected/healthy status and muted amber/red retain warning/error semantics. This keeps high information density without the heavy visual field of a dark landing page.

Display headlines use **Instrument Serif**. Inter remains the sole font for navigation, controls, labels, data, and body content. Cards should remain light with thin neutral borders, 16–24px radii, restrained shadows, and deliberate white space. The hero may retain its navy video surface as a contrasting media window rather than making the overall site dark.

## Public landing-page sequence

1. A light navigation bar with product, solutions, resources, enterprise, and clear primary/secondary CTAs.
2. A light hero explaining SOPRANOVA as the enterprise intelligence operating layer, with the existing motion/video contained in a navy product window.
3. A concise problem-to-outcome section: fragmented inputs become governed context, insight, and action.
4. A lifecycle section: Connect, Configure, Validate, Operate.
5. A product-suite grid: Agents, Intelligence, Data, Operations, Analytics, Decisions.
6. Platform and Intelligence film panels using the reusable `ExplainerVideo` component. These must be explicit placeholders/fallbacks until real video files are generated.
7. An operations section covering channels, procedures, actions, and human handoff.
8. A governance section covering workspace isolation, roles, audit history, and data handling. Only make compliance claims that are documented and true.
9. Use-case cards with original enterprise scenarios, not copied customer stories.
10. A final conversion section and structured footer.

## Authenticated application structure

The app should communicate one continuous operating system. Command Center is the summary view. Intelligence is the conversation and evidence workspace. Agents holds agent configuration. Operations owns Channels, Procedures, Actions, and Helpdesk. Data covers sources, documents, and memory. Automations, Analytics, Decisions, Activity, Workspace, and Settings remain separate but use the same header, tab, card, status, empty, and dialog primitives.

Each route must show a useful empty state, loading state, clear error/retry state, and one meaningful primary action. Client-side hiding of unavailable controls is a usability improvement only; the server remains responsible for RBAC and workspace isolation.

## Media and motion rules

The hero background video remains optional and controllable: play/pause, mute/unmute, progress seeking, poster/fallback, keyboard access, and `prefers-reduced-motion` support are required. Platform and Intelligence films must reuse `ExplainerVideo`, lazy-load near the viewport, use `preload="metadata"`, stay muted, and retain the branded animated fallback when a source is absent or fails. Decorative motion must use opacity/transform, stay brief, and never block first contentful render.

## Remaining execution gates

Actual Platform and Intelligence videos are deferred until new assets can be generated. The protected `/app/operations` screen still requires an authenticated desktop/mobile visual pass. Any future provider integration, such as external messaging, payments, CRM or search, requires a deliberate provider contract and credentials before it can be shown as active.

## References

[1]: https://www.chatbase.co/ "Chatbase: AI Agents for Customer Experience & Support"
[2]: https://www.chatbase.co/blog/the-ai-agent-playbook "The AI Agent Playbook — Chatbase"
[3]: https://chatbase.co/docs/user-guides/chatbot/analytics "Analytics — Chatbase Documentation"
