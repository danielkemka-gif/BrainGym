"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Mail, RefreshCw, CheckCircle2, User, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";

export function SignupForm({ refCode }: { refCode?: string | null }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isExistingAccount, setIsExistingAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsExistingAccount(false);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Client-Side Input Validations
    if (!trimmedName || trimmedName.length < 2) {
      setError("Please enter your full name (at least 2 characters).");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter your password confirmation.");
      return;
    }

    setLoading(true);

    // Save referral code in cookie for robust attribution
    if (refCode) {
      try {
        document.cookie = `pending_ref=${encodeURIComponent(refCode)}; path=/; max-age=900; SameSite=Lax`;
      } catch {}
    }

    const supabase = createClient();
    const options: { emailRedirectTo: string; data?: Record<string, any> } = {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        full_name: trimmedName,
        name: trimmedName,
        ...(refCode ? { ref_code: refCode } : {}),
      },
    };

    try {
      console.log("Starting user registration...", { email: trimmedEmail });
      const { data, error: authError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options,
      });

      if (authError) {
        console.warn("Client signUp error, attempting server fallback...", authError);
        const msg = (authError.message || "").toLowerCase();

        if (msg.includes("user already registered") || msg.includes("already exists")) {
          setIsExistingAccount(true);
          setError("An account with this email already exists. Please sign in below.");
          setLoading(false);
          return;
        }

        // Server-side admin creation fallback
        try {
          const apiRes = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fullName: trimmedName,
              email: trimmedEmail,
              password,
              refCode,
            }),
          });
          const apiData = await apiRes.json();

          if (apiRes.ok && apiData.success) {
            // Sign in directly
            const { error: signInErr } = await supabase.auth.signInWithPassword({
              email: trimmedEmail,
              password,
            });

            if (!signInErr) {
              // Set flag indicating first-time account registration for PWA install prompt
              try {
                sessionStorage.setItem("akuche_just_registered", "true");
              } catch {}
              router.replace("/dashboard");
              router.refresh();
              return;
            }
          } else if (apiData.isExisting) {
            setIsExistingAccount(true);
            setError("An account with this email already exists. Please sign in.");
            setLoading(false);
            return;
          } else if (apiData.error) {
            const apiMsg = (apiData.error || "").toLowerCase();
            if (
              apiMsg.includes("trouble connecting") ||
              apiMsg.includes("failed to fetch") ||
              apiMsg.includes("network") ||
              apiMsg.includes("enotfound")
            ) {
              setError(
                "We're having trouble connecting to Akuche right now. Your internet connection or our service may be temporarily unavailable. Please try again shortly."
              );
            } else {
              setError(apiData.error);
            }
            setLoading(false);
            return;
          }
        } catch (fallbackErr) {
          console.error("Server fallback error:", fallbackErr);
        }

        const isNetworkFailure =
          msg.includes("failed to fetch") ||
          msg.includes("networkerror") ||
          msg.includes("enotfound") ||
          msg.includes("fetch failed") ||
          msg.includes("load failed") ||
          (authError as any).status === 0;

        if (isNetworkFailure) {
          setError(
            "We're having trouble connecting to Akuche right now. Your internet connection or our service may be temporarily unavailable. Please try again shortly."
          );
        } else if (msg.includes("rate limit") || msg.includes("too many requests")) {
          setError("Too many signup attempts. Please wait a moment or try Google sign-in.");
        } else if (!authError.message || authError.message.includes("Database error")) {
          setError("Unable to create account right now. Please try again shortly.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      // Check if user already exists (Supabase returns empty identities array when user already exists)
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setIsExistingAccount(true);
        setError("An account with this email already exists. Please sign in or reset your password.");
        setLoading(false);
        return;
      }

      // If auto-confirm is enabled and session is present, go straight to dashboard
      if (data?.session?.user) {
        try {
          sessionStorage.setItem("akuche_just_registered", "true");
        } catch {}
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      // Email confirmation required
      setSubmitted(true);
    } catch (err: any) {
      console.error("Unexpected signup error:", err);
      const isDnsOrNetwork =
        !navigator.onLine ||
        err?.message?.includes("Failed to fetch") ||
        err?.message?.includes("NetworkError") ||
        err?.message?.includes("ENOTFOUND") ||
        err?.name === "TypeError";

      if (isDnsOrNetwork) {
        setError(
          "We're having trouble connecting to Akuche right now. Your internet connection or our service may be temporarily unavailable. Please try again shortly."
        );
      } else {
        setError(err?.message || "Connection error. Please try again.");
      }
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
        setResendStatus(resendError.message || "Failed to resend confirmation email. Please wait a moment.");
      } else {
        setResendStatus("Confirmation email resent! Please check your inbox and spam folder.");
      }
    } catch {
      setResendStatus("Failed to resend confirmation email. Please check your connection.");
    } finally {
      setResending(false);
    }
  }

  // Confirmation email sent view
  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-card p-5 sm:p-6 text-center space-y-4 shadow-sm animate-in fade-in">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <Mail className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-foreground">Verify Your Email</h3>
          <p className="text-sm text-muted-foreground">
            We sent an activation link to <strong className="text-foreground">{email}</strong>
          </p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Tap the link in your email to activate your account and access your personal clarity dashboard.
        </p>

        {resendStatus && (
          <div
            className={`rounded-xl p-3 text-xs border ${
              resendStatus.includes("resent")
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}
          >
            {resendStatus}
          </div>
        )}

        <div className="pt-2 space-y-2">
          <button
            type="button"
            onClick={handleResendEmail}
            disabled={resending}
            className="inline-flex items-center justify-center gap-1.5 w-full h-11 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${resending ? "animate-spin" : ""}`} />
            {resending ? "Resending..." : "Didn't receive email? Resend"}
          </button>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full h-11 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 transition"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {/* 1. Full Name Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="signup-name"
          className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"
        >
          <User className="h-3.5 w-3.5" />
          Full Name
        </label>
        <input
          id="signup-name"
          type="text"
          placeholder="e.g. Maya Lin"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
          className="flex h-12 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring touch-manipulation"
        />
      </div>

      {/* 2. Email Address Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="signup-email"
          className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"
        >
          <Mail className="h-3.5 w-3.5" />
          Email Address
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

      {/* 3. Password Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="signup-password"
          className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"
        >
          <Lock className="h-3.5 w-3.5" />
          Password (min 8 characters)
        </label>
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className="flex h-12 w-full rounded-xl border border-border bg-background px-4 py-2 pr-11 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring touch-manipulation"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* 4. Confirm Password Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="signup-confirm-password"
          className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="signup-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            className={`flex h-12 w-full rounded-xl border bg-background px-4 py-2 pr-11 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring touch-manipulation ${
              confirmPassword && password !== confirmPassword
                ? "border-destructive/60 focus-visible:ring-destructive"
                : "border-border"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
            tabIndex={-1}
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {confirmPassword && password !== confirmPassword && (
          <p className="text-[11px] text-destructive">Passwords do not match</p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-xl bg-destructive/10 p-3 sm:p-4 text-xs sm:text-sm text-destructive border border-destructive/20 space-y-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p className="flex-1 leading-relaxed">{error}</p>
          </div>
          {error.includes("trouble connecting") && (
            <div className="pt-1">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline text-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry registration
              </button>
            </div>
          )}
          {isExistingAccount && (
            <Link
              href={`/login?email=${encodeURIComponent(email)}`}
              className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline text-xs pt-1"
            >
              Sign in with this email →
            </Link>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || (!!confirmPassword && password !== confirmPassword)}
        className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm sm:text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 shadow-md shadow-primary/20 touch-manipulation"
      >
        {loading ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}
