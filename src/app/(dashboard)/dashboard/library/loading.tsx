export default function LibraryLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-pulse" role="status" aria-live="polite" aria-label="Loading library">
      <div className="overflow-hidden rounded-2xl bg-muted/50 p-6">
        <div className="h-7 w-48 rounded-lg bg-muted" />
        <div className="mt-2 h-4 w-64 rounded-lg bg-muted" />
        <div className="mt-4 flex gap-3">
          <div className="h-6 w-24 rounded-lg bg-muted" />
          <div className="h-6 w-28 rounded-lg bg-muted" />
          <div className="h-6 w-20 rounded-lg bg-muted" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-muted/50" />
        ))}
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-28 rounded-xl bg-muted" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-muted/50" />
        ))}
      </div>
    </div>
  );
}
