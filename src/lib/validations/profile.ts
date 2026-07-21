import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  age: z.number().min(13, "Must be at least 13").max(120).optional(),
  occupation: z.string().max(100).optional(),
  goals: z.array(z.string()).max(5).optional(),
  preferred_workout_time: z.string().optional(),
});

export const onboardingSchema = z.object({
  age: z.number().min(13, "Must be at least 13").max(120),
  occupation: z.string().max(100).optional(),
  goals: z.array(z.string()).min(1, "Select at least one goal").max(5),
  challenges: z.array(z.string()).max(5).optional(),
  preferred_workout_time: z.string(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
