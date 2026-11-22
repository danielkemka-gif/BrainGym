import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set New Password | Akuche",
  description: "Set a new secure password for your Akuche account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-sm space-y-4 sm:space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-balance">Set New Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter and confirm your new secure password below.
        </p>
      </div>

      <Suspense fallback={<div className="h-48 flex items-center justify-center text-sm text-muted-foreground">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>

      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
