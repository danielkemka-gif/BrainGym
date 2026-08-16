"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import Link from "next/link";

export function LoginForm({ refCode }: { refCode?: string | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isUnconfirmed, setIsUnconfirmed] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const effectiveRef = refCode || searchParams.get("ref");

  useEffect(() => {
    const errorParam = searchParams.get("error");
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
    if (errorParam === "auth_callback_error") {
      setError("Sign-in or confirmation link expired or invalid. Please try signing in or requesting a fresh link.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsUnconfirmed(false);
    setResendMessage(null);
    setLoading(true);

    if (effectiveRef) {
      try {
        document.cookie = `pending_ref=${encodeURIComponent(effectiveRef)}; path=/; max-age=900; SameSite=Lax`;
      } catch {
        // ignore cookie write failures
      }
    }

    const trimmedEmail = email.trim().toLowerCase();
    const supabase = createClient();

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (authError) {
        const msg = authError.message?.toLowerCase() || "";
        if (msg.includes("email not confirmed")) {
          setIsUnconfirmed(true);
          setError("Your email address is not verified yet. Please check your inbox or resend the verification email.");
        } else if (msg.includes("invalid login credentials")) {
          setError("Incorrect email or password. Please try again or reset your password.");
        } else if (msg.includes("rate limit") || msg.includes("too many")) {
          setError("Too many sign-in attempts. Please wait a minute before trying again.");
        } else {
          setError(authError.message || "Invalid email or password. Please try again.");
        }
        setLoading(false);
        return;
      }

      if (data?.session?.user) {
        // Attribute referral if present
        if (effectiveRef) {
          try {
            await supabase.rpc("attribute_referral", {
              p_user_id: data.session.user.id,
              p_ref: effectiveRef,
            });
          } catch (err) {
            console.error("Failed to attribute referral on login:", err);
          }
        }

        // Check onboarding completion
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_complete")
          .eq("user_id", data.session.user.id)
          .maybeSingle();

        const redirectParam = searchParams.get("redirect");
        const destination = redirectParam || (!profile || !profile.onboarding_complete ? "/onboarding" : "/dashboard");

        router.push(destination);
        router.refresh();
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendVerification() {
    if (!email) return;
    setResending(true);
    setResendMessage(null);

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
        setResendMessage(resendError.message || "Failed to resend link. Please wait a moment.");
      } else {
        setResendMessage("Verification email resent! Please check your inbox and spam folder.");
      }
    } catch {
      setResendMessage("Unable to resend email. Please check your connection.");
    } finally {
      setResending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div className="space-y-1.5">
        <label htmlFor="login-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Email
        </label>
        <input
          id="login-email"
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
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-primary font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="current-password"
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
          {isUnconfirmed && (
            <div className="pt-1">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resending}
                className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline text-xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${resending ? "animate-spin" : ""}`} />
                {resending ? "Resending..." : "Click here to resend verification email"}
              </button>
            </div>
          )}
        </div>
      )}

      {resendMessage && (
        <div className={`rounded-xl p-3 text-xs border ${
          resendMessage.includes("resent")
            ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
            : "bg-destructive/10 text-destructive border-destructive/20"
        }`}>
          {resendMessage}
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
          "Sign in"
        )}
      </button>
    </form>
  );
}
