export const PLANS = {
  premium: {
    name: "Premium",
    amount: 350000, // ₦3,500 in kobo
    currency: "NGN",
    interval: "monthly" as const,
    description: "Premium subscription for BrainGym",
    features: [
      "Everything in Free",
      "AI Coach unlimited chats",
      "Decision Lab unlimited analyses",
      "Advanced reports & insights",
      "Priority support",
    ],
  },
} as const;

export type PlanTier = keyof typeof PLANS;
