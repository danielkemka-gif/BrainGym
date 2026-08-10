"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export function SignupForm({ refCode }: { refCode?: string | null }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const options: any = {
      emailRedirectTo: `${window.location.origin}/auth/callback${refCode ? `?ref=${refCode}` : ""}`,
    };

    if (refCode) {
      options.data = { ref_code: refCode };
    }

    try {
      console.log("Starting signup...", { email, refCode });
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options,
      });

      if (authError) {
        console.error("Signup error:", authError);
        const message =
          authError?.message ||
          (authError as any)?.error_description ||
          (authError as any)?.details ||
          "Something went wrong. Please try again.";
        setError(message);
        setLoading(false);
        return;
      }

      // If a session was returned, email confirmation is disabled and the
      // account is ready to use immediately — attribute any referral and
      // continue to onboarding.
      if (data?.session?.user) {
        const userId = data.session.user.id;
        if (refCode) {
          try {
            const { data: referrer } = await supabase
              .from("profiles")
              .select("user_id")
              .eq("referral_code", refCode)
              .maybeSingle();

            if (referrer) {
              await supabase
                .from("profiles")
                .update({ referred_by: referrer.user_id })
                .eq("user_id", userId);
              await supabase.rpc("increment_referral_count", {
                referrer_id: referrer.user_id,
              });
            }
          } catch (err) {
            console.error("Failed to attribute referral:", err);
          }
        }

        router.replace("/onboarding");
        router.refresh();
        return;
      }

      console.log("Signup successful — confirmation email sent");
      setSubmitted(true);
    } catch (err) {
      console.error("Unexpected signup error:", err);
      const message =
        (err as any)?.message ||
        (err as any)?.error_description ||
        (err as any)?.details ||
        "Network error. Please check your connection and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border bg-card p-4 sm:p-6 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
          <span className="text-2xl">📧</span>
        </div>
        <h3 className="font-semibold">Check your email</h3>
        <p className="text-sm text-muted-foreground">
          We sent a confirmation link to <strong>{email}</strong>
        </p>
        <p className="text-xs text-muted-foreground">
          Click the link in the email to confirm your account, then sign in.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="mt-3 text-sm text-primary hover:underline"
        >
          Go to sign in →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        id="signup-email"
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        className="flex h-12 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring touch-manipulation"
      />
 
      <div className="relative">
        <input
          id="signup-password"
          type={showPassword ? "text" : "password"}
          placeholder="Create a password (6+ chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          className="flex h-12 w-full rounded-xl border border-border bg-background px-4 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring touch-manipulation"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
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
          "Create account"
        )}
      </button>
    </form>
  );
}
