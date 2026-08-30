"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  PHYSICAL_ACTIVITIES_LIBRARY,
  PhysicalActivity,
} from "@/lib/physical-activities";
import {
  BODY_BRAIN_CHALLENGES,
  BodyBrainChallenge,
} from "@/lib/body-brain";
import { createClient } from "@/lib/supabase/client";
import { Confetti } from "@/components/ui/confetti";
import { MotionVerificationCard } from "@/components/verification/motion-verification-card";
import { CognitiveRecallModal } from "@/components/verification/cognitive-recall-modal";
import { getVerificationQuestionsForActivity } from "@/lib/verification/cognitive-questions";
import { VerificationResult } from "@/lib/verification/types";
import { evaluatePersonalRecords, BrokenRecord } from "@/lib/personal-records";
import { ShareableVictoryCard } from "@/components/sharing/shareable-victory-card";
import { MilestoneCertificateModal } from "@/components/sharing/milestone-certificate-modal";
import {
  ArrowLeft,
  Clock,
  Sparkles,
  Zap,
  Coins,
  Flame,
  ArrowRight,
  ShieldCheck,
  Brain,
  Footprints,
  Trophy,
  Share2,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { ExerciseAvatarGraphic } from "@/components/physical-activities/exercise-avatar-graphic";

export default function PhysicalActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const activityId = (params?.id as string) || "";

  // Search in both libraries
  const bodyBrainMatch = BODY_BRAIN_CHALLENGES.find((a) => a.id === activityId);
  const physicalMatch = PHYSICAL_ACTIVITIES_LIBRARY.find((a) => a.id === activityId);

  const title = bodyBrainMatch?.title || physicalMatch?.title || "10-Minute Memory Walk";
  const durationMinutes = bodyBrainMatch?.durationMinutes || physicalMatch?.durationMinutes || 10;
  const xpReward = bodyBrainMatch?.xpReward || physicalMatch?.xpReward || 100;
  const coinReward = bodyBrainMatch?.coinReward || physicalMatch?.coinReward || 25;
  const whyItMatters = bodyBrainMatch?.expectedOutcome || physicalMatch?.whyItMatters || "Enhances cerebral blood flow and memory retention.";
  const physicalAction = bodyBrainMatch?.physicalAction || physicalMatch?.whatToDo?.[0] || physicalMatch?.tagline || "Walk briskly for the target duration.";
  const cognitiveAction = bodyBrainMatch?.cognitiveAction || "Actively observe and encode distinct environmental details along your route.";

  const [isCompleted, setIsCompleted] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [showCognitiveModal, setShowCognitiveModal] = useState(false);
  const [pendingDurationSec, setPendingDurationSec] = useState(durationMinutes * 60);
  const [brokenRecords, setBrokenRecords] = useState<BrokenRecord[]>([]);
  const [showShareCard, setShowShareCard] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [streakDays, setStreakDays] = useState(15);
  const [userName, setUserName] = useState("Thinker");

  const cognitiveQuestions = getVerificationQuestionsForActivity(activityId);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, current_streak, streak_count")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile) {
        setStreakDays((profile.current_streak ?? profile.streak_count ?? 14) + 1);
        if (profile.name) setUserName(profile.name.split(" ")[0]);
      }
    });
  }, []);

  const handleMotionVerification = (result: VerificationResult) => {
    setPendingDurationSec(result.durationSeconds);
    // If activity has cognitive recall component, trigger the recall quiz
    if (cognitiveQuestions && cognitiveQuestions.length > 0) {
      setShowCognitiveModal(true);
    } else {
      finalizeActivity(result);
    }
  };

  const handleCognitiveVerification = (result: VerificationResult) => {
    setShowCognitiveModal(false);
    finalizeActivity(result);
  };

  const finalizeActivity = async (result: VerificationResult) => {
    setVerificationResult(result);
    setIsCompleted(true);

    const calculatedXp = Math.round(xpReward * result.xpModifier);
    const calculatedCoins = Math.round(coinReward * result.xpModifier);

    // Evaluate Personal Records
    const accuracy = result.cognitiveRecallScore?.accuracyPercent || (result.status === "VERIFIED" ? 92 : 80);
    const { newRecords } = evaluatePersonalRecords({
      accuracyPercent: accuracy,
      streakDays: streakDays,
      brainMomentum: 82,
      weeklyActivities: 5,
    });
    setBrokenRecords(newRecords);

    // Check for milestone certificate (7, 14, 30, 60, 90 days)
    if ([7, 14, 30, 60, 90].includes(streakDays)) {
      setTimeout(() => setShowMilestoneModal(true), 1500);
    }

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Record in XP Ledger
        await supabase.from("xp_ledger").insert({
          user_id: user.id,
          amount: calculatedXp,
          source_type: "verified_body_brain",
          source_id: activityId,
          description: `Completed verified challenge: ${title} (${result.status})`,
        });

        // Update profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("total_xp, coins, current_streak, streak_count")
          .eq("user_id", user.id)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({
              total_xp: (profile.total_xp || 0) + calculatedXp,
              coins: (profile.coins || 0) + calculatedCoins,
              current_streak: streakDays,
              streak_count: streakDays,
            })
            .eq("user_id", user.id);
        }
      }
    } catch (err) {
      console.warn("Activity verification DB sync fallback:", err);
    }
  };

  // ─── COMPLETION & REWARD EXPERIENCE ─────────────────────────────────────────
  if (isCompleted && verificationResult) {
    const finalXp = Math.round(xpReward * verificationResult.xpModifier);
    const finalCoins = Math.round(coinReward * verificationResult.xpModifier);

    return (
      <div className="mx-auto w-full max-w-xl space-y-6 px-3 sm:px-4 py-4 pb-20 overflow-x-hidden">
        <Confetti active={isCompleted} />

        {/* Milestone Certificate Modal */}
        {showMilestoneModal && (
          <MilestoneCertificateModal
            streakDays={streakDays}
            userName={userName}
            onClose={() => setShowMilestoneModal(false)}
          />
        )}

        <div className="rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 via-card to-teal-600/10 p-6 sm:p-8 text-center space-y-5 shadow-2xl">
          {/* Header */}
          <div className="space-y-1.5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
              <Trophy className="h-8 w-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              MISSION COMPLETE!
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
              You showed up for your brain and body today.
            </p>
          </div>

          {/* Verification Status Badge */}
          <div className="rounded-2xl border border-emerald-500/40 bg-background/90 p-4 text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Integrity Engine: {verificationResult.status}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground capitalize">
                Confidence: {verificationResult.confidence}
              </span>
            </div>
            <p className="text-xs text-foreground font-medium leading-relaxed">
              {verificationResult.evidenceSummary}
            </p>
          </div>

          {/* 3 Metric Summary Badges */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="rounded-2xl bg-background/80 border border-border p-3">
              <span className="text-[9px] text-muted-foreground font-bold uppercase block">Earned XP</span>
              <span className="text-base sm:text-lg font-black text-primary">+{finalXp} XP</span>
            </div>
            <div className="rounded-2xl bg-background/80 border border-border p-3">
              <span className="text-[9px] text-muted-foreground font-bold uppercase block">Earned Coins</span>
              <span className="text-base sm:text-lg font-black text-amber-500">+{finalCoins} 🪙</span>
            </div>
            <div className="rounded-2xl bg-background/80 border border-border p-3">
              <span className="text-[9px] text-muted-foreground font-bold uppercase block">Streak</span>
              <span className="text-base sm:text-lg font-black text-orange-500 flex items-center justify-center gap-0.5">
                <Flame className="h-4 w-4 fill-current" />
                {streakDays}d
              </span>
            </div>
          </div>

          {/* ─── PERSONAL RECORD ALERT ("YOU JUST BEAT YOURSELF") ───────────── */}
          {brokenRecords.length > 0 && (
            <div className="rounded-2xl border-2 border-amber-500/60 bg-gradient-to-r from-amber-500/15 via-background to-orange-500/15 p-4 text-left space-y-1.5 shadow-md">
              <div className="flex items-center gap-1.5 text-amber-500 font-black text-xs uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>NEW PERSONAL RECORD!</span>
              </div>
              <p className="text-sm font-black text-foreground">
                {brokenRecords[0].title}: {brokenRecords[0].previousValue}
                {brokenRecords[0].unit} → {brokenRecords[0].newValue}
                {brokenRecords[0].unit}
              </p>
              <p className="text-xs text-muted-foreground italic">
                &ldquo;You just beat yourself.&rdquo;
              </p>
            </div>
          )}

          {/* Meaningful Cognitive Insight */}
          <div className="rounded-2xl bg-muted/60 p-3.5 text-xs text-muted-foreground text-left">
            <span className="font-bold text-foreground block mb-0.5">Cognitive Insight:</span>
            Consistent aerobic engagement elevates Brain-Derived Neurotrophic Factor (BDNF), priming synaptic plasticity for tomorrow&apos;s workout.
          </div>

          {/* Share Victory Card Trigger */}
          {showShareCard ? (
            <ShareableVictoryCard
              userName={userName}
              activityTitle={title}
              score={verificationResult.cognitiveRecallScore?.accuracyPercent || 92}
              streakDays={streakDays}
              momentumScore={82}
              onClose={() => setShowShareCard(false)}
            />
          ) : (
            <button
              onClick={() => setShowShareCard(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-background hover:bg-accent p-3.5 text-xs font-bold text-foreground transition min-h-[44px]"
            >
              <Share2 className="h-4 w-4 text-primary" />
              <span>Share My Progress &amp; Challenge Friends</span>
            </button>
          )}

          {/* Action Navigation */}
          <div className="space-y-2.5 pt-2">
            <Link
              href="/dashboard/workout"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white py-4 px-6 text-sm font-black shadow-lg shadow-primary/25 hover:brightness-110 active:scale-95 transition min-h-[52px]"
            >
              <Brain className="h-5 w-5" />
              <span>CONTINUE TO TODAY&apos;S BRAIN WORKOUT</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-xs font-bold hover:bg-accent transition min-h-[44px]"
            >
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── ACTIVE PREPARATION & VERIFICATION FLOW ────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-xl space-y-5 px-3 sm:px-4 py-2 pb-20 overflow-x-hidden touch-manipulation">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground min-h-[36px]"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
          Body + Brain Challenge
        </span>
      </div>

      {/* Hero Details */}
      <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-card to-teal-500/10 p-6 sm:p-7 space-y-4 shadow-lg">
        {/* Exercise Graphic Avatar Illustration */}
        <div className="flex justify-center pt-1 pb-2">
          <ExerciseAvatarGraphic
            type={physicalMatch?.illustrationType || "walking"}
            size="hero"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md shadow-emerald-500/25">
            <Footprints className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {title}
            </h1>
            <p className="text-xs text-muted-foreground font-semibold">
              Target: {durationMinutes} Minutes · Combined Cognitive + Physical Drill
            </p>
          </div>
        </div>

        {/* 2-Part Action Split */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-2xl bg-background/90 border border-border p-3.5 space-y-1">
            <span className="text-[10px] font-black uppercase text-muted-foreground">
              🏃 1. Physical Action
            </span>
            <p className="text-foreground font-semibold leading-relaxed">
              {physicalAction}
            </p>
          </div>

          <div className="rounded-2xl bg-background/90 border border-border p-3.5 space-y-1">
            <span className="text-[10px] font-black uppercase text-primary">
              🧠 2. Cognitive Task
            </span>
            <p className="text-foreground font-semibold leading-relaxed">
              {cognitiveAction}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-background/80 border border-border p-3 text-xs text-muted-foreground">
          <span className="font-bold text-foreground block mb-0.5">Why it matters:</span>
          {whyItMatters}
        </div>
      </div>

      {/* ─── LIVE MULTI-MODAL MOTION VERIFICATION COMPONENT ─────────────────── */}
      <MotionVerificationCard
        expectedDurationSec={durationMinutes * 60}
        onVerificationComplete={handleMotionVerification}
      />

      {/* ─── POST-ACTIVITY COGNITIVE RECALL MODAL ───────────────────────────── */}
      {showCognitiveModal && (
        <CognitiveRecallModal
          questions={cognitiveQuestions}
          activityTitle={title}
          durationSeconds={pendingDurationSec}
          expectedDurationSec={durationMinutes * 60}
          onComplete={handleCognitiveVerification}
          onSkip={() =>
            finalizeActivity({
              method: "cognitive_recall",
              status: "SELF_REPORTED",
              confidence: "low",
              durationSeconds: pendingDurationSec,
              expectedDurationSeconds: durationMinutes * 60,
              evidenceSummary: "User completed activity duration and self-reported.",
              xpModifier: 0.5,
              verifiedAt: new Date().toISOString(),
            })
          }
        />
      )}
    </div>
  );
}
