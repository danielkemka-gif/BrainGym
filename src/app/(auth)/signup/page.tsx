import { SignupForm } from "@/components/auth/signup-form";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import Link from "next/link";

export default async function SignupPage(props: { searchParams?: Promise<{ ref?: string }> }) {
  const searchParams = await props.searchParams;
  const refCode = searchParams?.ref || null;

  return (
    <div className="w-full max-w-sm space-y-3 sm:space-y-5">
      {refCode && (
        <div className="rounded-xl bg-primary/10 border border-primary/20 px-3 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm text-primary">
          You were invited by a friend! Join now and earn bonus coins.
        </div>
      )}

      <div className="space-y-2 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-balance">Join BrainGym</h1>
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
          <span className="bg-background px-2 text-muted-foreground">
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
        <Link href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
