"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      );

      if (authError) {
        const message =
          authError?.message ||
          (authError as any)?.error_description ||
          "Failed to send reset link";
        setError(message);
        setLoading(false);
        return;
      }

      setSent(true);
    } catch (err) {
      console.error("Forgot password error:", err);
      const message =
        (err as any)?.message ||
        (err as any)?.error_description ||
        "Network error. Please check your connection and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Check your email for a reset link.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex h-12 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring touch-manipulation"
        />
      </div>

      {error && (
        <div className="rounded-xl bg-destructive/10 p-3 sm:p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm sm:text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50"
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          "Send reset link"
        )}
      </button>
    </form>
  );
}
