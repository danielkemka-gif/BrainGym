export default function MarketingLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
        <div className="hidden gap-6 md:flex">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-16 animate-pulse rounded bg-muted" />
          ))}
        </div>
        <div className="h-9 w-20 animate-pulse rounded-xl bg-muted" />
      </div>
      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-7xl space-y-16 px-4 py-20 sm:px-6 lg:px-8">
          <div className="space-y-4 text-center">
            <div className="mx-auto h-10 w-96 animate-pulse rounded-lg bg-muted" />
            <div className="mx-auto h-6 w-72 animate-pulse rounded-lg bg-muted" />
            <div className="mx-auto flex gap-3">
              <div className="h-11 w-32 animate-pulse rounded-xl bg-muted" />
              <div className="h-11 w-28 animate-pulse rounded-xl bg-muted" />
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted/50" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
