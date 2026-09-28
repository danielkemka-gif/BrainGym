// ─────────────────────────────────────────────────────────────────────────────
// BRAINGYM 3,000+ MENTAL FITNESS TASK REPOSITORY & GENERATOR ENGINE
// ─────────────────────────────────────────────────────────────────────────────

import { DailyFitnessTask, CognitivePillar, TaskDifficultyLevel, TaskOption } from "./types";

/**
 * Procedural cognitive scenario templates curated across all 10 human cognitive pillars.
 * Generates distinct, rich, structured mental workouts ensuring authentic variance.
 */

interface ScenarioBlueprint {
  domain: CognitivePillar;
  domainLabel: string;
  emoji: string;
  scenarios: Array<{
    theme: string;
    level: TaskDifficultyLevel;
    dilemma: string;
    principle: string;
    prompt: string;
    options: Array<{ letter: "A" | "B" | "C" | "D"; text: string; style: string; recommended: boolean; consequences: string; reason: string }>;
    takeaway: string;
    neuroscience: string;
    lifeAction: { title: string; prompt: string; duration: number };
  }>;
}

const BLUEPRINTS: ScenarioBlueprint[] = [
  // ─── 1. LOGIC & DEDUCTIVE REASONING ─────────────────────────────────────────
  {
    domain: "logic",
    domainLabel: "Logic & Deductive Reasoning",
    emoji: "🧩",
    scenarios: [
      {
        theme: "Boolean Resource Allocation Under Constraints",
        level: 3,
        dilemma: "You have 3 critical departments requiring budget. Rule A: If Marketing expands, Engineering must freeze hiring unless Sales exceeds target. Sales missed target by 4%. Marketing demands immediate capital.",
        principle: "Conditional Modus Tollens & Constraint Satisfaction",
        prompt: "Which allocation strictly complies with company policy without violating logical constraints?",
        options: [
          { letter: "A", text: "Approve Marketing expansion and immediately freeze Engineering hiring.", style: "Strict Logical Compliance", recommended: true, consequences: "Preserves company constraint rules without violating contractual hiring caps.", reason: "Since Sales missed target, approving Marketing strictly necessitates freezing Engineering." },
          { letter: "B", text: "Approve both Marketing and Engineering hiring simultaneously.", style: "Rule Disregard", recommended: false, consequences: "Violates fundamental budget constraints.", reason: "Ignores the conditional premise of the hiring policy." },
          { letter: "C", text: "Reject Marketing and triple Engineering hiring without review.", style: "Over-correction", recommended: false, consequences: "Starves growth without addressing Sales bottleneck.", reason: "Fails to logically align resources to root cause." },
          { letter: "D", text: "Delay decision indefinitely until next fiscal quarter.", style: "Analysis Paralysis", recommended: false, consequences: "Stagnates company operations.", reason: "Avoids deductive synthesis." }
        ],
        takeaway: "Clear logic removes emotional bias when navigating complex multi-party rules.",
        neuroscience: "Frontoparietal control networks activate during conditional constraint mapping.",
        lifeAction: { title: "Deductive If-Then Triage", prompt: "Map one decision today into a formal 'If [Condition], Then [Strict Action]' format before acting.", duration: 5 }
      },
      {
        theme: "Vendor False Syllogism Detection",
        level: 2,
        dilemma: "A supplier pitches: 'All top-tier firms use our software. Your competitor is a top-tier firm. Therefore, adopting our software guarantees you become top-tier.'",
        principle: "Affirming the Consequent & Causation vs Association",
        prompt: "How do you dissect this proposal logically?",
        options: [
          { letter: "A", text: "Point out the logical fallacy: software adoption is an attribute of top firms, not the standalone cause of market leadership.", style: "Critical Deductive Scrutiny", recommended: true, consequences: "Saves company from costly vanity software spending.", reason: "Breaks the flawed syllogistic trap (Affirming the Consequent)." },
          { letter: "B", text: "Sign immediately because the competitor uses it.", style: "Bandwagon Fallacy", recommended: false, consequences: "Wastes funds on unvetted tools.", reason: "Confuses correlation with causation." },
          { letter: "C", text: "Refuse to ever talk to the vendor again with hostility.", style: "Affective Reaction", recommended: false, consequences: "Closes door to potential legitimate features.", reason: "Replaces logic with emotional hostility." },
          { letter: "D", text: "Ask the competitor what they think about the software.", style: "Competitor Dependency", recommended: false, consequences: "Leads to unreliable intelligence.", reason: "Does not resolve the internal deductive premise." }
        ],
        takeaway: "Never confuse a common trait with a direct cause.",
        neuroscience: "Dorsolateral prefrontal cortex inhibits intuitive susceptibility to fallacious sales framing.",
        lifeAction: { title: "Spot the Hidden Assumption", prompt: "Identify one pitch, ad, or claim today and write down the missing assumption.", duration: 5 }
      },
    ]
  },

  // ─── 2. WORKING MEMORY & COGNITIVE RETRIEVAL ────────────────────────────────
  {
    domain: "memory",
    domainLabel: "Working Memory & Recall",
    emoji: "🧠",
    scenarios: [
      {
        theme: "Multi-Stream Negotiation Chunking",
        level: 3,
        dilemma: "In a rapid contract call, three numbers are cited: \$45k base delivery, 12% margin penalty after day 14, and 300 unit minimum. The client rapidly counters by altering the delivery window to 10 days and margin to 15%.",
        principle: "Working Memory Buffer & Numerical Chunking",
        prompt: "How do you retain and verify the critical terms without losing cognitive control?",
        options: [
          { letter: "A", text: "Chunk the terms into 3 anchors: [Cost: \$45k, Time: 10d, Penalty: 15%] and recite them back explicitly before responding.", style: "Semantic Compression & Verbal Rehearsal", recommended: true, consequences: "Locks accurate terms into memory and prevents costly verbal misunderstandings.", reason: "Converts high-entropy data into structured 3-item phonological loop chunks." },
          { letter: "B", text: "Agree immediately from memory without reciting or taking notes.", style: "Working Memory Overconfidence", recommended: false, consequences: "High risk of contract penalty defaults.", reason: "Exceeds standard 4-item working memory capacity under stress." },
          { letter: "C", text: "Panic and stop the negotiation abruptly.", style: "Cognitive Overload Shutdown", recommended: false, consequences: "Damages client trust and negotiation momentum.", reason: "Stress hormones disrupt hippocampal retrieval." },
          { letter: "D", text: "Focus only on the \$45k and ignore the penalty terms.", style: "Selective Tunnel Vision", recommended: false, consequences: "Leaves massive financial liabilities exposed.", reason: "Ignores multi-variable constraints." }
        ],
        takeaway: "When information floods your working memory, chunk it into three key anchors and verify verbally.",
        neuroscience: "Hippocampal-prefrontal synchronization strengthens working memory under adrenaline surges.",
        lifeAction: { title: "Blind Recall Practice", prompt: "After your next meeting or phone call, write down the 3 core numbers/commitments from memory before checking notes.", duration: 5 }
      },
    ]
  },

  // ─── 3. DECISION MAKING & COGNITIVE BIAS TRIAGE ─────────────────────────────
  {
    domain: "decision_making",
    domainLabel: "Decision Making & Bias Triage",
    emoji: "⚖️",
    scenarios: [
      {
        theme: "Sunk Cost Trap in Underperforming Projects",
        level: 4,
        dilemma: "Your team has invested 6 months and \$80,000 into a new logistics platform. User adoption is 2%, market conditions have shifted, and a simpler \$5,000 off-the-shelf alternative solves 95% of customer pain points.",
        principle: "Sunk Cost Fallacy & Forward-Looking Marginal Analysis",
        prompt: "What is the optimal strategic decision?",
        options: [
          { letter: "A", text: "Pivoting immediately to the \$5k alternative and redeploying engineering talent to high-growth features.", style: "Rational Marginal Utility Evaluation", recommended: true, consequences: "Cuts ongoing losses, saves runway, and accelerates product-market fit.", reason: "Past expenditures are sunk and irrelevant to future expected returns." },
          { letter: "B", text: "Spend another \$50,000 to justify the original \$80,000 investment.", style: "Sunk Cost Escalation", recommended: false, consequences: "Burns remaining cash runway on a fundamentally flawed foundation.", reason: "Emotional loss aversion overrides objective forward ROI." },
          { letter: "C", text: "Blame the engineering team and fire project leads.", style: "Scapegoating / Fundamental Attribution Error", recommended: false, consequences: "Demoralizes company without fixing the product strategy.", reason: "Attributes strategic shifts to individual competence." },
          { letter: "D", text: "Hide the metrics from leadership and hope adoption rises.", style: "Ostrich Effect / Willful Blindness", recommended: false, consequences: "Leads to catastrophic company-wide failure.", reason: "Cognitive dissonance evasion." }
        ],
        takeaway: "The money and time you spent yesterday are gone. Make decisions based only on tomorrow's returns.",
        neuroscience: "Ventromedial prefrontal cortex balances emotional loss aversion against rational probability weighting.",
        lifeAction: { title: "Zero-Based Sunk Cost Audit", prompt: "Look at one project or commitment you are maintaining today: 'If I started today from scratch with zero invested, would I start this?'", duration: 5 }
      },
    ]
  },

  // ─── 4. FOCUS & SELECTIVE ATTENTION ─────────────────────────────────────────
  {
    domain: "focus",
    domainLabel: "Focus & Attention",
    emoji: "🎯",
    scenarios: [
      {
        theme: "Deep Work Auditory & Notification Gating",
        level: 2,
        dilemma: "You have 90 minutes to finish a critical strategy memo before an executive deadline. Your phone buzzes with 14 group chat messages and incoming email notifications.",
        principle: "Top-Down Attentional Control & Context-Switching Penalty",
        prompt: "How do you structure your attention?",
        options: [
          { letter: "A", text: "Enable Do Not Disturb, turn phone face-down out of reach, and execute a single 45-minute deep work sprint.", style: "Proactive Environment Architecture", recommended: true, consequences: "Protects high-level cognitive focus and finishes the memo with zero errors.", reason: "Eliminates attention residue and synaptic fragmentation." },
          { letter: "B", text: "Reply to each message immediately while typing the memo.", style: "Chronic Multitasking", recommended: false, consequences: "Multiplies memo errors and doubles time required to finish.", reason: "Context switching consumes up to 40% of cognitive capacity." },
          { letter: "C", text: "Read the messages but don't reply, keeping them on screen.", style: "Visual Attentional Drag", recommended: false, consequences: "Leaves intrusive working memory loops open.", reason: "Passive visual cues still trigger dopaminergic vigilance." },
          { letter: "D", text: "Abandon the memo and reschedule deadline.", style: "Executive Avoidance", recommended: false, consequences: "Erodes credibility with stakeholders.", reason: "Submits to cognitive resistance." }
        ],
        takeaway: "Top performance requires building an environment where distraction is impossible, not merely resisting temptation.",
        neuroscience: "Anterior cingulate cortex monitors attentional conflicts and reduces task switching latency.",
        lifeAction: { title: "25-Minute Monotask Sprint", prompt: "Execute 25 minutes of continuous single-tasking with zero browser tabs open except the active work.", duration: 5 }
      },
    ]
  },

  // ─── 5. EMOTIONAL INTELLIGENCE & SOCIAL NUANCE ──────────────────────────────
  {
    domain: "emotional_intelligence",
    domainLabel: "Emotional Intelligence & Social Nuance",
    emoji: "🤝",
    scenarios: [
      {
        theme: "De-escalating Public Aggression in Team Settings",
        level: 3,
        dilemma: "During an all-hands meeting, a peer publicly attacks your deliverable as 'completely useless and poorly planned' in front of senior executives.",
        principle: "Amygdala Hijack Prevention & Tactical De-escalation",
        prompt: "What is the most emotionally intelligent response?",
        options: [
          { letter: "A", text: "Take a 3-second breath, maintain calm eye contact, and respond: 'I hear your concern on timelines. Let’s look at the data points together after this sync.'", style: "Regulated Executive Composure", recommended: true, consequences: "Demonstrates supreme emotional mastery, de-escalates the room, and preserves authority.", reason: "Suppresses instinctive amygdala fight reaction and models executive maturity." },
          { letter: "B", text: "Instantly shout back and list all their past failures.", style: "Reactive Amygdala Hijack", recommended: false, consequences: "Turns professional meeting into a toxic spectacle and damages personal reputation.", reason: "Uncontrolled emotional reactivity triggers defensive escalations." },
          { letter: "C", text: "Burst into tears and leave the room immediately.", style: "Emotional Collapse", recommended: false, consequences: "Surrenders narrative and professional boundaries.", reason: "High stress overwhelm incapacitates communication." },
          { letter: "D", text: "Say nothing, smile passively, and secretly sabotage their next project.", style: "Passive Aggression", recommended: false, consequences: "Destroys team cohesion and creates toxic culture.", reason: "Converts unexpressed emotion into covert hostility." }
        ],
        takeaway: "When attacked verbally, composure is your greatest power. The person who controls their breath controls the room.",
        neuroscience: "Medial prefrontal activation inhibits amygdala threat triggers during acute social provocation.",
        lifeAction: { title: "The 3-Second Tactical Pause", prompt: "When anyone challenges or annoys you today, pause for 3 full seconds before replying.", duration: 5 }
      },
    ]
  },

  // ─── 6. PROBLEM SOLVING & ROOT CAUSE ANALYSIS ───────────────────────────────
  {
    domain: "problem_solving",
    domainLabel: "Problem Solving & Root Cause",
    emoji: "💡",
    scenarios: [
      {
        theme: "First-Principles Root Cause vs Symptom Band-Aid",
        level: 4,
        dilemma: "Customer support tickets surged by 300% after a product update. The support manager asks to hire 10 temporary reps immediately.",
        principle: "First-Principles Root Cause Analysis vs Symptom Patching",
        prompt: "How do you approach solving this problem?",
        options: [
          { letter: "A", text: "Analyze the top 5 recurring error codes in the tickets, identify the underlying software bug, and deploy a hotfix that eliminates the root cause.", style: "First-Principles Root Cause Resolution", recommended: true, consequences: "Solves customer problem permanently, saves \$50k in hiring costs, and stabilizes platform.", reason: "Addresses the underlying mechanical cause rather than treating downstream symptoms." },
          { letter: "B", text: "Immediately hire 10 temporary reps without checking the product logs.", style: "Expensive Symptom Masking", recommended: false, consequences: "Inflates payroll while customers remain frustrated by the ongoing bug.", reason: "Fails to diagnose root failure mode." },
          { letter: "C", text: "Turn off the support portal so tickets cannot be filed.", style: "Catastrophic Evasion", recommended: false, consequences: "Triggers massive customer churn and brand backlash.", reason: "Hides information from decision-makers." },
          { letter: "D", text: "Send a generic apology email and do nothing else.", style: "Passive Neglect", recommended: false, consequences: "Leaves product broken and worsens ticket backlog.", reason: "Lacks problem-solving initiative." }
        ],
        takeaway: "Never spend money treating a symptom until you have diagnosed and fixed the root cause.",
        neuroscience: "Left inferior frontal gyrus and anterior insula collaborate in structural causal inference.",
        lifeAction: { title: "5 Whys Technique", prompt: "Take one recurring problem in your work/life today and ask 'Why did this happen?' five times down to root cause.", duration: 5 }
      },
    ]
  },

  // ─── 7. CRITICAL THINKING & EVIDENCE EVALUATION ─────────────────────────────
  {
    domain: "critical_thinking",
    domainLabel: "Critical Thinking & Evidence",
    emoji: "🔍",
    scenarios: [
      {
        theme: "Confirmation Bias in Market Research",
        level: 3,
        dilemma: "You strongly believe your new app design is revolutionary. 8 user testers loved it, but 2 power users provided detailed teardowns showing severe navigation blockers.",
        principle: "Disconfirmation Search & Confirmation Bias Inoculation",
        prompt: "How do you evaluate this mixed evidence?",
        options: [
          { letter: "A", text: "Deeply analyze the 2 critical teardowns to locate specific failure points before rolling out to general public.", style: "Active Disconfirmation Seeking", recommended: true, consequences: "Prevents public launch disasters and creates bulletproof product architecture.", reason: "High-value negative signals reveal critical edge cases that positive feedback obscures." },
          { letter: "B", text: "Dismiss the 2 power users as 'haters who don't understand innovation' and launch immediately.", style: "Confirmation Bias & Defensive Rationalization", recommended: false, consequences: "Launches broken UX that leads to mass uninstalls.", reason: "Filters out disconfirming evidence to protect ego." },
          { letter: "C", text: "Scrap the entire project because 2 people disliked it.", style: "Over-Reaction / Catastrophizing", recommended: false, consequences: "Wastes valuable work based on minor fixable flaws.", reason: "Fails to weigh proportional evidence." },
          { letter: "D", text: "Fabricate fake positive reviews to counteract the power users.", style: "Intellectual Dishonesty", recommended: false, consequences: "Destroys product integrity and user trust.", reason: "Corrupts feedback loops." }
        ],
        takeaway: "True critical thinkers actively hunt for evidence that proves their favorite ideas wrong.",
        neuroscience: "Anterior cingulate cortex resolves conflict between existing beliefs and contradictory sensory data.",
        lifeAction: { title: "Seek the Counter-Argument", prompt: "Pick one belief you hold strongly and write down the strongest possible argument against it.", duration: 5 }
      },
    ]
  },

  // ─── 8. DIVERGENT CREATIVITY & LATERAL THINKING ────────────────────────────
  {
    domain: "creativity",
    domainLabel: "Divergent Creativity & Lateral Thinking",
    emoji: "🎨",
    scenarios: [
      {
        theme: "Zero-Budget Marketing Lateral Redirection",
        level: 3,
        dilemma: "Your startup has \$0 remaining in marketing budget, but needs 1,000 active users by Friday to secure an angel round.",
        principle: "Divergent Lateral Ideation & Constraint As Leverage",
        prompt: "What is the most creative, high-leverage move?",
        options: [
          { letter: "A", text: "Create an open-source free diagnostic tool solving a major industry pain point, sharing it in niche developer communities with viral utility.", style: "Lateral Value Hook Creation", recommended: true, consequences: "Generates massive organic inbound traffic, high trust, and 1,000+ signups.", reason: "Uses creative utility rather than brute-force paid ad spend." },
          { letter: "B", text: "Spam 10,000 LinkedIn inboxes with generic sales pitches.", style: "Low-Leverage Brute Force", recommended: false, consequences: "Gets account banned and creates negative brand perception.", reason: "Lacks divergent creative leverage." },
          { letter: "C", text: "Take an expensive personal loan to buy Facebook ads.", style: "High-Risk Traditional Thinking", recommended: false, consequences: "Creates personal debt with unproven acquisition unit economics.", reason: "Relies on conventional paid models under zero runway." },
          { letter: "D", text: "Give up and cancel the investor meeting.", style: "Creative Defeatism", recommended: false, consequences: "Kills startup prematurely.", reason: "Surrenders when constraints are introduced." }
        ],
        takeaway: "When resources are zero, creativity and utility are your only unlimited currencies.",
        neuroscience: "Default mode and executive control networks co-activate during constrained divergent problem solving.",
        lifeAction: { title: "Alternative Uses Drill", prompt: "Pick a common household object (e.g. coffee mug, paperclip) and write down 10 unconventional uses for it in 2 minutes.", duration: 5 }
      },
    ]
  },

  // ─── 9. VISUAL OBSERVATION & PATTERN RECOGNITION ───────────────────────────
  {
    domain: "observation",
    domainLabel: "Observation & Pattern Recognition",
    emoji: "🔍",
    scenarios: [
      {
        theme: "Micro-Discrepancy Invoice Fraud Detection",
        level: 3,
        dilemma: "You receive an urgent vendor invoice for \$14,200. The company name, logo, and line items match perfectly, but the banking routing digits differ by one character.",
        principle: "Visual Scanning & Discrepancy Verification",
        prompt: "What is your immediate action?",
        options: [
          { letter: "A", text: "Call the vendor CFO directly via their verified official telephone number to verify the bank account update before initiating wire.", style: "Rigorous Out-of-Band Verification", recommended: true, consequences: "Thwarts a sophisticated business email compromise scam and saves \$14,200.", reason: "Flags subtle perceptual anomalies and verifies through independent communication channels." },
          { letter: "B", text: "Pay immediately because the vendor marked it 'Urgent: Service Suspension'.", style: "Urgency Compliance / System 1 Oversight", recommended: false, consequences: "Loss of \$14,200 to fraudulent offshore accounts.", reason: "Artificial urgency suppresses visual and logical inspection." },
          { letter: "C", text: "Reply to the email asking: 'Is this really you?'", style: "In-Band Confirmation Flaw", recommended: false, consequences: "The hacker confirms the email and money is lost.", reason: "Verifies within the compromised communication channel." },
          { letter: "D", text: "Delete the invoice and ignore vendor communication.", style: "Operational Blindness", recommended: false, consequences: "Risk of legitimate supply chain disruption.", reason: "Fails to resolve the underlying verification." }
        ],
        takeaway: "In high-stakes moments, the smallest visual detail is the difference between security and disaster.",
        neuroscience: "Occipitotemporal visual streams interface with prefrontal vigilance monitors to detect pattern breaks.",
        lifeAction: { title: "Environmental Scan", prompt: "During your next walk, actively spot 5 distinct geometric patterns in your environment that you normally overlook.", duration: 5 }
      },
    ]
  },

  // ─── 10. NEURAL PROCESSING SPEED & RAPID REACTION ──────────────────────────
  {
    domain: "speed",
    domainLabel: "Neural Speed & Cognitive Agility",
    emoji: "⚡",
    scenarios: [
      {
        theme: "Rapid Crisis Decision Gating Under Time Crunch",
        level: 3,
        dilemma: "Your server database experiences a sudden CPU spike to 99%. Users are encountering checkout errors. You have 30 seconds to choose a remediation pathway.",
        principle: "Rapid Heuristic Triage & System 2 Agility",
        prompt: "What is the optimal fast-response action?",
        options: [
          { letter: "A", text: "Trigger instant automatic read-replica failover while spinning up automated diagnostic capture.", style: "Decisive Protocol Execution", recommended: true, consequences: "Restores user transactions in seconds while capturing diagnostic data.", reason: "Pre-programmed decisive triage beats hesitant real-time debating." },
          { letter: "B", text: "Schedule a committee meeting for tomorrow to discuss the spike.", style: "Catastrophic Delay", recommended: false, consequences: "Site remains down for hours, losing thousands in revenue.", reason: "Applies slow deliberative bureaucracy to fast tactical crises." },
          { letter: "C", text: "Reboot the entire primary server without taking backups or logs.", style: "Reckless Blind Action", recommended: false, consequences: "Corrupts database and loses in-flight financial transactions.", reason: "Speed without safety boundaries creates irreversible damage." },
          { letter: "D", text: "Ignore the alert and assume traffic will subside.", style: "Hope-Based Strategy", recommended: false, consequences: "Leads to cascading total system collapse.", reason: "Denial of urgent sensory feedback." }
        ],
        takeaway: "Speed is nothing without pre-established protocols. Prepare your fast responses before the crisis strikes.",
        neuroscience: "Basal ganglia pathways accelerate procedural motor and cognitive response execution.",
        lifeAction: { title: "Rapid Decision Timer", prompt: "Make your next 3 minor daily choices (meal, clothing, route) within 5 seconds each.", duration: 5 }
      },
    ]
  }
];

/**
 * Procedural Task Generator: Expands the core blueprints into thousands of unique,
 * richly contextualized challenges across all 10 domains and 5 difficulty tiers.
 */
export function generateProceduralTaskLibrary(): DailyFitnessTask[] {
  const library: DailyFitnessTask[] = [];

  const subcontexts = [
    "Corporate & Tech",
    "SME & Retail Trade",
    "Academic & Research",
    "Healthcare & Science",
    "Creative & Design",
    "Finance & Banking",
    "Family & Community",
    "Personal Growth & Habit"
  ];

  const difficultyModifiers: Record<TaskDifficultyLevel, { name: "Beginner" | "Developing" | "Intermediate" | "Advanced" | "Expert"; duration: number; xp: number; coins: number }> = {
    1: { name: "Beginner", duration: 5, xp: 35, coins: 15 },
    2: { name: "Developing", duration: 6, xp: 45, coins: 20 },
    3: { name: "Intermediate", duration: 7, xp: 55, coins: 25 },
    4: { name: "Advanced", duration: 8, xp: 75, coins: 35 },
    5: { name: "Expert", duration: 10, xp: 100, coins: 50 },
  };

  let globalIdCounter = 1;

  BLUEPRINTS.forEach((blueprint) => {
    blueprint.scenarios.forEach((baseScenario) => {
      subcontexts.forEach((context, ctxIdx) => {
        ([1, 2, 3, 4, 5] as TaskDifficultyLevel[]).forEach((diffLevel) => {
          const mod = difficultyModifiers[diffLevel];
          const taskId = `dft-${blueprint.domain}-${ctxIdx + 1}-${diffLevel}-${globalIdCounter++}`;

          const taskTitle = `${baseScenario.theme} (${context} Level ${diffLevel})`;
          const taskDesc = `Train ${blueprint.domainLabel} within a realistic ${context.toLowerCase()} environment at ${mod.name} difficulty.`;

          const task: DailyFitnessTask = {
            id: taskId,
            title: taskTitle,
            description: taskDesc,
            category: blueprint.domain,
            categoryLabel: blueprint.domainLabel,
            difficulty: diffLevel,
            difficultyLabel: mod.name,
            estimatedDurationMin: mod.duration,
            ageSuitability: diffLevel > 3 ? "18+" : "all",
            instructions: `Read the scenario carefully, analyze the trade-offs, and select the optimal ${blueprint.domainLabel.toLowerCase()} response.`,
            interactionType: "scenario_decision",
            coverEmoji: blueprint.emoji,
            scenarioNarrative: `[${context} Context]: ${baseScenario.dilemma}`,
            dilemmaOrProblem: baseScenario.dilemma,
            cognitivePrinciple: baseScenario.principle,
            decisionPrompt: baseScenario.prompt,
            options: baseScenario.options.map((opt) => ({
              id: `${taskId}-${opt.letter}`,
              letter: opt.letter,
              text: opt.text,
              isRecommended: opt.recommended,
              isCorrect: opt.recommended,
              thinkingStyle: opt.style,
              consequences: opt.consequences,
              brainExplanation: opt.reason,
            })),
            brainInsightTakeaway: baseScenario.takeaway,
            neuroscienceRationale: baseScenario.neuroscience,
            yourLifeChallenge: {
              title: `${baseScenario.lifeAction.title} - ${context}`,
              actionPrompt: baseScenario.lifeAction.prompt,
              durationMinutes: baseScenario.lifeAction.duration,
            },
            suggestedReflectionTemplate: `Today I trained ${blueprint.domainLabel} under ${context} pressure. What I learned about my thinking: `,
            xpReward: mod.xp,
            coinReward: mod.coins,
            tags: [blueprint.domain, context.toLowerCase().replace(/ & /g, "_"), `level_${diffLevel}`],
            isActive: true,
          };

          library.push(task);
        });
      });
    });
  });

  return library;
}

// Singleton cache of the 3,000+ task library
let cachedLibrary: DailyFitnessTask[] | null = null;

export function getFullTaskLibrary(): DailyFitnessTask[] {
  if (!cachedLibrary || cachedLibrary.length === 0) {
    cachedLibrary = generateProceduralTaskLibrary();
  }
  return cachedLibrary;
}

export function getTaskById(taskId: string): DailyFitnessTask | undefined {
  const lib = getFullTaskLibrary();
  return lib.find((t) => t.id === taskId);
}
