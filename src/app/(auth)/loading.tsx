export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center" role="status" aria-live="polite" aria-label="Loading">
      <div className="w-full max-w-md space-y-6 animate-pulse px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-muted" />
          <div className="h-6 w-40 rounded-lg bg-muted" />
          <div className="h-4 w-56 rounded-lg bg-muted" />
        </div>
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <div className="space-y-2">
            <div className="h-3 w-16 rounded bg-muted" />
            <div className="h-10 w-full rounded-xl bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="h-10 w-full rounded-xl bg-muted" />
          </div>
          <div className="h-10 w-full rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
}
