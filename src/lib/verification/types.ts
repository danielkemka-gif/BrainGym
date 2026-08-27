/**
 * BRAINGYM VERIFICATION & INTEGRITY ENGINE — TYPE DEFINITIONS
 * 
 * Replaces simple "Done" buttons with:
 * START → PERFORM → VERIFY → COMPLETE
 */

export type VerificationMethod =
  | "app_interaction"
  | "motion_sensor"
  | "camera_pose"
  | "cognitive_recall"
  | "proof_of_action";

export type VerificationStatus =
  | "VERIFIED"
  | "PARTIALLY_VERIFIED"
  | "SELF_REPORTED"
  | "NOT_VERIFIED";

export type VerificationConfidence = "high" | "medium" | "low" | "none";

export interface VerificationResult {
  method: VerificationMethod;
  status: VerificationStatus;
  confidence: VerificationConfidence;
  durationSeconds: number;
  expectedDurationSeconds: number;
  movementConsistencyPct?: number; // e.g. 87%
  repsDetected?: number;
  cognitiveRecallScore?: {
    totalQuestions: number;
    correctAnswers: number;
    accuracyPercent: number;
  };
  proofImageAttached?: boolean;
  evidenceSummary: string;
  xpModifier: number; // 1.0 for VERIFIED, 0.75 for PARTIALLY_VERIFIED, 0.5 for SELF_REPORTED
  verifiedAt: string;
}

export interface CognitiveVerificationQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  cognitiveSkill: string;
}
