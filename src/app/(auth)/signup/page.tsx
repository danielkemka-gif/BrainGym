"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import Link from "next/link";

function SignupContent() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");

  return (
    <div className="w-full max-w-sm space-y-4 sm:space-y-5">
      {refCode && (
        <div className="rounded-xl bg-primary/10 border border-primary/20 px-3 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm text-primary">
          You were invited by a friend! Join now and earn bonus coins.
        </div>
      )}

      <div className="space-y-2 text-center">
        <h1 className="text-xl sm:text-2xl font-black text-balance">Join BrainGym</h1>
        <p className="text-sm text-muted-foreground">
          Train your brain in 5 minutes a day
        </p>
      </div>

      <SocialAuthButtons refCode={refCode} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-semibold">
            Or use email
          </span>
        </div>
      </div>

      <SignupForm refCode={refCode} />

      <p className="text-center text-xs text-muted-foreground">
        By signing up you agree to our{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={refCode ? `/login?ref=${encodeURIComponent(refCode)}` : "/login"}
          className="text-primary font-bold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
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
      <SignupContent />
    </Suspense>
  );
}
