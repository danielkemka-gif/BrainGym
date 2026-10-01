/**
 * Thinking Journal Synchronization & History Service
 * Automatically records 8-step workout completions into the permanent Thinking Journal
 * and retrieves recent workout history for the dashboard.
 */

import { createClient } from "../supabase/client";
import { RealWorldChallengeDefinition, UserChallengeAttemptRecord } from "../real-world-thinking-engine/types";
import { Locale } from "../i18n/types";

export interface LoggedWorkoutHistoryItem {
  id: string;
  challengeId: string;
  title: string;
  date: string;
  skill: string;
  score: number;
  xpEarned: number;
  scenarioSummary: string;
  userDecisionText: string;
  realWorldAction: string;
  reflectionText: string;
}

const STORAGE_KEY = "braingym_thinking_journal_history";

export async function logCompletedWorkoutToJournal(
  challenge: RealWorldChallengeDefinition,
  attempt: Partial<UserChallengeAttemptRecord>,
  locale: Locale = "en"
): Promise<boolean> {
  const content = challenge.translations[locale] || challenge.translations.en;
  if (!content) return false;

  const chosenOption = content.decisionOptions.find(
    (opt) => opt.id === attempt.selectedDecisionId
  );

  const title = `Decision Log: ${content.title}`;
  const journalContent = [
    `🎯 Skill: ${challenge.skill} (${challenge.category})`,
    `📖 Scenario: "${content.scenarioNarrative}"`,
    `⚖️ My Decision: ${chosenOption ? `[${chosenOption.letter}] ${chosenOption.text}` : "Custom response"}`,
    `⚡ Real-World Action: ${content.realLifeAction.instruction}`,
    `🧠 Reflection & Learnings: ${attempt.userReflectionText || content.suggestedTakeaway}`,
  ].join("\n\n");

  const today = attempt.assignmentDate || new Date().toISOString().split("T")[0];

  const historyItem: LoggedWorkoutHistoryItem = {
    id: `history-${Date.now()}`,
    challengeId: challenge.id,
    title: content.title,
    date: today,
    skill: challenge.skill,
    score: attempt.cognitiveDrillScore || 100,
    xpEarned: attempt.xpEarned || challenge.xpReward,
    scenarioSummary: content.scenarioNarrative,
    userDecisionText: chosenOption ? chosenOption.text : "Strategic assessment",
    realWorldAction: content.realLifeAction.instruction,
    reflectionText: attempt.userReflectionText || content.suggestedTakeaway,
  };

  // 1. Save locally in client storage
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const items: LoggedWorkoutHistoryItem[] = raw ? JSON.parse(raw) : [];
      // Prepend without duplicate dates
      const filtered = items.filter((i) => i.challengeId !== challenge.id && i.date !== today);
      filtered.unshift(historyItem);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, 30)));
    } catch (err) {
      console.warn("Failed to write to local journal storage", err);
    }
  }

  // 2. Sync to Supabase if authenticated
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("brain_journal").insert({
        user_id: user.id,
        title,
        content: journalContent,
        mood: "great",
        tags: [challenge.skill.toLowerCase(), "thinking-journal", "decision-practice"],
      });
    }
  } catch (err) {
    console.warn("Supabase journal insert failed, kept in local storage", err);
  }

  return true;
}

export async function getLatestCompletedWorkouts(userId?: string): Promise<LoggedWorkoutHistoryItem[]> {
  // 1. Check local storage
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const items = JSON.parse(raw);
        if (Array.isArray(items) && items.length > 0) {
          return items.slice(0, 7);
        }
      }
    } catch {}
  }

  // 2. Fallback seeds if fresh user
  return [
    {
      id: "seed-1",
      challengeId: "rwc-decision-1",
      title: "The Churn Paradox: Operational Friction",
      date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      skill: "Decision Making",
      score: 95,
      xpEarned: 55,
      scenarioSummary: "Resolved checkout delay friction before discounting product pricing.",
      userDecisionText: "Conduct direct user exit interviews and fix checkout latency.",
      realWorldAction: "Ask one customer what step in interaction feels most cumbersome.",
      reflectionText: "Identified the critical difference between price complaints and friction.",
    },
    {
      id: "seed-2",
      challengeId: "rwc-reasoning-1",
      title: "Conflicting Executive Directives",
      date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
      skill: "Reasoning",
      score: 90,
      xpEarned: 50,
      scenarioSummary: "Balanced brief executive summary with exhaustive regional data appendixes.",
      userDecisionText: "4-page core narrative with attached modular data appendix.",
      realWorldAction: "Place core conclusion in the very first 2 lines of next email.",
      reflectionText: "Progressive disclosure eliminated the false binary between speed and depth.",
    }
  ];
}
