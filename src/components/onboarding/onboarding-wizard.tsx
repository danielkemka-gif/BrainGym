"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BasicInfoStep, type BasicInfoData } from "./steps/basic-info-step";
import {
  GoalsScheduleStep,
  type GoalsScheduleData,
} from "./steps/goals-schedule-step";
import { AssessmentStep, type AssessmentData } from "./steps/assessment-step";
import { SummaryStep } from "./steps/summary-step";

const TOTAL_STEPS = 4;
const STEP_LABELS = ["About you", "Goals", "Assessment", "Review"];

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
    name: "",
    username: "",
    age: 25,
    occupation: "",
  });

  const [goalsSchedule, setGoalsSchedule] = useState<GoalsScheduleData>({
    goals: [],
    challenges: [],
    preferred_workout_time: "",
  });

  const [assessment, setAssessment] = useState<AssessmentData>({
    scores: {},
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error: profileError } = await supabase.from("profiles").upsert({
        user_id: user.id,
        name: basicInfo.name,
        age: basicInfo.age,
        occupation: basicInfo.occupation || null,
        goals: goalsSchedule.goals,
        challenges: goalsSchedule.challenges,
        preferred_workout_time: goalsSchedule.preferred_workout_time || null,
        onboarding_complete: true,
      });

      if (profileError) throw profileError;

      const scores = Object.entries(assessment.scores);
      if (scores.length > 0) {
        const today = new Date().toISOString().split("T")[0];
        const { error: scoresError } = await supabase.from("brain_scores").insert(
          scores.map(([categorySlug, score]) => ({
            user_id: user.id,
            date: today,
            category_id: categorySlug,
            score,
          }))
        );
        if (scoresError) throw scoresError;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-lg">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  i <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={`mx-2 h-0.5 w-12 rounded transition-colors ${
                    i < step ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-6 text-xl font-bold">
          {STEP_LABELS[step]}
        </h2>

        {step === 0 && (
          <BasicInfoStep
            defaultValues={basicInfo}
            onNext={(data) => {
              setBasicInfo(data);
              setStep(1);
            }}
          />
        )}

        {step === 1 && (
          <GoalsScheduleStep
            defaultValues={goalsSchedule}
            onNext={(data) => {
              setGoalsSchedule(data);
              setStep(2);
            }}
            onBack={() => setStep(0)}
          />
        )}

        {step === 2 && (
          <AssessmentStep
            defaultValues={assessment}
            onNext={(data) => {
              setAssessment(data);
              setStep(3);
            }}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <SummaryStep
            basicInfo={basicInfo}
            goalsSchedule={goalsSchedule}
            assessment={assessment}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitError={submitError}
          />
        )}
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Step {step + 1} of {TOTAL_STEPS}
      </p>
    </div>
  );
}
