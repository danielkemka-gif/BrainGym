/**
 * AKUCHE JOURNEYS ENGINE
 * 
 * 10 Structured Progressive Tracks:
 * 1. Build My Business (10 stages)
 * 2. Make More Money (8 stages)
 * 3. Find My Direction (6 stages)
 * 4. Improve My Career (7 stages)
 * 5. Build a Habit (6 stages)
 * 6. Make a Difficult Decision (6 stages)
 * 7. Start a Project (7 stages)
 * 8. Become More Consistent (6 stages)
 * 9. Learn a New Skill (6 stages)
 * 10. Improve My Relationships (6 stages)
 */

import { recordActionStreakActivity, setLastSession } from "./memory-engine";

export interface JourneyStage {
  id: string;
  stageNumber: number;
  title: string;
  objective: string;
  instructions: string;
  practicalAction: string;
  whyItMatters: string;
  doneWhen: string;
  estimatedMinutes: number;
  category: "THINK" | "DECIDE" | "ACT" | "REFLECT" | "LEARN";
}

export interface AkucheJourney {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  category: "Business" | "Money" | "Career" | "Habits" | "Decisions" | "Productivity" | "Growth" | "Relationships";
  stages: JourneyStage[];
}

export interface UserJourneyProgress {
  journeyId: string;
  currentStageIndex: number; // 0-indexed
  completedStages: number[]; // e.g. [0, 1]
  startedAt: string;
  lastActiveAt: string;
  isCompleted: boolean;
}

export const AKUCHE_JOURNEYS: AkucheJourney[] = [
  {
    id: "build-business",
    title: "Build My Business",
    tagline: "Move from an unvalidated idea to a profitable, repeatable business engine.",
    description: "A disciplined 10-stage operating system designed to validate market demand, craft undeniable offers, acquire paying clients, and scale.",
    icon: "Briefcase",
    category: "Business",
    stages: [
      {
        id: "bb-1",
        stageNumber: 1,
        title: "Discover Your High-Value Strength",
        objective: "Identify the #1 specific skill or asset you have that solves an urgent headache for someone with budget.",
        instructions: "List 3 problems you have solved for yourself or others in the past 12 months. Which one saved the most time or made the most money?",
        practicalAction: "Write down your single core high-value skill in 1 crisp sentence.",
        whyItMatters: "Businesses fail when they start with products rather than verifiable individual leverage.",
        doneWhen: "Core skill written down in 1 sentence.",
        estimatedMinutes: 15,
        category: "THINK",
      },
      {
        id: "bb-2",
        stageNumber: 2,
        title: "Identify a Painful Commercial Problem",
        objective: "Isolate a problem that people are actively complaining about and already paying to solve.",
        instructions: "Do not invent new problems. Find where people are currently spending money poorly or losing time.",
        practicalAction: "Interview 2 potential clients or review 5 competitor complaints.",
        whyItMatters: "Selling painkillers is 10x easier than selling vitamins.",
        doneWhen: "Specific customer problem documented with real feedback.",
        estimatedMinutes: 20,
        category: "THINK",
      },
      {
        id: "bb-3",
        stageNumber: 3,
        title: "Define Your Target Buyer Profile",
        objective: "Clarify exactly who has the budget and authority to pay you immediately.",
        instructions: "Specify their industry, company size, exact job title, and daily operational frustration.",
        practicalAction: "Write down a description of your ideal buyer so clear that anyone could introduce you to them.",
        whyItMatters: "Marketing to everyone means selling to no one.",
        doneWhen: "1-paragraph ideal client profile completed.",
        estimatedMinutes: 15,
        category: "DECIDE",
      },
      {
        id: "bb-4",
        stageNumber: 4,
        title: "Validate Before Spending Capital",
        objective: "Verify willingness to pay before investing in websites, logos, or inventory.",
        instructions: "Have 3 diagnostic conversations without pitching. Ask: 'If someone could fix this problem in 48 hours, what would that be worth to you?'",
        practicalAction: "Conduct 3 pain-discovery conversations with target buyers.",
        whyItMatters: "Pre-validation eliminates 90% of entrepreneurial bankruptcy risk.",
        doneWhen: "Feedback from 3 real prospective buyers documented.",
        estimatedMinutes: 30,
        category: "ACT",
      },
      {
        id: "bb-5",
        stageNumber: 5,
        title: "Craft Your Undeniable Offer",
        objective: "Package your service with clear outcome, turnaround time, and risk-reversal guarantee.",
        instructions: "Format: 'I help [Target Buyer] achieve [Measurable Outcome] in [Timeframe] without [Biggest Headache].'",
        practicalAction: "Write out your 1-page offer proposal with transparent pricing.",
        whyItMatters: "An irresistible offer does 80% of the sales closing for you.",
        doneWhen: "1-page written offer drafted.",
        estimatedMinutes: 20,
        category: "DECIDE",
      },
      {
        id: "bb-6",
        stageNumber: 6,
        title: "Build Your 20-Prospect Hit List",
        objective: "Identify 20 real human decision-makers who need your offer right now.",
        instructions: "Search phone contacts, LinkedIn, WhatsApp groups, and local businesses.",
        practicalAction: "Create a list with Name, Role, Phone/WhatsApp, and specific reason they need your help.",
        whyItMatters: "Direct relationship outreach generates revenue faster than passive social media posting.",
        doneWhen: "20 qualified names and contact methods listed.",
        estimatedMinutes: 25,
        category: "ACT",
      },
      {
        id: "bb-7",
        stageNumber: 7,
        title: "Close Your First Paying Client",
        objective: "Execute personalized diagnostic outreaches to secure your first deposit.",
        instructions: "Send 5 direct messages offering a low-friction pilot.",
        practicalAction: "Send 5 outreach messages and follow up on responses.",
        whyItMatters: "A business does not exist until money changes hands.",
        doneWhen: "5 outreaches sent and at least 1 client committed.",
        estimatedMinutes: 30,
        category: "ACT",
      },
      {
        id: "bb-8",
        stageNumber: 8,
        title: "Deliver & Collect Written Feedback",
        objective: "Over-deliver on the result and capture a glowing testimonial.",
        instructions: "Ask the client: 'What was the #1 benefit you experienced working together?'",
        practicalAction: "Collect 1 written testimonial or case study.",
        whyItMatters: "Social proof makes subsequent sales 3x faster.",
        doneWhen: "1 client review or case study recorded.",
        estimatedMinutes: 20,
        category: "REFLECT",
      },
      {
        id: "bb-9",
        stageNumber: 9,
        title: "Build Daily Outreach Discipline",
        objective: "Establish a non-negotiable rhythm of 5 new conversations every weekday.",
        instructions: "Dedicate 9:00 AM to 10:00 AM daily solely to pipeline generation.",
        practicalAction: "Log 5 consecutive days of outbound client contact.",
        whyItMatters: "Consistency separates full-time entrepreneurs from struggling dabblers.",
        doneWhen: "5 consecutive outreach days logged.",
        estimatedMinutes: 20,
        category: "ACT",
      },
      {
        id: "bb-10",
        stageNumber: 10,
        title: "Systematize & Scale Operations",
        objective: "Document standard operating procedures and raise prices by 25%.",
        instructions: "Create a checklist for client onboarding, delivery, and referral generation.",
        practicalAction: "Update pricing and package your repeatable delivery SOP.",
        whyItMatters: "Systems create leverage and prevent founder burnout.",
        doneWhen: "Delivery SOP created and new rate sheet published.",
        estimatedMinutes: 30,
        category: "LEARN",
      },
    ],
  },
  {
    id: "make-money",
    title: "Make More Money",
    tagline: "Reverse-engineer your income target into a daily mathematical pipeline.",
    description: "Break down ambitious financial goals into unit economics, high-ticket services, and high-velocity daily outreach.",
    icon: "DollarSign",
    category: "Money",
    stages: [
      {
        id: "mm-1",
        stageNumber: 1,
        title: "Reverse-Engineer the Mathematics ($R = P \\times Q$)",
        objective: "Break your income target into realistic unit prices and client volumes.",
        instructions: "Divide your 30-day goal into: High-ticket (10 clients), Mid-ticket (20 clients), or Productized (50 clients).",
        practicalAction: "Choose your primary pricing tier and calculate your daily conversation requirement.",
        whyItMatters: "Vague goals produce vague effort. Math creates clarity and urgency.",
        doneWhen: "Target equation ($R = P \\times Q$) finalized.",
        estimatedMinutes: 15,
        category: "THINK",
      },
      {
        id: "mm-2",
        stageNumber: 2,
        title: "Audit Your Fastest Route to Cash Flow",
        objective: "Identify what you can sell in the next 72 hours without upfront inventory.",
        instructions: "Look at existing skills: consulting, copywriting, design, sales, auditing, repairs, tech support.",
        practicalAction: "Select 1 high-value service you can execute immediately.",
        whyItMatters: "Services generate cash 10x faster than unbuilt physical/digital products.",
        doneWhen: "1 high-value service selected.",
        estimatedMinutes: 15,
        category: "DECIDE",
      },
      {
        id: "mm-3",
        stageNumber: 3,
        title: "Build a 30-Contact Warm Network Sheet",
        objective: "List past clients, phone book contacts, and business owners you already know.",
        instructions: "Reactivating warm relationships converts at 40% vs cold outreach at 3%.",
        practicalAction: "List 30 names with phone numbers on a target sheet.",
        whyItMatters: "Your existing network contains your fastest next payout.",
        doneWhen: "30 warm names written down.",
        estimatedMinutes: 20,
        category: "ACT",
      },
      {
        id: "mm-4",
        stageNumber: 4,
        title: "Send 5 Pilot Messages Before 6:00 PM",
        objective: "Initiate direct conversations proposing a low-risk pilot.",
        instructions: "Send: 'Hi [Name], I'm taking on 2 clients to help with [specific outcome] this month. Is this a focus for you right now?'",
        practicalAction: "Send 5 personalized WhatsApp/SMS messages.",
        whyItMatters: "Sending messages creates immediate commercial feedback.",
        doneWhen: "5 messages sent.",
        estimatedMinutes: 15,
        category: "ACT",
      },
      {
        id: "mm-5",
        stageNumber: 5,
        title: "Conduct Diagnostic Discovery Conversations",
        objective: "Ask 3 questions before discussing price or proposals.",
        instructions: "Diagnose their bottleneck, quantify their loss, and confirm their decision timeline.",
        practicalAction: "Run 2 discovery conversations with interested prospects.",
        whyItMatters: "Diagnosing builds authority and justifies premium pricing.",
        doneWhen: "2 discovery calls completed.",
        estimatedMinutes: 30,
        category: "ACT",
      },
      {
        id: "mm-6",
        stageNumber: 6,
        title: "Send 1-Page Proposal with 48h Incentive",
        objective: "Present a clear scope with upfront deposit requirement.",
        instructions: "Include a 48-hour priority pricing discount to prevent client stalling.",
        practicalAction: "Deliver 1 proposal with explicit payment terms.",
        whyItMatters: "Urgency prevents proposals from sitting in limbo.",
        doneWhen: "1 proposal submitted to decision maker.",
        estimatedMinutes: 20,
        category: "DECIDE",
      },
      {
        id: "mm-7",
        stageNumber: 7,
        title: "Collect Upfront Cash Deposit",
        objective: "Secure at least 50% to 100% payment before beginning delivery.",
        instructions: "Never start work on verbal promises. Verify bank transfer confirmation.",
        practicalAction: "Confirm upfront deposit in your bank account.",
        whyItMatters: "Cash flow in the bank protects your operational focus.",
        doneWhen: "Payment confirmed.",
        estimatedMinutes: 10,
        category: "ACT",
      },
      {
        id: "mm-8",
        stageNumber: 8,
        title: "Weekly Financial Review & Pipeline Refill",
        objective: "Track actual revenue collected vs monthly target and reload prospect list.",
        instructions: "Review conversion rates and add 20 new prospect names for the upcoming week.",
        practicalAction: "Complete your weekly cash velocity review.",
        whyItMatters: "Continuous pipeline maintenance prevents feast-or-famine cycles.",
        doneWhen: "Weekly revenue logged and 20 new prospects added.",
        estimatedMinutes: 15,
        category: "REFLECT",
      },
    ],
  },
  {
    id: "find-direction",
    title: "Find My Direction",
    tagline: "Uncover your unique strengths, values, and highest-leverage life trajectory.",
    description: "Move from confusion to deep personal conviction by mapping your natural leverage, market demand, and non-negotiable priorities.",
    icon: "Compass",
    category: "Growth",
    stages: [
      {
        id: "fd-1",
        stageNumber: 1,
        title: "Conduct an Energy & Frustration Audit",
        objective: "Identify activities that give you natural energy vs tasks that drain you.",
        instructions: "Review your last 30 days. List 3 tasks that felt effortless and 3 that felt exhausting.",
        practicalAction: "Complete your 2-column Energy Audit list.",
        whyItMatters: "Long-term success requires alignment with your intrinsic cognitive energy.",
        doneWhen: "Energy audit documented.",
        estimatedMinutes: 15,
        category: "THINK",
      },
      {
        id: "fd-2",
        stageNumber: 2,
        title: "Map Your Unfair Advantages & Skills",
        objective: "Identify the unique combination of 2-3 skills that puts you in the top 5% of a niche.",
        instructions: "Skill stacking: e.g. Accounting + Good Communication + Tech Knowledge = Premium Financial Consultant.",
        practicalAction: "Write down your 3-skill combination.",
        whyItMatters: "Intersection of ordinary skills creates rare unfair leverage.",
        doneWhen: "Skill stack defined.",
        estimatedMinutes: 20,
        category: "THINK",
      },
      {
        id: "fd-3",
        stageNumber: 3,
        title: "Define 3 Non-Negotiable Core Values",
        objective: "Clarify what you will never compromise on (e.g. autonomy, financial independence, integrity).",
        instructions: "Pick 3 values that act as decision filters for opportunities.",
        practicalAction: "Record your 3 personal boundary filters.",
        whyItMatters: "Clear values eliminate decision fatigue and protect you from bad partnerships.",
        doneWhen: "3 core boundary filters documented.",
        estimatedMinutes: 15,
        category: "DECIDE",
      },
      {
        id: "fd-4",
        stageNumber: 4,
        title: "Test Market Demand for Your Direction",
        objective: "Verify that people actually pay for what you want to do.",
        instructions: "Search job boards, freelance platforms, and industry discussions for commercial demand.",
        practicalAction: "Find 3 real examples of people thriving in this exact direction.",
        whyItMatters: "Passion without market demand is a hobby; passion with market demand is a career.",
        doneWhen: "3 market validation proofs logged.",
        estimatedMinutes: 20,
        category: "LEARN",
      },
      {
        id: "fd-5",
        stageNumber: 5,
        title: "Make the Single 90-Day Commitment",
        objective: "Choose one primary focus for the next 90 days and say NO to distractions.",
        instructions: "Pick the single objective that will make the biggest difference in your life.",
        practicalAction: "Write out your 90-day singular priority contract.",
        whyItMatters: "Focus is the highest-leverage force multiplier.",
        doneWhen: "90-day priority contract written and signed.",
        estimatedMinutes: 15,
        category: "DECIDE",
      },
      {
        id: "fd-6",
        stageNumber: 6,
        title: "Set Your Week 1 Milestone Action",
        objective: "Take one tangible, public action that locks in your new direction.",
        instructions: "Tell an accountability partner, register for a course, or message a mentor.",
        practicalAction: "Complete your initial public commitment step.",
        whyItMatters: "Public commitment converts internal intention into real-world momentum.",
        doneWhen: "1 commitment action executed.",
        estimatedMinutes: 15,
        category: "ACT",
      },
    ],
  },
  {
    id: "difficult-decision",
    title: "Make a Difficult Decision",
    tagline: "Evaluate high-stakes options with rigorous Socratic clarity and zero regret.",
    description: "A 6-stage decision protocol that separates emotional fear from hard facts, runs downside calculations, and designs 24-hour test actions.",
    icon: "HelpCircle",
    category: "Decisions",
    stages: [
      {
        id: "dd-1",
        stageNumber: 1,
        title: "Frame the Exact Core Dilemma",
        objective: "State the decision in 1 sentence without emotional drama or vague confusion.",
        instructions: "Format: 'Should I [Option A] or [Option B] given [Key Constraint]?'",
        practicalAction: "Write your crisp decision statement.",
        whyItMatters: "A properly framed question is 80% answered.",
        doneWhen: "Decision framed in 1 sentence.",
        estimatedMinutes: 10,
        category: "THINK",
      },
      {
        id: "dd-2",
        stageNumber: 2,
        title: "Downside & Worst-Case Scenario Analysis",
        objective: "Calculate the worst-case financial, emotional, and career outcome for each option.",
        instructions: "Ask: 'If Option A fails completely, can I survive? What is my recovery plan?'",
        practicalAction: "Document the worst-case scenario and survival protocol for each route.",
        whyItMatters: "Fear dissipates once the worst-case scenario is quantified and survivable.",
        doneWhen: "Worst-case survival plan documented.",
        estimatedMinutes: 20,
        category: "THINK",
      },
      {
        id: "dd-3",
        stageNumber: 3,
        title: "Test for Reversibility (One-Way vs Two-Way Doors)",
        objective: "Determine whether this choice can be undone easily if new data arrives.",
        instructions: "Two-way door decisions should be made quickly; one-way door decisions require careful validation.",
        practicalAction: "Classify your decision as reversible or irreversible.",
        whyItMatters: "Most people treat two-way reversible decisions with paralyzing one-way caution.",
        doneWhen: "Reversibility classification recorded.",
        estimatedMinutes: 10,
        category: "DECIDE",
      },
      {
        id: "dd-4",
        stageNumber: 4,
        title: "Design a 24-Hour Micro-Experiment",
        objective: "Take one small test action today that gathers hard evidence before permanent commitment.",
        instructions: "Talk to 2 people who made this exact transition or run a $0 pilot test.",
        practicalAction: "Execute your 24-hour information-gathering micro-action.",
        whyItMatters: "1 hour of real-world testing beats 40 hours of anxiety.",
        doneWhen: "Micro-experiment executed and notes saved.",
        estimatedMinutes: 25,
        category: "ACT",
      },
      {
        id: "dd-5",
        stageNumber: 5,
        title: "Make the Decisive Choice & Set Boundaries",
        objective: "Select your path with 100% conviction and close all mental escape routes.",
        instructions: "Write down your final choice and the 3 reasons you will not second-guess it.",
        practicalAction: "Record your decision in your Akuche Decision Lab.",
        whyItMatters: "Commitment produces momentum; second-guessing drains energy.",
        doneWhen: "Decision recorded and locked.",
        estimatedMinutes: 15,
        category: "DECIDE",
      },
      {
        id: "dd-6",
        stageNumber: 6,
        title: "Schedule the 30-Day Follow-Up Review",
        objective: "Set a reminder to review how the decision played out in reality.",
        instructions: "Log what happened, what surprised you, and what you learned about your judgment.",
        practicalAction: "Set your 30-day review checkpoint.",
        whyItMatters: "Evaluating past decisions builds lifelong wisdom.",
        doneWhen: "30-day review reminder scheduled.",
        estimatedMinutes: 10,
        category: "REFLECT",
      },
    ],
  },
  {
    id: "build-habit",
    title: "Build a Habit",
    tagline: "Build unbreakable consistency by reducing friction and stacking micro-actions.",
    description: "Transform your daily productivity, health, and focus with behavioral science and the 7-day action streak protocol.",
    icon: "Zap",
    category: "Habits",
    stages: [
      {
        id: "bh-1",
        stageNumber: 1,
        title: "Define the 2-Minute Micro-Habit",
        objective: "Shrink the new behavior until it is impossible to fail (e.g. 5 push-ups, 2 sentences written, 1 prospect contacted).",
        instructions: "Do not start with 1 hour a day. Start with 2 minutes a day.",
        practicalAction: "Define your 2-minute version of the habit.",
        whyItMatters: "Consistency is more important than intensity when establishing a new identity.",
        doneWhen: "2-minute micro-habit defined.",
        estimatedMinutes: 10,
        category: "DECIDE",
      },
      {
        id: "bh-2",
        stageNumber: 2,
        title: "Anchor to an Existing Daily Routine",
        objective: "Attach the new habit directly after an existing non-negotiable action.",
        instructions: "Format: 'After I [Pour Morning Tea], I will [Complete 2-Minute Habit].'",
        practicalAction: "Write down your habit anchor trigger.",
        whyItMatters: "Using an existing neural pathway creates instant automaticity.",
        doneWhen: "Habit anchor trigger written down.",
        estimatedMinutes: 10,
        category: "THINK",
      },
      {
        id: "bh-3",
        stageNumber: 3,
        title: "Eliminate Environmental Friction",
        objective: "Remove all obstacles that could make the habit difficult to perform.",
        instructions: "Prepare your workspace, open the required app, or set your tools the night before.",
        practicalAction: "Set up your environment to make the habit frictionless.",
        whyItMatters: "Willpower is unreliable; environment design is supreme.",
        doneWhen: "Environment optimized for instant action.",
        estimatedMinutes: 15,
        category: "ACT",
      },
      {
        id: "bh-4",
        stageNumber: 4,
        title: "Execute Day 1 to Day 3 Sprint",
        objective: "Perform the 2-minute habit for 3 consecutive days without skipping.",
        instructions: "Log your action in Akuche immediately after completion.",
        practicalAction: "Complete the habit 3 days in a row.",
        whyItMatters: "Early wins build momentum and self-trust.",
        doneWhen: "3-day streak logged.",
        estimatedMinutes: 10,
        category: "ACT",
      },
      {
        id: "bh-5",
        stageNumber: 5,
        title: "Implement the 'Never Miss Twice' Rule",
        objective: "Establish a recovery plan in case an emergency disrupts your schedule.",
        instructions: "If you miss 1 day, complete the 2-minute version the next day without fail.",
        practicalAction: "Write your emergency recovery rule.",
        whyItMatters: "One miss is an accident; two misses is the start of a bad habit.",
        doneWhen: "Emergency recovery rule documented.",
        estimatedMinutes: 10,
        category: "DECIDE",
      },
      {
        id: "bh-6",
        stageNumber: 6,
        title: "Scale Habit to Full Target Duration",
        objective: "Gradually expand the habit from 2 minutes to 15-30 minutes.",
        instructions: "Now that the neural trigger is automatic, increase the volume safely.",
        practicalAction: "Upgrade your daily habit target.",
        whyItMatters: "Scaling on a solid foundation produces lifelong results.",
        doneWhen: "Upgraded habit target running consistently.",
        estimatedMinutes: 15,
        category: "LEARN",
      },
    ],
  },
];

const JOURNEY_PROGRESS_KEY = "akuche_journey_progress_v2";
const ACTIVE_JOURNEY_KEY = "akuche_active_journey_v2";

export function getAllJourneys(): AkucheJourney[] {
  return AKUCHE_JOURNEYS;
}

export function getJourneyById(id: string): AkucheJourney | undefined {
  return AKUCHE_JOURNEYS.find((j) => j.id === id);
}

export function getActiveJourneyId(): string {
  if (typeof window === "undefined") return "build-business";
  const stored = localStorage.getItem(ACTIVE_JOURNEY_KEY);
  return stored || "build-business";
}

export function setActiveJourneyId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_JOURNEY_KEY, id);

  const journey = getJourneyById(id);
  if (journey) {
    const progress = getJourneyProgress(id);
    const stage = journey.stages[progress.currentStageIndex] || journey.stages[0];
    setLastSession({
      type: "journey_step",
      title: journey.title,
      subtitle: `Stage ${stage.stageNumber}: ${stage.title}`,
      route: `/dashboard/journeys`,
      progressText: `Stage ${stage.stageNumber} of ${journey.stages.length}`,
      timestamp: new Date().toISOString(),
    });
  }
}

export function getAllJourneyProgress(): Record<string, UserJourneyProgress> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(JOURNEY_PROGRESS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function getJourneyProgress(journeyId: string): UserJourneyProgress {
  const all = getAllJourneyProgress();
  if (all[journeyId]) return all[journeyId];

  const initial: UserJourneyProgress = {
    journeyId,
    currentStageIndex: 0,
    completedStages: [],
    startedAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    isCompleted: false,
  };
  return initial;
}

export function completeJourneyStage(journeyId: string, stageIndex: number): UserJourneyProgress {
  const all = getAllJourneyProgress();
  const journey = getJourneyById(journeyId);
  if (!journey) return getJourneyProgress(journeyId);

  const current = getJourneyProgress(journeyId);
  const completedSet = new Set(current.completedStages);
  completedSet.add(stageIndex);
  const newCompleted = Array.from(completedSet).sort((a, b) => a - b);

  const nextStageIndex = Math.min(stageIndex + 1, journey.stages.length - 1);
  const isCompleted = newCompleted.length >= journey.stages.length;

  const updated: UserJourneyProgress = {
    journeyId,
    currentStageIndex: nextStageIndex,
    completedStages: newCompleted,
    startedAt: current.startedAt,
    lastActiveAt: new Date().toISOString(),
    isCompleted,
  };

  all[journeyId] = updated;
  if (typeof window !== "undefined") {
    localStorage.setItem(JOURNEY_PROGRESS_KEY, JSON.stringify(all));
  }

  const completedStageObj = journey.stages[stageIndex];
  recordActionStreakActivity({
    type: "journey_step",
    title: `${journey.title} - Stage ${stageIndex + 1}: ${completedStageObj.title}`,
    details: completedStageObj.practicalAction,
  });

  const nextStageObj = journey.stages[nextStageIndex];
  setLastSession({
    type: "journey_step",
    title: journey.title,
    subtitle: `Stage ${nextStageObj.stageNumber}: ${nextStageObj.title}`,
    route: `/dashboard/journeys`,
    progressText: `Stage ${nextStageObj.stageNumber} of ${journey.stages.length}`,
    timestamp: new Date().toISOString(),
  });

  return updated;
}
