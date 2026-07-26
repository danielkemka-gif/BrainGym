export default function OnboardingLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-6 animate-pulse">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-2 w-12 rounded-full bg-muted" />
          ))}
        </div>
        <div className="space-y-3 text-center">
          <div className="mx-auto h-8 w-64 rounded-lg bg-muted" />
          <div className="mx-auto h-4 w-80 rounded-lg bg-muted" />
        </div>
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <div className="space-y-2">
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="h-10 w-full rounded-xl bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="h-10 w-full rounded-xl bg-muted" />
          </div>
          <div className="h-10 w-full rounded-xl bg-muted" />
        </div>
        <div className="flex justify-between">
          <div className="h-10 w-24 animate-pulse rounded-xl bg-muted" />
          <div className="h-10 w-28 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
}
