import { DailyBrainDrop } from "./types";

export const BRAIN_UNIVERSE_DROPS: DailyBrainDrop[] = [
  // ─── 1. FOCUS & ATTENTION ──────────────────────────────────────────────────
  {
    id: "drop-attention-residue",
    cardId: "CARD-#004821",
    type: "discovery",
    category: "Focus",
    title: "Attention Residue Destroys Deep Focus",
    discovery: "When you switch between tasks or check a quick message, your attention does not follow immediately — part of your brain remains stuck on the previous task.",
    whyItMatters: "This 'attention residue' causes mental fatigue, halves working memory capacity, and makes simple tasks feel exhausting.",
    useItToday: {
      action: "Single-Task for 20 Minutes",
      mission: "Before starting your next key task, close all extra tabs and put your phone out of sight for 20 continuous minutes.",
      durationMinutes: 20,
      xpReward: 20,
    },
    scientificContext: {
      explanation: "Dr. Sophie Leroy's cognitive research at the University of Minnesota revealed that human executive control requires a transition buffer. Every brief interruption leaves active neural residue in the prefrontal cortex.",
      evidenceLevel: "Well established",
      keyStudy: "Leroy, S. (2009). 'Why is it so hard to do my work? The challenge of attention residue.'",
      relatedConcept: "Executive Attentional Control",
    },
    microChallenge: {
      question: "How long does it typically take your prefrontal cortex to fully recover focus after checking a single notification?",
      options: ["Up to 15–20 minutes", "Under 10 seconds", "1–2 minutes", "Zero time if you are young"],
      correctAnswer: "Up to 15–20 minutes",
      explanation: "Cognitive science shows that task resumption with full depth requires an average of 15 to 23 minutes due to attention residue.",
    },
    relatedWorkoutDomain: "Focus",
    tags: ["focus", "productivity", "digital distraction", "attention"],
  },

  // ─── 2. MEMORY & RETRIEVAL ─────────────────────────────────────────────────
  {
    id: "drop-retrieval-practice",
    cardId: "CARD-#004822",
    type: "technique",
    category: "Memory",
    title: "Don't Just Reread. Retrieve.",
    discovery: "Actively recalling information from memory strengthens neural pathways up to 300% more than passive reading or highlighting.",
    whyItMatters: "Passive rereading creates an 'illusion of competence', while active retrieval triggers synaptic consolidation in the hippocampus.",
    useItToday: {
      action: "The 3-Minute Blind Recall",
      mission: "After reading an article, book chapter, or meeting notes today, close it completely and write down 3 key takeaways from memory.",
      durationMinutes: 3,
      xpReward: 25,
    },
    scientificContext: {
      explanation: "Roediger & Karpicke (2006) demonstrated the 'Testing Effect': students who practiced active retrieval retained 80% of material after a week, compared to only 30% for those who repeatedly restudied.",
      evidenceLevel: "Well established",
      keyStudy: "Roediger, H. L., & Karpicke, J. D. (2006). 'The Power of Testing Memory.' Psychological Science.",
      relatedConcept: "Synaptic Plasticity & Long-Term Potentiation",
    },
    microChallenge: {
      question: "Which study technique produces the greatest long-term memory retention?",
      options: [
        "Self-quizzing and active recall",
        "Highlighting important text with colors",
        "Rereading the material 4 times",
        "Summarizing with notes open",
      ],
      correctAnswer: "Self-quizzing and active recall",
      explanation: "Active recall forces the brain to rebuild neural retrieval routes, creating resilient long-term memory traces.",
    },
    relatedWorkoutDomain: "Memory",
    tags: ["memory", "studying", "learning", "neuroscience"],
  },

  // ─── 3. HABITS & PREDICTIVE CODING ─────────────────────────────────────────
  {
    id: "drop-predictive-brain",
    cardId: "CARD-#004823",
    type: "discovery",
    category: "Habits",
    title: "Your Brain is a Prediction Engine",
    discovery: "Your brain does not passively react to the world; it constantly constructs predictive models of what will happen next to conserve metabolic energy.",
    whyItMatters: "This is why repeated routines become automatic habits — your basal ganglia pre-computes the sequence before you consciously decide.",
    useItToday: {
      action: "Anchor a Micro-Habit to an Existing Anchor",
      mission: "Attach one small 60-second positive brain habit (e.g. drinking water, 5 deep breaths) immediately following your morning coffee.",
      durationMinutes: 2,
      xpReward: 20,
    },
    scientificContext: {
      explanation: "In predictive processing theory (Karl Friston), the brain minimizes 'free energy' or prediction errors. Habit loops automate motor and cognitive subroutines to protect prefrontal glucose reserves.",
      evidenceLevel: "Well established",
      keyStudy: "Friston, K. (2010). 'The free-energy principle: a unified brain theory?' Nature Reviews Neuroscience.",
      relatedConcept: "Basal Ganglia Habit Automation",
    },
    relatedWorkoutDomain: "Problem Solving",
    tags: ["habits", "neuroscience", "behavior", "productivity"],
  },

  // ─── 4. BRAIN MYTH OF THE DAY ──────────────────────────────────────────────
  {
    id: "drop-10-percent-myth",
    cardId: "CARD-#004824",
    type: "myth",
    category: "Brain Myths",
    title: "The '10% of Your Brain' Myth",
    discovery: "The popular belief that humans only use 10% of their brain is completely false. Neuroimaging shows virtually 100% of the brain is active across a typical day.",
    whyItMatters: "Even during deep sleep, complex neural networks, glial cleaning systems, and memory consolidation circuits are firing at peak efficiency.",
    useItToday: {
      action: "Cross-Train Multiple Brain Domains",
      mission: "Engage in an activity today that combines two distinct domains (e.g. listening to rhythm while walking or calculating mental math).",
      durationMinutes: 5,
      xpReward: 20,
    },
    scientificContext: {
      explanation: "fMRI and PET scans demonstrate that even simple tasks like tapping a finger recruit motor, somatosensory, and cerebellar networks. Evolution would never preserve a 3-pound organ consuming 20% of your metabolic energy if 90% was useless.",
      evidenceLevel: "Well established",
      keyStudy: "Beyerstein, B. L. (1999). 'Whence Cometh the Myth that We Only Use 10% of Our Brains?'",
      relatedConcept: "Whole-Brain Distributed Processing",
    },
    mythCheck: {
      claim: "Humans only use 10% of their total brain capacity.",
      isTrue: false,
      revealExplanation: "False! Neuroimaging proves that almost every part of the human brain is active around the clock.",
    },
    relatedWorkoutDomain: "Processing Speed",
    tags: ["brain myths", "neuroscience", "cognition"],
  },

  // ─── 5. SLEEP & BRAIN CLEANING ─────────────────────────────────────────────
  {
    id: "drop-glymphatic-system",
    cardId: "CARD-#004825",
    type: "discovery",
    category: "Sleep and the Brain",
    title: "The Brain's Nightly Power Wash",
    discovery: "During deep slow-wave sleep, your brain cells shrink by 60%, allowing cerebrospinal fluid to flush out metabolic waste, including beta-amyloid proteins.",
    whyItMatters: "Chronic sleep deprivation blocks this 'glymphatic wash', leading to brain fog, impaired decision speed, and long-term cognitive decline.",
    useItToday: {
      action: "The 30-Minute Screen Wind-Down",
      mission: "Tonight, shut off all bright screens 30 minutes before sleep to allow your pineal gland to release natural melatonin.",
      durationMinutes: 30,
      xpReward: 25,
    },
    scientificContext: {
      explanation: "Dr. Maiken Nedergaard discovered the Glymphatic System in 2012. It acts as the brain's specialized lymphatic drainage, functioning almost exclusively during non-REM deep sleep states.",
      evidenceLevel: "Well established",
      keyStudy: "Xie, L. et al. (2013). 'Sleep Drives Metabolite Clearance from the Adult Brain.' Science.",
      relatedConcept: "Glymphatic Clearance & Neuroprotection",
    },
    microChallenge: {
      question: "When is the brain's waste clearance system (glymphatic system) most active?",
      options: [
        "During deep slow-wave sleep",
        "While running on a treadmill",
        "During intense afternoon work",
        "Right after drinking coffee",
      ],
      correctAnswer: "During deep slow-wave sleep",
      explanation: "Cerebrospinal fluid surges through interstitial spaces during deep sleep, clearing cellular metabolic byproducts.",
    },
    relatedWorkoutDomain: "Focus",
    tags: ["sleep", "brain health", "recovery", "neuroscience"],
  },

  // ─── 6. EXERCISE & NEUROGENESIS (BDNF) ──────────────────────────────────────
  {
    id: "drop-bdnf-neurogenesis",
    cardId: "CARD-#004826",
    type: "discovery",
    category: "Exercise and the Brain",
    title: "Exercise Is Miracle-Gro for Your Neurons",
    discovery: "Just 15 minutes of brisk aerobic movement triggers the release of BDNF (Brain-Derived Neurotrophic Factor), stimulating the birth of new neurons in the hippocampus.",
    whyItMatters: "Physical movement literally builds new structural memory infrastructure and boosts mental clarity within minutes.",
    useItToday: {
      action: "10-Minute Pre-Work Walk",
      mission: "Take a brisk 10-minute walk or do 20 jumping jacks before starting your most mentally demanding task today.",
      durationMinutes: 10,
      xpReward: 25,
    },
    scientificContext: {
      explanation: "BDNF promotes synaptic plasticity, dendritic branching, and adult neurogenesis in the subgranular zone of the dentate gyrus. Exercise is the most potent behavioral trigger for BDNF upregulation.",
      evidenceLevel: "Well established",
      keyStudy: "Cotman, C. W., & Berchtold, N. C. (2002). 'Exercise: a behavioral intervention to enhance brain health and plasticity.' Trends in Neurosciences.",
      relatedConcept: "Adult Neurogenesis & BDNF",
    },
    relatedWorkoutDomain: "Memory",
    tags: ["exercise", "neurogenesis", "memory", "energy"],
  },

  // ─── 7. DECISION MAKING & INVERSION THINKING ───────────────────────────────
  {
    id: "drop-inversion-thinking",
    cardId: "CARD-#004827",
    type: "technique",
    category: "Decision Making",
    title: "Think in Reverse: The Inversion Principle",
    discovery: "Instead of asking 'How do I succeed?', ask 'How could I guarantee complete failure here?' — and then systematically eliminate those failure modes.",
    whyItMatters: "The human brain is evolutionarily optimized for threat and error detection rather than ideal state optimization.",
    useItToday: {
      action: "The 2-Minute Failure Audit",
      mission: "Pick a major goal or project. List 3 obvious ways to ruin it, and verify that you have guardrails in place against each.",
      durationMinutes: 3,
      xpReward: 20,
    },
    scientificContext: {
      explanation: "Inversion originated with mathematician Carl Jacobi ('Man muss immer umkehren') and was popularized in cognitive decision architecture. Reframing problems in reverse bypasses confirmation bias.",
      evidenceLevel: "Well established",
      relatedConcept: "Cognitive Bias Mitigation & Premortem Analysis",
    },
    relatedWorkoutDomain: "Problem Solving",
    tags: ["decision making", "problem solving", "critical thinking", "strategy"],
  },

  // ─── 8. STRESS & VAGAL TONE ────────────────────────────────────────────────
  {
    id: "drop-vagus-nerve-cadence",
    cardId: "CARD-#004828",
    type: "technique",
    category: "Stress",
    title: "Hack Your Nervous System with 4-4-6 Breath",
    discovery: "Extending your exhalation longer than your inhalation triggers the Vagus Nerve to release acetylcholine, slowing your heart rate and suppressing cortisol within 60 seconds.",
    whyItMatters: "High stress shuts down prefrontal rational decision-making; activating your parasympathetic brake immediately restores working memory access.",
    useItToday: {
      action: "The 60-Second Vagal Reset",
      mission: "Inhale for 4 seconds through your nose, hold for 4 seconds, and exhale slowly for 6 seconds. Repeat 3 times whenever feeling pressured.",
      durationMinutes: 1,
      xpReward: 15,
    },
    scientificContext: {
      explanation: "Respiratory Sinus Arrhythmia (RSA) couples cardiac pacing to breathing phases. Long exhalations increase vagal efferent traffic to the sinoatrial node, rapidly downregulating sympathetic arousal.",
      evidenceLevel: "Well established",
      keyStudy: "Laborde, S. et al. (2017). 'Slow-Paced Breathing and Autonomic Nervous System Regulation.' Frontiers in Psychology.",
      relatedConcept: "Autonomic Heart Rate Variability & Insula Regulation",
    },
    relatedWorkoutDomain: "Focus",
    tags: ["stress", "emotions", "breathwork", "neuroscience"],
  },

  // ─── 9. DIGITAL DISTRACTION & DOPAMINE ─────────────────────────────────────
  {
    id: "drop-dopamine-prediction-error",
    cardId: "CARD-#004829",
    type: "discovery",
    category: "Digital Distraction",
    title: "Why Refreshing Feeds Is Neurologically Irresistible",
    discovery: "Dopamine is not the molecule of pleasure; it is the molecule of anticipation. Variable unpredictable rewards trigger maximum dopamine surges in the striatum.",
    whyItMatters: "Social apps exploit the same slot-machine variable reward mechanics that hijack animal foraging instincts.",
    useItToday: {
      action: "Greyscale Mode Challenge",
      mission: "Turn your phone's color filter to Greyscale for the next 2 hours to remove artificial visual reward triggers.",
      durationMinutes: 120,
      xpReward: 30,
    },
    scientificContext: {
      explanation: "Wolfram Schultz's landmark research showed that dopamine neurons in the ventral tegmental area fire most intensely during unexpected reward cues (Reward Prediction Error), driving compulsive checking behaviors.",
      evidenceLevel: "Well established",
      keyStudy: "Schultz, W. (1998). 'Predictive reward signal of dopamine neurons.' Journal of Neurophysiology.",
      relatedConcept: "Ventral Striatum & Variable Ratio Reinforcement",
    },
    relatedWorkoutDomain: "Focus",
    tags: ["digital distraction", "dopamine", "habits", "focus"],
  },

  // ─── 10. DUAL-CODING MEMORY PALACE ─────────────────────────────────────────
  {
    id: "drop-memory-palace",
    cardId: "CARD-#004830",
    type: "technique",
    category: "Memory Techniques",
    title: "The 2,500-Year-Old Memory Palace Technique",
    discovery: "By anchoring abstract concepts onto familiar physical locations (Method of Loci), your brain utilizes its immense spatial navigation cortex to store limitless information.",
    whyItMatters: "Spatial memory in the entorhinal cortex and hippocampus has vastly higher bandwidth than rote verbal memory.",
    useItToday: {
      action: "Memorize 5 Items via Your Front Door",
      mission: "Picture your front door, hallway, couch, kitchen, and fridge. Place 5 grocery items mentally in those exact spots with funny visual imagery.",
      durationMinutes: 2,
      xpReward: 25,
    },
    scientificContext: {
      explanation: "Dresler et al. (2017) scanned World Memory Champions and showed that mnemonic training physically reshires whole-brain functional connectivity networks to resemble spatial navigation hubs.",
      evidenceLevel: "Well established",
      keyStudy: "Dresler, M. et al. (2017). 'Mnemonic Training Reshapes Brain Networks to Support Superior Memory.' Neuron.",
      relatedConcept: "Method of Loci & Place Cells",
    },
    relatedWorkoutDomain: "Memory",
    tags: ["memory techniques", "learning", "spatial reasoning", "memory"],
  },
];

export function getDropById(id: string): DailyBrainDrop | undefined {
  return BRAIN_UNIVERSE_DROPS.find((d) => d.id === id || d.cardId === id);
}

export function getAllDrops(): DailyBrainDrop[] {
  return BRAIN_UNIVERSE_DROPS;
}

export function getDropsByCategory(category: string): DailyBrainDrop[] {
  return BRAIN_UNIVERSE_DROPS.filter((d) => d.category === category);
}
