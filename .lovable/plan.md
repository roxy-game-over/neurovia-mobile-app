# Neurovia Mobile App — dedicated project

Good news: I can read the original Neurovia project directly, so almost everything transfers faithfully — the `/app/*` routes, mobile shell, practice tools, garden logic, VIA chat, design system and the full database schema are all recoverable from source. Nothing needs to be reinvented.

## A. Recreated directly from the original source (no input needed from you)

- **Design system** — full Neurovia `styles.css` (lavender/lilac/purple/rose/mint/gold tokens, Cormorant Garamond + Inter, radii, dark/light), copied verbatim.
- **Mobile shell** — `AppShell` (full-screen shell, bottom navigation, VI branding, transitions), theme provider, auth provider.
- **Routes** at `/app/*`: `auth`, `onboarding`, `home`, `practice`, `garden`, `via`, `profile`, `care`, `safety`, `journey`.
- **Onboarding (4 steps)** — Welcome/VI, Concerns (Overthinking, Stress, Sleep, …), Goals, Journey start; content files copied as-is.
- **Home** — daily check-in (mood / sleep / energy), +10 coins, streak tracking, 500 → 510 behaviour.
- **Practice** — all five tools copied from `PracticeTools.tsx`: Box Breathing (4/4/6/4 animated timer), Grounding 5-4-3-2-1 tap-to-notice, One-line Journal, Thought Reframe, 2-minute Wind-down; +20 coins each.
- **Garden** — Seed → Sprout → Sapling → Flowering → Strong Tree → Blooming → Sanctuary, progress bar and "3 more practices to reach Sprout" messaging (`lib/app/progress.ts`).
- **VIA** — real AI companion chat, existing personality/system prompt and UI, calls kept server-side.
- **Profile** — editable name, coins, practices, garden stats, concerns, goals, theme toggle, sign-out, name backfill.
- **Care & Safety** — professional care ("coming soon"), Tele-MANAS 14416, KIRAN, AASRA, 112, privacy principles. Legal links will point at the existing Neurovia website URLs (external), since `/` is not recreated here.
- **Routing** — `/app/*` only; `/` redirects to `/app` (the marketing website is *not* recreated).

## B. Assets from the original project

- Mobile-app screens reference `vi-mascot.png` and a few scene images. These are project-scoped assets; I'll re-download and re-upload the ones the `/app` screens actually use. If any single asset fails to transfer I'll tell you rather than substituting silently.

## C. Backend / database configuration to transfer

This project has **no backend yet**. I'll enable Lovable Cloud (fresh, empty database) and re-apply the original migrations for the app tables:

- `app_profiles` (display_name, concerns[], goals[], theme, onboarding_completed, coins default **500**, garden_stage, practices_completed) + RLS + grants + updated_at trigger
- `check_ins` (mood, sleep, energy, note) + RLS
- `journal_entries` (kind: journal / reframe / grounding) + RLS
- `via_conversations`, `via_messages` (service-role only) + RLS
- `user_roles` + `has_role()` (used by admin-gated reads)

Not transferred (website-only): `waitlist_signups`, email templates, admin page.

**Important:** this is a *new, empty* database. Existing user accounts, profiles, coins, check-ins and chat history from the original project do **not** come across. If you want the same account/data, tell me and we can discuss migration; otherwise you'll sign up fresh here.

## D. Environment variables / secrets

- **Supabase URL + publishable key** — created automatically by Lovable Cloud.
- **AI key for VIA** — the original uses the Lovable AI Gateway (`LOVABLE_API_KEY`). I'll provision a key for this project automatically. No key is ever exposed to the frontend; chat runs through a server route.
- **Google sign-in** — needs enabling in this project's Cloud auth settings. Managed Google sign-in works without you supplying credentials; I'll enable it and flag it if it needs a click from you.

## E. Cannot be transferred automatically — I need you to confirm

1. **User data / accounts** — new project = new database. Fresh sign-up required unless you want a migration.
2. **Auth email confirmation setting** — the original shows a "check your email" state. Confirm you want email confirmation ON (default) rather than instant sign-in.
3. **Legal/privacy links** — I'll point Care & Safety at `https://neurovia-ai-in.lovable.app/privacy`, `/terms`, `/disclaimer`. Say the word if you'd rather they live in this project.
4. **Custom domain / publishing** — nothing will be published; you asked me to hold.

## Technical notes

TanStack Start with file-based routes; `src/routes/app.tsx` as the mobile shell layout with `app.*.tsx` children. Supabase clients from `@/integrations/supabase/*`; VIA chat via a server route so no key reaches the browser; coin/streak/garden mutations run against RLS-protected tables as the signed-in user.
