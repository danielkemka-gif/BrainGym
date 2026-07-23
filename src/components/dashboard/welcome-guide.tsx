"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { X, Zap, Brain, Target, Trophy } from "lucide-react";

interface GuideStep {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  cta: string;
}

const steps: GuideStep[] = [
  {
    id: "workout",
    icon: <Zap className="h-5 w-5" />,
    title: "Start your first workout",
    description:
      "Begin with a quick 5-minute brain training session to warm up your mind.",
    href: "/dashboard/challenge",
    cta: "Start Workout",
  },
  {
    id: "library",
    icon: <Brain className="h-5 w-5" />,
    title: "Explore activities",
    description:
      "Browse 177+ brain training activities across Memory, Focus, Thinking, and more.",
    href: "/dashboard/library",
    cta: "Browse Activities",
  },
  {
    id: "coach",
    icon: <Target className="h-5 w-5" />,
    title: "Meet your AI Coach",
    description:
      "Get personalized tips and guidance from your AI-powered brain training coach.",
    href: "/dashboard/coach",
    cta: "Talk to Coach",
  },
  {
    id: "leaderboard",
    icon: <Trophy className="h-5 w-5" />,
    title: "Check the leaderboard",
    description:
      "See how you rank against other BrainGym members and stay motivated.",
    href: "/dashboard/leaderboard",
    cta: "View Rankings",
  },
];

export function WelcomeGuide() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;

      const name =
        user.user_metadata?.display_name ||
        user.user_metadata?.gender ||
        user.email?.split("@")[0] ||
        "there";
      setUserName(name.split(" ")[0]);

      supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          const key = `braingym_guide_dismissed_${user.id}`;
          const wasDismissed = localStorage.getItem(key);
          if (!wasDismissed) {
            setVisible(true);
          }
        });
    });
  }, []);

  function handleDismiss() {
    setDismissed(true);
    setVisible(false);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        localStorage.setItem(`braingym_guide_dismissed_${user.id}`, "true");
      }
    });
  }

  if (!visible || dismissed) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10 p-6">
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
          🧠
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold">
            Hey {userName}! Welcome to BrainGym 💪
          </h3>
          <p className="text-sm text-muted-foreground">
            Let&apos;s get your brain training started. Here&apos;s what to do first:
          </p>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {step.icon}
          </div>
          <div>
            <p className="text-sm font-semibold">{step.title}</p>
            <p className="text-xs text-muted-foreground">{step.description}</p>
          </div>
        </div>
        <Link
          href={step.href}
          onClick={handleDismiss}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {step.cta}
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentStep
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent"
            >
              Back
            </button>
          )}
          {!isLast ? (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-accent"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleDismiss}
              className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
            >
              Got it!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
