"use client";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Platform analytics and insights (coming soon)
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
        <span className="text-5xl">📊</span>
        <p className="mt-4 text-lg font-semibold">Analytics Dashboard</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Detailed analytics including DAU/MAU, retention curves, feature usage heatmaps,
          and A/B test results will be available here.
        </p>
      </div>
    </div>
  );
}
