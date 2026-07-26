export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse" role="status" aria-live="polite" aria-label="Loading admin">
      <div className="h-7 w-48 rounded-lg bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-muted/50" />
        ))}
      </div>
    </div>
  );
}
