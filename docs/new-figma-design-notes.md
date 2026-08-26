# New Figma Design Audit

The supplied browser URL `https://www.figma.com/it-it/` opens the public Figma landing page, not a specific design file. The supplied `Followpromptinstructions.zip` contains the authoritative exported frontend source for the new SOPRANOVA design.

## Source inventory

The source includes `src/components/AppLayout.tsx`, `Logo.tsx`, `PublicNav.tsx`, `src/index.css`, public pages for Home, Platform, Intelligence, Agents, Solutions, Enterprise, About, Contact, Login, Signup, and ForgotPassword, plus authenticated pages for Dashboard, Intelligence, Decisions, Agents, Analytics, Data, Memory, Automations, Activity, Workspace, and Settings.

## Design DNA

The design uses an ivory/off-white surface (`#FAFAF8`), navy product color (`#1A1F3C`), muted neutral borders (`#E8E6E2`), indigo accent (`#5B6FA8`), teal status color (`#4A8B8C`), Inter for interface text, and Instrument Serif for editorial display headings. Motion is restrained, with short reveal, fade, slide, and scale transitions that respect reduced-motion preferences.

## Implementation constraint

Use the exported source as the visual reference, but preserve SOPRANOVA's existing independent authentication, tRPC contracts, tenant isolation, database, storage, and worker behavior. Do not copy the source's localStorage-only auth guard or demo-only data behavior into production.

## Route expansion required

The new source expects authenticated routes for `/app/decisions`, `/app/memory`, `/app/activity`, and `/app/workspace` in addition to the existing dashboard, intelligence, agents, analytics, data, automations, and settings routes. These routes should be added through the current authenticated shell and wired to existing APIs where available.
