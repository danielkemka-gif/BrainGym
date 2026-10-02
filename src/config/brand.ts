/**
 * Centralized Brand Configuration
 * Single source of truth for app branding, positioning, tagline, and metadata.
 * "People go to the gym to strengthen their bodies. BrainGym helps people strengthen their minds."
 */

export const BRAND_CONFIG = {
  // Brand Identity
  name: "BrainGym",
  shortName: "BrainGym",
  legalName: "BrainGym Mental Fitness Platform",
  tagline: "Train Your Mind. Solve Real Problems.",
  secondaryTagline: "Train the way you think, make better decisions, take action and learn from real-life situations.",
  corePhilosophy: "People go to the gym to strengthen their bodies. BrainGym helps people strengthen their minds.",
  coreDifferentiation: "ChatGPT can give you an answer. BrainGym helps you become better at finding, evaluating and applying answers.",
  coreLoop: "ASK → UNDERSTAND → THINK → CHALLENGE → SOLVE → ACT → MEASURE → REFLECT → GROW",
  
  // Brand Positioning & Non-Medical Statement
  positioning: "A mental fitness and real-life problem-solving platform that helps people strengthen their minds, think through challenges, make better decisions, take purposeful action and learn from their results.",
  nonMedicalDisclaimer: "BrainGym is a mental fitness and thinking development platform. It provides structured cognitive exercises and decision frameworks. It does not provide medical, clinical, legal, or financial advice.",
  
  // App URLs & Socials
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://braingym-live.vercel.app",
  supportEmail: "support@braingym.app",
  
  // 10 Core Cognitive Dimensions (Non-medical thinking development)
  cognitiveDimensions: [
    { id: "critical_thinking", name: "Critical Thinking", icon: "🔍", color: "#6366f1", description: "Evaluating evidence, identifying biases, and questioning assumptions." },
    { id: "problem_solving", name: "Problem Solving", icon: "🧩", color: "#ec4899", description: "Deconstructing complex situations into clear, solvable steps." },
    { id: "decision_making", name: "Decision Making", icon: "🧭", color: "#f59e0b", description: "Weighing trade-offs, calculating risks, and choosing optimal paths." },
    { id: "focus", name: "Focus", icon: "🎯", color: "#3b82f6", description: "Sustaining attention, filtering distractions, and deep concentration." },
    { id: "memory", name: "Memory", icon: "🧠", color: "#8b5cf6", description: "Retaining information, active recall, and mental retrieval models." },
    { id: "reasoning", name: "Reasoning", icon: "⚖️", color: "#10b981", description: "Logical deduction, structured arguments, and sound rationale." },
    { id: "creativity", name: "Creativity", icon: "💡", color: "#06b6d4", description: "Generating novel perspectives, lateral thinking, and innovative solutions." },
    { id: "communication", name: "Communication", icon: "💬", color: "#14b8a6", description: "Articulating ideas with clarity, persuasion, and emotional empathy." },
    { id: "adaptability", name: "Adaptability", icon: "🔄", color: "#84cc16", description: "Pivoting under uncertainty and reframing unexpected constraints." },
    { id: "strategic_thinking", name: "Strategic Thinking", icon: "♟️", color: "#a855f7", description: "Long-term planning, second-order consequences, and system thinking." },
    { id: "execution", name: "Execution", icon: "⚡", color: "#f97316", description: "Turning thinking into concrete action, measuring results, and follow-through." },
  ] as const,

  // Legacy compatibility alias
  cognitiveSkills: [
    { id: "memory", name: "Memory", icon: "🧠", color: "#6366f1" },
    { id: "focus", name: "Focus", icon: "🎯", color: "#3b82f6" },
    { id: "reasoning", name: "Reasoning", icon: "⚖️", color: "#8b5cf6" },
    { id: "problem_solving", name: "Problem Solving", icon: "🧩", color: "#ec4899" },
    { id: "decision_making", name: "Decision Making", icon: "🧭", color: "#f59e0b" },
    { id: "cognitive_flexibility", name: "Cognitive Flexibility", icon: "🔄", color: "#10b981" },
    { id: "processing_speed", name: "Processing Speed", icon: "⚡", color: "#eab308" },
    { id: "creativity", name: "Creativity", icon: "💡", color: "#06b6d4" },
  ] as const,
};

export type CognitiveDimensionId = typeof BRAND_CONFIG.cognitiveDimensions[number]["id"];
export type CognitiveSkillId = typeof BRAND_CONFIG.cognitiveSkills[number]["id"];
