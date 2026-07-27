export interface PremiumScenario {
  id: string;
  category: string;
  title: string;
  scenario: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  feature: string;
  featureDescription: string;
  featureIcon: string;
  xp: number;
  coins: number;
}

export const PREMIUM_SCENARIOS: PremiumScenario[] = [
  {
    id: "ps-ai-coach-stress",
    category: "health",
    title: "AI Coach: Stress Recovery",
    scenario:
      "You've had 4 back-to-back meetings and your head is pounding. You have15 minutes before your next call. What's the smartest move?",
    options: [
      "Scroll your phone to decompress",
      "Drink coffee to push through",
      "Do a focused 5-minute breathing exercise",
      "Skip the next meeting entirely",
    ],
    correctAnswer: "Do a focused 5-minute breathing exercise",
    explanation:
      "Your AI Coach would analyze your stress pattern and suggest a personalized 2-minute reset based on your brain profile.",
    feature: "AI Coach",
    featureDescription:
      "Get personalized stress management strategies based on YOUR brain data — not generic advice.",
    featureIcon: "🤖",
    xp: 30,
    coins: 12,
  },
  {
    id: "ps-decision-lab-career",
    category: "thinking",
    title: "Decision Lab: Career Crossroads",
    scenario:
      "You got two job offers. One pays 40% more but requires relocation. Your gut says stay. How do you decide?",
    options: [
      "Go with the money — you can always move back",
      "Stay — gut feelings are usually right",
      "Make a pros-and-cons list and pick the longer one",
      "Ask your friends what they would do",
    ],
    correctAnswer: "Stay — gut feelings are usually right",
    explanation:
      "Decision Lab would weight your values, fears, and long-term goals to reveal your true answer — not just the logical one.",
    feature: "Decision Lab",
    featureDescription:
      "Analyze life decisions with weighted values, cognitive bias detection, and scenario modeling.",
    featureIcon: "🧪",
    xp: 30,
    coins: 12,
  },
  {
    id: "ps-ai-coach-sleep",
    category: "memory",
    title: "AI Coach: Sleep & Memory",
    scenario:
      "You've been sleeping 5 hours for a week and you're starting to forget names and lose your keys. What should you do first?",
    options: [
      "Set more alarms so you don't forget things",
      "Start a memory supplement routine",
      "Fix your sleep schedule with a structured wind-down routine",
      "Write everything down so you don't have to remember",
    ],
    correctAnswer: "Fix your sleep schedule with a structured wind-down routine",
    explanation:
      "AI Coach would build a sleep-brain recovery plan tailored to YOUR specific cognitive weak spots.",
    feature: "AI Coach",
    featureDescription:
      "Get a personalized brain recovery plan when sleep, stress, or habits are affecting your memory.",
    featureIcon: "🤖",
    xp: 30,
    coins: 12,
  },
  {
    id: "ps-decision-lab-social",
    category: "emotional-intelligence",
    title: "Decision Lab: The Honest Friend",
    scenario:
      "Your close friend just asked for honest feedback on their business idea. You think it's terrible and will lose money. What do you say?",
    options: [
      "Tell them it's great — friends support each other",
      "Be brutally honest — they asked for it",
      "Ask them tough questions so they figure it out themselves",
      "Change the subject — avoid the conversation entirely",
    ],
    correctAnswer: "Ask them tough questions so they figure it out themselves",
    explanation:
      "Decision Lab would analyze the social dynamics, weigh truth vs. kindness, and find the kindest honest response for YOUR relationship.",
    feature: "Decision Lab",
    featureDescription:
      "Navigate tricky social situations with structured analysis of dynamics, emotions, and outcomes.",
    featureIcon: "🧪",
    xp: 30,
    coins: 12,
  },
  {
    id: "ps-report-progress",
    category: "learning",
    title: "Advanced Report: Your Brain Progress",
    scenario:
      "You've been training for 30 days. You feel sharper but can't prove it. How do you know if it's actually working?",
    options: [
      "Trust the feeling — if you feel better, it's working",
      "Compare your quiz scores from day 1 to today",
      "Ask someone else if they notice a difference",
      "Take a break to see if you miss it — that proves it matters",
    ],
    correctAnswer: "Compare your quiz scores from day 1 to today",
    explanation:
      "Advanced Reports track your cognitive growth trends, brain age progression, and show exactly which areas improved — with data.",
    feature: "Advanced Reports",
    featureDescription:
      "See your cognitive growth trends, brain age, and personalized recommendations with detailed analytics.",
    featureIcon: "📊",
    xp: 30,
    coins: 12,
  },
  {
    id: "ps-ai-coach-focus",
    category: "focus",
    title: "AI Coach: Focus Audit",
    scenario:
      "You can't focus for more than 10 minutes at work. Your phone is the obvious culprit, but is it really?",
    options: [
      "Delete all social media apps from your phone",
      "Use a focus app that blocks distractions",
      "Identify your real distraction triggers — it's rarely just the phone",
      "Work in a different location each day",
    ],
    correctAnswer: "Identify your real distraction triggers — it's rarely just the phone",
    explanation:
      "AI Coach would run a focus audit and find YOUR specific distraction patterns — notifications, hunger, boredom, or something deeper.",
    feature: "AI Coach",
    featureDescription:
      "Get a personalized focus audit that reveals your actual distraction triggers, not just the obvious ones.",
    featureIcon: "🤖",
    xp: 30,
    coins: 12,
  },
];

export function pickPremiumScenarios(count: number, seed: number): PremiumScenario[] {
  const shuffled = [...PREMIUM_SCENARIOS];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
