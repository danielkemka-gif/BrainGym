export interface TourStep {
  id: string;
  title: string;
  badge: string;
  message: string;
  targetSelector?: string;
  route?: string;
  pointingDirection: "left" | "right" | "up" | "down";
  actionCta?: string;
  actionHref?: string;
}

export const KUCHE_TOUR_STEPS: TourStep[] = [
  {
    id: "think",
    badge: "STEP 1 OF 7 · THINK",
    title: "Think & Ask Akuche",
    message:
      "Bring any dilemma, high-stakes decision, or ambitious goal. Akuche acts as your Socratic sparring partner — deconstructing assumptions, calculating trade-offs, and clarifying your next move.",
    targetSelector: '[data-guide="think"]',
    route: "/dashboard",
    pointingDirection: "down",
    actionCta: "Try a Thinking Session →",
    actionHref: "/dashboard/ask",
  },
  {
    id: "actions",
    badge: "STEP 2 OF 7 · MY ACTIONS",
    title: "My Actions & Next Step",
    message:
      "Insight without action is just theory. Every session produces a concrete 'Today's Action' with a practical deadline so you can execute and log real-life momentum.",
    targetSelector: '[data-guide="actions"]',
    route: "/dashboard",
    pointingDirection: "up",
    actionCta: "View Commitments →",
    actionHref: "/dashboard/goals",
  },
  {
    id: "clarity",
    badge: "STEP 3 OF 7 · DAILY CLARITY",
    title: "Daily Clarity & Mind Training",
    message:
      "Take 3 to 5 minutes to warm up your cognitive reflexes with targeted mental exercises in memory recall, logical deduction, and focus stamina.",
    targetSelector: '[data-guide="clarity"]',
    route: "/dashboard",
    pointingDirection: "up",
    actionCta: "Start Daily Challenge →",
    actionHref: "/dashboard/daily-challenge",
  },
  {
    id: "decisions",
    badge: "STEP 4 OF 7 · MY DECISIONS",
    title: "Decision Lab",
    message:
      "Faced with a tough crossroads? The Decision Lab helps you map alternatives, stress-test worst-case scenarios, and make decisions you won't regret.",
    targetSelector: '[data-guide="decisions"]',
    route: "/dashboard/decisions",
    pointingDirection: "left",
    actionCta: "Open Decision Lab →",
    actionHref: "/dashboard/decisions",
  },
  {
    id: "progress",
    badge: "STEP 5 OF 7 · MY PROGRESS",
    title: "My Progress & Growth",
    message:
      "Observe your real trajectory across 4 core development pillars: Thinking, Life Skills, Focus, and Action — backed by genuine streak and milestone history.",
    targetSelector: '[data-guide="progress"]',
    route: "/dashboard",
    pointingDirection: "up",
    actionCta: "Inspect Progress →",
    actionHref: "/dashboard/progress",
  },
  {
    id: "profile",
    badge: "STEP 6 OF 7 · PROFILE & MEMORY",
    title: "My Akuche & Memory Controls",
    message:
      "Review transparent, user-controlled memory items. You have complete authority to view, edit, or delete what Akuche remembers about your context and goals.",
    targetSelector: '[data-guide="profile"]',
    route: "/dashboard/profile",
    pointingDirection: "left",
    actionCta: "Review My Profile →",
    actionHref: "/dashboard/profile",
  },
  {
    id: "reminders",
    badge: "STEP 7 OF 7 · MY REMINDERS",
    title: "Daily Clarity Reminders",
    message:
      "Consistency beats intensity. Set a subtle morning or evening prompt to safeguard your thinking routine at the time that works best for your schedule.",
    targetSelector: '[data-guide="reminders"]',
    route: "/dashboard/settings",
    pointingDirection: "right",
    actionCta: "Manage Reminders →",
    actionHref: "/dashboard/settings",
  },
];
