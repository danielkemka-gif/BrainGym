# Security Changes

This document records the critical security fixes applied to the BrainGym codebase.

## Fix 1: Protect admin storage setup route
- File: `src/app/api/admin/setup-storage/route.ts`
- Change: Added server-side Supabase session validation and admin role check before using the Supabase service-role client.
- Reason: Prevents unauthorized users from invoking an admin-only route that can create or modify storage buckets using the service role key.

## Fix 2: Enforce auth for protected API routes
- File: `src/middleware.ts`
- Change: Removed the blanket bypass for all `/api/` routes.
- Change: Allowed only `/api/paystack/webhook` as a public API path.
- Change: Added authentication enforcement for all other API requests via Supabase session validation.
- Reason: Prevents unauthenticated access to protected API endpoints and ensures only authorized requests can reach backend logic.
