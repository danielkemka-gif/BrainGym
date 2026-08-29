/**
 * BRAIN-TO-LIFE TRANSFER & DEMOGRAPHIC PERSONALIZATION — TYPE DEFINITIONS
 * 
 * "BrainGym does not train people to become better at BrainGym.
 *  BrainGym trains the brain so users can perform better in real life."
 */

export type LifeStageBand =
  | "teen_13_17"
  | "young_adult_18_24"
  | "adult_25_34"
  | "prime_35_49"
  | "mature_50_64"
  | "senior_65_plus";

export type LifeRole =
  | "student"
  | "employee"
  | "entrepreneur"
  | "business_owner"
  | "professional"
  | "teacher"
  | "creative"
  | "job_seeker"
  | "parent"
  | "retired"
  | "consultant"
  | "freelancer"
  | "other";

export type PersonalBrainGoal =
  | "remember_more"
  | "focus_longer"
  | "learn_faster"
  | "study_better"
  | "work_productively"
  | "think_faster"
  | "solve_problems_better"
  | "generate_better_ideas"
  | "make_better_decisions"
  | "mental_stamina"
  | "stay_mentally_sharp"
  | "age_vitality"
  | "improve_concentration"
  | "mental_flexibility";

export interface LifeTransferChallenge {
  id: string;
  title: string;
  targetDomain: string; // e.g. "Focus", "Memory", "Problem Solving", "Creativity", "Decision Making"
  lifeRoles: LifeRole[];
  ageBands: LifeStageBand[];
  whatToDo: string;
  whyYouAreDoingIt: string;
  durationMinutes: number;
  whatToRecord: {
    label: string;
    type: "number" | "text" | "rating" | "count";
    unit?: string;
    placeholder?: string;
  };
  whatSkillItTrains: string;
  xpReward: number;
  lifePerformanceCategory: "deep_work" | "study_recall" | "strategic_problem_solving" | "idea_output" | "interruption_resilience" | "everyday_memory";
}

export interface UserDemographicProfile {
  userId: string;
  name: string;
  dateOfBirth?: string;
  age: number;
  ageBand: LifeStageBand;
  roles: LifeRole[];
  primaryGoals: PersonalBrainGoal[];
  cognitiveBaseline: Record<string, number>;
  createdAt: string;
}
