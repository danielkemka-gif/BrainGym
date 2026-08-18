// ============================================================================
// BRAINGYM COGNITIVE MATRIX & 10 SCIENTIFIC PILLARS
// ============================================================================

export type CognitiveDomainId =
  | "processing_speed"
  | "working_memory"
  | "attention_focus"
  | "learn_recall"
  | "logical_reasoning"
  | "decision_making"
  | "mental_flexibility"
  | "verbal_reasoning"
  | "numerical_reasoning"
  | "problem_solving";

export interface CognitiveDomain {
  id: CognitiveDomainId;
  name: string;
  shortName: string;
  tagline: string;
  icon: string;
  color: string;
  badgeTitle: string;
  badgeEmoji: string;
  neuralRegion: string;
  description: string;
}

export const COGNITIVE_DOMAINS: Record<CognitiveDomainId, CognitiveDomain> = {
  processing_speed: {
    id: "processing_speed",
    name: "Processing Speed",
    shortName: "Speed",
    tagline: "Think faster under time pressure",
    icon: "zap",
    color: "#f59e0b",
    badgeTitle: "Speed Builder",
    badgeEmoji: "⚡",
    neuralRegion: "Left parietal cortex & white matter pathways",
    description: "Rapid visual scanning, automatic response inhibition, and fast mental processing.",
  },
  working_memory: {
    id: "working_memory",
    name: "Working Memory",
    shortName: "Memory",
    tagline: "Hold and manipulate complex information",
    icon: "brain",
    color: "#6366f1",
    badgeTitle: "Memory Master",
    badgeEmoji: "🧠",
    neuralRegion: "Dorsolateral prefrontal cortex & hippocampus",
    description: "Multi-item holding, mental sequence reversal, and dual-task memory storage.",
  },
  attention_focus: {
    id: "attention_focus",
    name: "Attention & Focus",
    shortName: "Focus",
    tagline: "Block distractions and sustain deep focus",
    icon: "target",
    color: "#10b981",
    badgeTitle: "Focused Mind",
    badgeEmoji: "🎯",
    neuralRegion: "Anterior cingulate cortex & parietal lobe",
    description: "Selective target detection, noise filtering, and sustained continuous vigilance.",
  },
  learn_recall: {
    id: "learn_recall",
    name: "Learn & Recall",
    shortName: "Learn",
    tagline: "Learn quicker and retain critical facts",
    icon: "book-open",
    color: "#3b82f6",
    badgeTitle: "Knowledge Architect",
    badgeEmoji: "📚",
    neuralRegion: "Hippocampus & temporal neocortex",
    description: "Information compression, teach-back synthesis, and spaced interval recall.",
  },
  logical_reasoning: {
    id: "logical_reasoning",
    name: "Logical Reasoning",
    shortName: "Logic",
    tagline: "Deduce facts and detect fallacies",
    icon: "search",
    color: "#8b5cf6",
    badgeTitle: "Logic Detective",
    badgeEmoji: "🔍",
    neuralRegion: "Bilateral prefrontal cortex & parietal network",
    description: "Pattern completion, syllogistic deduction, and recognizing missing information.",
  },
  decision_making: {
    id: "decision_making",
    name: "Decision Making",
    shortName: "Decisions",
    tagline: "Evaluate trade-offs and update probabilities",
    icon: "scale",
    color: "#ec4899",
    badgeTitle: "Strategic Thinker",
    badgeEmoji: "♟️",
    neuralRegion: "Ventromedial prefrontal cortex & insula",
    description: "Trade-off analysis, cognitive bias elimination, and Bayesian evidence updating.",
  },
  mental_flexibility: {
    id: "mental_flexibility",
    name: "Mental Flexibility",
    shortName: "Flexibility",
    tagline: "Adapt to changing rules and perspectives",
    icon: "refresh-cw",
    color: "#06b6d4",
    badgeTitle: "Flexible Thinker",
    badgeEmoji: "🔄",
    neuralRegion: "Orbitofrontal cortex & striatum",
    description: "Alternative uses generation, multi-perspective shifts, and divergent problem-solving.",
  },
  verbal_reasoning: {
    id: "verbal_reasoning",
    name: "Verbal Reasoning",
    shortName: "Verbal",
    tagline: "Master word precision and argument strength",
    icon: "message-square",
    color: "#14b8a6",
    badgeTitle: "Evidence Evaluator",
    badgeEmoji: "📊",
    neuralRegion: "Wernicke's and Broca's areas",
    description: "Semantic word nuance, correlation vs causation testing, and persuasive logic.",
  },
  numerical_reasoning: {
    id: "numerical_reasoning",
    name: "Numerical Reasoning",
    shortName: "Numbers",
    tagline: "Develop numerical intuition and data literacy",
    icon: "hash",
    color: "#f97316",
    badgeTitle: "Data Interpreter",
    badgeEmoji: "🔢",
    neuralRegion: "Intraparietal sulcus & frontal gyrus",
    description: "Rapid mental estimation, graphical trend extraction, and safe statistical inference.",
  },
  problem_solving: {
    id: "problem_solving",
    name: "Problem Solving",
    shortName: "Solutions",
    tagline: "Overcome constraints and find bottlenecks",
    icon: "puzzle",
    color: "#84cc16",
    badgeTitle: "Complex Problem Solver",
    badgeEmoji: "🧩",
    neuralRegion: "Frontopolar prefrontal cortex",
    description: "Constraint puzzles, multi-step systems bottleneck analysis, and root-cause discovery.",
  },
};

// 8 Master Thinker Cognitive Ranks (Section 22)
export const COGNITIVE_RANKS = [
  { level: 1, title: "Starter", minScore: 0, emoji: "🌱", description: "Beginning your cognitive journey" },
  { level: 2, title: "Explorer", minScore: 25, emoji: "🧭", description: "Discovering neural strengths" },
  { level: 3, title: "Thinker", minScore: 45, emoji: "💡", description: "Building daily cognitive momentum" },
  { level: 4, title: "Strategist", minScore: 60, emoji: "♟️", description: "Applying reasoning to complex scenarios" },
  { level: 5, title: "Analyst", minScore: 72, emoji: "🔬", description: "Quickly dissecting evidence and bias" },
  { level: 6, title: "Problem Solver", minScore: 82, emoji: "🧩", description: "Overcoming constraints with creative agility" },
  { level: 7, title: "Critical Thinker", minScore: 90, emoji: "🛡️", description: "Sharp, disciplined, and resilient thinker" },
  { level: 8, title: "Master Thinker", minScore: 95, emoji: "👑", description: "Elite cognitive fitness across all 10 pillars" },
] as const;

export function getRankByScore(averageScore: number) {
  for (let i = COGNITIVE_RANKS.length - 1; i >= 0; i--) {
    if (averageScore >= COGNITIVE_RANKS[i].minScore) {
      return COGNITIVE_RANKS[i];
    }
  }
  return COGNITIVE_RANKS[0];
}

// Cognitive Drill Types
export type DrillType =
  | "rapid_categorization"
  | "rule_switch"
  | "speed_comparison"
  | "number_chain"
  | "mental_manipulation"
  | "dual_memory"
  | "target_detection"
  | "distraction_resistance"
  | "sustained_attention"
  | "learn_recall"
  | "teach_back"
  | "compression"
  | "spaced_recall"
  | "pattern_completion"
  | "deduction"
  | "missing_information"
  | "trade_off"
  | "probability_challenge"
  | "bias_detector"
  | "evidence_update"
  | "constraint_puzzle"
  | "bottleneck_detective"
  | "alternative_uses"
  | "three_solutions"
  | "perspective_shift"
  | "word_precision"
  | "argument_strength"
  | "estimate_first"
  | "data_interpretation"
  | "decision_simulation";

export interface DrillItem {
  id: string;
  domain: CognitiveDomainId;
  type: DrillType;
  title: string;
  objective: string;
  difficulty: number; // 1 to 10
  timeLimitSeconds: number;
  prompt: string;
  context?: string;
  options?: { id: string; text: string; isCorrect: boolean; feedback?: string }[];
  correctAnswer?: string | number | string[];
  explanation: string;
  cognitivePrinciple: string;
  microLesson: string;
  metacognitivePrompt: string;
  customData?: Record<string, any>;
}

// Built-in Scientific Drill Bank
export const DRILL_BANK: DrillItem[] = [
  // ─── 1. THINK FASTER: PROCESSING SPEED ─────────────────────────────
  {
    id: "speed_cat_01",
    domain: "processing_speed",
    type: "rapid_categorization",
    title: "Rapid Categorization Sprint",
    objective: "Categorize each item as quickly and accurately as possible in 30 seconds.",
    difficulty: 3,
    timeLimitSeconds: 30,
    prompt: "Is this item an ODD NUMBER or EVEN NUMBER?",
    explanation: "Rapid categorization strengthens parietal cortex white-matter transmission speed.",
    cognitivePrinciple: "Automatic visual recognition and fast binary decision routing.",
    microLesson: "Focus on the last digit only to determine parity in under 200ms.",
    metacognitivePrompt: "Did you hesitate on two-digit numbers, and what visual shortcut could speed you up?",
    customData: {
      items: [
        { item: "17", category: "Odd" },
        { item: "42", category: "Even" },
        { item: "89", category: "Odd" },
        { item: "64", category: "Even" },
        { item: "31", category: "Odd" },
        { item: "98", category: "Even" },
        { item: "13", category: "Odd" },
        { item: "76", category: "Even" },
      ],
      categories: ["Odd", "Even"],
    },
  },
  {
    id: "speed_rule_01",
    domain: "processing_speed",
    type: "rule_switch",
    title: "Rule Switch Agility",
    objective: "Follow the current rule, but immediately adapt when the rule switches!",
    difficulty: 5,
    timeLimitSeconds: 45,
    prompt: "Tap LEFT or RIGHT according to the active rule shown on screen.",
    explanation: "Rule switching trains cognitive flexibility and suppresses habitual automatic responses.",
    cognitivePrinciple: "Task-set reconfiguration and prefrontal response inhibition.",
    microLesson: "Pause for 100ms when the rule banner turns orange to load the new rule into working memory.",
    metacognitivePrompt: "Did you make errors right after the rule changed? How can you reset your mental set faster?",
    customData: {
      initialRule: { text: "Tap LEFT if Even, RIGHT if Odd", ruleKey: "parity" },
      switchRule: { text: "NEW RULE: Tap LEFT if > 50, RIGHT if ≤ 50", ruleKey: "threshold" },
      switchAfterRound: 4,
      items: [
        { val: 24, parity: "LEFT", threshold: "RIGHT" },
        { val: 17, parity: "RIGHT", threshold: "RIGHT" },
        { val: 86, parity: "LEFT", threshold: "LEFT" },
        { val: 39, parity: "RIGHT", threshold: "RIGHT" },
        { val: 72, parity: "LEFT", threshold: "LEFT" }, // switched rule here
        { val: 14, parity: "LEFT", threshold: "RIGHT" },
        { val: 93, parity: "RIGHT", threshold: "LEFT" },
        { val: 48, parity: "LEFT", threshold: "RIGHT" },
      ],
    },
  },
  {
    id: "speed_comp_01",
    domain: "processing_speed",
    type: "speed_comparison",
    title: "Speed String Comparison",
    objective: "Determine whether the two complex strings are identical or different in milliseconds.",
    difficulty: 4,
    timeLimitSeconds: 30,
    prompt: "Are these two strings 100% IDENTICAL?",
    explanation: "Visual scanning comparison trains rapid saccadic eye movements and character verification.",
    cognitivePrinciple: "High-speed optical pattern verification.",
    microLesson: "Scan characters in pairs from left-to-right rather than trying to read the whole number as a word.",
    metacognitivePrompt: "Where did your eyes naturally focus first when comparing the two strings?",
    customData: {
      pairs: [
        { a: "738492", b: "738429", identical: false },
        { a: "918274", b: "918274", identical: true },
        { a: "558193", b: "558193", identical: true },
        { a: "402851", b: "402815", identical: false },
        { a: "617390", b: "617390", identical: true },
        { a: "882319", b: "883219", identical: false },
      ],
    },
  },

  // ─── 2. WORKING MEMORY ─────────────────────────────────────────────
  {
    id: "wm_chain_01",
    domain: "working_memory",
    type: "number_chain",
    title: "Reverse Number Chain",
    objective: "Memorize the sequence of numbers and enter them in REVERSE order.",
    difficulty: 4,
    timeLimitSeconds: 40,
    prompt: "Remember this sequence: 7 → 2 → 9 → 4 → 1. Enter it in REVERSE order.",
    correctAnswer: "1, 4, 9, 2, 7",
    options: [
      { id: "a", text: "1, 4, 9, 2, 7", isCorrect: true, feedback: "Perfect reverse mental indexing!" },
      { id: "b", text: "7, 2, 9, 4, 1", isCorrect: false, feedback: "That is the forward order. Remember to reverse!" },
      { id: "c", text: "1, 9, 4, 2, 7", isCorrect: false, feedback: "Close, but 4 and 9 were swapped." },
      { id: "d", text: "1, 4, 2, 9, 7", isCorrect: false, feedback: "9 and 2 were misplaced." },
    ],
    explanation: "Reversing a sequence forces your prefrontal cortex to hold items in a buffer while rearranging indices.",
    cognitivePrinciple: "Phonological loop manipulation and central executive sequencing.",
    microLesson: "Repeat the sequence to yourself backwards once before entering the first number.",
    metacognitivePrompt: "What strategy did you use to retain the middle digits while speaking the ends?",
  },
  {
    id: "wm_manip_01",
    domain: "working_memory",
    type: "mental_manipulation",
    title: "Multi-Step Mental Arithmetic",
    objective: "Execute multi-step operations in your head without paper or calculator.",
    difficulty: 5,
    timeLimitSeconds: 45,
    prompt: "Start with 27. Add 8. Multiply by 2. Subtract 10. What is the final answer?",
    correctAnswer: 60,
    options: [
      { id: "a", text: "60", isCorrect: true, feedback: "27 + 8 = 35 → 35 × 2 = 70 → 70 - 10 = 60!" },
      { id: "b", text: "50", isCorrect: false, feedback: "Check your intermediate multiplication step." },
      { id: "c", text: "65", isCorrect: false, feedback: "Did you subtract 10 at the end?" },
      { id: "d", text: "70", isCorrect: false, feedback: "You stopped before the final subtraction." },
    ],
    explanation: "Mental arithmetic requires updating state variables in working memory while applying arithmetic rules.",
    cognitivePrinciple: "Dynamic working memory updating.",
    microLesson: "Hold the intermediate sum (35) as a firm anchor before executing the double operation.",
    metacognitivePrompt: "Did you lose track of the intermediate result at any point? What caused the cognitive load spike?",
  },

  // ─── 3. ATTENTION & FOCUS ──────────────────────────────────────────
  {
    id: "att_target_01",
    domain: "attention_focus",
    type: "target_detection",
    title: "Conditional Target Detection",
    objective: "Detect target 'X' ONLY when it appears immediately following a vowel (A, E, I, O, U).",
    difficulty: 5,
    timeLimitSeconds: 40,
    prompt: "Tap TARGET only when 'X' is preceded directly by a vowel (e.g. A → X, E → X, O → X).",
    explanation: "Trains conditioned selective attention rather than simple reflexive tapping.",
    cognitivePrinciple: "Conditional top-down attentional filtering.",
    microLesson: "Prime your brain for vowels: only look for X if your vowel detector just fired.",
    metacognitivePrompt: "Did you find yourself almost tapping on non-vowel Xs? How did you inhibit the impulse?",
    customData: {
      stream: [
        { char: "B", isTarget: false },
        { char: "E", isTarget: false },
        { char: "X", isTarget: true, reason: "Preceded by 'E' (vowel)" },
        { char: "D", isTarget: false },
        { char: "K", isTarget: false },
        { char: "X", isTarget: false, reason: "Preceded by 'K' (consonant)" },
        { char: "O", isTarget: false },
        { char: "X", isTarget: true, reason: "Preceded by 'O' (vowel)" },
        { char: "P", isTarget: false },
        { char: "A", isTarget: false },
        { char: "X", isTarget: true, reason: "Preceded by 'A' (vowel)" },
      ],
    },
  },

  // ─── 4. LEARN & RECALL ─────────────────────────────────────────────
  {
    id: "lr_teach_01",
    domain: "learn_recall",
    type: "teach_back",
    title: "Feynman Teach-Back Synthesis",
    objective: "Identify the single most critical strategic fact from the passage and filter noise.",
    difficulty: 4,
    timeLimitSeconds: 60,
    context: "A company has three products: Product A generates 50% of current revenue, Product B generates 30%, and Product C generates 20%. While Product A is largest today, Product B has the highest growth rate at +45% YoY and the highest profit margin.",
    prompt: "Which statement captures the most important strategic takeaway?",
    options: [
      { id: "a", text: "Product B is the primary growth and profit engine despite not being the largest current revenue generator.", isCorrect: true, feedback: "Accurate! You identified the future-looking value driver." },
      { id: "b", text: "Product A is the only product that matters because it produces 50% of revenue.", isCorrect: false, feedback: "Fails to recognize growth and margins." },
      { id: "c", text: "Product C should be discontinued immediately.", isCorrect: false, feedback: "Unsubstantiated assumption not in text." },
      { id: "d", text: "The company's revenue is evenly split between three lines.", isCorrect: false, feedback: "Factually incorrect." },
    ],
    explanation: "Teach-back synthesis extracts the signal from the noise and prioritizes forward-looking leverage.",
    cognitivePrinciple: "Conceptual hierarchy extraction and semantic compression.",
    microLesson: "Distinguish between current snapshot volume and future growth trajectory.",
    metacognitivePrompt: "How quickly did you discount Product A's size to evaluate Product B's margin and growth?",
  },

  // ─── 5. LOGICAL REASONING ──────────────────────────────────────────
  {
    id: "logic_ded_01",
    domain: "logical_reasoning",
    type: "deduction",
    title: "Syllogistic Deduction",
    objective: "Determine what MUST be true strictly based on given premises without assumptions.",
    difficulty: 6,
    timeLimitSeconds: 50,
    context: "Premise 1: All architects are designers.\nPremise 2: Some designers are musicians.\nPremise 3: John is an architect.",
    prompt: "Which statement MUST be true?",
    options: [
      { id: "a", text: "John is a designer.", isCorrect: true, feedback: "Correct! Since all architects are designers and John is an architect, John must be a designer." },
      { id: "b", text: "John is a musician.", isCorrect: false, feedback: "Could be true, but not MUST be true (only SOME designers are musicians)." },
      { id: "c", text: "All musicians are architects.", isCorrect: false, feedback: "Logically invalid conversion." },
      { id: "d", text: "John cannot be a musician.", isCorrect: false, feedback: "False; he could be, but we cannot be certain." },
    ],
    explanation: "Deductive reasoning distinguishes strict necessity ('Must be true') from mere possibility ('Could be true').",
    cognitivePrinciple: "Formal predicate logic and quantifier constraint satisfaction.",
    microLesson: "Never equate 'Some A are B' with 'All A are B' or assume individual membership without proof.",
    metacognitivePrompt: "Did you feel an urge to assume John plays music? How did you verify the necessity?",
  },
  {
    id: "logic_miss_01",
    domain: "logical_reasoning",
    type: "missing_information",
    title: "Uncertainty & Missing Information",
    objective: "Recognize when there is insufficient data to draw a valid conclusion.",
    difficulty: 5,
    timeLimitSeconds: 45,
    context: "Scenario: Company A made 20% more profit this year than last year. Company B made 10% less profit this year than last year.",
    prompt: "Which company is more profitable in total dollars this year?",
    options: [
      { id: "a", text: "There is not enough information to determine this.", isCorrect: true, feedback: "Excellent! Without baseline dollar amounts (e.g. $1M vs $100M), percentage changes alone cannot compare totals." },
      { id: "b", text: "Company A is definitely more profitable.", isCorrect: false, feedback: "Classic base-rate fallacy! If A went from $10k to $12k and B went from $100M to $90M, B is far more profitable." },
      { id: "c", text: "Company B is definitely more profitable.", isCorrect: false, feedback: "Unjustified assumption." },
      { id: "d", text: "Both companies made the same dollar profit.", isCorrect: false, feedback: "Unjustified assumption." },
    ],
    explanation: "Recognizing missing information prevents jumping to conclusions based on partial percentage metrics.",
    cognitivePrinciple: "Epistemic vigilance and base-rate awareness.",
    microLesson: "Always check: 'Do I have the base numbers or only relative rates?'",
    metacognitivePrompt: "Why does our intuition naturally prefer picking an answer over saying 'Not enough information'?",
  },

  // ─── 6. DECISION MAKING ────────────────────────────────────────────
  {
    id: "dec_bias_01",
    domain: "decision_making",
    type: "bias_detector",
    title: "Cognitive Bias Detective",
    objective: "Identify the specific cognitive fallacy or reasoning error in the scenario.",
    difficulty: 6,
    timeLimitSeconds: 60,
    context: "A manager spent $500,000 building custom software that is now obsolete and buggy. A modern SaaS tool costs $2,000/month and solves all problems immediately. The manager insists: 'We cannot switch now; otherwise all that $500,000 we invested will go to waste!'",
    prompt: "What cognitive bias is dominating the manager's decision?",
    options: [
      { id: "a", text: "Sunk-Cost Fallacy", isCorrect: true, feedback: "Spot on! The $500,000 is gone forever. Future decisions should only evaluate future costs vs benefits." },
      { id: "b", text: "Anchoring Bias", isCorrect: false, feedback: "Anchoring refers to over-relying on an initial number when estimating." },
      { id: "c", text: "Confirmation Bias", isCorrect: false, feedback: "Confirmation bias is seeking out only supporting evidence." },
      { id: "d", text: "Gambler's Fallacy", isCorrect: false, feedback: "Gambler's fallacy assumes past independent events alter future odds." },
    ],
    explanation: "The sunk-cost fallacy causes decision-makers to throw good money after bad to justify past losses.",
    cognitivePrinciple: "Loss aversion and non-recoverable resource allocation.",
    microLesson: "Ask: 'If I arrived fresh today with zero history, would I choose this option right now?'",
    metacognitivePrompt: "Have you ever kept watching a boring movie or finishing a bad book due to sunk cost?",
  },
  {
    id: "dec_prob_01",
    domain: "decision_making",
    type: "probability_challenge",
    title: "Independent Probability & Gambler's Fallacy",
    objective: "Calculate true probability on independent random events.",
    difficulty: 4,
    timeLimitSeconds: 30,
    prompt: "A fair coin has landed on HEADS 6 times in a row. What is the exact mathematical probability of landing on HEADS on the 7th toss?",
    options: [
      { id: "a", text: "50% (1 in 2)", isCorrect: true, feedback: "Correct! The coin has no memory. Each toss is an independent 50/50 event." },
      { id: "b", text: "Less than 10% (Tails is 'due')", isCorrect: false, feedback: "This is the classic Gambler's Fallacy. The coin cannot remember past tosses." },
      { id: "c", text: "More than 75% (Heads has momentum)", isCorrect: false, feedback: "A fair coin has no momentum." },
      { id: "d", text: "100%", isCorrect: false, feedback: "Impossible on a fair coin." },
    ],
    explanation: "Independent random processes are unaffected by previous trials.",
    cognitivePrinciple: "Independence of Bernoulli trials and Gambler's Fallacy resistance.",
    microLesson: "Random events never owe you a specific outcome.",
    metacognitivePrompt: "Why does our brain crave finding patterns and 'rebalancing' in truly random events?",
  },
  {
    id: "dec_trade_01",
    domain: "decision_making",
    type: "trade_off",
    title: "Investment Trade-Off Evaluator",
    objective: "Evaluate competing investment options based on risk, time horizon, and return.",
    difficulty: 6,
    timeLimitSeconds: 60,
    context: "You have $10,000 saved for a home down payment that you plan to make in 12 months. Which option represents the most prudent decision?",
    prompt: "Select the option with the soundest risk-to-timeline reasoning:",
    options: [
      { id: "a", text: "High-Yield Savings / Treasury Bills (4.5% guaranteed, zero principal risk for a 1-year timeline).", isCorrect: true, feedback: "Spot on! Short horizons (<2 years) require principal preservation over volatile growth." },
      { id: "b", text: "High-risk crypto / meme stock fund (target 50% return in 6 months).", isCorrect: false, feedback: "Massive probability of losing down payment capital right before purchase." },
      { id: "c", text: "10-Year illiquid real estate syndication.", isCorrect: false, feedback: "Severe liquidity mismatch with a 12-month goal." },
      { id: "d", text: "Keeping physical cash under mattress (loses value to inflation).", isCorrect: false, feedback: "Suboptimal when risk-free interest is available." },
    ],
    explanation: "Decision quality is measured by aligning risk tolerance with the specific liquidity time horizon.",
    cognitivePrinciple: "Time-horizon liquidity matching and capital preservation.",
    microLesson: "Never risk money you need in the short term on high-volatility assets.",
    metacognitivePrompt: "Did you feel tempted by the 50% return? How did you weigh greed against deadline risk?",
  },

  // ─── 7. PROBLEM SOLVING ────────────────────────────────────────────
  {
    id: "ps_bottleneck_01",
    domain: "problem_solving",
    type: "bottleneck_detective",
    title: "Systems Bottleneck Detective",
    objective: "Identify the critical constraining bottleneck in a operational workflow.",
    difficulty: 6,
    timeLimitSeconds: 60,
    context: "A kitchen receives 120 customer orders per hour. The order-taking app processes 150/hr. The kitchen cooking line can prepare 70 orders/hr. The packaging station packs 130/hr. There are 25 delivery drivers waiting outside.",
    prompt: "What is the single operational bottleneck limiting total system output?",
    options: [
      { id: "a", text: "The Kitchen Cooking Line (70 orders/hr capacity).", isCorrect: true, feedback: "Correct! The system throughput can never exceed its slowest stage (Theory of Constraints)." },
      { id: "b", text: "The Delivery Drivers.", isCorrect: false, feedback: "Drivers are waiting with idle capacity." },
      { id: "c", text: "The Order Taking App.", isCorrect: false, feedback: "App capacity (150/hr) exceeds demand." },
      { id: "d", text: "The Packaging Station.", isCorrect: false, feedback: "Packaging (130/hr) is starved by kitchen output." },
    ],
    explanation: "Goldratt's Theory of Constraints: System throughput is strictly determined by the single slowest bottleneck.",
    cognitivePrinciple: "Systems thinking and constraint identification.",
    microLesson: "Improving any stage other than the bottleneck produces zero net improvement to total output.",
    metacognitivePrompt: "What additional resource (e.g. second chef vs more drivers) would you fund first?",
  },

  // ─── 8. MENTAL FLEXIBILITY ─────────────────────────────────────────
  {
    id: "flex_persp_01",
    domain: "mental_flexibility",
    type: "perspective_shift",
    title: "360° Perspective Shift",
    objective: "Analyze a business policy change from three competing stakeholder viewpoints.",
    difficulty: 5,
    timeLimitSeconds: 60,
    context: "An airline introduces a strict fee for overhead carry-on bags.",
    prompt: "From the perspective of FLIGHT ATTENDANTS, what is the primary benefit of this policy?",
    options: [
      { id: "a", text: "Faster boarding times and fewer arguments over crowded overhead bin space.", isCorrect: true, feedback: "Insightful! For crew, boarding speed and reduced cabin friction are primary benefits." },
      { id: "b", text: "More airline ancillary revenue for shareholders.", isCorrect: false, feedback: "That is the executive/investor perspective, not flight attendant daily workflow." },
      { id: "c", text: "Lower ticket base price for budget passengers.", isCorrect: false, feedback: "That is the customer perspective." },
      { id: "d", text: "More fuel sold by oil suppliers.", isCorrect: false, feedback: "Irrelevant." },
    ],
    explanation: "Cognitive perspective-taking develops empathy and anticipates stakeholder behavior.",
    cognitivePrinciple: "Theory of Mind and multi-stakeholder incentive mapping.",
    microLesson: "To predict behavior, evaluate policies through each group's direct daily incentives.",
    metacognitivePrompt: "How easily could you disconnect from your own passenger perspective to see the crew's view?",
  },

  // ─── 9. VERBAL REASONING ───────────────────────────────────────────
  {
    id: "verb_arg_01",
    domain: "verbal_reasoning",
    type: "argument_strength",
    title: "Correlation vs Causation",
    objective: "Identify the critical flaw in an argument confusing correlation with causation.",
    difficulty: 5,
    timeLimitSeconds: 50,
    context: "Argument: 'Cities with more ice cream shops have significantly higher rates of drowning incidents. Therefore, consuming ice cream causes people to drown.'",
    prompt: "What is the true underlying explanation for this correlation?",
    options: [
      { id: "a", text: "A confounding variable (Hot summer weather causes BOTH increased swimming and more ice cream eating).", isCorrect: true, feedback: "Exact! Temperature is the lurking common cause." },
      { id: "b", text: "Ice cream causes stomach cramps while swimming.", isCorrect: false, feedback: "Unproven folk myth." },
      { id: "c", text: "Ice cream shops are built on water.", isCorrect: false, feedback: "Nonsensical." },
      { id: "d", text: "The statistic must be completely fabricated.", isCorrect: false, feedback: "The correlation is real, but the causal inference is false." },
    ],
    explanation: "Correlation does not imply causation when a lurking third variable (temperature) drives both phenomena.",
    cognitivePrinciple: "Causal inference and confounding variable detection.",
    microLesson: "Whenever A correlates with B, always ask: 'Could C be causing both A and B?'",
    metacognitivePrompt: "Can you think of a health or business claim you heard recently that confused correlation with cause?",
  },

  // ─── 10. NUMERICAL REASONING ───────────────────────────────────────
  {
    id: "num_est_01",
    domain: "numerical_reasoning",
    type: "estimate_first",
    title: "Rapid Fermi Numerical Estimation",
    objective: "Estimate the approximate magnitude without calculating exact decimals.",
    difficulty: 4,
    timeLimitSeconds: 25,
    prompt: "Without using a calculator, approximately what is: 19.8 × 51?",
    options: [
      { id: "a", text: "≈ 1,000 (20 × 50)", isCorrect: true, feedback: "Exact answer is 1,009.8! Rounding to 20 × 50 gave 99% accuracy in 2 seconds." },
      { id: "b", text: "≈ 500", isCorrect: false, feedback: "Far too low (10 × 50)." },
      { id: "c", text: "≈ 2,500", isCorrect: false, feedback: "Far too high (50 × 50)." },
      { id: "d", text: "≈ 10,000", isCorrect: false, feedback: "Order of magnitude error." },
    ],
    explanation: "Fermi estimation trains intuitive number sense by rounding to friendly orders of magnitude.",
    cognitivePrinciple: "Mental anchoring and heuristic numerical estimation.",
    microLesson: "Round 19.8 up to 20, and round 51 down to 50: 20 × 50 = 1,000 instantly.",
    metacognitivePrompt: "Did you try to calculate decimals first, or did you immediately round to round numbers?",
  },
];
