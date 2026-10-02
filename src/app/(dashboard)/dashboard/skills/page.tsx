import { SkillDevelopmentProfile } from "@/components/dashboard/skill-development-profile";
import { QualitativeThinkingProfile } from "@/components/profile/qualitative-thinking-profile";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Skill Development Profile — BrainGym",
  description: "Explore your 8 core cognitive skills and qualitative thinking dimensions.",
};

export default function SkillsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 py-4 pb-24 space-y-6">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Skill Development &amp; Cognitive Profile
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Detailed breakdown of your real-world thinking dimensions, decision agility, and skill progress.
        </p>
      </div>

      {/* 8 Skills Profile */}
      <SkillDevelopmentProfile />

      {/* Qualitative 10-Dimension Thinking Profile */}
      <QualitativeThinkingProfile />
    </div>
  );
}
