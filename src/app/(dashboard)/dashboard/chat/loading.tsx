export default function ChatLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] animate-pulse" role="status" aria-live="polite" aria-label="Loading chat">
      <div className="flex-1 space-y-4 p-4">
        <div className="h-7 w-32 rounded-lg bg-muted" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="space-y-1.5">
                <div className="h-3 w-20 rounded bg-muted" />
                <div className="h-10 w-48 rounded-xl bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden w-60 border-l border-border p-4 lg:block">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="mt-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-muted" />
              <div className="h-3 w-16 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
