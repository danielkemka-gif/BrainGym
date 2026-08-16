import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import Link from "next/link";

function LoginFormWrapper({ refCode }: { refCode?: string | null }) {
  return (
    <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-muted" />}>
      <LoginForm refCode={refCode} />
    </Suspense>
  );
}

export default async function LoginPage(props: {
  searchParams?: Promise<{ ref?: string; redirect?: string; error?: string; email?: string }>;
}) {
  const searchParams = await props.searchParams;
  const refCode = searchParams?.ref || null;
  const redirect = searchParams?.redirect || null;

  return (
    <div className="w-full max-w-sm space-y-3 sm:space-y-5">
      {refCode && (
        <div className="rounded-xl bg-primary/10 border border-primary/20 px-3 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm text-primary">
          You were invited by a friend! Sign in or join to earn bonus coins.
        </div>
      )}

      <div className="space-y-2 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-balance">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to continue training your brain
        </p>
      </div>

      <SocialAuthButtons refCode={refCode} redirectTo={redirect ? undefined : undefined} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or sign in with email
          </span>
        </div>
      </div>

      <LoginFormWrapper refCode={refCode} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or use magic link
          </span>
        </div>
      </div>

      <MagicLinkForm refCode={refCode} />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={refCode ? `/signup?ref=${encodeURIComponent(refCode)}` : "/signup"}
          className="text-primary font-medium hover:underline"
        >
          Sign up free
        </Link>
      </p>
    </div>
  );
}

