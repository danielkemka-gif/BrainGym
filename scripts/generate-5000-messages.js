// @ts-check
/**
 * AKUCHE 5,000+ PHILOSOPHICAL INSPIRATION GENERATOR & VALIDATOR
 * 
 * Generates an exhaustive library of >= 5,000 distinct, profound, non-cliché messages
 * categorized across 15 core dimensions of thinking, decision-making, and intentional living.
 */

const fs = require('fs');
const path = require('path');

const THEMES = [
  "Clarity & Mental Models",
  "Decision-Making & Strategy",
  "Critical Thinking & Inversion",
  "Execution & Taking Action",
  "Resilience & Adversity",
  "Emotional Mastery & Equanimity",
  "Career, Wealth & Leverage",
  "Relationships & Boundaries",
  "Mastery & Deep Learning",
  "Discipline & Compounding Habits",
  "Vision, Purpose & Long Horizons",
  "Problem Solving & Innovation",
  "Self-Awareness & Blind Spots",
  "Focus, Energy & Deep Work",
  "Timeless Wisdom & Philosophy"
];

// Rich vocabulary for Focus Words by theme
const FOCUS_WORDS = {
  "Clarity & Mental Models": [
    "CLARITY", "DISTILLATION", "LUCIDITY", "PERSPECTIVE", "ESSENCE", 
    "COGNITION", "FIRST PRINCIPLES", "PRECISION", "ILLUMINATION", "FOUNDATION",
    "OBJECTIVITY", "PERCEPTION", "DISENTANGLE", "UNPACKING", "TRANSPARENCY",
    "AXIOMS", "GROUND TRUTH", "FORESIGHT", "SIMPLICITY", "INSIGHT"
  ],
  "Decision-Making & Strategy": [
    "DECISIVENESS", "ASYMMETRY", "SECOND-ORDER", "TRADE-OFFS", "STRATEGY",
    "CALCULATION", "OPPORTUNITY COST", "POSITIONING", "CONVICTION", "PROBABILITY",
    "OPTION VALUE", "TACTICAL CALM", "DIRECTION", "LEVERAGE", "DIVERGENCE",
    "MARGIN OF SAFETY", "GAME PLAN", "INTENTIONALITY", "AGENCY", "CHOICE"
  ],
  "Critical Thinking & Inversion": [
    "INVERSION", "SKEPTICISM", "DISPROBATION", "SCRUTINY", "FALLACIES",
    "DECONSTRUCTION", "BIAS AUDIT", "CHALLENGE", "INTERROGATION", "RIGOR",
    "EMPIRICISM", "DIALECTIC", "UNBIASED", "FALSIFICATION", "INTELLECTUAL HONESTY",
    "NUANCE", "DISSECTION", "PREMISE", "VALIDITY", "UNSETTLE"
  ],
  "Execution & Taking Action": [
    "MOMENTUM", "INITIATIVE", "VELOCITY", "EXECUTION", "FORWARD LEAP",
    "MICRO-STEPS", "TANGIBLE", "ACTIVATION", "CATALYST", "SHIP",
    "DRIVE", "UNHESITATING", "PRAGMATISM", "DELIVERY", "REALIZATION",
    "TRACTION", "CADENCE", "PROPELLER", "COMMISSION", "DISPATCH"
  ],
  "Resilience & Adversity": [
    "ANTIFRAGILE", "RESILIENCE", "ENDURANCE", "TENACITY", "FORTITUDE",
    "GRIT", "ADAPTATION", "STALWART", "UNBREAKABLE", "REBOUND",
    "STEADFAST", "WEATHER THE STORM", "UNFAZED", "REFORGING", "DEEP ROOTS",
    "COURAGE", "UNSHAKABLE", "RESOLVE", "ANCHOR", "PERSEVERANCE"
  ],
  "Emotional Mastery & Equanimity": [
    "EQUANIMITY", "SERENITY", "SOVEREIGNTY", "STILLNESS", "IMPASSIVITY",
    "COMPOSURE", "CENTERED", "TRANQUILITY", "POISE", "SELF-COMMAND",
    "BALANCE", "CALM CENTER", "INNER SANCTUARY", "NON-REACTIVITY", "HARMONY",
    "GRACE", "SOOTHING", "DETACHMENT", "PEACE", "UNPERTURBED"
  ],
  "Career, Wealth & Leverage": [
    "COMPOUNDING", "LEVERAGE", "ASYMMETRIC", "VALUE CREATION", "CAPITAL",
    "EQUITY", "SOVEREIGNTY", "ARBITRAGE", "HIGH-AGENCY", "RESOURCEFUL",
    "ASSET ALLOCATION", "MOAT", "EXPONENTIAL", "SKILL STACKING", "AUTONOMY",
    "INDEPENDENCE", "ENTERPRISE", "MULTIPLIER", "WEALTH MINDSET", "STRATEGIC VALUE"
  ],
  "Relationships & Boundaries": [
    "BOUNDARIES", "RECIPROCITY", "DISCERNMENT", "HONESTY", "INTEGRITY",
    "ASSERTIVENESS", "SELECTIVITY", "PROTECTION", "ALLIANCE", "MUTUALITY",
    "SOVEREIGN SPACE", "NON-ATTACHMENT", "DIGNITY", "COMMUNICATION", "COMPASSION",
    "DIRECTNESS", "AUTHENTICITY", "RESONANCE", "CLEAR CONTRACTS", "SOLIDARITY"
  ],
  "Mastery & Deep Learning": [
    "DELIBERATE PRACTICE", "CRAFT", "MASTERY", "APPRENTICESHIP", "ACCELERATION",
    "MENTAL MODELS", "ITERATION", "KAIZEN", "FEEDBACK LOOPS", "FLUENCY",
    "EXPERTISE", "REFINEMENT", "SYNTHESIS", "ABSORPTION", "COMPETENCE",
    "SHARPENING", "HONING", "UNDERSTANDING", "DEEP INTELLECT", "EVOLUTION"
  ],
  "Discipline & Compounding Habits": [
    "CONSISTENCY", "DISCIPLINE", "AUTOMATION", "HABIT LOOPS", "RHYTHM",
    "DAILY CADENCE", "IDENTITY", "SELF-GOVERNANCE", "UNYIELDING", "REGULARITY",
    "MICRO-HABITS", "COMPOUND EFFECT", "RITUAL", "STRUCTURE", "FOUNDATIONAL",
    "UNSTOPPABLE", "STANDARD", "RELIABILITY", "VIGILANCE", "STEADY MARCH"
  ],
  "Vision, Purpose & Long Horizons": [
    "LONG HORIZON", "NORTH STAR", "PURPOSE", "LEGACY", "LONG GAME",
    "ASPIRATION", "VISION", "TELEOLOGY", "DESTINY", "END GAME",
    "HORIZON VIEW", "MACRO VISION", "ETERNAL VIEW", "SIGNIFICANCE", "MEANING",
    "DIRECTIONALITY", "GREAT WORK", "UNWAVERING PATH", "TRUE NORTH", "LONG EMBERS"
  ],
  "Problem Solving & Innovation": [
    "BOTTLENECK", "LATERAL THINKING", "SYNTHESIS", "CREATIVITY", "DECONSTRUCT",
    "BREAKTHROUGH", "INNOVATION", "ANALOGY", "RESTRUCTURE", "UNBLOCK",
    "CONVERGENCE", "EXPERIMENTATION", "NEW COMBINATIONS", "OUTFLANK", "SIMPLIFICATION",
    "PIVOT", "LEVERAGE POINT", "RESOLVE", "EUREKA", "STRUCTURAL SHIFT"
  ],
  "Self-Awareness & Blind Spots": [
    "SELF-AUDIT", "SHADOW WORK", "BLIND SPOTS", "INTELLECTUAL HUMILITY", "MIRROR",
    "EGO DETACHMENT", "ACCURACY", "SELF-HONESTY", "INTERNAL LOCUS", "UNVEILING",
    "AUTHENTICITY", "CANDOR", "RECOGNITION", "VULNERABILITY", "UNMASKING",
    "SELF-OBSERVATION", "HONEST APPRAISAL", "ROOT MOTIVES", "TRUTH-SEEKING", "REALIGNMENT"
  ],
  "Focus, Energy & Deep Work": [
    "DEEP WORK", "COGNITIVE FLOW", "SINGULARITY", "ENERGY HYGIENE", "BANDWIDTH",
    "UNINTERRUPTED", "MONK MODE", "ATTENTION HYGIENE", "HYPER-FOCUS", "ELIMINATION",
    "NOISE FILTER", "PROTECTED TIME", "ZONE OF GENIUS", "PRISTINE FOCUS", "INTENSITY",
    "RUTHLESS PRIORITY", "CONCENTRATION", "ABSORBED", "ENERGY DEFENSE", "LASER"
  ],
  "Timeless Wisdom & Philosophy": [
    "MEMENTO MORI", "AMOR FATI", "ATARAXIA", "EUDAIMONIA", "TRANSCENDENCE",
    "TIMELESS PRINCIPLES", "STOIC CALM", "WAY OF LIVING", "SOUL CALM", "SERENITY",
    "PERSPECTIVE OF AGES", "HUMILITY", "SACRED ESSENCE", "CONSCIOUS LIVING", "ETERNAL ORDER",
    "NATURE OF THINGS", "MINDFUL HARMONY", "UNSHAKABLE CORE", "NOBLE LIVING", "INNER CITADEL"
  ]
};

// Seed arrays for building 350+ unique structured insights per theme (350 * 15 = 5,250 items)
const THEME_SEEDS = {
  "Clarity & Mental Models": {
    openers: [
      "Most confusion is not a lack of information, but an abundance of unorganized noise.",
      "When you cannot see the solution, you are likely asking the wrong question.",
      "Clear thinking begins by ruthlessly stripping away assumptions that cannot be proven.",
      "Mental models are not reality itself, but lenses that reveal hidden structure.",
      "Confusion thrives in vagueness. Precision in language creates precision in thought.",
      "Strip away the emotional narrative and look only at the physical facts on the table.",
      "The simplest explanation that accounts for all verified facts is where your focus belongs.",
      "When faced with overwhelming complexity, find the single governing principle.",
      "True understanding means you can explain the mechanism in plain, unadorned terms.",
      "Clarity is not something you wait for; it is something you actively excavate.",
      "Separate what is actually happening from what you fear might happen.",
      "A situation clearly stated is already halfway to its rightful resolution.",
      "Beware of convincing stories that lack empirical verification.",
      "Your perception is an interpretation, not a direct transcript of reality.",
      "High-clarity thinkers do not know more; they eliminate distractions faster."
    ],
    cores: [
      "Break the problem down to its immutable first principles before building upward.",
      "Map out the causal chain: if this happens, what specifically drives the next event?",
      "Filter every claim through Occam's razor and eliminate unnecessary assumptions.",
      "Translate vague anxieties into specific, testable propositions.",
      "Look at the incentive landscape; behavior follows structural rewards, not polite rhetoric.",
      "Observe what remains invariant across multiple cycles of change.",
      "Distinguish between noise that demands attention and signal that demands action.",
      "Verify the source data yourself rather than relying on secondhand interpretations.",
      "Acknowledge what you do not know with total candor; false certainty is the greatest trap.",
      "Identify the single variable that, if altered, fundamentally changes the outcome."
    ],
    closers: [
      "When the fog lifts, the correct course of action requires very little debate.",
      "See the board as it actually is, not as you wish it were.",
      "Precision of thought is the greatest time-saver known to humanity.",
      "Clear sight is the foundation upon which all decisive power is built.",
      "A calm, clear mind sees five moves ahead while others react to the present pawn."
    ],
    reflections: [
      "What core assumption about your current challenge have you accepted without verifying?",
      "If you had to explain your current situation in one unambiguous sentence, what would it be?",
      "Which part of your current stress is a factual obstacle versus an imagined projection?",
      "What would this problem look like if it were fundamentally simple?",
      "Where are you mistaking familiarity with a concept for true understanding of its mechanics?"
    ],
    microActions: [
      "Write down the three indisputable facts of your current challenge on a clean piece of paper.",
      "Spend 10 minutes removing 3 non-essential tasks from your board to sharpen your daily focus.",
      "Draw a simple diagram of the system or problem you are trying to solve to test your mental model.",
      "Identify one assumption you hold today and look up contrary evidence for 5 minutes.",
      "Draft a 2-sentence summary of your primary objective for today and place it where you can see it."
    ]
  },

  "Decision-Making & Strategy": {
    openers: [
      "A decision is only as good as the alternatives you were courageous enough to evaluate.",
      "Indecision is itself a decision—one that surrenders your agency to circumstances.",
      "Great strategists do not seek certainty; they seek asymmetric upside with capped downside.",
      "Speed of decision-making compounds just as powerfully as financial capital.",
      "Do not judge a decision solely by its immediate outcome, but by the quality of the process.",
      "When choices appear equally attractive, look at their second and third-order consequences.",
      "Every 'yes' you speak is a simultaneous 'no' to a thousand other possibilities.",
      "The quality of your life is the cumulative sum of the decisions you dared to make.",
      "Decisions made under emotional heat are usually calculated to relieve discomfort, not win.",
      "Good strategy is as much about choosing what NOT to do as what to pursue.",
      "When stakes are high, preserve option value until the critical leverage point appears.",
      "Reversible decisions should be made with rapid speed; irreversible ones with deep deliberation.",
      "Never bet the farm on an assumption you cannot afford to have proven false.",
      "Position yourself so that multiple plausible futures still result in your advancement.",
      "The best move is often the one that improves your posture for the move after next."
    ],
    cores: [
      "Quantify the worst-case scenario: if you can survive it with dignity, take the leap.",
      "Apply second-order thinking: ask 'and then what?' at least three times consecutively.",
      "Look for asymmetric bets where you risk 1 unit of downside to capture 10 units of upside.",
      "Separate the decision from the outcome; evaluate whether your reasoning was sound.",
      "Build a margin of safety into every timeline, budget, and strategic projection.",
      "Decide on the rules of engagement before the heat of conflict or pressure begins.",
      "Seek disconfirming data with greater eagerness than confirmatory applause.",
      "When navigating uncertainty, run small, low-cost experiments before committing major resources.",
      "Align your tactical actions with your 5-year strategic posture, not today's momentary mood.",
      "Identify the irreversible threshold in your choice and treat that boundary with reverence."
    ],
    closers: [
      "Decide with wisdom, commit with conviction, and adapt with total flexibility.",
      "A definitive decision liberates more mental energy than months of agonizing hesitation.",
      "The strategic high ground belongs to those who act deliberately while others dither.",
      "Choose the path that makes future decisions progressively easier.",
      "Own your choices fully; personal sovereignty begins with radical ownership of decisions."
    ],
    reflections: [
      "What decision are you delaying because you are waiting for 100% certainty that will never come?",
      "If you look at the 2nd and 3rd order consequences of your top choice, what becomes visible?",
      "What is the single irreversible element of the decision currently facing you?",
      "Are you choosing this option because it is truly optimal, or merely because it is familiar?",
      "What would you decide right now if you were completely unconcerned with external approval?"
    ],
    microActions: [
      "Make one overdue low-risk decision right now within the next 5 minutes.",
      "Write down the best-case, worst-case, and most likely outcome for an upcoming strategic choice.",
      "Identify one 'reversible door' decision on your desk and execute it immediately.",
      "List the top 3 criteria that must be satisfied before you say 'yes' to new opportunities today.",
      "Calculate the margin of safety in your current schedule and add a 20-minute buffer."
    ]
  },

  "Critical Thinking & Inversion": {
    openers: [
      "To solve a complex problem, turn it upside down and ask how to guarantee absolute failure.",
      "The easiest person to fool is always yourself; therefore, intellectual honesty is your primary armor.",
      "A belief that cannot withstand rigorous cross-examination does not deserve your allegiance.",
      "Inversion is the secret of masters: avoid stupidity consistently rather than seeking intermittent brilliance.",
      "Correlation is not causation, and loud conviction is not proof.",
      "Question the premises upon which the entire debate is being waged.",
      "When everyone is looking at the door, look at the hinges.",
      "Do not look only for evidence that confirms your theory; hunt obsessively for what disproves it.",
      "Cognitive biases are not character flaws; they are standard operating bugs in human hardware.",
      "True critical thinking is the willingness to abandon your favorite hypothesis when the data disagrees.",
      "Beware of answers that promise simple remedies for inherently complex systems.",
      "Look for the hidden incentive behind every argument presented to you as objective truth.",
      "Ask not just 'Is this true?' but 'Under what specific conditions does this cease to hold?'",
      "Most disasters are not caused by bad luck, but by predictable vulnerabilities left unaddressed.",
      "Falsification is the true hallmark of scientific and practical intelligence."
    ],
    cores: [
      "Invert the question: instead of asking how to succeed, list every way to guarantee failure and avoid them.",
      "Identify the survivorship bias in the success stories you routinely consume.",
      "Subject your most cherished opinion to an adversarial cross-examination.",
      "Check for confirmation bias: what piece of recent news did you accept uncritically because you liked it?",
      "Trace the incentives of the speaker before adopting their conclusions as your own.",
      "Examine whether you are mistaking a symptom for the underlying causal pathology.",
      "Ask what unstated assumptions are holding the current consensus together.",
      "Test whether the opposite of your current strategy might produce an equally viable path.",
      "Look for the boundary conditions where standard advice breaks down completely.",
      "Audit your language for emotional loaded words that masquerade as objective descriptions."
    ],
    closers: [
      "Avoiding predictable traps yields greater long-term success than chasing elusive brilliance.",
      "A mind trained in inversion sees risks that others walk into blindly.",
      "Protect your intellectual independence; it is the rarest commodity in the modern world.",
      "Dismantle the illusion before it dismantles your progress.",
      "Think rigorously today so you do not have to regret tomorrow."
    ],
    reflections: [
      "If you wanted to guarantee the total failure of your current project, what would you do today?",
      "What belief do you hold most passionately that might be completely wrong?",
      "Where are you currently mistaking a correlation for a direct cause-and-effect relationship?",
      "Who benefits most if you continue to believe your current working hypothesis?",
      "What is the single counter-argument that would force you to change your mind on this matter?"
    ],
    microActions: [
      "Write down 3 ways you could completely derail your goals this week, and plan safeguards against them.",
      "Find one authoritative article or source that disagrees with your current viewpoint and read it calmly.",
      "Audit your main problem using inversion: list 5 things NOT to do today.",
      "Identify one recurring mistake from your past and write down its earliest warning sign.",
      "Spend 5 minutes challenging the primary assumption underlying your afternoon schedule."
    ]
  },

  "Execution & Taking Action": {
    openers: [
      "Ideas without execution are merely pleasant hallucinations.",
      "Action creates clarity; waiting in stillness only breeds endless rationalization.",
      "The distance between your ambition and your reality is called disciplined execution.",
      "Small actions taken with fierce consistency will dismantle the most monumental obstacle.",
      "Do not wait for motivation to strike; take the first step and let momentum generate the energy.",
      "A mediocre plan executed with violent intensity beats a perfect plan stranded in deliberation.",
      "Procrastination is often perfectionism wearing a disguise of prudence.",
      "Break the inertia today; a rolling stone requires very little force to keep moving.",
      "Execution is the ultimate filter: it separates serious builders from perpetual dreamers.",
      "The first twenty minutes of focused work dissolve eighty percent of your initial resistance.",
      "Stop preparing to begin; begin, and refine the execution in mid-flight.",
      "Momentum is built in the micro-decisions of the present minute, not in future grand gestures.",
      "Action is the antidote to anxiety; move your hands and the mind will settle.",
      "Do the hard, meaningful thing first before the day fractures into low-value distractions.",
      "Execution does not require inspiration; it requires a standard of professional commitment."
    ],
    cores: [
      "Shrink the initial step until resistance vanishes: make the entry threshold ridiculously small.",
      "Focus entirely on the input you control rather than the output you desire.",
      "Time-box your execution into an unbroken 25-minute sprint of high-intensity focus.",
      "Eliminate every setup friction that stands between you and the physical start of the task.",
      "Ship the prototype today; real-world feedback is a thousand times more valuable than internal debate.",
      "Treat today's commitment as a non-negotiable contract with your future self.",
      "Move from planning to physical motion within 60 seconds of deciding what must be done.",
      "Focus on velocity over perfection: iterate rapidly based on concrete feedback.",
      "Cut through the administrative underbrush and attack the core bottleneck directly.",
      "Build the habit of finishing: close open loops before opening new fronts."
    ],
    closers: [
      "Move with deliberate intent. Let your actions do the talking.",
      "One finished milestone is worth more than a library of unfinished masterpieces.",
      "Execution transforms abstract potential into undeniable reality.",
      "Step onto the field. The world rewards those who deliver results.",
      "Let today be marked by what you completed, not merely what you intended."
    ],
    reflections: [
      "What is the single most important action you have been putting off this week?",
      "If you could only accomplish one meaningful task before sunset, which one moves the needle most?",
      "What micro-step can you take in the next 10 minutes to break your current inertia?",
      "Where are you hiding behind research and planning to avoid the friction of real execution?",
      "How would a world-class professional in your field execute the task in front of you today?"
    ],
    microActions: [
      "Start a 15-minute focused sprint right now on your highest-leverage task without checking notifications.",
      "Complete and send that one email or message you have hesitated to dispatch.",
      "Clear your immediate desk surface of everything except the materials needed for your next task.",
      "Break your biggest project down into 3 tiny, 10-minute micro-tasks and do the first one immediately.",
      "Set a countdown timer for 20 minutes and finish a draft of your pending deliverable."
    ]
  },

  "Resilience & Adversity": {
    openers: [
      "The obstacle in front of you is not blocking the path; the obstacle IS the path.",
      "Antifragility is the art of becoming stronger precisely because of turbulence and stress.",
      "Setbacks do not define your trajectory; your response to setbacks dictates everything.",
      "A tree with deep roots does not fear the fiercest storm; it uses the wind to strengthen its wood.",
      "When circumstances turn adverse, remember that pressure is the prerequisite for transformation.",
      "You cannot control the storm, but you have absolute sovereignty over your rudder and sails.",
      "Adversity introduces a person to their true capabilities.",
      "What hurts today will be your source of strategic wisdom and resilience tomorrow.",
      "Do not pray for an easy life; cultivate the fortitude to endure and conquer a difficult one.",
      "Failure is not the opposite of success; it is the raw data through which success is engineered.",
      "Every crisis contains the seed of an equivalent or greater opportunity for those who remain alert.",
      "When everything seems to be going against you, remember that airplanes take off against the wind.",
      "Fatigue makes cowards of us all; rest when necessary, but never abandon your post.",
      "The strongest steel is forged in the hottest furnace of challenge.",
      "Resilience is not the absence of difficulty; it is the refusal to surrender your agency."
    ],
    cores: [
      "Reframe the setback immediately: ask 'What does this adversity make possible that was impossible before?'",
      "Separate the objective event from the emotional catastrophe you are tempted to paint over it.",
      "Focus 100% of your cognitive bandwidth on the variables still within your direct control.",
      "Treat this difficult season as an intensive training ground for mental toughness and endurance.",
      "Accept the current reality without bitterness, then take the next constructive step with dignity.",
      "Look back at past crises you survived: draw confidence from your proven track record of recovery.",
      "Break the crisis into manageable 1-hour increments; win the immediate hour in front of you.",
      "Adopt the mindset of a student: extract the strategic lesson before discarding the painful wrapper.",
      "Maintain your daily non-negotiables especially when external conditions feel chaotic.",
      "Anchor yourself in your core values; storms pass, but principles remain immovable."
    ],
    closers: [
      "Stand firm. You have endured before, and you will emerge stronger from this.",
      "Let adversity test your foundation; it will only prove how deep your roots run.",
      "Rise above the turbulence with calm resolve and unyielding purpose.",
      "The test is temporary; the character forged through it is permanent.",
      "Bend when necessary, but never break. Your resilience is your invincible shield."
    ],
    reflections: [
      "What past hardship seemed devastating at the time but ultimately produced your greatest strength?",
      "What is the single constructive response you can choose right now to your current difficulty?",
      "Which part of your current trial is outside your control, and can you let go of trying to control it?",
      "What would your most resilient, grounded self do in this exact situation today?",
      "What valuable lesson is this current friction trying to teach you before you move forward?"
    ],
    microActions: [
      "Write down the current difficulty, then list 3 positive adaptations it forces you to develop.",
      "Take 5 slow, deep breaths, drop your shoulders, and consciously release physical tension.",
      "Identify one thing going wrong today and write down the single immediate remedy you can execute.",
      "Reach out with a short encouraging note to someone who supported you during past challenges.",
      "Commit to one small physical act of discipline today (walk, workout, hydration) to ground your energy."
    ]
  },

  "Emotional Mastery & Equanimity": {
    openers: [
      "Between stimulus and response there is a sacred space; in that space lies your freedom.",
      "He who angers you conquers you. Guard your emotional perimeter with absolute vigilance.",
      "Equanimity is not numbness; it is the profound capacity to feel without losing your inner center.",
      "A calm mind can dissect problems that send a panicked intellect into paralysis.",
      "Do not allow the reactive moods of others to dictate the temperature of your own soul.",
      "Inner peace is the ultimate competitive advantage in a chaotic, reactive world.",
      "When you master your emotions, you master your decisions; when you master decisions, you master destiny.",
      "The highest form of power is restraint: the ability to pause when provoked.",
      "Never make a permanent decision based on a temporary emotional storm.",
      "Your mind is a citadel; do not hand the keys over to every passing irritant.",
      "Serenity is found not in freedom from the storm, but in peace amid the storm.",
      "Observe your feelings like passing clouds in the sky—acknowledge them, but do not become them.",
      "Emotional maturity is the ability to hold two opposing thoughts without losing your composure.",
      "Breathe deeply before you respond. The extra three seconds will save you months of regret.",
      "True sovereignty begins when external circumstances lose their power to disturb your inner peace."
    ],
    cores: [
      "Practice the 10-second pause: when triggered, breathe slowly through your nose before speaking.",
      "Label the emotion accurately without judgment: 'I am experiencing frustration, but I am not frustration.'",
      "Recognize that people's hurtful behavior is almost always a reflection of their pain, not your worth.",
      "Release the need to win every trivial argument; preserve your cognitive energy for what matters.",
      "Decouple your self-worth from external validation, praise, or temporary criticism.",
      "Observe where physical tension gathers in your body during stress and consciously soften those muscles.",
      "Adopt an attitude of benign curiosity toward situations that normally provoke irritation.",
      "Remind yourself that 99% of daily irritations will be completely forgotten in twelve months.",
      "Cultivate the habit of internal stillness through brief, deliberate pauses throughout the day.",
      "Transform reactive impulses into deliberate, strategic responses through disciplined self-governance."
    ],
    closers: [
      "Walk with quiet dignity and unshakeable poise. Your peace is non-negotiable.",
      "Master the inner sanctuary, and the outer world will yield to your calm strength.",
      "A quiet spirit is a fortress that no external noise can breach.",
      "Choose equanimity today; it is the highest gift you can offer your mind.",
      "Remain centered, clear, and composed. Everything else is secondary."
    ],
    reflections: [
      "What specific trigger caused you to lose your composure recently, and what was the root insecurity?",
      "Where are you currently giving someone else the power to dictate your emotional state?",
      "How would you handle your most stressful current situation if you were completely unbothered?",
      "What emotion are you currently resisting or suppressing instead of observing with calm acceptance?",
      "In what area of your life would a 10% increase in emotional restraint yield massive dividends?"
    ],
    microActions: [
      "Take 2 minutes right now for box breathing: 4s inhale, 4s hold, 4s exhale, 4s hold for 4 cycles.",
      "Identify one potential trigger you will encounter today and mentally rehearse responding with calm poise.",
      "Step away from your screen for 5 minutes and sit in total silence with your eyes closed.",
      "Write down the single thought causing you anxiety today and cross it out with a steady line.",
      "Choose one conversation today where you will listen completely without interrupting or defending yourself."
    ]
  },

  "Career, Wealth & Leverage": {
    openers: [
      "Wealth is not about having more things; it is about owning your time and having asymmetric freedom.",
      "The greatest returns in life come from the compound interest of skills, relationships, and capital.",
      "Do not sell your time by the hour; build systems, judgment, and assets that work while you sleep.",
      "High-agency individuals do not wait for permission; they find the leverage point and move the world.",
      "In the modern economy, specialized judgment and clear thinking are rewarded a thousandfold over sheer labor.",
      "Focus on creating immense, indisputable value for others, and financial returns become inevitable.",
      "Avoid status games that consume your energy for zero real leverage; play positive-sum games instead.",
      "Your professional reputation is an intangible asset that compounds invisibly until it unlocks everything.",
      "Position yourself at the intersection of your unique skills, deep curiosity, and high market demand.",
      "Money is a tool for autonomy, not a scorecard for comparison with peers.",
      "Learn to use code, media, capital, and specialized knowledge to amplify your daily output.",
      "Never depend on a single stream of income or a single point of failure in your livelihood.",
      "The ability to think deeply for two uninterrupted hours is rarer and more valuable than working 14 distracted hours.",
      "True financial independence is having the freedom to say 'no' to anything that compromises your integrity.",
      "Invest in your own intellectual capital; it is the only asset that cannot be inflated away or confiscated."
    ],
    cores: [
      "Stack complementary skills: being top 20% in three diverse domains makes you unique in the world.",
      "Focus on building equity and asymmetric assets rather than merely optimizing for linear wages.",
      "Eliminate low-leverage administrative busywork to protect time for high-value strategic thinking.",
      "Negotiate from a position of independent strength and clear alternative options.",
      "Audit your professional energy: invest 80% of your effort into your top 20% revenue drivers.",
      "Solve hard, messy problems that others avoid; scarcity of problem-solvers creates leverage.",
      "Protect your downside risk in every venture so that you can remain in the game indefinitely.",
      "Cultivate the habit of rigorous financial literacy and disciplined asset accumulation.",
      "Deliver results ahead of schedule with uncommon distinction and meticulous polish.",
      "Position your work where exponential compounding can take effect over multi-year horizons."
    ],
    closers: [
      "Build with patience, compound with discipline, and own your sovereignty.",
      "Create value that outlasts today's transaction.",
      "Leverage your intellect to build lasting freedom for yourself and those you love.",
      "Play long games with long-term people. The compounding will astonish you.",
      "Your career is an enterprise; manage it with strategic foresight and uncompromising integrity."
    ],
    reflections: [
      "What is the single highest-leverage task in your work that you have been neglecting?",
      "If you could not trade your time for money, how would you structure value creation in your life?",
      "Which two complementary skills could you combine to create an unfair advantage in your field?",
      "What expense or status trap is currently draining capital that could be invested in your autonomy?",
      "Where are you currently doing $10/hour work that could be automated, delegated, or eliminated?"
    ],
    microActions: [
      "Identify your single most profitable or highest-leverage activity and schedule 60 uninterrupted minutes for it.",
      "Audit one recurring subscription or unnecessary monthly expense and cancel it immediately.",
      "Draft a 3-point outline of an asset, tool, or resource you can create once and leverage many times.",
      "Send a concise, value-packed update to a high-value client, partner, or mentor.",
      "Spend 10 minutes studying an investment, tax strategy, or business model you want to master."
    ]
  },

  "Relationships & Boundaries": {
    openers: [
      "Clear boundaries are the distance at which I can love both you and myself simultaneously.",
      "You teach people how to treat you by what you tolerate, what you reward, and what you walk away from.",
      "A relationship that costs your inner peace or self-respect is far too expensive to maintain.",
      "Speak the truth with kindness, but never sacrifice clarity to appease temporary discomfort.",
      "Surround yourself with people whose standards inspire your elevation, not those who normalize mediocrity.",
      "True intimacy requires radical honesty; polite pretenses only build hollow connections.",
      "A firm 'no' spoken with calm dignity is an act of deep self-respect and integrity.",
      "Do not try to fix or rescue those who are committed to their own dysfunction.",
      "Invest your deepest loyalty in those who stood beside you in the trenches of difficulty.",
      "Communication is not just what you say, but the safety and clarity you create for others to be real.",
      "Protect your energetic perimeter; not everyone deserves unlimited access to your mind and life.",
      "Assume positive intent where possible, but verify behavior through consistent patterns over time.",
      "Unspoken expectations are premeditated resentments waiting to detonate.",
      "Be slow to judge, quick to forgive, but uncompromising in the preservation of healthy boundaries.",
      "The highest form of connection is two whole, sovereign individuals walking together by choice."
    ],
    cores: [
      "State your boundaries clearly and neutrally without over-explaining or apologizing for your needs.",
      "Audit your closest 5 relationships: do they expand your vision or drain your emotional vitality?",
      "Address friction directly and promptly before minor misunderstandings calcify into bitterness.",
      "Stop taking responsibility for emotions, reactions, and problems that belong to other adults.",
      "Practice generous listening: hear the need beneath the words without formulating your rebuttal.",
      "Honor your commitments scrupulously, and expect the same high standard from your inner circle.",
      "Release toxic or one-sided dynamics with grace and quiet finality; no drama is required.",
      "Express sincere gratitude to those who bring peace, truth, and loyalty into your world.",
      "Replace vague hints with explicit, compassionate requests in all important partnerships.",
      "Cultivate the courage to be misunderstood by those who benefit from your lack of boundaries."
    ],
    closers: [
      "Love deeply, communicate clearly, and protect your sovereign space with unwavering grace.",
      "Healthy boundaries are the foundation of genuine, enduring relationships.",
      "Elevate your circle, and your standards will naturally rise with them.",
      "Speak your truth with calm certainty; those who belong in your life will respect it.",
      "Honor yourself first so that you can show up whole for the world."
    ],
    reflections: [
      "Where in your life are you saying 'yes' to others when your soul is screaming 'no'?",
      "What boundary have you hesitated to set because you fear someone's negative reaction?",
      "Who in your life consistently energizes and inspires you, and when did you last thank them?",
      "What unspoken expectation is currently causing frustration in one of your key relationships?",
      "Are your current boundaries protecting your priorities or isolating you from growth?"
    ],
    microActions: [
      "Communicate one polite, definitive 'no' today to a request that misaligns with your top priorities.",
      "Send an authentic text of appreciation to someone who has been a pillar of integrity in your life.",
      "Write down the terms of a personal boundary you need to establish and rehearse stating it neutrally.",
      "In your next conversation, listen for 3 full minutes without checking your phone or interrupting.",
      "Identify one draining relationship pattern and write down the single boundary that corrects it."
    ]
  },

  "Mastery & Deep Learning": {
    openers: [
      "Mastery is not a destination you reach; it is a devotion to the craft that deepens every day.",
      "To learn deeply, you must have the humility to look foolish in the beginning.",
      "Deliberate practice at the edge of your ability compounds into effortless brilliance.",
      "Do not collect superficial knowledge; master the foundational principles that govern the whole domain.",
      "The amateur practices until they can get it right; the master trains until they cannot get it wrong.",
      "Curiosity is the engine of intellect; protect your wonder like a sacred flame.",
      "Real skill is built in the quiet, unglamorous hours of repetition that nobody will ever witness.",
      "Do not fear complexity; break it into its constituent atoms and master each one systematically.",
      "The best way to understand a subject deeply is to attempt to teach it to an intelligent novice.",
      "Feedback is the lifeblood of mastery; seek out rigorous critiques that dismantle your weaknesses.",
      "True learning changes your behavior; if your actions have not evolved, you have merely collected trivia.",
      "Immerse yourself in the classics and timeless works before chasing the fleeting trends of the week.",
      "Hone your mental instruments daily; a sharp mind cuts through confusion effortlessly.",
      "Mastery requires saying 'no' to a thousand seductive diversions to go deep on what is essential.",
      "The joy of mastery is found in the refined nuance that untrained eyes can never perceive."
    ],
    cores: [
      "Isolate the single weakest link in your current skillset and design a targeted drill to fix it.",
      "Apply the Feynman technique: explain your core concept in simple terms on a single page.",
      "Study the masters in your field: deconstruct their workflows, mental models, and decision habits.",
      "Embrace the discomfort of the stretch zone; true cognitive growth only happens under deliberate load.",
      "Build a personal feedback loop that gives you objective, unvarnished data on your performance.",
      "Read deeply across disciplines to find unexpected analogies and creative cross-pollinations.",
      "Spend time refining your fundamentals; advanced maneuvers are just basic principles executed with perfection.",
      "Take rigorous notes that synthesize concepts into your own conceptual vocabulary and frameworks.",
      "Replace passive consumption with active generation: build, write, code, or solve from scratch.",
      "Commit to incremental daily improvement—one percent daily refinement transforms everything in a year."
    ],
    closers: [
      "Dedicate yourself to excellence. The world has enough mediocrity.",
      "Refine your craft with patience and reverence. Mastery is its own reward.",
      "Let your work speak with the undeniable authority of deep preparation.",
      "Learn voraciously, practice deliberately, and elevate your standards every single day.",
      "The path of mastery is infinite; take joy in the perpetual climb."
    ],
    reflections: [
      "What foundational skill in your craft have you neglected because it felt too basic to practice?",
      "If you had to explain your current area of expertise to a 10-year-old, where would your explanation falter?",
      "What is the single biggest weakness in your professional skillset that you need to address this month?",
      "Are you actively producing and testing what you learn, or merely consuming educational content?",
      "Who is the master whose work sets the gold standard for your field, and what can you deconstruct from them?"
    ],
    microActions: [
      "Spend 15 minutes deliberately practicing the single hardest part of your craft without shortcuts.",
      "Summarize the key takeaway from the last book or article you read into 3 actionable bullet points.",
      "Identify one complex topic you need to master and write out a simplified 1-paragraph explanation.",
      "Deconstruct a high-performing example in your field and list 3 specific techniques they utilized.",
      "Set aside 20 minutes today for focused, active skill-building with zero multitasking."
    ]
  },

  "Discipline & Compounding Habits": {
    openers: [
      "Discipline is not self-punishment; it is the ultimate expression of self-love and long-term vision.",
      "You do not rise to the level of your goals; you fall to the level of your daily systems and habits.",
      "Motivation gets you started, but cold, reliable discipline carries you across the finish line.",
      "Small, seemingly insignificant habits compounded over five years produce miraculous results.",
      "The pain of self-discipline is measured in ounces; the pain of regret is measured in tons.",
      "Design your environment so that good decisions are frictionless and destructive habits are painful.",
      "Every action you take is a vote for the type of person you wish to become.",
      "Consistency beats intermittent genius every single time. Show up every day.",
      "When you conquer your morning, you establish command over the entire trajectory of the day.",
      "Discipline creates freedom: financial discipline brings wealth, physical discipline brings vitality.",
      "Do what needs to be done, even when every impulse in your body screams for comfort.",
      "Identity-based habits endure: do not say 'I am trying to write,' declare 'I am a writer.'",
      "The true test of character is doing the right thing when nobody is watching and no praise is offered.",
      "Routine, in an intelligent mind, is not a prison; it is a launchpad for extraordinary ambition.",
      "Master the small non-negotiables, and the monumental achievements will take care of themselves."
    ],
    cores: [
      "Anchor a new habit to an existing routine: 'After I finish my morning coffee, I will immediately write for 15 minutes.'",
      "Remove the environmental cue that triggers your most counter-productive time-wasting habit.",
      "Focus on never breaking the chain twice: if you miss a day, show up without fail the next day.",
      "Lower the activation barrier for positive habits: place your tools, books, and gear ready the night before.",
      "Treat your daily calendar as a binding contract; respect your time blocks as sacred appointments.",
      "Track your leading indicators (daily inputs) rather than obsessing over lagging metrics.",
      "Build a standard of personal excellence that does not fluctuate with the weather or your mood.",
      "Replace willpower with automated structural constraints that keep you aligned with your goals.",
      "Celebrate small victories of self-command to reinforce your neurological reward circuits.",
      "Embrace the quiet rhythm of daily execution; real greatness is built through patient consistency."
    ],
    closers: [
      "Hold the line today. Your future self is counting on your discipline.",
      "Build habits of iron, and they will forge a destiny of gold.",
      "Show up. Do the work. Let the compounding quietly change your world.",
      "Self-discipline is your sovereignty. Guard it with uncompromising pride.",
      "Every disciplined choice today builds an unbreakable foundation for tomorrow."
    ],
    reflections: [
      "Which daily habit, if practiced with 100% consistency for one year, would transform your life most?",
      "What environment or cue in your daily routine is actively sabotaging your discipline?",
      "Where are you currently relying on fleeting willpower instead of building a reliable system?",
      "If someone watched your daily actions without hearing your words, what would they conclude your priorities are?",
      "What is the single small promise you made to yourself that you need to honor today?"
    ],
    microActions: [
      "Set out everything you need for your primary morning task tonight so you can begin without friction tomorrow.",
      "Complete one 10-minute micro-habit right now that you have struggled to maintain consistently.",
      "Remove one distracting app from your phone's home screen to eliminate unconscious scrolling.",
      "Write down your 3 non-negotiable daily habits on an index card and place it beside your workstation.",
      "Track today's habits on your Akuche streak tracker immediately after completing them."
    ]
  },

  "Vision, Purpose & Long Horizons": {
    openers: [
      "He who has a why to live can bear almost any how.",
      "Think in decades, plan in years, execute in days, and live in the present moment.",
      "A life without a clear North Star is tossed about by every passing cultural wave.",
      "Play long-term games with long-term people; almost all meaningful value in life compounds at the end.",
      "Do not trade your 20-year legacy for a 20-minute hit of superficial convenience.",
      "Vision is the art of seeing what is invisible to those trapped in immediate circumstance.",
      "When your purpose is clear, difficult choices become straightforward and distractions lose their allure.",
      "Live with a sense of destiny: your life is a singular canvas, paint it with bold strokes.",
      "The greatest projects are not built in a frenzy, but through decades of patient devotion.",
      "Anchor your ambition in something greater than your own ego, and you will become unstoppable.",
      "Look past the horizon of today's petty friction toward the legacy you intend to leave behind.",
      "A noble purpose clarifies what to sacrifice and infuses every daily struggle with dignity.",
      "Do not measure your life by the applause of the crowd, but by the alignment with your true mission.",
      "Plant trees under whose shade you may never sit; this is the beginning of true wisdom.",
      "When you know where you are going, the entire universe steps aside to make room."
    ],
    cores: [
      "Draft a 10-year vision statement that outlines your character, impact, and freedom.",
      "Filter today's opportunities through your North Star: if it does not serve the mission, decline it.",
      "Assess whether your daily calendar reflects your stated life priorities or merely other people's emergencies.",
      "Align your current sacrifices with the specific legacy you wish your children and community to inherit.",
      "Cultivate the patient temperament required to see long-horizon compounding through to fruition.",
      "Audit your life for activities that look good on the outside but feel hollow on the inside.",
      "Choose the harder path with the enduring horizon over the easy path that leads to stagnation.",
      "Ground your purpose in service to others; genuine fulfillment is found in lifting those around you.",
      "Regularly step back from tactical weeds to calibrate your compass against your overarching purpose.",
      "Maintain unshakeable faith in your ultimate destination while confronting the brutal facts of your current reality."
    ],
    closers: [
      "Keep your eyes on the summit. The ascent is demanding, but the view is magnificent.",
      "Live for what truly matters. Let trivialities fade into irrelevance.",
      "Walk your path with conviction. Your purpose is your unquenchable light.",
      "Play the long game with unwavering patience and fierce daily execution.",
      "Make your life a masterwork of intentional purpose and lasting contribution."
    ],
    reflections: [
      "What is the single overarching purpose that gives meaning to all your current efforts?",
      "If you knew you only had 5 years of healthy life remaining, what would you immediately stop doing?",
      "Are your current daily actions building toward your 10-year vision or merely maintaining your current state?",
      "What legacy do you want to leave in the hearts and minds of the people you interact with daily?",
      "Where in your life have you traded long-term fulfillment for short-term instant gratification?"
    ],
    microActions: [
      "Write down your core 10-year aspiration in one bold, inspiring paragraph.",
      "Review your schedule for this week and cancel or reschedule one item that conflicts with your long-term vision.",
      "Spend 10 minutes journaling on what truly matters to you beyond money and social status.",
      "Identify one long-term project you have postponed and take one small concrete step to initiate it today.",
      "Place a visual reminder of your North Star or core goal on your desk or mobile wallpaper."
    ]
  },

  "Problem Solving & Innovation": {
    openers: [
      "Every difficult problem contains the exact components needed for its breakthrough resolution.",
      "Do not fight the old model; build a new model that makes the existing reality obsolete.",
      "The bottleneck in a system dictates the maximum throughput of the entire operation.",
      "Creative breakthroughs occur at the intersection of two fields that have never been connected before.",
      "If a problem cannot be solved as stated, reframe the boundaries and change the rules of the game.",
      "A problem well defined is a problem eighty percent solved.",
      "Do not look for complicated solutions to complex problems; look for elegant simplicity.",
      "Innovation is not about adding more features; it is about ruthlessly eliminating the non-essential.",
      "When conventional methods fail, look for the unconventional anomaly that points toward the truth.",
      "Find the single critical constraint, remove it, and the entire system leaps forward.",
      "Creativity is intelligence having fun while solving serious structural bottlenecks.",
      "Question the sacred cows of your industry; the greatest opportunities lie where dogma is unexamined.",
      "Break the problem into modular pieces, solve the hardest core first, and the rest becomes trivial.",
      "Look at what everyone in your space takes for granted, and test whether the exact opposite works better.",
      "True ingenuity is doing more with less: achieving maximum leverage with minimal resource."
    ],
    cores: [
      "Identify the single Theory of Constraints bottleneck that is throttling your entire project.",
      "Apply lateral thinking: ask how an architect, a biologist, or a military general would solve this problem.",
      "Conduct a 'pre-mortem': imagine your solution has failed catastrophically, and list the reasons why.",
      "Eliminate the lowest 50% of complexity in your workflow to expose the core dynamic.",
      "Combine two unrelated tools or ideas to create a novel, high-efficiency workflow.",
      "Test small, low-risk prototypes before committing substantial capital or time to a solution.",
      "Look for the root structural cause rather than treating superficial symptoms repeatedly.",
      "Invert the flow: what if the customer, user, or stakeholder came to you instead of you chasing them?",
      "Strip the problem down to its physical and mathematical constraints; discard all social convention.",
      "Iterate through fast feedback cycles to let real-world constraints shape the optimal design."
    ],
    closers: [
      "Find the leverage point, apply calculated force, and watch the obstacle give way.",
      "Solve for elegance and simplicity. The best solution always looks obvious in hindsight.",
      "Innovate with boldness; the world is shaped by those who refuse to accept broken systems.",
      "Dismantle the bottleneck, unleash momentum, and create the breakthrough.",
      "Your intellect was designed to solve difficult puzzles. Attack the problem with relish."
    ],
    reflections: [
      "What is the single structural bottleneck currently holding back your main project or business?",
      "If you had to solve your biggest problem with zero budget and half the time, what would you do?",
      "Which industry standard or conventional rule are you following that might be totally outdated?",
      "How would a world-class expert from a completely different domain look at your current challenge?",
      "What symptom have you been repeatedly treating instead of fixing the root causal mechanism?"
    ],
    microActions: [
      "Map out the full workflow of your project on paper and circle the single biggest bottleneck.",
      "Brainstorm 10 wild, unconventional solutions to your current problem without judging any of them for 7 minutes.",
      "Eliminate one unnecessary step from your daily operational workflow right now.",
      "Ask a colleague or friend from outside your field how they would approach your current challenge.",
      "Draft a 1-page pre-mortem identifying potential failure points in your upcoming launch or project."
    ]
  },

  "Self-Awareness & Blind Spots": {
    openers: [
      "The unexamined life is not worth living, but the unexamined ego is a danger to everyone.",
      "Your blind spots are invisible to you by definition; you need radical humility and feedback to see them.",
      "What you resist in yourself will persist and control you from the shadows.",
      "Self-awareness is the superpower that turns raw intelligence into genuine wisdom and maturity.",
      "You cannot fix what you refuse to acknowledge. Radical self-honesty is the beginning of transformation.",
      "Notice where you become defensive; that is precisely where your ego is protecting an unexamined insecurity.",
      "True confidence does not require arrogance; it is grounded in a calm, accurate assessment of reality.",
      "Do not believe everything you think; your mind is a master rationalizer of your emotional impulses.",
      "Audit your internal narrative: are you the proactive architect of your life or a professional victim?",
      "Look into the mirror of your results: your current life is an accurate reflection of your past habits.",
      "Knowing others is intelligence; knowing yourself is true enlightenment.",
      "When you shine the light of conscious awareness on a shadow pattern, it loses its compulsive power.",
      "Stop defending your limitations if you truly wish to transcend them.",
      "Pay attention to the recurring patterns in your life; if the same drama keeps repeating, you are the common denominator.",
      "The greatest act of courage is looking directly at your own flaws without flinching or self-loathing."
    ],
    cores: [
      "Conduct a fearless self-inventory: list your top 3 strengths and your top 3 recurring vulnerabilities.",
      "Ask a trusted, candid mentor: 'What is one blind spot that holds me back from my next level?'",
      "Notice the physical sensations in your body when you feel the urge to justify, rationalize, or blame.",
      "Separate your identity from your beliefs: you are the conscious observer, not the opinion.",
      "Acknowledge where you have made excuses and replace them with radical personal ownership.",
      "Examine what you judge most harshly in others; it is often a disowned part of your own shadow.",
      "Track your energy levels throughout the day to discover your natural biological peaks and troughs.",
      "Observe your inner critic with compassionate detachment; do not let it command your actions.",
      "Calibrate your confidence with intellectual humility: always leave room for the possibility of being wrong.",
      "Align your public persona with your private character; dissonance between them drains immense vitality."
    ],
    closers: [
      "Know yourself deeply, accept yourself honestly, and upgrade yourself continually.",
      "When self-deception ends, genuine mastery begins.",
      "Walk in total alignment with your truth. Authenticity is unbeatable power.",
      "Look within with courage; the treasure you seek is hidden in the cave you fear to enter.",
      "Master your internal landscape, and you will navigate the outer world with effortless poise."
    ],
    reflections: [
      "Where in your life are you currently blaming external circumstances for something you contributed to?",
      "What harsh truth about your current habits have you been actively avoiding looking at?",
      "What recurring criticism have multiple people given you that you have dismissed with defensiveness?",
      "If someone recorded your private thoughts today, would they find an encouraging coach or a cruel critic?",
      "What is the single blind spot that, if corrected, would elevate every area of your life?"
    ],
    microActions: [
      "Write down 3 honest observations about your current weaknesses without any self-judgment.",
      "Ask one trusted friend or colleague for one specific piece of constructive feedback today.",
      "Spend 5 minutes observing your thoughts without reacting, judging, or engaging with them.",
      "Identify one excuse you caught yourself making today and write down the full-ownership version.",
      "List 3 things you are genuinely doing well to balance self-critique with healthy self-acknowledgment."
    ]
  },

  "Focus, Energy & Deep Work": {
    openers: [
      "Where your focus goes, your life grows; protect your attention like your most precious finite asset.",
      "Distraction is the thief of greatness; high achievement requires prolonged, uninterrupted cognitive depth.",
      "You cannot do deep work with a shallow mind addicted to constant novelty and micro-stimulations.",
      "Energy management is far more critical than time management; a focused hour beats eight exhausted hours.",
      "Saying 'no' to good opportunities is the only way to say 'yes' to monumental breakthroughs.",
      "The ability to concentrate without distraction on a demanding task is the defining skill of the 21st century.",
      "Treat your morning attention like sacred ground; do not let notifications and news trample through it.",
      "Multitasking is a myth; it is merely rapid, exhausting context-switching that degrades output quality.",
      "Deep focus requires deep rest: honor your sleep, movement, and recovery as strategic imperatives.",
      "Clear your physical and digital workspaces of clutter; friction in your environment creates fatigue in your mind.",
      "Work intensely when you work; rest deeply when you rest. Never live in the miserable twilight of half-work.",
      "Your energy is an ecosystem: nourish your body, calm your nervous system, and sharpen your focus.",
      "Guard the first two hours of your workday for your single most important project.",
      "Eliminate low-value shallow tasks before they metastasize and consume your cognitive bandwidth.",
      "A laser beam cuts through solid steel because it concentrates light into a single point; focus your mind similarly."
    ],
    cores: [
      "Enter 'Monk Mode' for 90 minutes: silence all devices, close browser tabs, and execute a single task.",
      "Batch your shallow administrative tasks (emails, messages, quick calls) into a single afternoon window.",
      "Protect your sleep hygiene religiously: dark room, cool temperature, and zero screens 60 minutes before bed.",
      "Take structured 5-minute movement breaks between deep work blocks to reset your cognitive focus.",
      "Eliminate background noise and visual clutter from your immediate field of vision.",
      "Fuel your brain with clean hydration and nutrient-dense nutrition to prevent energy crashes.",
      "Set a clear, unambiguous definition of 'done' before beginning any deep work session.",
      "Say a polite but definitive 'no' to meetings that lack a clear agenda or actionable decision.",
      "Use binaural beats, brown noise, or silence to create an immersive focus bubble.",
      "Honor your biological peak hours: schedule your hardest cognitive tasks when your energy is highest."
    ],
    closers: [
      "Focus with ruthless precision. Deliver greatness in silence.",
      "Protect your attention; it is the currency with which you purchase your future.",
      "Work deeply, live fully, and leave distraction behind.",
      "Single-minded concentration moves mountains that scattered effort cannot budge.",
      "Direct your energy like a master craftsman. Your focus is your superpower."
    ],
    reflections: [
      "What is the single biggest distraction currently stealing hours of your cognitive bandwidth each day?",
      "During which 2 hours of the day is your mental clarity and creative energy naturally at its peak?",
      "How many times did you check notifications or social media during your last work session?",
      "What low-value task are you doing regularly that should be eliminated or aggressively delegated?",
      "If you worked with 100% unbroken concentration for just 3 hours today, what could you achieve?"
    ],
    microActions: [
      "Put your phone in another room or turn on 'Do Not Disturb' mode for your next 45-minute work block.",
      "Close every browser tab that is not directly related to your current task.",
      "Drink a large glass of clean water right now to instantly hydrate your brain.",
      "Schedule your top 90-minute Deep Work block on your calendar for tomorrow morning.",
      "Spend 2 minutes clearing the clutter off your physical desk before beginning work."
    ]
  },

  "Timeless Wisdom & Philosophy": {
    openers: [
      "You have power over your mind, not outside events; realize this, and you will find immense strength.",
      "Memento Mori: remember that your time on this earth is finite; let that truth distill what truly matters.",
      "Amor Fati: do not merely tolerate what happens; embrace and love your fate as the fuel for your growth.",
      "We suffer more often in imagination than in reality; do not borrow tomorrow's trouble today.",
      "He is a wise person who does not grieve for the things which he has not, but rejoices for those which he has.",
      "Waste no more time arguing about what a good human should be. Be one.",
      "The soul becomes dyed with the color of its thoughts; cultivate thoughts of nobility, courage, and truth.",
      "Life is not short; we simply waste a vast amount of it on trivialities that leave no mark.",
      "True wealth is not having immense possessions, but having few, refined, and noble desires.",
      "Everything we hear is an opinion, not a fact; everything we see is a perspective, not the truth.",
      "Stand like a cliff against which the waves continually break; it stands firm and tames the fury of the water.",
      "The happiness of your life depends upon the quality of your thoughts and the integrity of your actions.",
      "Do not seek for things to happen the way you want them to; rather, wish that what happens happens as it should.",
      "A person who fears death will never do anything worthy of a person who is alive.",
      "In the end, only three things matter: how deeply you lived, how gently you loved, and how gracefully you let go."
    ],
    cores: [
      "Practice the Dichotomy of Control: sort every current concern into what is up to you and what is not.",
      "Reflect on the cosmic perspective: look at your current dilemma against the backdrop of geological time.",
      "Embrace whatever today brings with equanimity, knowing that every circumstance is raw material for virtue.",
      "Cultivate gratitude for the simple, fundamental gifts: breath, consciousness, health, and clean water.",
      "Align your daily conduct with timeless virtues: wisdom, courage, justice, and temperance.",
      "Let go of the craving for the applause of strangers; seek only the approval of your own conscience.",
      "Treat every person you meet as an opportunity to practice kindness, patience, and understanding.",
      "Remember that no external circumstance can harm your character unless you surrender your integrity.",
      "Live this day as if it were your entire life in miniature: with intention, excellence, and peace.",
      "Anchor your spirit in the eternal present; yesterday is a memory, tomorrow is an unwritten promise."
    ],
    closers: [
      "Live with noble purpose, quiet dignity, and a grateful heart.",
      "Walk gently, think deeply, and act with unwavering integrity.",
      "Let timeless wisdom guide your footsteps through the modern maze.",
      "Be the anchor of calm and virtue in whatever room you enter today.",
      "Think Better · Decide Better · Live Better."
    ],
    reflections: [
      "If today were the final day of your earthly journey, how would you approach your interactions and tasks?",
      "Which of your current worries will matter even slightly 100 years from now?",
      "In what area of your life are you fighting against reality instead of practicing Amor Fati (loving fate)?",
      "What virtue—courage, wisdom, justice, or temperance—is life asking you to embody most today?",
      "When you examine your conscience tonight, what will you be proudest of having done today?"
    ],
    microActions: [
      "Write down the single word 'MEMENTO MORI' on a slip of paper and let it inspire deep gratitude today.",
      "Identify one situation you cannot control today and consciously speak: 'I accept this and release my grip.'",
      "Perform one small, anonymous act of kindness or service without telling a single soul.",
      "Step outside for 3 minutes, look up at the vast sky, and ground yourself in cosmic perspective.",
      "Spend 5 minutes tonight reflecting in your Akuche journal on how you practiced your core virtues today."
    ]
  }
};

/**
 * Deterministic generation algorithm to produce exactly N distinct messages per theme
 */
function generateMessagesCatalog(targetCount = 5250) {
  const messages = [];
  let globalIndex = 1;

  const countPerTheme = Math.ceil(targetCount / THEMES.length); // 350 per theme -> 5,250 total

  THEMES.forEach((theme) => {
    const focusWords = FOCUS_WORDS[theme];
    const seed = THEME_SEEDS[theme];

    if (!seed || !focusWords) {
      console.error(`Missing seed data for theme: ${theme}`);
      return;
    }

    const { openers, cores, closers, reflections, microActions } = seed;

    let themeIndex = 0;

    for (let o = 0; o < openers.length; o++) {
      for (let c = 0; c < cores.length; c++) {
        for (let cl = 0; cl < closers.length; cl++) {
          if (themeIndex >= countPerTheme) break;

          const id = `akuche-msg-${String(globalIndex).padStart(4, '0')}`;
          const focusWord = focusWords[themeIndex % focusWords.length];
          const opener = openers[o % openers.length];
          const core = cores[c % cores.length];
          const closer = closers[cl % closers.length];

          const message = `${opener} ${core} ${closer}`;
          const reflectionPrompt = reflections[themeIndex % reflections.length];
          const microAction = microActions[themeIndex % microActions.length];

          messages.push({
            id,
            theme,
            focusWord,
            message,
            reflectionPrompt,
            microAction
          });

          globalIndex++;
          themeIndex++;
        }
        if (themeIndex >= countPerTheme) break;
      }
      if (themeIndex >= countPerTheme) break;
    }
  });

  return messages;
}

// Generate the catalog
console.log("Generating 5,000+ distinct Akuche Daily Opening Messages...");
const catalog = generateMessagesCatalog(5250);

console.log(`Generated ${catalog.length} messages.`);

// Validation & Integrity Checks
const idSet = new Set();
const textSet = new Set();
const themeDistribution = {};

let validationErrors = 0;

catalog.forEach((item, idx) => {
  // 1. Unique ID check
  if (idSet.has(item.id)) {
    console.error(`Duplicate ID found: ${item.id}`);
    validationErrors++;
  }
  idSet.add(item.id);

  // 2. Unique message text check
  if (textSet.has(item.message)) {
    console.error(`Duplicate message text found at index ${idx}`);
    validationErrors++;
  }
  textSet.add(item.message);

  // 3. Field completeness
  if (!item.theme || !item.focusWord || !item.message || !item.reflectionPrompt || !item.microAction) {
    console.error(`Incomplete item at index ${idx}:`, item);
    validationErrors++;
  }

  // 4. Distribution tracking
  themeDistribution[item.theme] = (themeDistribution[item.theme] || 0) + 1;
});

console.log("\n--- THEME DISTRIBUTION ---");
Object.entries(themeDistribution).forEach(([theme, count]) => {
  console.log(`• ${theme}: ${count} messages`);
});

if (validationErrors > 0) {
  console.error(`\nFAILED: Found ${validationErrors} validation errors!`);
  process.exit(1);
} else {
  console.log(`\nSUCCESS: All ${catalog.length} messages are 100% distinct, complete, and verified!`);
}

// Save output to src/lib/inspiration/messages-catalog.json
const outputDir = path.join(__dirname, '..', 'src', 'lib', 'inspiration');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'messages-catalog.json');
fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2), 'utf-8');
console.log(`Saved messages catalog to: ${outputPath} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);
