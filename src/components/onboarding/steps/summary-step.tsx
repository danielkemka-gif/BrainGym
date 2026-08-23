"use client";

import { CATEGORIES, GOALS, CHALLENGES, WORKOUT_TIMES, AGE_GROUPS } from "@/lib/constants";
import { AGE_GROUP_ICONS } from "@/lib/icons";
import type { BasicInfoData } from "./basic-info-step";
import type { GoalsScheduleData } from "./goals-schedule-step";
import type { AssessmentData } from "./assessment-step";
import type { AgeGroup } from "@/lib/constants";

interface Props {
  basicInfo: BasicInfoData;
  goalsSchedule: GoalsScheduleData;
  assessment: AssessmentData;
  ageGroup?: AgeGroup;
  onBack: () => void;
  onSubmit: () => Promise<void>;
  submitting: boolean;
  submitError: string | null;
}

export function SummaryStep({
  basicInfo,
  goalsSchedule,
  assessment,
  ageGroup,
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
  const ageGroupLabel = AGE_GROUPS.find((a) => a.value === ageGroup);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
        <h3 className="mb-2 text-sm font-medium">About you</h3>
        <div className="flex items-center gap-3 sm:gap-4">
          {basicInfo.avatar_url && (
            <img
              src={basicInfo.avatar_url}
              alt="Avatar"
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover shrink-0"
            />
          )}
          <div className="space-y-1 text-xs sm:text-sm text-muted-foreground min-w-0">
            <p className="truncate">
              {basicInfo.name}, {basicInfo.gender ? `${basicInfo.gender}, ` : ""}{basicInfo.age}
              {basicInfo.occupation ? ` — ${basicInfo.occupation}` : ""}
            </p>
            {ageGroupLabel && (
              <p className="flex items-center gap-1.5">
                {(() => { const AgeIcon = AGE_GROUP_ICONS[ageGroupLabel.iconKey]; return AgeIcon ? <AgeIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" /> : null; })()}
                <span className="text-foreground font-medium">{ageGroupLabel.label}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
        <h3 className="mb-2 text-sm font-medium">Goals & schedule</h3>
        <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
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

      <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
        <h3 className="mb-2 text-sm font-medium">Self-assessment</h3>
        <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
          {CATEGORIES.map((c) => (
            <p key={c.id}>
              {c.label}: <span className="text-foreground">{assessment.scores[c.slug] ?? "—"}</span>/100
            </p>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-violet-500/10 p-4 sm:p-5 text-center space-y-1.5 shadow-sm">
        <span className="text-[10px] font-black uppercase tracking-wider text-primary">Personalized Habit Plan Ready</span>
        <h3 className="text-base sm:text-lg font-black text-foreground">
          YOUR BRAIN TRAINING PLAN IS READY.
        </h3>
        <p className="text-xs text-muted-foreground">
          We&apos;ve customized your 7-minute daily workouts across your primary focus domains. Start today to establish your baseline score.
        </p>
      </div>

      {submitError && (
        <div className="rounded-xl bg-destructive/10 p-3 text-xs sm:text-sm text-destructive">
          {submitError}
        </div>
      )}

      <div className="flex gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border border-border bg-background px-4 text-sm font-bold transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] touch-manipulation min-h-[48px]"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="inline-flex h-12 flex-[2] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 px-6 text-sm font-black text-white shadow-lg shadow-primary/25 transition-all hover:brightness-110 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] touch-manipulation min-h-[48px]"
        >
          {submitting ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "START YOUR FIRST WORKOUT →"
          )}
        </button>
      </div>
    </div>
  );
}
