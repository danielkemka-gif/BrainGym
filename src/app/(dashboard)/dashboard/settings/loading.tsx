export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-pulse" role="status" aria-live="polite" aria-label="Loading settings">
      <div>
        <div className="h-7 w-32 rounded-lg bg-muted" />
        <div className="mt-2 h-4 w-48 rounded-lg bg-muted" />
      </div>
      <div className="space-y-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-muted" />
          <div className="space-y-2">
            <div className="h-5 w-32 rounded bg-muted" />
            <div className="h-4 w-48 rounded bg-muted" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 rounded bg-muted" />
              <div className="h-10 w-full rounded-xl bg-muted" />
            </div>
          ))}
        </div>
        <div className="h-10 w-32 rounded-xl bg-muted" />
      </div>
    </div>
  );
}
