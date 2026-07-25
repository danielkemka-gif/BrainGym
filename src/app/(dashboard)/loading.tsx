export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-lg bg-muted" />
          <div className="h-4 w-64 rounded-lg bg-muted" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-20 rounded-full bg-muted" />
          <div className="h-8 w-16 rounded-full bg-muted" />
        </div>
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted" />
              <div className="space-y-1.5">
                <div className="h-3 w-16 rounded bg-muted" />
                <div className="h-5 w-12 rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-muted/50" />
        ))}
      </div>

      {/* Activity cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 rounded-xl bg-muted/50" />
        ))}
      </div>
    </div>
  );
}
