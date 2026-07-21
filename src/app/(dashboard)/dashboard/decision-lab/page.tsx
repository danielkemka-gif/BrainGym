"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { PremiumGate } from "@/components/premium/premium-gate";

interface Evaluation {
  pros: string[];
  cons: string[];
  secondOrder: string[];
  biases: { name: string; explanation: string }[];
  alternatives: string[];
  recommendation: string;
}

interface Entry {
  id: string;
  scenario: string;
  response: string | null;
  ai_evaluation: Evaluation;
  created_at: string;
}

export default function DecisionLabPage() {
  const [scenario, setScenario] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentEval, setCurrentEval] = useState<Evaluation | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("decision_lab_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)
        .then(({ data }) => {
          if (data) setEntries(data as unknown as Entry[]);
          setLoadingHistory(false);
        });
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!scenario.trim()) return;

    setSubmitting(true);
    setError(null);
    setCurrentEval(null);

    try {
      const res = await fetch("/api/ai/decision-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: scenario.trim(),
          response: userResponse.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error ?? "Request failed");
      }

      const data = await res.json();
      setCurrentEval(data.evaluation);
      setShowForm(false);

      // Refresh history
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: newEntries } = await supabase
          .from("decision_lab_entries")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20);
        if (newEntries) setEntries(newEntries as unknown as Entry[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setScenario("");
    setUserResponse("");
    setCurrentEval(null);
    setShowForm(true);
    setError(null);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Decision Lab</h1>
        <p className="text-sm text-muted-foreground">
          Analyze real decisions with AI-powered thinking frameworks
        </p>
      </div>

      <PremiumGate feature="Decision Lab">
        <>
          {/* New scenario form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  What decision or scenario are you facing?
                </label>
                <textarea
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  placeholder="e.g. I'm considering leaving my stable job to start a business..."
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Your initial thoughts (optional)
                </label>
                <textarea
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="What are you leaning towards? What are your concerns?"
                  rows={2}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!scenario.trim() || submitting}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Decision"
                )}
              </button>
            </form>
          )}

          {/* Evaluation result */}
          {currentEval && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Analysis</h2>
                <button onClick={resetForm} className="text-sm text-primary hover:underline">
                  New analysis
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
                  <h3 className="mb-2 text-sm font-medium text-green-600">Pros</h3>
                  <ul className="space-y-1.5">
                    {currentEval.pros?.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-0.5 text-green-500">+</span>
                        {p}
                      </li>
                    )) ?? <li className="text-sm text-muted-foreground">None identified</li>}
                  </ul>
                </div>

                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                  <h3 className="mb-2 text-sm font-medium text-red-600">Cons</h3>
                  <ul className="space-y-1.5">
                    {currentEval.cons?.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-0.5 text-red-500">−</span>
                        {c}
                      </li>
                    )) ?? <li className="text-sm text-muted-foreground">None identified</li>}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-2 text-sm font-medium">Second-Order Thinking</h3>
                <ul className="space-y-1.5">
                  {currentEval.secondOrder?.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-0.5 text-primary">{i + 1}.</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {currentEval.biases && currentEval.biases.length > 0 && (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                  <h3 className="mb-2 text-sm font-medium text-amber-600">Cognitive Biases Detected</h3>
                  <ul className="space-y-2">
                    {currentEval.biases.map((b, i) => (
                      <li key={i} className="text-sm">
                        <span className="font-medium">{b.name}</span>
                        <p className="text-muted-foreground">{b.explanation}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-2 text-sm font-medium">Alternative Perspectives</h3>
                <ul className="space-y-1.5">
                  {currentEval.alternatives?.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-0.5 text-primary">◈</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <h3 className="mb-2 text-sm font-medium text-primary">Recommendation</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {currentEval.recommendation}
                </p>
              </div>
            </div>
          )}

          {/* History */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Past Analyses</h2>

            {loadingHistory ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
                ))}
              </div>
            ) : entries.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg font-medium">No analyses yet</p>
                <p className="text-sm text-muted-foreground">
                  Submit a decision scenario to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => {
                  const evalData = entry.ai_evaluation as Evaluation | null;
                  return (
                    <button
                      key={entry.id}
                      onClick={() => {
                        setCurrentEval(evalData);
                        setShowForm(false);
                      }}
                      className="w-full rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-muted-foreground/30"
                    >
                      <p className="line-clamp-1 text-sm font-medium">
                        {entry.scenario}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                        {evalData && (
                          <>
                            <span>·</span>
                            <span>{evalData.pros?.length ?? 0} pros, {evalData.cons?.length ?? 0} cons</span>
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      </PremiumGate>
    </div>
  );
}
