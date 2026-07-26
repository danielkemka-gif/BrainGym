export default function GamesLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-pulse" role="status" aria-live="polite" aria-label="Loading games">
      <div>
        <div className="h-7 w-40 rounded-lg bg-muted" />
        <div className="mt-2 h-4 w-80 rounded-lg bg-muted" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl bg-muted/50 p-4 text-center">
            <div className="mx-auto mb-2 h-8 w-16 rounded bg-muted" />
            <div className="mx-auto h-3 w-20 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="h-24 rounded-2xl bg-muted/50" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-56 rounded-2xl bg-muted/50" />
        ))}
      </div>
    </div>
  );
}
