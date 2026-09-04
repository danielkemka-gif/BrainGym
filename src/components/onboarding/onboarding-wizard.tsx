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
import { deriveAgeTierFromAge, setActiveUserAgeTier } from "@/lib/age-tiers";

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

      // Automatically configure Age Tier for all daily questions and games
      const derivedTier = deriveAgeTierFromAge(basicInfo.age);
      setActiveUserAgeTier(derivedTier);

      const profilePayload = {
        user_id: user.id,
        name: basicInfo.name || "User",
        username: basicInfo.username || null,
        age: basicInfo.age || null,
        age_group: ageGroup.age_group,
        occupation: basicInfo.occupation || null,
        goals: goalsSchedule.goals || [],
        challenges: goalsSchedule.challenges || [],
        preferred_workout_time: goalsSchedule.preferred_workout_time || null,
        preferred_difficulty: assessment.overallLevel || "beginner",
        avatar_url: basicInfo.avatar_url || null,
        onboarding_complete: true,
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profilePayload, { onConflict: "user_id" });

      if (profileError) {
        await supabase
          .from("profiles")
          .update(profilePayload)
          .eq("user_id", user.id);
      }

      if (basicInfo.gender || basicInfo.name) {
        await supabase.auth.updateUser({
          data: {
            gender: basicInfo.gender || undefined,
            display_name: basicInfo.name || undefined,
          },
        });
      }

      const refCode = user.user_metadata?.ref_code || null;
      if (refCode) {
        try {
          await supabase.rpc("attribute_referral", {
            p_user_id: user.id,
            p_ref: refCode,
          });
        } catch (err) {
          console.error("Failed to attribute referral:", err);
        }
      }

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
            await supabase.from("brain_scores").insert(rows);
          }
        }
      }

      // Ensure essential user tables are seeded if trigger didn't run
      await Promise.allSettled([
        supabase.from("user_settings").upsert({ user_id: user.id }, { onConflict: "user_id" }),
        supabase.from("streaks").upsert({ user_id: user.id }, { onConflict: "user_id" }),
        supabase.from("user_levels").upsert({ user_id: user.id, level: 1, current_xp: 0, total_xp: 0 }, { onConflict: "user_id" }),
      ]);

      router.replace("/dashboard");
      router.refresh();
    } catch {
      router.replace("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="w-full max-w-lg overflow-x-hidden">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between overflow-x-auto scrollbar-none gap-1">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center shrink-0">
              <div
                className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-[11px] sm:text-xs font-medium transition-colors ${
                  i <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={`mx-1 sm:mx-2 h-0.5 w-8 sm:w-12 rounded transition-colors ${
                    i < step ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
        <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold">
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
