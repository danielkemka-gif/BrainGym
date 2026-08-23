"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import Link from "next/link";

function LoginContent() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");
  const redirect = searchParams.get("redirect");

  return (
    <div className="w-full max-w-sm space-y-4 sm:space-y-5">
      {refCode && (
        <div className="rounded-xl bg-primary/10 border border-primary/20 px-3 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm text-primary">
          You were invited by a friend! Sign in or join to earn bonus coins.
        </div>
      )}

      <div className="space-y-2 text-center">
        <h1 className="text-xl sm:text-2xl font-black text-balance">Welcome Back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to continue your daily brain training
        </p>
      </div>

      <SocialAuthButtons refCode={refCode} redirectTo={redirect || undefined} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-semibold">
            Or sign in with email
          </span>
        </div>
      </div>

      <LoginForm refCode={refCode} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-semibold">
            Or use magic link
          </span>
        </div>
      </div>

      <MagicLinkForm refCode={refCode} />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={refCode ? `/signup?ref=${encodeURIComponent(refCode)}` : "/signup"}
          className="text-primary font-bold hover:underline"
        >
          Sign up free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-sm space-y-4 animate-pulse">
          <div className="h-8 bg-muted rounded-xl w-1/2 mx-auto" />
          <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
          <div className="h-48 bg-muted rounded-2xl" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
