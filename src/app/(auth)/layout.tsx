import Link from "next/link";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 pb-[env(safe-area-inset-bottom)] touch-manipulation">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center text-center">
          <Link href="/" className="inline-flex items-center justify-center focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
            <AkucheBrandLogo variant="full" size="md" showTagline />
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
