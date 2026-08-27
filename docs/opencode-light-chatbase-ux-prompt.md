# OpenCode Prompt — SOPRANOVA Light Chatbase-Inspired UI/UX

```text
You are continuing the existing SOPRANOVA repository. Implement the next frontend iteration directly in the current codebase.

Your reference is the information architecture, product flow, conversion discipline, operational UX, and media placement of a modern AI-agent platform such as Chatbase. Do NOT copy Chatbase’s trademarks, logo, name, wording, screenshots, testimonials, customer logos, pricing claims, illustrations, videos, or proprietary assets. The resulting product must remain unmistakably SOPRANOVA and visually original.

## Non-negotiable project context

SOPRANOVA is a standalone multi-tenant enterprise intelligence platform. It uses React 19, TypeScript, Vite, Tailwind CSS 4, Express, tRPC, Drizzle ORM, MySQL/TiDB, Vitest, session authentication, workspace isolation, RBAC, a background worker, agents, conversations, data sources, documents, memory, workflows, analytics, decisions, activity, notifications, audit logging, channels, procedures, actions, and helpdesk tickets.

Preserve every existing real backend contract. Do not replace tRPC calls with mock data. Do not bypass server authorization. Do not weaken tenant isolation. Do not put secrets, credentials, or provider tokens in frontend source code. Do not change backend code unless the frontend needs an existing, real API contract.

Never fabricate customer reviews, ratings, testimonials, customer logos, business metrics, integrations, or success claims. When real data is absent, use an honest empty state rather than fake content.

Read before editing:

- README.md
- todo.md
- docs/chatbase-ux-analysis.md
- docs/refactor-plan.md
- client/src/App.tsx
- client/src/index.css
- client/src/pages/Home.tsx
- client/src/pages/Platform.tsx
- client/src/pages/IntelligencePublic.tsx
- client/src/pages/Operations.tsx
- client/src/components/AnimatedSection.tsx
- client/src/components/PageTransition.tsx
- client/src/components/ExplainerVideo.tsx, if it exists

## Primary design goal

Reorganize and refine SOPRANOVA’s public site and application UI with the clarity and operating-system feel of Chatbase, but make the complete visual design **light mode**.

The public site must not use a dark-page default. The application must also remain light by default. A navy video or diagram window is allowed as a focused contrast surface, but it must not turn the whole page into a dark experience.

### Light design tokens

Use these as the visual foundation, while preserving any existing equivalent project tokens:

- Page canvas: warm ivory `#FAFAF8`.
- Raised cards: `#FFFFFF` or `#FDFCF9`.
- Primary text and navy media surface: `#1A1F3C`.
- Secondary text: muted warm gray such as `#6B6660` and `#8C887F`.
- Primary interactive accent: periwinkle `#6B7FBF`.
- Connected/healthy state: teal `#4A8B8C`.
- Attention: muted amber `#C5974A`.
- Error: muted red `#B8675A`.
- Borders: a warm neutral such as `#E8E6E2`.
- Use light cards with thin borders, 16–24px radii, restrained shadows, and generous whitespace.

### Typography

- Use Instrument Serif only for important display headings and editorial titles.
- Use Inter for navigation, body content, data labels, forms, buttons, tabs, dialogs, and all dashboard UI.
- Preserve a consistent type scale, line-height, letter spacing, and contrast. Do not use faux font weights.
- The product should feel considered and premium, not decorative or overly editorial.

## Public landing page — product flow

Create a light, conversion-focused SaaS landing experience. Use the following sequence. Keep SOPRANOVA copy original and truthful.

1. **Light navigation**
   - Product, Solutions, Resources, Enterprise, and clear primary/secondary CTAs.
   - Sticky behavior only if it already fits the project; never obstruct content.
   - Mobile navigation must remain keyboard accessible.

2. **Hero**
   - A direct enterprise-intelligence proposition.
   - One primary conversion CTA and one secondary exploratory CTA.
   - Keep the existing SOPRANOVA network motion and hero video inside a deliberate navy product window, not as a full-page dark background.
   - Retain cinematic video controls: play/pause, mute/unmute, keyboard-accessible progress, visible focus state, reduced-motion behavior, and error fallback.

3. **Problem-to-outcome statement**
   - Explain the original SOPRANOVA outcome: fragmented enterprise inputs become governed context, actionable intelligence, and traceable decisions.
   - Use concise cards or a visual flow rather than a long wall of text.

4. **Lifecycle section**
   - Present a clear four-stage operating flow: Connect, Configure, Validate, Operate.
   - Each stage must map to a real SOPRANOVA capability: sources/data, agents/procedures, testing/guardrails, channels/actions/analytics/helpdesk.
   - Do not represent an integration as active unless a real provider configuration and test path exists.

5. **Product-suite grid**
   - Show original SOPRANOVA areas: Agents, Intelligence, Data, Operations, Analytics, Decisions.
   - Every card needs a clear link and a purpose-led description.
   - Avoid fake numerical metrics or customer proof.

6. **Platform film**
   - Place the reusable ExplainerVideo component on `/platform` after the introduction and before the detailed diagram.
   - The future film narrative is: fragmented enterprise data → governed operating layer → structured intelligence → traceable actions.
   - Until a real video asset is available, use an honest branded fallback, not a fabricated video claim.

7. **Intelligence film**
   - Place the reusable ExplainerVideo component on `/intelligence` after the process explanation and before the example query.
   - The future film narrative is: contextual reasoning → pattern discovery → cited insight → recommendation.
   - Use exactly the same component and media lifecycle rules as Platform.

8. **Operations and human oversight**
   - Explain Channels, Procedures, Actions, Helpdesk, and human escalation as one controlled operating layer.
   - Do not claim third-party channel providers are connected if no credentialed adapter exists.

9. **Governance and enterprise trust**
   - Present only real platform properties: workspace isolation, roles, permissions, audit history, controlled operations, and independently configurable providers.
   - Do not make unsupported legal or compliance claims.

10. **Use cases and final CTA**
    - Use original, generic enterprise scenarios such as support operations, customer intelligence, knowledge operations, and decision workflows.
    - Finish with one clear CTA and a structured footer.

## Authenticated application — operations-first UX

Keep the existing protected app routes, but unify them into a clear enterprise console.

### Main navigation order

1. Command Center
2. Intelligence
3. Agents
4. Operations
5. Data
6. Automations
7. Analytics
8. Decisions
9. Activity
10. Workspace
11. Settings

### Route responsibilities

- **Command Center:** the workspace summary with real KPIs, activity, agent runs, tickets, actions, and alerts where APIs exist.
- **Intelligence:** conversations, questions, cited sources, history, and meaningful loading/error states.
- **Agents:** agent configuration, purpose, state, related actions, related procedures, and execution context.
- **Operations:** use sub-navigation/tabs for Channels, Procedures, Actions, and Helpdesk. Every list and dialog must use real workspace-scoped tRPC data.
- **Data:** sources, documents, memory, synchronization, indexing, and actual processing states.
- **Automations:** workflows, run history, queue state, and real execution status.
- **Analytics:** time ranges, KPIs, trends, segments, topics/sentiment only if supported by real data and backend contracts.
- **Decisions and Activity:** evidence, review status, approvals, audit timeline, and transparent ownership.
- **Workspace and Settings:** members, roles, security, account preferences, and audit data.

### Common app UX primitives

Make the system coherent with shared typed components for:

- Page headers and contextual actions.
- Tab/sub-navigation controls.
- Status pills.
- Empty states.
- Loading states.
- Error states with retry actions.
- Metric cards.
- Data-list rows.
- Form fields with inline validation.
- Accessible dialogs.
- Video and media cards.

Do not create oversized page components. Route-level pages should orchestrate data and composition only. Feature components must own focused presentational responsibilities. Prefer composition and explicit typed props over a long list of boolean props.

## Video, media, and motion

Use video as a product explanation, never as visual noise.

1. Reuse a typed `ExplainerVideo` component for Platform and Intelligence.
2. Support `src`, `poster`, `title`, `description`, `autoplay`, and fallback behavior.
3. Lazy-mount below-the-fold video only near the viewport using IntersectionObserver with an appropriate root margin.
4. Use `preload="metadata"`, `playsInline`, muted autoplay only, and never autoplay with sound.
5. Show player controls only when there is a real source. Controls need meaningful labels, keyboard support, visible focus, and reliable state updates.
6. If a source is absent or fails, retain a polished SOPRANOVA fallback: restrained moving nodes, orbit rings, and soft glow. The fallback must not claim a video is playing.
7. Respect `prefers-reduced-motion`: stop autoplay, canvas loops, non-essential transforms, and decorative CSS animation.
8. Use opacity and transform for UI motion. Keep UI transitions generally below 300ms. Avoid animated layout properties.
9. Do not generate or hardcode placeholder video URLs. Real assets must be added through the approved asset storage workflow once available.

## Component architecture and performance

- Keep page components for route composition and data orchestration only.
- Group reusable components by responsibility, for example `components/layout`, `components/motion`, `components/media`, `components/marketing`, and `components/app`.
- Keep shared UI primitives separate from business-specific components.
- Do not use `any`, unsafe casts, or duplicated type definitions.
- Place TypeScript props near their components and use discriminated unions for meaningful variants.
- Keep API hooks and mutations close to feature boundaries; do not duplicate requests for the same resource.
- Stabilize tRPC query inputs. Never create unstable object/array query inputs on every render.
- Do not call setState, navigation, or async side effects during render.
- Use stable keys from persistent IDs; do not use dynamic array indexes as keys.
- Clean up animation frames, observers, timers, event listeners, media listeners, and abortable async tasks.
- Use `React.memo`, `useMemo`, and `useCallback` only where they prevent a measured or evident rerender/cost issue.
- Use route-level code splitting and lazy-load noncritical media where it does not compromise the intended experience.
- Do not add dependencies unless the existing stack cannot solve the requirement; explain and justify each new dependency.

## Accessibility and form quality

- Use semantic HTML and correctly associated labels.
- All dialogs must use correct modal semantics, focus management where supported by the project, Escape handling, and a visible close action.
- All interactive controls require a keyboard path and `focus-visible` style.
- Errors must be visible, plain-language, adjacent to the field/form, and never discarded silently.
- Every mutation needs a pending/disabled state and an error recovery path.
- Dynamic content must preserve readable color contrast in light mode.

## Implementation constraints

- Work in small, focused commits.
- Update `todo.md` before starting a new feature and mark items complete only after verification.
- Do not move the feature branch into `main` directly. Use the existing feature-branch/PR workflow.
- Do not alter or remove previously working tenant, RBAC, authentication, worker, or migration functionality.
- Do not use mock business data just to make the UI look populated.
- Do not mark the Platform and Intelligence videos complete until actual assets are generated, uploaded, integrated, and visually verified.

## Completion gate

Before reporting completion:

1. Run `pnpm check`.
2. Run `pnpm test`.
3. Run `pnpm build`.
4. Run `git diff --check`.
5. Verify all changed public pages on desktop and mobile.
6. Verify changed authenticated pages with a real authenticated session; if that is not available, document the missing evidence instead of claiming completion.
7. Check keyboard navigation, visual focus, light-mode contrast, reduced motion, video fallback, empty states, loading states, error states, and responsive layouts.
8. Update `todo.md` and relevant documentation honestly.
9. Commit and push to the existing feature branch, then update the pull request with the final commit hash and a concise summary.

Do not stop at an audit or a written plan. First inspect the existing repository, then implement the highest-confidence frontend improvements in small, safe steps while preserving SOPRANOVA’s original light-mode identity.
```
