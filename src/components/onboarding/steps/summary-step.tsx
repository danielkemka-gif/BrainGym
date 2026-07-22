"use client";

import { CATEGORIES, GOALS, CHALLENGES, WORKOUT_TIMES } from "@/lib/constants";
import type { BasicInfoData } from "./basic-info-step";
import type { GoalsScheduleData } from "./goals-schedule-step";
import type { AssessmentData } from "./assessment-step";

interface Props {
  basicInfo: BasicInfoData;
  goalsSchedule: GoalsScheduleData;
  assessment: AssessmentData;
  onBack: () => void;
  onSubmit: () => Promise<void>;
  submitting: boolean;
  submitError: string | null;
}

export function SummaryStep({
  basicInfo,
  goalsSchedule,
  assessment,
  onBack,
  onSubmit,
  submitting,
  submitError,
}: Props) {
  const goalLabels = goalsSchedule.goals.map(
    (g) => GOALS.find((o) => o.value === g)?.label ?? g
  );
  const challengeLabels = goalsSchedule.challenges.map(
    (c) => CHALLENGES.find((o) => o.value === c)?.label ?? c
  );
  const timeLabel = WORKOUT_TIMES.find(
    (t) => t.value === goalsSchedule.preferred_workout_time
  )?.label;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-2 text-sm font-medium">About you</h3>
        <div className="flex items-center gap-4">
          {basicInfo.avatar_url && (
            <img
              src={basicInfo.avatar_url}
              alt="Avatar"
              className="h-14 w-14 rounded-full object-cover"
            />
          )}
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              {basicInfo.name}, {basicInfo.gender ? `${basicInfo.gender}, ` : ""}{basicInfo.age}
              {basicInfo.occupation ? ` — ${basicInfo.occupation}` : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-2 text-sm font-medium">Goals & schedule</h3>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>
            Goals:{" "}
            {goalLabels.length > 0
              ? goalLabels.join(", ")
              : "None selected"}
          </p>
          {challengeLabels.length > 0 && (
            <p>Challenges: {challengeLabels.join(", ")}</p>
          )}
          <p>Preferred time: {timeLabel ?? "Not set"}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-2 text-sm font-medium">Self-assessment</h3>
        <div className="space-y-1 text-sm text-muted-foreground">
          {CATEGORIES.map((c) => (
            <p key={c.id}>
              {c.label}: <span className="text-foreground">{assessment.scores[c.id] ?? "—"}</span>/100
            </p>
          ))}
        </div>
      </div>

      {submitError && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {submitError}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {submitting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            "Complete setup"
          )}
        </button>
      </div>
    </div>
  );
}
