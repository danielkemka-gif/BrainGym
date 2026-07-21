# BrainGym — Build Backlog

> **Legend:** `[ ]` Not started — `[/]` In progress — `[x] Complete`

---

## Phase A: Foundation

- [x] Initialize Next.js 15 project (TypeScript, Tailwind, App Router, src dir)
- [x] Install runtime & dev dependencies
- [x] Configure shadcn/ui (dark theme, custom brand tokens)
- [x] Create full folder structure
- [x] Set up environment config (`.env.example`, `.env.local`)
- [x] Configure Supabase client (browser + server + admin + middleware)
- [x] Write database schema migrations (all tables, indexes, RLS)
- [x] Seed script: 7 categories + 100+ activities
- [x] Create shared types, constants, Zod validations
- [x] Set up Next.js auth middleware
- [x] Build root layout (Inter font, dark mode, QueryClient, Supabase listener)
- [x] Verify `npm run build` passes

## Phase B: Public Website

- [x] Landing page — hero, social proof, feature highlights, CTA
- [x] Features page — detail on all 7 categories & core features
- [x] Pricing page — Free vs Premium comparison table
- [x] About page — mission, vision, values
- [x] Marketing layout — responsive nav, footer, SEO metadata
- [x] SEO pass — meta tags, Open Graph, structured data

## Phase C: Authentication

- [x] Supabase Auth — Google OAuth + Email/Password via components
- [x] Login page (email + Google SSO)
- [x] Signup page (email + Google SSO)
- [x] Password reset flow
- [x] Auth callback route handler (PKCE code exchange)
- [x] Auth middleware — protect dashboard routes, redirect unauthenticated users, redirect logged-in users from auth pages
- [x] Auth guards — `SignedIn`, `SignedOut`, `RequireAuth` components
- [x] Fix: `SUPABASE_SERVICE_ROLE_KEY` missing from env files

## Phase D: Onboarding

- [x] Multi-step OnboardingWizard (4 steps with progress stepper)
- [x] Step 1: Basic info (name, age, occupation) — Zod validated form
- [x] Step 2: Goals & challenges selection + workout time picker
- [x] Step 3: Initial Brain Assessment (7 category sliders, 0–100)
- [x] Step 4: Summary & confirmation — saves profile + brain_scores to Supabase
- [x] Redirect logic — auth callback redirects new users to `/onboarding`; layout redirects already-onboarded to `/dashboard`
- [x] Fix: auth callback queried `profiles.id` instead of `profiles.user_id`
- [x] Fix: `@hookform/resolvers` v5 incompatible with zod v3 — downgraded to v4.1.3

## Phase E: Dashboard & Workouts

- [x] Dashboard layout — AppShell with collapsible Sidebar + TopBar
- [x] Dashboard page — Today's Workout, Brain Score, XP bar, Streak, Missions
- [x] Today's Workout component — 5 activity cards with toggle checkoff + complete button
- [x] Workout completion flow — creates daily workout, submits logs, awards XP/coins
- [x] Activity Library — grid with category filter, difficulty filter, search
- [x] Activity detail page — description, benefits, instructions, tips, CTA
- [x] Basic scoring engine — XP, coins, level-up logic (lib/scoring.ts)
- [x] Fix: `ssr: false` not allowed in Server Components — moved to client component
- [x] Fix: TypeScript error in `getLevel` — added proper type annotation
- [x] Fix: Installed `@next/swc-win32-x64-msvc` — SWC warning eliminated
- [ ] Workout history page

## Phase F: Gamification

- [ ] Achievement system — check conditions on workout completion
- [ ] Achievement UI — grid of locked/unlocked badges with progress
- [ ] Leaderboard — global, friends, weekly
- [ ] Level ranks — Bronze → Silver → Gold → Diamond → Mastermind
- [ ] Level badge + XP progress bar in TopBar

## Phase G: Profile & Settings

- [ ] Profile page — edit name, avatar, goals, age, occupation
- [ ] Settings page — notification preferences, workout reminder time, dark mode toggle
- [ ] Avatar upload (Supabase Storage)

## Phase H: AI Features

- [ ] OpenAI client setup (server-side only)
- [ ] AI Coach — chat interface with system prompt + workout context
- [ ] Decision Lab — weekly scenario display + response form
- [ ] AI evaluation — reasoning, empathy, long-term thinking scores
- [ ] Decision Lab history page
- [ ] Missions system — create, join, track life missions
- [ ] AI-generated daily workout plans based on mission

## Phase I: Notifications

- [ ] In-app notification center (bell icon in TopBar)
- [ ] Notification triggers: workout reminder, streak warning, achievement unlocked
- [ ] Weekly report notification (Brain Score summary)
- [ ] Supabase Realtime subscription for live notifications

## Phase J: Premium Subscription

- [ ] Stripe integration — checkout session creation
- [ ] Webhook handler — subscription lifecycle events
- [ ] Premium gating — restrict AI Coach, Decision Lab history, advanced reports
- [ ] Subscription status badge on profile

## Phase K: Admin Panel

- [ ] Admin route group (`/admin/*`) with separate layout
- [ ] Admin dashboard — key metrics (DAU, workouts completed, active subscriptions)
- [ ] Activity CRUD — create/edit/disable activities
- [ ] Mission templates CRUD
- [ ] User management — search, view profile, manual adjustments
- [ ] Analytics view — charts for engagement, retention, category popularity

## Phase L: Polish & Launch

- [ ] PWA manifest + service worker
- [ ] SEO — sitemap, robots.txt, canonical URLs
- [ ] Accessibility audit (WCAG AA)
- [ ] Performance audit (Lighthouse 90+)
- [ ] Error boundaries — per route group with fallback UI
- [ ] Loading states — skeletons for every data-fetching view
- [ ] Empty states — illustrations + CTA for empty lists
- [ ] Responsive pass — mobile, tablet, desktop breakpoints
- [ ] `npm run build` final verification

---

*Last updated: Phase A complete*
