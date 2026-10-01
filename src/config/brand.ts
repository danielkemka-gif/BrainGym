/**
 * Centralized Brand Configuration
 * Single source of truth for app branding, positioning, tagline, and metadata.
 * Enables changing the product name globally without searching/replacing across the codebase.
 */

export const BRAND_CONFIG = {
  // Brand Identity
  name: "BrainGym",
  shortName: "BrainGym",
  legalName: "BrainGym Mental Fitness Platform",
  tagline: "Train your thinking. Strengthen your mind. Apply it to real life.",
  coreFramework: "THINK → DECIDE → ACT → REFLECT",
  
  // Brand Positioning & Non-Medical Mental Fitness Statement
  positioning: "A daily mental fitness system that helps people practise how they think, decide, act, and reflect in real life.",
  nonMedicalDisclaimer: "BrainGym is a mental fitness and thinking practice application. It does not provide medical advice, diagnosis, or treatment.",
  
  // App URLs & Socials
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "https://braingym-live.vercel.app",
  supportEmail: "support@braingym.app",
  
  // Core Cognitive Skills (8 Distinct Domains)
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

export type CognitiveSkillId = typeof BRAND_CONFIG.cognitiveSkills[number]["id"];
