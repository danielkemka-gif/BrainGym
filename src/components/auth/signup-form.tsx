"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Mail, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";

export function SignupForm({ refCode }: { refCode?: string | null }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isExistingAccount, setIsExistingAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsExistingAccount(false);
    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    // Save referral code in cookie for robust attribution across redirect flows
    if (refCode) {
      try {
        document.cookie = `pending_ref=${encodeURIComponent(refCode)}; path=/; max-age=900; SameSite=Lax`;
      } catch {
        // ignore cookie write failures in non-standard environments
      }
    }

    const supabase = createClient();
    const options: { emailRedirectTo: string; data?: Record<string, any> } = {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    };

    if (refCode) {
      options.data = { ref_code: refCode };
    }

    try {
      console.log("Starting signup...", { email: trimmedEmail, refCode });
      const { data, error: authError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options,
      });

      if (authError) {
        console.warn("Client signUp encountered error, attempting server fallback...", authError);
        const msg = (typeof authError === "string" ? authError : authError.message || (authError as any)?.error_description || "").toLowerCase();

        if (msg.includes("user already registered") || msg.includes("already exists")) {
          setIsExistingAccount(true);
          setError("An account with this email already exists. Please sign in.");
          setLoading(false);
          return;
        }

        // Attempt server-side creation fallback for instant signup & test run
        try {
          const apiRes = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: trimmedEmail, password, refCode }),
          });
          const apiData = await apiRes.json();

          if (apiRes.ok && apiData.success) {
            // Sign in directly
            const { error: signInErr } = await supabase.auth.signInWithPassword({
              email: trimmedEmail,
              password,
            });

            if (!signInErr) {
              router.replace("/onboarding");
              router.refresh();
              return;
            }
          } else if (apiData.isExisting) {
            setIsExistingAccount(true);
            setError("An account with this email already exists. Please sign in.");
            setLoading(false);
            return;
          }
        } catch (fallbackErr) {
          console.error("Server fallback error:", fallbackErr);
        }

        // Format user-friendly error (never display `{}` or empty string)
        if (msg.includes("rate limit") || msg.includes("too many requests")) {
          setError("Too many signup attempts. Please wait a moment or try Google sign-in.");
        } else if (!authError.message || authError.message === "{}" || authError.message.includes("Database error")) {
          setError("Unable to create account right now. Please try with Google or sign in.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      // Check if user already exists (Supabase returns empty identities array when user already exists with email confirmation enabled)
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        console.log("User already exists (empty identities)");
        setIsExistingAccount(true);
        setError("An account with this email already exists. Please sign in or reset your password.");
        setLoading(false);
        return;
      }

      // If a session was returned immediately (auto-confirm is enabled), proceed to onboarding
      if (data?.session?.user) {
        router.replace("/onboarding");
        router.refresh();
        return;
      }

      console.log("Signup successful — confirmation email sent");
      setSubmitted(true);
    } catch (err) {
      console.error("Unexpected signup error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendEmail() {
    if (!email) return;
    setResending(true);
    setResendStatus(null);

    const supabase = createClient();
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (resendError) {
        setResendStatus(resendError.message || "Failed to resend. Please wait a moment.");
      } else {
        setResendStatus("Confirmation email resent! Please check your inbox and spam folder.");
      }
    } catch {
      setResendStatus("Failed to resend confirmation email. Please check your connection.");
    } finally {
      setResending(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-center space-y-4 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Mail className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-foreground">Check your email</h3>
          <p className="text-sm text-muted-foreground">
            We sent a verification link to <strong className="text-foreground">{email}</strong>
          </p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Click the link in the email to activate your account and access your BrainGym dashboard.
        </p>

        {resendStatus && (
          <div className={`rounded-xl p-3 text-xs ${
            resendStatus.includes("resent")
              ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}>
            {resendStatus}
          </div>
        )}

        <div className="pt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleResendEmail}
            disabled={resending}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-xs font-semibold text-foreground hover:bg-accent transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${resending ? "animate-spin" : ""}`} />
            {resending ? "Resending link..." : "Resend confirmation email"}
          </button>

          <Link
            href="/login"
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-primary/10 px-4 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
          >
            <span>Go to sign in</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div className="space-y-1.5">
        <label htmlFor="signup-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="flex h-12 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring touch-manipulation"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="signup-password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Password
        </label>
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="At least 6 characters"
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
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-destructive/10 p-3 sm:p-4 text-xs sm:text-sm text-destructive border border-destructive/20 space-y-2">
          <p>{error}</p>
          {isExistingAccount && (
            <Link
              href={`/login?email=${encodeURIComponent(email)}${refCode ? `&ref=${encodeURIComponent(refCode)}` : ""}`}
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline text-xs"
            >
              Click here to sign in →
            </Link>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm sm:text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 shadow-md shadow-primary/20"
      >
        {loading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          "Create account"
        )}
      </button>
    </form>
  );
}
