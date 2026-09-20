/**
 * BRAINGYM PERSONALIZED SCENARIO & WORKOUT REPOSITORY
 * 
 * Multi-Factor Personalized Workouts across all 8 Core Mental Fitness Areas:
 * 1. Focus
 * 2. Memory
 * 3. Problem-solving
 * 4. Decision-making
 * 5. Critical thinking
 * 6. Creativity
 * 7. Adaptability
 * 8. Self-awareness
 * 
 * Every workout delivers:
 * UNIVERSAL SKILL + PERSONALIZED CONTEXT + DIFFICULTY (Levels 1-6) + YOUR LIFE CHALLENGE + REFLECTION
 */

import { PersonalizedMentalWorkout } from "./types";

export const PERSONALIZED_WORKOUTS_REPOSITORY: PersonalizedMentalWorkout[] = [
  // ───────────────────────────────────────────────────────────────────────────
  // 1. TEENAGER / 16-YEAR-OLD STUDENT SCENARIOS (YOUTH-SAFE, EMPOWERING)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "pw-teen-peer-pressure",
    title: "The Weekend Social Media Dare & Group Pressure",
    universalSkill: "Decision-making",
    difficultyLevel: 2,
    estimatedMinutes: 7,
    tags: {
      skill: "Decision-making",
      difficulty: 2,
      ageSuitability: "13+",
      lifeContext: ["Student", "Other"],
      interests: ["Everyday life", "Social issues", "Technology"],
      format: "scenario_workout",
      estimatedDurationMin: 7,
      realLifeApplication: true,
      safetyCategory: "youth_safe",
      culturalGrounding: "Universal_Global",
    },
    coverEmoji: "🎒",
    coverIllustration: "knowledge",
    scenarioNarrative:
      "A close group of friends in your school WhatsApp group is planning a prank on a classmate and recording it for TikTok. They tag you and urge you to join, saying 'Don't be boring!' You know this prank will publicly humiliate the classmate and could lead to school disciplinary action.",
    situationAnalysis: {
      coreDilemma: "Balancing the desire for peer belonging against personal values and consequences.",
      hiddenTrap: "Fear of missing out (FOMO) and social exclusion overriding moral intuition.",
      cognitivePrinciple: "Consequence Projection & Value-Based Boundary Setting.",
    },
    decisionPrompt: "How do you navigate this peer pressure?",
    decisionOptions: [
      {
        id: "opt-teen-pp-1",
        letter: "A",
        text: "Join in reluctantly because you don't want your friends to make fun of you or exclude you.",
        thinkingStyle: "Social Compliance / Fear of Rejection",
        isRecommended: false,
        consequences: "You compromise your integrity, hurt a classmate, and risk school suspension.",
        brainExplanation: "The adolescent limbic system strongly magnifies peer approval rewards over long-term risk assessment.",
      },
      {
        id: "opt-teen-pp-2",
        letter: "B",
        text: "Privately message the group leader, state clearly that you won't participate, and propose an alternative fun challenge that doesn't hurt anyone.",
        thinkingStyle: "Constructive Boundary Setting",
        isRecommended: true,
        consequences: "You maintain self-respect, protect a peer from humiliation, and offer a positive redirection without aggressive confrontation.",
        brainExplanation: "Activating the prefrontal cortex allows you to decouple social connection from harmful collective behavior.",
      },
      {
        id: "opt-teen-pp-3",
        letter: "C",
        text: "Publicly insult everyone in the group chat and immediately exit.",
        thinkingStyle: "Reactive Hostility",
        isRecommended: false,
        consequences: "Creates unnecessary conflict and drama without addressing the core safety of the targeted classmate.",
        brainExplanation: "Emotional fight response creates defensive pushback rather than thoughtful persuasion.",
      },
      {
        id: "opt-teen-pp-4",
        letter: "D",
        text: "Pretend your phone was off all weekend and ignore what happens.",
        thinkingStyle: "Passive Bystander",
        isRecommended: false,
        consequences: "The classmate still gets hurt, and you feel lingering guilt for remaining silent.",
        brainExplanation: "Avoidance momentarily relieves immediate tension but builds cognitive dissonance and self-doubt.",
      },
    ],
    brainInsightTakeaway: "True courage isn't opposing your friends loudly; it's standing firm in what is right without losing your composure.",
    neuroscienceRationale:
      "Adolescent neurodevelopment experiences heightened dopaminergic sensitivity to peer validation. Pausing for 60 seconds engages prefrontal impulse control.",
    relatedBrainChallenge: {
      id: "bc-teen-risk-eval",
      title: "Second-Order Consequence Evaluation",
      category: "Critical Thinking",
      subcategory: "Consequence Mapping",
      difficulty: "beginner",
      type: "critical_scenario",
      estimatedTimeSec: 45,
      instruction: "Identify the second-order consequence of peer compliance.",
      cognitiveSkill: "Consequence Forecasting",
      question: "What is a 'second-order consequence' of agreeing to a bad prank just to fit in?",
      options: [
        { id: "bc-to1", label: "Loss of personal trust and expectations to do even worse dares in the future", isCorrect: true },
        { id: "bc-to2", label: "Getting 5 more likes on a video", isCorrect: false },
        { id: "bc-to3", label: "Your phone battery running down 2% faster", isCorrect: false },
        { id: "bc-to4", label: "Nothing changes whatsoever", isCorrect: false },
      ],
      educationalWhy: "First-order consequences are immediate (temporary laughs); second-order consequences are enduring (eroded reputation and habits).",
      xpReward: 30,
      coinReward: 10,
    },
    yourLifeChallenge: {
      id: "ylc-teen-boundary",
      title: "The 30-Second Pause Before Saying Yes",
      instruction: "Today, when anyone (friend, classmate, or sibling) asks you to do something you feel unsure about, take a 30-second pause before answering. Ask yourself: 'Is this aligned with who I want to be?'",
      contextWhy: "Training pause mechanics builds automatic prefrontal resistance against impulsivity.",
      durationMinutes: 3,
      verificationQuestion: "Did you use the 30-second pause on a decision today?",
      reflectionPrompt: "How did pausing help you make a clearer, calmer choice today?",
    },
    journalPrompts: [
      "When was the last time you felt pressured to agree with the crowd?",
      "What core value matters most to you when choosing friends?",
      "How does pausing 30 seconds change your decision confidence?",
    ],
    suggestedReflectionTemplate:
      "Today I learned that saying no to peer pressure is a superpower. When I took a pause before reacting, I noticed how much easier it is to protect my peace and integrity.",
  },

  {
    id: "pw-teen-study-distraction",
    title: "Exam Study Block & The Infinite Notification Loop",
    universalSkill: "Focus",
    difficultyLevel: 2,
    estimatedMinutes: 6,
    tags: {
      skill: "Focus",
      difficulty: 2,
      ageSuitability: "13+",
      lifeContext: ["Student"],
      interests: ["Education", "Technology"],
      format: "scenario_workout",
      estimatedDurationMin: 6,
      realLifeApplication: true,
      safetyCategory: "youth_safe",
      culturalGrounding: "Universal_Global",
    },
    coverEmoji: "📚",
    coverIllustration: "focus",
    scenarioNarrative:
      "You have an important Physics and Chemistry exam in 48 hours. Every time you open your notebook, your phone buzzes with group chats, reels, and video game invites. Two hours pass and you realize you've only read one page.",
    situationAnalysis: {
      coreDilemma: "High-friction academic study competing with low-friction variable dopamine rewards.",
      hiddenTrap: "Assuming willpower alone can defeat algorithmic notification architecture.",
      cognitivePrinciple: "Environmental Friction Design & Deep Work Sprints.",
    },
    decisionPrompt: "What is the highest-leverage cognitive strategy?",
    decisionOptions: [
      {
        id: "opt-teen-focus-1",
        letter: "A",
        text: "Keep the phone right next to your textbook on silent, trying harder to resist checking it.",
        thinkingStyle: "Willpower Reliance Fallacy",
        isRecommended: false,
        consequences: "Cognitive 'attentional residue' drains working memory even if you don't pick up the phone.",
        brainExplanation: "A visible smartphone in the peripheral visual field continuously taxes working memory resources.",
      },
      {
        id: "opt-teen-focus-2",
        letter: "B",
        text: "Put the phone in another room on airplane mode and commit to two 25-minute Pomodoro focus sprints with a clear 5-minute break.",
        thinkingStyle: "Environmental Friction Architecture",
        isRecommended: true,
        consequences: "Deep study flow is unlocked quickly, allowing you to absorb complex concepts in half the time.",
        brainExplanation: "Physical distance removes the visual cue, drastically reducing dopamine seeking loops.",
      },
      {
        id: "opt-teen-focus-3",
        letter: "C",
        text: "Study while listening to YouTube videos and chatting simultaneously.",
        thinkingStyle: "Multitasking Illusion",
        isRecommended: false,
        consequences: "Information goes into shallow memory and vanishes by exam morning.",
        brainExplanation: "The hippocampus requires focused attention to consolidate synaptic memory traces into long-term storage.",
      },
      {
        id: "opt-teen-focus-4",
        letter: "D",
        text: "Give up on studying today and plan to pull an all-nighter right before the exam.",
        thinkingStyle: "Procrastination Capitulation",
        isRecommended: false,
        consequences: "Severe sleep deprivation cripples recall and causes brain fog during the exam.",
        brainExplanation: "Sleep is mandatory for memory consolidation and neural waste clearance.",
      },
    ],
    brainInsightTakeaway: "You don't need superhuman willpower when you design an environment with zero distractions.",
    neuroscienceRationale:
      "Removing physical triggers from the visual field preserves glucose and working memory in the dorsolateral prefrontal cortex.",
    relatedBrainChallenge: {
      id: "bc-teen-focus-decay",
      title: "Attentional Switching Cost",
      category: "Focus & Attention",
      subcategory: "Task Switching",
      difficulty: "beginner",
      type: "critical_scenario",
      estimatedTimeSec: 30,
      instruction: "Identify the recovery time after a digital interruption.",
      cognitiveSkill: "Attentional Reset",
      question: "According to cognitive science, how long does the brain take on average to regain deep focus after checking a single notification?",
      options: [
        { id: "bc-fo1", label: "15 to 23 minutes of refocusing time", isCorrect: true },
        { id: "bc-fo2", label: "3 seconds", isCorrect: false },
        { id: "bc-fo3", label: "0 seconds (we multitask instantly)", isCorrect: false },
        { id: "bc-fo4", label: "1 hour", isCorrect: false },
      ],
      educationalWhy: "Attentional residue lingers after every switch, destroying deep comprehension.",
      xpReward: 30,
      coinReward: 10,
    },
    yourLifeChallenge: {
      id: "ylc-teen-out-of-sight",
      title: "The 'Phone in Another Room' Study Sprint",
      instruction: "Place your phone in another room for 25 minutes while you study or read one chapter of a book without a single interruption.",
      contextWhy: "Directly experiencing uninterrupted flow rebuilds attention span.",
      durationMinutes: 25,
      verificationQuestion: "Did you complete one full 25-minute phone-free sprint?",
      reflectionPrompt: "How much faster did you absorb the material without notifications?",
    },
    journalPrompts: [
      "Which app is your biggest focus thief during study sessions?",
      "How did your mind feel during the 25-minute uninterrupted block?",
      "What is one rule you will set for your desk environment?",
    ],
    suggestedReflectionTemplate:
      "Today I discovered that putting my phone out of sight made studying feel 10x easier. When there were no pings, my brain was actually able to grasp the hard concepts.",
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. 22-YEAR-OLD GRADUATE / CAREER STARTER SCENARIOS
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "pw-grad-salary-freeze",
    title: "First Job Offer & The Salary Expectation Dilemma",
    universalSkill: "Critical thinking",
    difficultyLevel: 3,
    estimatedMinutes: 8,
    tags: {
      skill: "Critical thinking",
      difficulty: 3,
      ageSuitability: "18+",
      lifeContext: ["Job seeker", "University student", "Employee"],
      interests: ["Career", "Money", "Business"],
      format: "scenario_workout",
      estimatedDurationMin: 8,
      realLifeApplication: true,
      safetyCategory: "general_adult",
      culturalGrounding: "Nigerian_African",
    },
    coverEmoji: "🎓",
    coverIllustration: "workplace",
    scenarioNarrative:
      "You recently graduated and completed interviews for your first major role at an energy firm in Lagos. The hiring manager calls with good news: 'We'd love to offer you the role! Our budget is ₦180,000/month. Can you confirm acceptance today?' Industry research showed the benchmark for this role ranges from ₦250,000 to ₦300,000.",
    situationAnalysis: {
      coreDilemma: "Balancing excitement for a first job offer against anchoring yourself to an under-market compensation rate.",
      hiddenTrap: "Gratitude trap: feeling so grateful to be hired that you fear advocating for fair value.",
      cognitivePrinciple: "Anchoring Bias & Professional Value Negotiation.",
    },
    decisionPrompt: "What is your best strategic response?",
    decisionOptions: [
      {
        id: "opt-grad-sal-1",
        letter: "A",
        text: "Immediately accept on the spot to avoid looking difficult or risking them withdrawing the offer.",
        thinkingStyle: "Anxious Concession",
        isRecommended: false,
        consequences: "You start below market rate and lock in lower incremental percentage raises for future years.",
        brainExplanation: "Scarcity mindset triggers fear of total loss, causing premature negotiation capitulation.",
      },
      {
        id: "opt-grad-sal-2",
        letter: "B",
        text: "Express sincere enthusiasm, state your verified market data and unique skills, and professionally request ₦260,000 while asking for 24 hours to review the formal contract.",
        thinkingStyle: "Strategic Value Anchoring",
        isRecommended: true,
        consequences: "Employers expect professional counter-offers; they either meet you closer to ₦240,000+ or explain non-cash benefits.",
        brainExplanation: "Calm, evidence-based requests signal executive maturity and high professional self-worth.",
      },
      {
        id: "opt-grad-sal-3",
        letter: "C",
        text: "Tell them the offer is insulting and demand ₦400,000 immediately.",
        thinkingStyle: "Aggressive Over-reach",
        isRecommended: false,
        consequences: "Breaks rapport with the hiring manager and damages your professional reputation.",
        brainExplanation: "Ego-driven emotional reaction destroys collaborative negotiation room.",
      },
      {
        id: "opt-grad-sal-4",
        letter: "D",
        text: "Don't reply to the call or email for 4 days to make them anxious.",
        thinkingStyle: "Passive Ghosting",
        isRecommended: false,
        consequences: "The company moves to the next candidate on the shortlist.",
        brainExplanation: "Avoidance tactics in high-stakes professional moments cause irrecoverable opportunity loss.",
      },
    ],
    brainInsightTakeaway: "Negotiation is not confrontation; it is collaborative problem-solving based on verified value.",
    neuroscienceRationale:
      "When evaluating financial offers, separating emotional gratitude from market data prevents the brain from prematurely collapsing the negotiation window.",
    relatedBrainChallenge: {
      id: "bc-grad-anchor",
      title: "Anchoring Effect Identification",
      category: "Critical Thinking",
      subcategory: "Cognitive Biases",
      difficulty: "intermediate",
      type: "critical_scenario",
      estimatedTimeSec: 45,
      instruction: "Identify how an initial offer anchors psychological expectations.",
      cognitiveSkill: "Anchoring Detection",
      question: "When a hiring manager offers an initial low figure, which cognitive bias is being deployed?",
      options: [
        { id: "bc-go1", label: "Anchoring Bias (setting an initial psychological baseline that pulls all counter-offers down)", isCorrect: true },
        { id: "bc-go2", label: "Confirmation Bias", isCorrect: false },
        { id: "bc-go3", label: "Gambler's Fallacy", isCorrect: false },
        { id: "bc-go4", label: "Hindsight Bias", isCorrect: false },
      ],
      educationalWhy: "Recognizing the initial anchor enables you to reset the conversation around market objective data.",
      xpReward: 30,
      coinReward: 10,
    },
    yourLifeChallenge: {
      id: "ylc-grad-counter-pitch",
      title: "The 3-Point Value Scripting Exercise",
      instruction: "Write down 3 specific quantifiable outcomes or strengths you bring to your current job or next career opportunity. Read them out loud with calm, steady posture.",
      contextWhy: "Verbalizing your value aloud trains neurological confidence and reduces salary anxiety.",
      durationMinutes: 5,
      verificationQuestion: "Did you write and practice your 3-point value proposition?",
      reflectionPrompt: "How did practicing the value points change your self-assurance?",
    },
    journalPrompts: [
      "Have you ever hesitated to ask for what your work was worth?",
      "What is the single strongest skill you bring to any team?",
      "How will you handle your next negotiation with calm data?",
    ],
    suggestedReflectionTemplate:
      "Today I learned that negotiating professionally isn't greedy—it demonstrates maturity and self-worth. Backing up my value with facts removes emotional anxiety.",
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. 35-YEAR-OLD PROFESSIONAL / CORPORATE MANAGER SCENARIOS
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "pw-prof-meeting-burnout",
    title: "The Back-to-Back Meeting Trap & Strategic Delegation",
    universalSkill: "Problem-solving",
    difficultyLevel: 4,
    estimatedMinutes: 8,
    tags: {
      skill: "Problem-solving",
      difficulty: 4,
      ageSuitability: "18+",
      lifeContext: ["Professional", "Employee", "Business owner"],
      interests: ["Career", "Leadership", "Everyday life"],
      format: "scenario_workout",
      estimatedDurationMin: 8,
      realLifeApplication: true,
      safetyCategory: "general_adult",
      culturalGrounding: "Universal_Global",
    },
    coverEmoji: "💼",
    coverIllustration: "workplace",
    scenarioNarrative:
      "You manage a cross-functional department. Your calendar has 7.5 hours of back-to-back meetings every day. You find yourself answering operational emails and doing critical strategic thinking between 10 PM and 1 AM, leading to chronic exhaustion and irritability.",
    situationAnalysis: {
      coreDilemma: "Confusing meeting attendance with effective leadership and execution.",
      hiddenTrap: "The 'I must be in every room' illusion causing cognitive overload and bottlenecking the team.",
      cognitivePrinciple: "Eisenhower Matrix Triage & Asynchronous Decision Systems.",
    },
    decisionPrompt: "What is the structural solution to reclaim executive bandwidth?",
    decisionOptions: [
      {
        id: "opt-prof-meet-1",
        letter: "A",
        text: "Drink more caffeine, sleep 4 hours a night, and push through until the quarter ends.",
        thinkingStyle: "Burnout Hero Fallacy",
        isRecommended: false,
        consequences: "Cognitive performance plummets, decision quality deteriorates, and health suffers.",
        brainExplanation: "Chronic sleep restriction impairs executive functioning, emotional regulation, and working memory.",
      },
      {
        id: "opt-prof-meet-2",
        letter: "B",
        text: "Audit your calendar: decline meetings without clear agendas, delegate 4 recurring operational updates to junior leads with clear decision boundaries, and block 2 hours of daily uninterrupted deep work.",
        thinkingStyle: "Systemic Delegation & Boundary Architecture",
        isRecommended: true,
        consequences: "Reclaims 15+ hours weekly, empowers team members to grow, and elevates your strategic impact.",
        brainExplanation: "Prefrontal focus requires dedicated blocks of low-interruption time to synthesize complex systemic plans.",
      },
      {
        id: "opt-prof-meet-3",
        letter: "C",
        text: "Attend all meetings but keep your camera off and secretly work on spreadsheets during calls.",
        thinkingStyle: "Divided Attention Illusion",
        isRecommended: false,
        consequences: "Poor meeting contributions and errors in your spreadsheets due to cognitive split.",
        brainExplanation: "Divided attention creates continuous task-switching overhead, leaving both tasks half-done.",
      },
      {
        id: "opt-prof-meet-4",
        letter: "D",
        text: "Cancel all company meetings unilaterally without telling leadership.",
        thinkingStyle: "Destructive Defiance",
        isRecommended: false,
        consequences: "Breaks organizational alignment and creates friction with stakeholders.",
        brainExplanation: "Extreme pendulum swings replace one dysfunction with another.",
      },
    ],
    brainInsightTakeaway: "A leader's highest contribution is not attending every meeting, but ensuring the right decisions happen without them.",
    neuroscienceRationale:
      "Executive decision fatigue sets in rapidly after 4 hours of continuous social interaction. Dedicated deep work buffers cognitive vitality.",
    relatedBrainChallenge: {
      id: "bc-prof-eisenhower",
      title: "Eisenhower Priority Matrix Triage",
      category: "Executive Decisions",
      subcategory: "Priority Triage",
      difficulty: "advanced",
      type: "critical_scenario",
      estimatedTimeSec: 45,
      instruction: "Categorize the task that should be delegated immediately.",
      cognitiveSkill: "Strategic Triage",
      question: "Which type of task should a senior manager DELEGATE first according to cognitive leadership principles?",
      options: [
        { id: "bc-po1", label: "Urgent but Not Important tasks (routine status reporting, repetitive scheduling)", isCorrect: true },
        { id: "bc-po2", label: "Important and Urgent core crises", isCorrect: false },
        { id: "bc-po3", label: "Long-term organizational strategy", isCorrect: false },
        { id: "bc-po4", label: "Core team performance reviews", isCorrect: false },
      ],
      educationalWhy: "Delegating urgent non-core tasks builds team capability while protecting managerial prefrontal bandwidth.",
      xpReward: 30,
      coinReward: 10,
    },
    yourLifeChallenge: {
      id: "ylc-prof-deep-block",
      title: "The 90-Minute Unbreakable Focus Block",
      instruction: "Look at your calendar for tomorrow. Block out a 90-minute focus window labeled 'STRATEGIC FOCUS'. Reject or delegate any non-critical meeting invite during this window.",
      contextWhy: "Protecting uninterrupted focus blocks conditions executive authority and guards against burnout.",
      durationMinutes: 5,
      verificationQuestion: "Did you schedule and protect your 90-minute strategic block?",
      reflectionPrompt: "What single high-value task will you execute in that focus block?",
    },
    journalPrompts: [
      "Which recurring meeting on your calendar currently provides the lowest real value?",
      "Who on your team is ready for you to delegate more responsibility to?",
      "How does mental exhaustion distort your daily patience and decision clarity?",
    ],
    suggestedReflectionTemplate:
      "Today I recognized that busyness is not effectiveness. By blocking sacred deep work and empowering my team to own updates, I protect the clarity needed for high-stakes leadership.",
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 4. 48-YEAR-OLD ENTREPRENEUR / BUSINESS FOUNDER SCENARIOS
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "pw-entr-cashflow-emergency",
    title: "Supplier Payment Delay & Payroll Cash Flow Crunch",
    universalSkill: "Adaptability",
    difficultyLevel: 5,
    estimatedMinutes: 9,
    tags: {
      skill: "Adaptability",
      difficulty: 5,
      ageSuitability: "18+",
      lifeContext: ["Entrepreneur", "Business owner"],
      interests: ["Business", "Money", "Leadership"],
      format: "scenario_workout",
      estimatedDurationMin: 9,
      realLifeApplication: true,
      safetyCategory: "general_adult",
      culturalGrounding: "Nigerian_African",
    },
    coverEmoji: "🚀",
    coverIllustration: "finance",
    scenarioNarrative:
      "You run a distribution business with 18 employees. Today is the 25th of the month. Your largest corporate client (who owes ₦8.5M) informs you their accounting system is frozen and payment will be delayed by 20 days. Payroll of ₦4.2M is due in 5 days, and your bank balance is ₦2.1M.",
    situationAnalysis: {
      coreDilemma: "Managing an acute liquidity deficit without destroying staff morale or burning supplier bridges.",
      hiddenTrap: "Panic-borrowing at predator interest rates or hiding the truth from team until payroll day.",
      cognitivePrinciple: "Financial Triage, Transparent Leadership & Tactical Liquidity Structuring.",
    },
    decisionPrompt: "What is the optimal strategic triage approach?",
    decisionOptions: [
      {
        id: "opt-entr-cf-1",
        letter: "A",
        text: "Take a 25% monthly interest emergency loan from an aggressive informal lender to cover payroll silently.",
        thinkingStyle: "Panic Debt Trap",
        isRecommended: false,
        consequences: "Cripples company profitability for months and creates existential debt risk.",
        brainExplanation: "Acute financial fear triggers extreme short-term relief seeking at the expense of systemic survival.",
      },
      {
        id: "opt-entr-cf-2",
        letter: "B",
        text: "Execute a 3-step triage: (1) Offer the client a 4% immediate discount for same-week payment, (2) Offer key customers an advance inventory pre-order incentive for immediate cash, (3) Meet staff transparently to pay 60% immediately and balance on day 15.",
        thinkingStyle: "Systemic Liquidity Triage & Transparent Leadership",
        isRecommended: true,
        consequences: "Preserves company creditworthiness, brings in fast cash inflows, and maintains team trust through transparent accountability.",
        brainExplanation: "Divergent problem-solving evaluates multiple non-debt liquidity levers under high constraint.",
      },
      {
        id: "opt-entr-cf-3",
        letter: "C",
        text: "Turn off your phone on payday and wait for the big client to pay whenever they are ready.",
        thinkingStyle: "Ostrich Avoidance",
        isRecommended: false,
        consequences: "Immediate staff mutiny, loss of key talent, and permanent reputation destruction.",
        brainExplanation: "Amygdala avoidance reflex masquerading as 'waiting for things to clear up.'",
      },
      {
        id: "opt-entr-cf-4",
        letter: "D",
        text: "Immediately lay off half the company without notice.",
        thinkingStyle: "Disproportionate Panic Reaction",
        isRecommended: false,
        consequences: "Destroys operational capacity for a temporary 20-day timing glitch.",
        brainExplanation: "Catastrophizing turns a temporary working capital cycle delay into permanent structural damage.",
      },
    ],
    brainInsightTakeaway: "Cash flow crises test leadership composure. Never let a temporary timing problem force a permanent destructive decision.",
    neuroscienceRationale:
      "When financial survival stress hits, systematic multi-option generation forces the prefrontal cortex to bypass tunnel-vision panic pathways.",
    relatedBrainChallenge: {
      id: "bc-entr-liquidity",
      title: "Working Capital Working Gap Calculation",
      category: "Executive Decisions",
      subcategory: "Cash Flow Cycles",
      difficulty: "advanced",
      type: "critical_scenario",
      estimatedTimeSec: 50,
      instruction: "Calculate the fastest non-debt cash generation mechanism.",
      cognitiveSkill: "Cash Conversion Optimization",
      question: "If offering a 3% early settlement discount brings in ₦8,000,000 in 48 hours vs borrowing at 18% monthly interest, what is the smarter cash flow move?",
      options: [
        { id: "bc-co1", label: "The 3% discount (saves massive interest and eliminates debt compounding)", isCorrect: true },
        { id: "bc-co2", label: "Borrowing at 18% to preserve the 3% discount", isCorrect: false },
        { id: "bc-co3", label: "Closing the company", isCorrect: false },
        { id: "bc-co4", label: "Ignoring both", isCorrect: false },
      ],
      educationalWhy: "Early payment discounts trade a small margin percentage for zero balance-sheet risk and immediate solvency.",
      xpReward: 30,
      coinReward: 10,
    },
    yourLifeChallenge: {
      id: "ylc-entr-receivables",
      title: "The 3-Tier Receivables Follow-Up Sprint",
      instruction: "Review all outstanding invoices or payments owed to you or your business. Call or message the top 2 debtors with a polite, specific, and structured payment settlement proposal today.",
      contextWhy: "Direct follow-up on receivables converts theoretical revenue into tangible working capital.",
      durationMinutes: 10,
      verificationQuestion: "Did you contact your top outstanding debtors with a clear timeline?",
      reflectionPrompt: "What system will you put in place to prevent receivables delays next month?",
    },
    journalPrompts: [
      "What is your biggest financial bottleneck right now?",
      "How do you keep your mind calm and analytical when money pressures rise?",
      "What is one proactive cash buffer policy you will implement this quarter?",
    ],
    suggestedReflectionTemplate:
      "Today I learned that cash flow bottlenecks require creative multi-lever problem solving, not panic debt. Leading transparently with verified facts protects both the business and team trust.",
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 5. 60-YEAR-OLD RETIREE / SENIOR MENTOR SCENARIOS (DIGNIFIED, EMPOWERING)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "pw-senior-legacy-investment",
    title: "The High-Yield Family Investment Pitch & Risk Appraisal",
    universalSkill: "Self-awareness",
    difficultyLevel: 4,
    estimatedMinutes: 8,
    tags: {
      skill: "Self-awareness",
      difficulty: 4,
      ageSuitability: "18+",
      lifeContext: ["Retired", "Business owner", "Educator"],
      interests: ["Money", "Family", "Leadership", "Everyday life"],
      format: "scenario_workout",
      estimatedDurationMin: 8,
      realLifeApplication: true,
      safetyCategory: "general_adult",
      culturalGrounding: "Universal_Global",
    },
    coverEmoji: "👑",
    coverIllustration: "finance",
    scenarioNarrative:
      "A younger relative whom you love dearly brings you an 'exclusive, guaranteed 40% annual return' opportunity in crypto and foreign exchange trading. They urge you to invest ₦5,000,000 of your retirement pension savings immediately before the investment pool closes this Friday.",
    situationAnalysis: {
      coreDilemma: "Balancing family affection and desire to support young relatives against capital preservation and scam risk.",
      hiddenTrap: "Emotional affinity fraud: using emotional kinship to bypass standard financial due diligence.",
      cognitivePrinciple: "Affinity Bias Detection & Capital Preservation Heuristics.",
    },
    decisionPrompt: "What is your wisest course of action?",
    decisionOptions: [
      {
        id: "opt-senior-inv-1",
        letter: "A",
        text: "Transfer the ₦5,000,000 immediately to show love, support, and avoid disappointing the relative.",
        thinkingStyle: "Affinity Bias Compliance",
        isRecommended: false,
        consequences: "High probability of total capital loss, devastating your retirement security and straining family relations forever.",
        brainExplanation: "Oxytocin and familial empathy override prefrontal critical risk evaluation mechanisms.",
      },
      {
        id: "opt-senior-inv-2",
        letter: "B",
        text: "Thank them warmly for thinking of you, explain your strict retirement rule of 'zero unverified speculative risk', and offer to review the regulatory licensing together while offering a tiny gift amount if they need support.",
        thinkingStyle: "Principled Affection with Uncompromising Boundaries",
        isRecommended: true,
        consequences: "Protects your life savings, models disciplined financial wisdom for the relative, and preserves the relationship.",
        brainExplanation: "Metacognitive self-awareness separates emotional warmth for a family member from objective financial risk.",
      },
      {
        id: "opt-senior-inv-3",
        letter: "C",
        text: "Angrily yell at them and accuse them of trying to rob your pension.",
        thinkingStyle: "Hostile Overreaction",
        isRecommended: false,
        consequences: "Creates deep family rift; the relative may simply be misinformed by scammers rather than malicious.",
        brainExplanation: "Threat reflex generates defensive aggression rather than instructive mentorship.",
      },
      {
        id: "opt-senior-inv-4",
        letter: "D",
        text: "Invest half (₦2,500,000) as a compromise.",
        thinkingStyle: "Illogical Compromise",
        isRecommended: false,
        consequences: "You still lose ₦2,500,000 to an obvious speculative trap.",
        brainExplanation: "Splitting the difference on a fundamentally flawed premise does not reduce systemic risk.",
      },
    ],
    brainInsightTakeaway: "Saying no to risky financial schemes is the highest form of love and wisdom you can model for the next generation.",
    neuroscienceRationale:
      "Cognitive longevity thrives on high metacognitive boundaries: distinguishing emotional warmth from analytical decision-making preserves financial peace.",
    relatedBrainChallenge: {
      id: "bc-senior-scam",
      title: "Guaranteed Return Risk Indicator",
      category: "Critical Thinking",
      subcategory: "Risk Detection",
      difficulty: "intermediate",
      type: "critical_scenario",
      estimatedTimeSec: 40,
      instruction: "Identify the primary warning sign of fraudulent investments.",
      cognitiveSkill: "Financial Risk Heuristics",
      question: "In legitimate financial economics, what is the relationship between 'Guaranteed High Returns' and 'Risk'?",
      options: [
        { id: "bc-so1", label: "There is no such thing as guaranteed high returns without high risk of total loss", isCorrect: true },
        { id: "bc-so2", label: "Guaranteed 40% returns are standard and safe for pensions", isCorrect: false },
        { id: "bc-so3", label: "Family members can magically eliminate market risk", isCorrect: false },
        { id: "bc-so4", label: "Crypto eliminates all regulatory requirements", isCorrect: false },
      ],
      educationalWhy: "Understanding fundamental risk-return symmetry prevents emotional affinity traps.",
      xpReward: 30,
      coinReward: 10,
    },
    yourLifeChallenge: {
      id: "ylc-senior-mentorship",
      title: "The Wisdom Synthesis & Sharing Exercise",
      instruction: "Think of one critical life lesson about money, health, or patience that took you decades to learn. Write it in 2-3 clear sentences and share it with a younger person in your circle today.",
      contextWhy: "Synthesizing life wisdom stimulates neural associative pathways and deepens community purpose.",
      durationMinutes: 7,
      verificationQuestion: "Did you write and share your core life lesson today?",
      reflectionPrompt: "How did the recipient respond to your wisdom insight?",
    },
    journalPrompts: [
      "What is the single most valuable financial lesson you've learned in your lifetime?",
      "How do you maintain loving boundaries with family members who have differing views on money?",
      "What legacy of wisdom do you wish to leave behind?",
    ],
    suggestedReflectionTemplate:
      "Today I reflected that true wisdom is the ability to love unconditionally while keeping firm, rational boundaries. Protecting what you have built allows you to bless others sustainably.",
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 6. CREATIVITY & LATERAL THINKING (UNIVERSAL ALL AGES)
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: "pw-universal-creativity-constraint",
    title: "Zero Budget Marketing & Guerrilla Community Outreach",
    universalSkill: "Creativity",
    difficultyLevel: 3,
    estimatedMinutes: 7,
    tags: {
      skill: "Creativity",
      difficulty: 3,
      ageSuitability: "all",
      lifeContext: ["Student", "University student", "Employee", "Entrepreneur", "Business owner", "Professional", "Educator", "Other"],
      interests: ["Creativity", "Business", "Social issues", "Everyday life"],
      format: "scenario_workout",
      estimatedDurationMin: 7,
      realLifeApplication: true,
      safetyCategory: "all_audiences",
      culturalGrounding: "Nigerian_African",
    },
    coverEmoji: "💡",
    coverIllustration: "mindset",
    scenarioNarrative:
      "You are launching a community literacy club / new service. You have exactly ₦0 for paid social media ads or flyers. You have 7 days to get 50 enthusiastic participants to attend the opening session.",
    situationAnalysis: {
      coreDilemma: "Achieving high-impact traction under zero-capital constraints.",
      hiddenTrap: "Assuming that lack of money means lack of distribution.",
      cognitivePrinciple: "Divergent Thinking, Incentive Alignment & Organic Grassroots Loops.",
    },
    decisionPrompt: "What is the most creative lateral strategy?",
    decisionOptions: [
      {
        id: "opt-creat-1",
        letter: "A",
        text: "Wait until you save ₦100,000 for billboard and paid ads before doing anything.",
        thinkingStyle: "Resource Barrier Mindset",
        isRecommended: false,
        consequences: "Project stalls indefinitely while momentum dies.",
        brainExplanation: "Fixed-mindset thinking equates progress with capital availability rather than ingenuity.",
      },
      {
        id: "opt-creat-2",
        letter: "B",
        text: "Partner with 3 local community leaders/teachers who already have trusted access to the target audience, offer a free workshop on a high-demand topic, and create a 'Bring a Friend' referral contest.",
        thinkingStyle: "Lateral Collaboration & Existing Network Leverage",
        isRecommended: true,
        consequences: "Generates high-trust organic word-of-mouth and fills the room in under 5 days.",
        brainExplanation: "Divergent thinking connects existing unutilized social capital to create win-win value.",
      },
      {
        id: "opt-creat-3",
        letter: "C",
        text: "Spam 500 WhatsApp groups with unsolicited generic broadcast messages.",
        thinkingStyle: "Aggressive Spamming",
        isRecommended: false,
        consequences: "Gets your number reported and destroys your brand credibility.",
        brainExplanation: "Lazy low-empathy distribution fails because it ignores recipient value.",
      },
      {
        id: "opt-creat-4",
        letter: "D",
        text: "Stand on a busy street corner shouting into a megaphone.",
        thinkingStyle: "Low-Conversion Exhaustion",
        isRecommended: false,
        consequences: "High physical fatigue with virtually zero qualified sign-ups.",
        brainExplanation: "Random effort without audience targeting wastes physical and mental energy.",
      },
    ],
    brainInsightTakeaway: "Constraints are not blockers; they are the exact catalysts that spark true lateral creativity.",
    neuroscienceRationale:
      "When standard resource pathways are blocked, the brain's default mode network engages in combinatorial synthesis, linking unrelated assets into novel solutions.",
    relatedBrainChallenge: {
      id: "bc-creat-reframe",
      title: "Constraint Inversion Exercise",
      category: "Critical Thinking",
      subcategory: "Divergent Thinking",
      difficulty: "intermediate",
      type: "critical_scenario",
      estimatedTimeSec: 40,
      instruction: "Identify the asset created by constraint.",
      cognitiveSkill: "Lateral Reframing",
      question: "When you have zero advertising budget, what unique advantage do you possess over a big corporation?",
      options: [
        { id: "bc-co1", label: "High agility, authentic human connection, and ability to build personal grassroots relationships", isCorrect: true },
        { id: "bc-co2", label: "More television commercial time", isCorrect: false },
        { id: "bc-co3", label: "Ability to hire 50 PR agencies", isCorrect: false },
        { id: "bc-co4", label: "Zero advantages at all", isCorrect: false },
      ],
      educationalWhy: "Reframing a limitation into an agility advantage unlocks novel execution angles.",
      xpReward: 30,
      coinReward: 10,
    },
    yourLifeChallenge: {
      id: "ylc-creat-zero-cost",
      title: "The Zero-Cost Solution Challenge",
      instruction: "Identify one problem you've been delaying because you thought you needed money to fix it. Spend 5 minutes brainstorming 3 creative ways to solve it today using only existing relationships, skills, or available free tools.",
      contextWhy: "Forces the brain to practice asset mapping under tight parameters.",
      durationMinutes: 5,
      verificationQuestion: "Did you generate 3 zero-cost solutions to your obstacle?",
      reflectionPrompt: "Which of the 3 zero-cost ideas will you test first?",
    },
    journalPrompts: [
      "What is one goal you've postponed due to 'lack of resources'?",
      "How can you leverage existing relationships to create mutual value?",
      "What creative spark came to you during today's exercise?",
    ],
    suggestedReflectionTemplate:
      "Today I realized that lack of money is never the real constraint—lack of creative resourcefulness is. When I mapped out existing relationships and assets, solutions appeared immediately.",
  },
];

/**
 * Returns all personalized mental workouts in the repository.
 */
export function getAllPersonalizedWorkouts(): PersonalizedMentalWorkout[] {
  return PERSONALIZED_WORKOUTS_REPOSITORY;
}

/**
 * Find workout by ID.
 */
export function getPersonalizedWorkoutById(id: string): PersonalizedMentalWorkout | undefined {
  return PERSONALIZED_WORKOUTS_REPOSITORY.find((w) => w.id === id);
}
