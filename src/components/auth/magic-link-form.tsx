"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail } from "lucide-react";

export function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    try {
      console.log("Sending magic link...", { email });
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        console.error("Magic link error:", authError);
        const message =
          authError?.message ||
          (authError as any)?.error_description ||
          "Failed to send sign-in link. Please try again.";
        setError(message);
        setLoading(false);
        return;
      }

      console.log("Magic link sent successfully");
      setSubmitted(true);
    } catch (err) {
      console.error("Unexpected magic link error:", err);
      const message =
        (err as any)?.message ||
        "Network error. Please check your connection and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border bg-card p-4 sm:p-6 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-semibold">Check your email</h3>
        <p className="text-sm text-muted-foreground">
          We sent a sign-in link to <strong>{email}</strong>
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-3 text-sm text-primary hover:underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <label htmlFor="magic-email" className="text-sm font-medium">
          Email address
        </label>
        <input
          id="magic-email"
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
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm sm:text-base font-semibold transition-colors hover:bg-accent active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50"
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <>
            <Mail className="h-4 w-4" />
            Send me a sign-in link
          </>
        )}
      </button>
    </form>
  );
}
