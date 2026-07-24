"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BasicInfoStep, type BasicInfoData } from "./steps/basic-info-step";
import { AgeGroupStep } from "./steps/age-group-step";
import {
  GoalsScheduleStep,
  type GoalsScheduleData,
} from "./steps/goals-schedule-step";
import { AssessmentStep, type AssessmentData } from "./steps/assessment-step";
import { SummaryStep } from "./steps/summary-step";
import type { AgeGroup } from "@/lib/constants";

const TOTAL_STEPS = 5;
const STEP_LABELS = ["About you", "Your group", "Goals", "Assessment", "Review"];

function deriveAgeGroup(age: number): AgeGroup {
  if (age <= 20) return "teen";
  if (age <= 30) return "young_adult";
  if (age <= 50) return "adult";
  return "senior";
}

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [basicInfo, setBasicInfo] = useState<BasicInfoData>({
    name: "",
    username: "",
    gender: "",
    age: 25,
    occupation: "",
  });

  const [ageGroup, setAgeGroup] = useState<{ age_group: AgeGroup }>({
    age_group: deriveAgeGroup(25),
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

      if (!user) {
        setSubmitError("Session expired. Please sign in again.");
        setSubmitting(false);
        return;
      }

      let saveOk = false;

      const { error: err1 } = await supabase.from("profiles").upsert({
        user_id: user.id,
        name: basicInfo.name || "User",
        age: basicInfo.age,
        age_group: ageGroup.age_group,
        onboarding_complete: true,
      });
      if (!err1) saveOk = true;

      if (!saveOk) {
        const { error: err2 } = await supabase
          .from("profiles")
          .update({ onboarding_complete: true, name: basicInfo.name || "User", age_group: ageGroup.age_group })
          .eq("user_id", user.id);
        if (!err2) saveOk = true;
      }

      if (!saveOk) {
        const { error: err3 } = await supabase.from("profiles").insert({
          user_id: user.id,
          name: basicInfo.name || "User",
          onboarding_complete: true,
          age_group: ageGroup.age_group,
        });
        if (!err3) saveOk = true;
      }

      if (basicInfo.gender) {
        supabase.auth.updateUser({
          data: { gender: basicInfo.gender, display_name: basicInfo.name },
        });
      }

      if (goalsSchedule.goals.length > 0 || goalsSchedule.challenges.length > 0) {
        supabase.from("profiles").update({
          goals: goalsSchedule.goals,
          challenges: goalsSchedule.challenges,
          occupation: basicInfo.occupation || null,
        }).eq("user_id", user.id);
      }

      if (basicInfo.avatar_url) {
        supabase.from("profiles").update({
          avatar_url: basicInfo.avatar_url,
        }).eq("user_id", user.id);
      }

      supabase.from("user_settings").upsert({
        user_id: user.id,
        age_group: ageGroup.age_group,
      }, { onConflict: "user_id" });

      const scores = Object.entries(assessment.scores);
      if (scores.length > 0) {
        const { data: cats } = await supabase.from("categories").select("id, slug");
        if (cats && cats.length > 0) {
          const slugToId: Record<string, string> = {};
          for (const c of cats) slugToId[c.slug] = c.id;

          const today = new Date().toISOString().split("T")[0];
          const rows: { user_id: string; date: string; category_id: string; score: number }[] = [];
          for (const [slug, score] of scores) {
            const id = slugToId[slug];
            if (id) rows.push({ user_id: user.id, date: today, category_id: id, score });
          }
          if (rows.length > 0) {
            supabase.from("brain_scores").insert(rows);
          }
        }
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      router.push("/dashboard");
      router.refresh();
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
              setAgeGroup({ age_group: deriveAgeGroup(data.age) });
              setStep(1);
            }}
          />
        )}

        {step === 1 && (
          <AgeGroupStep
            defaultValues={ageGroup}
            onNext={(data) => {
              setAgeGroup(data);
              setStep(2);
            }}
            onBack={() => setStep(0)}
          />
        )}

        {step === 2 && (
          <GoalsScheduleStep
            defaultValues={goalsSchedule}
            onNext={(data) => {
              setGoalsSchedule(data);
              setStep(3);
            }}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <AssessmentStep
            defaultValues={assessment}
            onNext={(data) => {
              setAssessment(data);
              setStep(4);
            }}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <SummaryStep
            basicInfo={basicInfo}
            goalsSchedule={goalsSchedule}
            assessment={assessment}
            onBack={() => setStep(3)}
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
