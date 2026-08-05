import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 pb-[env(safe-area-inset-bottom)] touch-manipulation">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold">
            <span className="text-2xl">🧠</span>
            <span>BrainGym</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
