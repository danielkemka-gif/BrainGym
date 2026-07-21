# BrainGym — Agents Guide

## State of the project

This is a **greenfield project at PRD stage**. No code, no config, no dependencies exist yet.
The single source of truth is [`PRD.md`](./PRD.md).

## Planned stack (from PRD)

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| **Backend** | Supabase (PostgreSQL, RLS, Auth, Edge Functions, Realtime) |
| **AI** | OpenAI Responses API, Embeddings |
| **Deployment** | Vercel, Supabase |
| **Analytics** | PostHog, Vercel Analytics |

## Node.js version

`v24.18.0` — confirm with `node --version` before initializing.

## MVP roadmap (12-week priority order)

| Phase | Weeks | Scope |
|---|---|---|
| **1** | 1–4 | Auth, onboarding, profiles, activity library, daily workouts, progress tracking, reminders, XP, streaks |
| **2** | 5–8 | AI Coach, Decision Lab, reports, achievements, leaderboards |
| **3** | 9–12 | Community challenges, Brain Buddy, referrals, premium subscriptions |

Phase 1 must ship first — do not build Phase 2/3 features until Phase 1 is complete.

## Once scaffolding is created

- **Project root** will be `C:\Users\danie\Documents\BRAINGYM APP`
- Keep `PRD.md` and `AGENTS.md` at the root
- Standard Next.js App Router layout: `app/`, `components/`, `lib/`, `types/`, `public/`
- Supabase types should be generated from the DB schema (use `supabase gen types`)
- All environment variables go in `.env.local` — template in `.env.example`
- shadcn/ui components go in `components/ui/`
- Run `npm run build` before creating PRs; fix type errors before lint errors

## Commit discipline

- Never commit secrets, `.env.local`, or generated Supabase types that are stale
- Keep commits small and focused on one feature area per commit
