"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Eye, EyeOff, RotateCcw, UserCheck, CheckCircle2 } from "lucide-react";
import { KucheCharacter } from "@/components/guide/kuche-character";
import { START_KUCHE_TOUR_EVENT } from "@/components/guide/kuche-companion";
import { CharacterPreviewModal } from "@/components/guide/character-preview-modal";

export function GuideSettingsSection() {
  const router = useRouter();
  const [guideEnabled, setGuideEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const enabled = localStorage.getItem("akuche_guide_enabled") !== "false";
      const reduced = localStorage.getItem("akuche_guide_reduced_motion") === "true";
      setGuideEnabled(enabled);
      setReducedMotion(reduced);
    }
  }, []);

  const handleToggleGuide = () => {
    const next = !guideEnabled;
    setGuideEnabled(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("akuche_guide_enabled", next ? "true" : "false");
      window.location.reload();
    }
  };

  const handleToggleReducedMotion = () => {
    const next = !reducedMotion;
    setReducedMotion(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("akuche_guide_reduced_motion", next ? "true" : "false");
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
    }
  };

  const handleRestartTour = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("akuche_guide_onboarding_v1");
      router.push("/dashboard");
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent(START_KUCHE_TOUR_EVENT));
      }, 500);
    }
  };

  return (
    <>
      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <KucheCharacter state="idle" size="sm" reducedMotion={reducedMotion} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  Akuche Guide Companion (Kuche)
                </h2>
                <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                  ASSISTANT
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Onboarding navigation assistant and contextual coaching guide.
              </p>
            </div>
          </div>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <span>Preferences updated.</span>
          </div>
        )}

        <div className="space-y-3 pt-1">
          {/* Toggle Guide Enabled */}
          <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3.5">
            <div>
              <span className="text-sm font-semibold text-foreground block">
                Enable Kuche Companion
              </span>
              <span className="text-xs text-muted-foreground">
                Displays the friendly guide for contextual tips and interface explanations.
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleGuide}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                guideEnabled ? "bg-[#167A52]" : "bg-muted"
              }`}
              role="switch"
              aria-checked={guideEnabled}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  guideEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Toggle Reduced Motion */}
          <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3.5">
            <div>
              <span className="text-sm font-semibold text-foreground block">
                Reduced Motion / Calm Animations
              </span>
              <span className="text-xs text-muted-foreground">
                Minimises character movement, using gentle fades instead of translational motion.
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleReducedMotion}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                reducedMotion ? "bg-[#167A52]" : "bg-muted"
              }`}
              role="switch"
              aria-checked={reducedMotion}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  reducedMotion ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Actions: Replay Tour & Character Showcase */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={handleRestartTour}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background hover:bg-muted p-2.5 text-xs font-bold text-foreground transition active:scale-95"
            >
              <RotateCcw className="h-4 w-4 text-[#167A52] dark:text-emerald-400" />
              <span>Replay Dashboard Tour</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#167A52]/30 bg-[#167A52]/10 hover:bg-[#167A52]/20 p-2.5 text-xs font-bold text-[#167A52] dark:text-emerald-400 transition active:scale-95"
            >
              <UserCheck className="h-4 w-4" />
              <span>Test All 7 Animation States</span>
            </button>
          </div>
        </div>
      </section>

      <CharacterPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />
    </>
  );
}
