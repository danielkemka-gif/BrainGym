import { VerificationMethod } from "../verification/types";

export interface BodyBrainChallenge {
  id: string;
  title: string;
  tagline: string;
  physicalAction: string;
  cognitiveAction: string;
  durationMinutes: number;
  verificationMethod: VerificationMethod;
  verificationInstructions: string;
  expectedOutcome: string;
  xpReward: number;
  coinReward: number;
  momentumImpact: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: "Walk & Recall" | "Observation" | "Balance & Memory" | "Movement & Math" | "Coordination";
}
