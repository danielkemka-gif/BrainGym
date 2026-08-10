"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getSiteUrl } from "@/lib/site-url";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export function SocialAuthButtons({
  redirectTo,
  refCode,
}: {
  redirectTo?: string;
  refCode?: string | null;
}) {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  async function handleOAuth(provider: "google") {
    setError(null);
    setLoading((prev) => ({ ...prev, [provider]: true }));
    console.log(`Starting ${provider} OAuth...`);

    try {
      // Carry the referral code via a short-lived cookie instead of a query
      // string on redirectTo — Supabase's redirect allowlist matches URLs
      // exactly, so `?ref=...` would fail validation after OAuth completes.
      if (refCode) {
        try {
          document.cookie = `pending_ref=${encodeURIComponent(refCode)}; path=/; max-age=900; SameSite=Lax`;
        } catch {
          // ignore cookie failures
        }
      }

      const supabase = createClient();
      const browserOrigin =
        typeof window !== "undefined" ? window.location.origin : getSiteUrl();
      const baseRedirect = redirectTo || `${browserOrigin}/auth/callback`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: baseRedirect,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) {
        console.error(`${provider} OAuth error:`, error);
        const message =
          error?.message?.includes("provider is not enabled")
            ? "Google sign-in is not enabled for this app yet. Please use email sign-in for now."
            : error?.message || `${provider} sign-in failed. Please try again.`;
        setError(message);
        setLoading((prev) => ({ ...prev, [provider]: false }));
        return;
      }

      // Some Supabase clients return an OAuth URL to follow. If provided,
      // navigate the browser there to start the provider flow.
      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      setLoading((prev) => ({ ...prev, [provider]: false }));
    } catch (err) {
      console.error(`Unexpected ${provider} OAuth error:`, err);
      const message =
        (err as any)?.message ||
        (err as any)?.error_description ||
        "Connection error. Please check your internet and try again.";
      setError(message);
      setLoading((prev) => ({ ...prev, [provider]: false }));
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="rounded-xl bg-destructive/10 p-3 sm:p-4 text-sm text-destructive">
          {error}
        </div>
      )}
      <button
        onClick={() => handleOAuth("google")}
        disabled={loading["google"]}
        className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border bg-background px-4 text-sm sm:text-base font-semibold transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50"
      >
        {loading["google"] ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </button>
    </div>
  );
}
