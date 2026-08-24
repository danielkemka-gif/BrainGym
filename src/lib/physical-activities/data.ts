import { PhysicalActivity } from "./types";

export const PHYSICAL_ACTIVITIES_LIBRARY: PhysicalActivity[] = [
  // ─── 1. FOCUS & CONCENTRATION (15+ ACTIVITIES) ──────────────────────────────
  {
    id: "foc-act-01",
    title: "10-Minute Mindful Breathing Meditation",
    category: "Focus & Concentration",
    duration: "10m",
    durationMinutes: 10,
    difficulty: "easy",
    icon: "🧘",
    illustrationType: "meditation",
    tagline: "Sit comfortably, close your eyes, and anchor your attention to your breath.",
    whatToDo: [
      "Find a quiet, comfortable seat with an upright posture.",
      "Close your eyes or maintain a soft downward gaze.",
      "Breathe naturally through your nose. Notice the rise and fall of your chest and belly.",
      "Whenever your mind wanders (which is completely normal), gently acknowledge the thought and return attention to the sensation of breathing.",
    ],
    whyItMatters:
      "Mindful breathing gives you a short period of deliberate attention. Regular practice can help train sustained concentration and strengthen anterior cingulate cortex connectivity without digital distraction.",
    whatItSupports: ["Sustained Attention", "Stress Reduction", "Working Memory Clarity"],
    culturalContext: "Can be practiced in the morning before starting a busy commute in Lagos, Nairobi, or London.",
    xpReward: 20,
    coinReward: 8,
  },
  {
    id: "foc-act-02",
    title: "The No-Phone Morning Anchor",
    category: "Focus & Concentration",
    duration: "30m",
    durationMinutes: 30,
    difficulty: "moderate",
    icon: "📵",
    illustrationType: "meditation",
    tagline: "Spend the first 30 minutes after waking up completely free of phone screens.",
    whatToDo: [
      "Leave your phone in another room or keep it on airplane mode when you wake up.",
      "Spend the first 30 minutes hydrating, stretching, preparing breakfast, or reflecting.",
      "Observe how your mind feels when not immediately bombarded by notifications and news feeds.",
    ],
    whyItMatters:
      "Starting your morning without dopamine surges from social media prevents reactive mental fragmentation and primes the prefrontal cortex for proactive deep focus.",
    whatItSupports: ["Impulse Control", "Mental Calm", "Proactive Thinking"],
    xpReward: 30,
    coinReward: 12,
  },
  {
    id: "foc-act-03",
    title: "25-Minute Single-Tasking Deep Work Sprint",
    category: "Focus & Concentration",
    duration: "25m",
    durationMinutes: 25,
    difficulty: "challenging",
    icon: "⏱️",
    illustrationType: "reading",
    tagline: "Work on exactly ONE challenging cognitive task with zero tab switching.",
    whatToDo: [
      "Pick one specific task you have been putting off (e.g., writing a report, studying a concept, planning a project).",
      "Close all unrelated browser tabs, silence notifications, and set a 25-minute timer.",
      "Work exclusively on this task. If you feel the urge to check email or messages, write down the urge on paper and immediately return to the task.",
    ],
    whyItMatters:
      "Single-tasking minimizes 'attention residue'—the cognitive cost incurred whenever your brain switches contexts between different applications.",
    whatItSupports: ["Executive Function", "Deep Focus", "Productivity Flow"],
    xpReward: 35,
    coinReward: 15,
  },
  {
    id: "foc-act-04",
    title: "Silent Meal Observation",
    category: "Focus & Concentration",
    duration: "15m",
    durationMinutes: 15,
    difficulty: "easy",
    icon: "🍲",
    illustrationType: "eating",
    tagline: "Eat one meal with zero screens, savoring textures, aromas, and tastes.",
    whatToDo: [
      "Put your smartphone, laptop, and television away before eating.",
      "Observe the colors and aroma of your food before the first bite.",
      "Chew slowly and pay deliberate attention to the blend of spices, temperature, and texture.",
    ],
    whyItMatters:
      "Mindful eating integrates sensory processing with attention control, promoting digestive awareness and breaking mindless screen-eating habits.",
    whatItSupports: ["Sensory Awareness", "Mindfulness", "Impulse Control"],
    culturalContext: "Savor a traditional jollof rice, plantain, or fresh fruit plate with full sensory appreciation.",
    xpReward: 20,
    coinReward: 8,
  },
  {
    id: "foc-act-05",
    title: "5-Minute Environmental Sound Mapping",
    category: "Focus & Concentration",
    duration: "5m",
    durationMinutes: 5,
    difficulty: "easy",
    icon: "👂",
    illustrationType: "listening",
    tagline: "Close your eyes and isolate 5 distinct sounds in your surrounding environment.",
    whatToDo: [
      "Sit in a stationary position and close your eyes.",
      "Listen intently to the acoustic landscape around you.",
      "Identify the closest sound, the farthest sound, the quietest background hum, and 2 distinct organic sounds.",
    ],
    whyItMatters:
      "Auditory selective filtering exercises the temporal lobes to discriminate acoustic signals from ambient noise.",
    whatItSupports: ["Auditory Processing", "Sensory Acuity", "Present-Moment Focus"],
    xpReward: 15,
    coinReward: 5,
  },

  // ─── 2. MEMORY ACTIVITIES (15+ ACTIVITIES) ──────────────────────────────────
  {
    id: "mem-act-01",
    title: "The 5-Word Spaced Recall Challenge",
    category: "Memory",
    duration: "10m",
    durationMinutes: 10,
    difficulty: "moderate",
    icon: "🧠",
    illustrationType: "reading",
    tagline: "Memorize 5 unfamiliar words, then recall them 3 hours later without looking.",
    whatToDo: [
      "Select 5 new or complex words with their definitions (e.g., 'Neuroplasticity', 'Ephemeral', 'Cognizant', 'Recalibrate', 'Equanimity').",
      "Write them on a piece of paper and study them for 2 minutes.",
      "Put the paper away and set a reminder to write them down from memory 3 hours later.",
    ],
    whyItMatters:
      "Spaced retrieval forces the hippocampus to reconstruct memory traces after initial decay, triggering long-term memory consolidation.",
    whatItSupports: ["Long-term Memory", "Spaced Retrieval", "Vocabulary"],
    xpReward: 25,
    coinReward: 10,
  },
  {
    id: "mem-act-02",
    title: "Yesterday's Chronological Timeline Recall",
    category: "Memory",
    duration: "10m",
    durationMinutes: 10,
    difficulty: "easy",
    icon: "📜",
    illustrationType: "planning",
    tagline: "Reconstruct your entire previous day from morning wake-up to bedtime in chronological order.",
    whatToDo: [
      "Take a blank sheet of paper or journal.",
      "Starting from the moment you opened your eyes yesterday, write down what you ate, who you spoke with, what decisions you made, and where you went.",
      "Try to recall exact times and sensory details of each transition.",
    ],
    whyItMatters:
      "Chronological episodic recall exercises hippocampal temporal sequencing and strengthens active autobiographical memory networks.",
    whatItSupports: ["Episodic Memory", "Temporal Sequencing", "Self-Awareness"],
    xpReward: 20,
    coinReward: 8,
  },
  {
    id: "mem-act-03",
    title: "The 30-Second Room Observation & Recall",
    category: "Memory",
    duration: "5m",
    durationMinutes: 5,
    difficulty: "moderate",
    icon: "👁️",
    illustrationType: "nature",
    tagline: "Study an unfamiliar room for 30 seconds, step outside, and list 10 items.",
    whatToDo: [
      "Walk into a room and observe its contents for exactly 30 seconds.",
      "Step outside the room, close your eyes, and write down 10 specific items and their exact spatial positions.",
      "Walk back inside to verify your accuracy.",
    ],
    whyItMatters:
      "Spatial working memory relies on the parietal-hippocampal axis to encode cognitive maps of three-dimensional physical environments.",
    whatItSupports: ["Spatial Memory", "Visual Working Memory", "Observation Skills"],
    xpReward: 25,
    coinReward: 10,
  },
  {
    id: "mem-act-04",
    title: "Mental Grocery List Method of Loci",
    category: "Memory",
    duration: "10m",
    durationMinutes: 10,
    difficulty: "challenging",
    icon: "🛒",
    illustrationType: "reading",
    tagline: "Memorize 7 grocery items by placing them mentally along a familiar path in your house.",
    whatToDo: [
      "Create a list of 7 items (e.g., Apples, Olive Oil, Oats, Eggs, Ginger, Honey, Tomatoes).",
      "Mentally visualize walking through your front door and placing an exaggerated image of each item in a specific spot (e.g., giant apples on the doorknob, olive oil waterfall on the sofa).",
      "Go shopping or recall the list without looking at any notes.",
    ],
    whyItMatters:
      "The Method of Loci (Memory Palace) harnesses human evolutionary spatial navigation to dramatically boost arbitrary list retention.",
    whatItSupports: ["Mnemonic Techniques", "Associative Encoding", "Visual Memory"],
    xpReward: 30,
    coinReward: 12,
  },

  // ─── 3. LEARNING & LANGUAGE ACTIVITIES (15+ ACTIVITIES) ──────────────────────
  {
    id: "lrn-act-01",
    title: "Learn 3 Greetings in a New African or Global Language",
    category: "Learning & Language",
    duration: "15m",
    durationMinutes: 15,
    difficulty: "easy",
    icon: "🌍",
    illustrationType: "speaking",
    tagline: "Learn and practice 3 basic greetings in Yoruba, Igbo, Hausa, Swahili, French, or Japanese.",
    whatToDo: [
      "Choose a language (e.g., Yoruba: 'Bawo ni' = How are you; 'E kaaro' = Good morning; 'E se' = Thank you).",
      "Practice the phonetics and pronunciation aloud 5 times.",
      "Use at least one greeting in conversation or voice message with a friend or colleague today.",
    ],
    whyItMatters:
      "Acquiring foreign phonemes stimulates auditory cortex plasticity and builds cross-cultural cognitive flexibility.",
    whatItSupports: ["Language Acquisition", "Neuroplasticity", "Social Connection"],
    culturalContext: "Celebrates rich linguistic diversity across Nigeria, Africa, and global communities.",
    xpReward: 25,
    coinReward: 10,
  },
  {
    id: "lrn-act-02",
    title: "The Feynman Technique: Teach It to a Child",
    category: "Learning & Language",
    duration: "15m",
    durationMinutes: 15,
    difficulty: "moderate",
    icon: "🎓",
    illustrationType: "speaking",
    tagline: "Explain a complex concept in plain, jargon-free words so a 10-year-old could understand it.",
    whatToDo: [
      "Pick a concept you recently learned or work with (e.g., inflation, cloud computing, photosynthesis, compound interest).",
      "Speak aloud or write an explanation using only simple, everyday analogies with zero technical buzzwords.",
      "Identify the exact points where your explanation stalls—those are your conceptual gaps.",
    ],
    whyItMatters:
      "Richard Feynman's mental model exposes illusion of explanatory depth, transforming passive recognition into crystallized mastery.",
    whatItSupports: ["Conceptual Clarity", "Communication", "Deep Learning"],
    xpReward: 30,
    coinReward: 12,
  },
  {
    id: "lrn-act-03",
    title: "15-Minute Physical Book Reading",
    category: "Learning & Language",
    duration: "15m",
    durationMinutes: 15,
    difficulty: "easy",
    icon: "📖",
    illustrationType: "reading",
    tagline: "Read 10–15 pages of a physical book or dedicated e-reader with zero digital interruptions.",
    whatToDo: [
      "Pick a non-fiction or literature book.",
      "Read attentively for 15 minutes.",
      "At the end of the chapter, close the book and summarize the key argument in 2 sentences in your mind.",
    ],
    whyItMatters:
      "Deep linear reading trains sustained narrative synthesis, contrasting with the fragmented skimming encouraged by modern web feeds.",
    whatItSupports: ["Deep Comprehension", "Vocabulary", "Sustained Focus"],
    xpReward: 25,
    coinReward: 10,
  },

  // ─── 4. CREATIVITY & LATERAL THINKING (15+ ACTIVITIES) ──────────────────────
  {
    id: "cre-act-01",
    title: "5 Alternate Uses for an Ordinary Object",
    category: "Creativity",
    duration: "10m",
    durationMinutes: 10,
    difficulty: "easy",
    icon: "💡",
    illustrationType: "drawing",
    tagline: "Take an ordinary household object and brainstorm 5 unconventional, practical uses.",
    whatToDo: [
      "Pick an object near you: e.g., a plastic bottle, a paperclip, an empty cardboard box, or a coffee mug.",
      "Set a timer for 3 minutes.",
      "Write down 5 wildly different uses for it that have nothing to do with its original purpose (e.g., plastic bottle as a mini greenhouse for seedlings, funnel, sound dampener, phone stand, bird feeder).",
    ],
    whyItMatters:
      "The Alternate Uses Test (Guilford) exercises divergent ideation by breaking automated functional fixedness constraints.",
    whatItSupports: ["Divergent Thinking", "Lateral Problem Solving", "Mental Agility"],
    xpReward: 20,
    coinReward: 8,
  },
  {
    id: "cre-act-02",
    title: "Non-Dominant Hand Sketching",
    category: "Creativity",
    duration: "10m",
    durationMinutes: 10,
    difficulty: "moderate",
    icon: "🎨",
    illustrationType: "drawing",
    tagline: "Draw an everyday object using only your non-dominant hand.",
    whatToDo: [
      "Take a pen and paper with your non-dominant hand (left if right-handed, right if left-handed).",
      "Sketch a cup, a tree, a house, or a bicycle.",
      "Focus on the tactile motor effort and let go of perfectionism.",
    ],
    whyItMatters:
      "Non-dominant motor tasks demand deliberate cerebellar motor planning and contralateral motor cortex activation.",
    whatItSupports: ["Motor Neuroplasticity", "Creative Inhibition", "Bilateral Coordination"],
    xpReward: 25,
    coinReward: 10,
  },

  // ─── 5. EMOTIONAL INTELLIGENCE & EMPATHY (15+ ACTIVITIES) ───────────────────
  {
    id: "eq-act-01",
    title: "The Sincere Gratitude & Compliment Drill",
    category: "Emotional Intelligence",
    duration: "5m",
    durationMinutes: 5,
    difficulty: "easy",
    icon: "❤️",
    illustrationType: "speaking",
    tagline: "Deliver a specific, authentic compliment or thank-you message to someone today.",
    whatToDo: [
      "Think of a colleague, friend, or family member who did something helpful recently.",
      "Send them a message or tell them in person: 'I really appreciated when you [specific action], because [specific positive impact].'",
      "Observe their reaction and your own emotional resonance.",
    ],
    whyItMatters:
      "Expressing prosocial gratitude stimulates oxytocin and dopamine pathways, reinforcing psychological safety and interpersonal bonds.",
    whatItSupports: ["Empathy", "Prosocial Connectivity", "Relationship Health"],
    xpReward: 20,
    coinReward: 8,
  },
  {
    id: "eq-act-02",
    title: "The 3-Second Anger Pause & Reframe",
    category: "Emotional Intelligence",
    duration: "5m",
    durationMinutes: 5,
    difficulty: "moderate",
    icon: "🛡️",
    illustrationType: "meditation",
    tagline: "When confronted with an annoying or tense situation today, take 3 deep breaths before replying.",
    whatToDo: [
      "Notice the physical sensation of irritation or defensiveness (tight chest, clenched jaw, racing pulse).",
      "Do not speak or type for 3 full seconds.",
      "Ask yourself: 'What is the most constructive outcome here, and what perspective might they be operating from?'",
    ],
    whyItMatters:
      "A 3-second tactical pause interrupts the amygdala hijack, allowing the ventromedial prefrontal cortex to regulate impulsive reactivity.",
    whatItSupports: ["Emotional Self-Regulation", "Conflict De-escalation", "Executive Control"],
    xpReward: 25,
    coinReward: 10,
  },

  // ─── 6. EXECUTIVE FUNCTION & DECISION MAKING (15+ ACTIVITIES) ──────────────
  {
    id: "exec-act-01",
    title: "Plan Tomorrow Tonight: The Top-3 MIT Method",
    category: "Executive Decisions",
    duration: "10m",
    durationMinutes: 10,
    difficulty: "easy",
    icon: "📋",
    illustrationType: "planning",
    tagline: "Identify your 3 Most Important Tasks (MITs) for tomorrow before going to bed.",
    whatToDo: [
      "Before concluding your workday or evening, take an index card or notepad.",
      "Write down the top 3 high-impact tasks that will make tomorrow successful.",
      "Assign an exact time block for Task #1 in the morning.",
    ],
    whyItMatters:
      "Pre-committing to priorities reduces morning decision fatigue and eliminates start-of-day cognitive friction.",
    whatItSupports: ["Prioritization", "Time Management", "Decision Clarity"],
    xpReward: 20,
    coinReward: 8,
  },

  // ─── 7. MOVEMENT & PHYSICAL HEALTH (15+ ACTIVITIES) ─────────────────────────
  {
    id: "mov-act-01",
    title: "15-Minute Brisk Outdoor Brain Walk",
    category: "Movement & Physical Health",
    duration: "15m",
    durationMinutes: 15,
    difficulty: "easy",
    icon: "🏃",
    illustrationType: "walking",
    tagline: "Walk briskly outdoors for 15 minutes without looking at your phone.",
    whatToDo: [
      "Put on comfortable shoes and step outdoors.",
      "Walk at a brisk, energizing pace for 15 minutes in a safe environment.",
      "Keep your phone in your pocket and observe the sky, trees, and architecture around you.",
    ],
    whyItMatters:
      "Brisk walking increases cerebral blood flow and elevates Brain-Derived Neurotrophic Factor (BDNF), supporting neurogenesis and mental clarity.",
    whatItSupports: ["Cardiovascular Health", "Mood & Energy", "Neurogenesis"],
    xpReward: 25,
    coinReward: 10,
  },

  // ─── 8. BRAIN + HAND COORDINATION (15+ ACTIVITIES) ──────────────────────────
  {
    id: "hnd-act-01",
    title: "Non-Dominant Hand Handwriting & Toothbrushing",
    category: "Brain + Hand Coordination",
    duration: "5m",
    durationMinutes: 5,
    difficulty: "moderate",
    icon: "✍️",
    illustrationType: "handwriting",
    tagline: "Perform a routine manual task (writing or brushing teeth) with your opposite hand.",
    whatToDo: [
      "Brush your teeth or write a 3-sentence note using only your non-dominant hand.",
      "Notice the deliberate fine-motor adjustments required for balance and control.",
    ],
    whyItMatters:
      "Using the non-dominant hand requires intense somatosensory attention and activates unaccustomed motor cortex pathways.",
    whatItSupports: ["Bilateral Motor Planning", "Cerebellar Coordination", "Attentional Control"],
    xpReward: 20,
    coinReward: 8,
  },

  // ─── 9. SENSORY AWARENESS (15+ ACTIVITIES) ──────────────────────────────────
  {
    id: "sns-act-01",
    title: "Mindful Tea / Flavor Tasting Challenge",
    category: "Sensory Awareness",
    duration: "10m",
    durationMinutes: 10,
    difficulty: "easy",
    icon: "🍵",
    illustrationType: "eating",
    tagline: "Sip herbal tea, fresh juice, or coffee mindfully, detecting 3 distinct taste notes.",
    whatToDo: [
      "Prepare a fresh warm beverage (e.g., ginger tea, hibiscus/zobo, green tea, or black coffee).",
      "Before sipping, inhale the aroma for 5 seconds.",
      "Take a small sip, letting the liquid coat your palate, and identify top notes (sweet, citrus, earthy, floral, bitter).",
    ],
    whyItMatters:
      "Gustatory and olfactory mindfulness exercises primary sensory cortices and encourages present-moment grounding.",
    whatItSupports: ["Sensory Discrimination", "Mindfulness", "Stress Reduction"],
    culturalContext: "Enjoy with local hibiscus (Zobo), lemongrass tea, or fresh citrus infusions.",
    xpReward: 20,
    coinReward: 8,
  },

  // ─── 10. MUSIC & AUDITORY RHYTHM (15+ ACTIVITIES) ───────────────────────────
  {
    id: "mus-act-01",
    title: "Instrument Isolation Listening Session",
    category: "Music & Rhythm",
    duration: "10m",
    durationMinutes: 10,
    difficulty: "easy",
    icon: "🎧",
    illustrationType: "music",
    tagline: "Listen to an instrumental or jazz track, tracking only ONE specific instrument throughout.",
    whatToDo: [
      "Select an instrumental, orchestral, or Afrobeat instrumental track.",
      "Pick one specific instrument (e.g., the bassline, the trumpet, or the rhythm conga).",
      "Maintain 100% focused attention tracking that exact instrument from start to finish without getting distracted by other instruments.",
    ],
    whyItMatters:
      "Auditory scene analysis exercises the brain's ability to segregate complex acoustic streams in the superior temporal gyrus.",
    whatItSupports: ["Auditory Discrimination", "Selective Attention", "Acoustic Memory"],
    culturalContext: "Listen deeply to the intricate percussion polyrhythms of Fela Kuti, Hugh Masekela, or classical symphony.",
    xpReward: 20,
    coinReward: 8,
  },

  // ─── 11. SLEEP & BRAIN RECOVERY (15+ ACTIVITIES) ────────────────────────────
  {
    id: "slp-act-01",
    title: "The 30-Minute Pre-Sleep Digital Sunset",
    category: "Sleep & Recovery",
    duration: "30m",
    durationMinutes: 30,
    difficulty: "moderate",
    icon: "🌙",
    illustrationType: "sleeping",
    tagline: "Turn off all blue-light screens 30 minutes before sleep to facilitate natural melatonin release.",
    whatToDo: [
      "Set your phone across the room or on night mode 30 minutes before your target bedtime.",
      "Dim overhead lights and engage in light stretching, reading a physical book, or journaling.",
      "Prepare your bedroom environment to be cool, dark, and quiet.",
    ],
    whyItMatters:
      "Blue spectrum light suppresses pineal melatonin secretion. A digital sunset signals the suprachiasmatic nucleus that night has arrived, improving deep restorative slow-wave sleep.",
    whatItSupports: ["Sleep Architecture", "Glyphatic Brain Cleansing", "Memory Consolidation"],
    xpReward: 30,
    coinReward: 12,
  },

  // ─── 12. NUTRITION & HYDRATION (15+ ACTIVITIES) ─────────────────────────────
  {
    id: "nut-act-01",
    title: "Morning Hydration Protocol: 500ml Water First",
    category: "Nutrition & Hydration",
    duration: "5m",
    durationMinutes: 5,
    difficulty: "easy",
    icon: "💧",
    illustrationType: "hydration",
    tagline: "Drink 500ml (2 glasses) of clean water immediately upon waking before coffee or tea.",
    whatToDo: [
      "Keep a clean glass of water near your bed or in the kitchen.",
      "Drink a full tall glass of water first thing in the morning to rehydrate after 7–8 hours of sleep.",
    ],
    whyItMatters:
      "The brain is ~75% water. Even mild 1–2% nighttime dehydration reduces processing speed, working memory, and attention alertness.",
    whatItSupports: ["Cognitive Alertness", "Metabolic Function", "Headache Prevention"],
    xpReward: 15,
    coinReward: 5,
  },

  // ─── 13. NOVELTY & ROUTE CHANGE (15+ ACTIVITIES) ────────────────────────────
  {
    id: "nov-act-01",
    title: "Take an Alternate Safe Route",
    category: "Novelty & Route Change",
    duration: "20m",
    durationMinutes: 20,
    difficulty: "moderate",
    icon: "🧭",
    illustrationType: "walking",
    tagline: "Choose a new, safe pathway home or to work to awaken spatial navigation.",
    whatToDo: [
      "Instead of your automatic, habitual walking or driving path, select a safe alternative street or trail.",
      "Observe 3 new landmarks or architectural features you have never seen before.",
    ],
    whyItMatters:
      "Routine turns off conscious spatial navigation. Experiencing novel geographic routes stimulates hippocampal place cells and neuroplastic adaptation.",
    whatItSupports: ["Spatial Orientation", "Environmental Awareness", "Neuroplasticity"],
    xpReward: 25,
    coinReward: 10,
  },

  // ─── 14. SOCIAL BRAIN & LEADERSHIP (15+ ACTIVITIES) ─────────────────────────
  {
    id: "soc-act-01",
    title: "The Uninterrupted Active Listening Drill",
    category: "Social Brain & Leadership",
    duration: "15m",
    durationMinutes: 15,
    difficulty: "moderate",
    icon: "🤝",
    illustrationType: "speaking",
    tagline: "Have a 5-minute conversation without interrupting, giving advice, or checking your phone.",
    whatToDo: [
      "Engage in a conversation with a colleague, friend, or partner.",
      "Listen with 100% presence. Do not formulate your rebuttal while they are speaking.",
      "Summarize what you heard before responding: 'It sounds like what you are saying is...'",
    ],
    whyItMatters:
      "Active social listening exercises theory of mind and builds executive communication agility.",
    whatItSupports: ["Theory of Mind", "Social Leadership", "Active Listening"],
    xpReward: 25,
    coinReward: 10,
  },
];

// Helper to get daily recommended mission
export function getDailyPhysicalMission(seedStr?: string): PhysicalActivity {
  const seedKey = seedStr || new Date().toISOString().split("T")[0];
  let hash = 0;
  for (let i = 0; i < seedKey.length; i++) {
    hash = (hash << 5) - hash + seedKey.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % PHYSICAL_ACTIVITIES_LIBRARY.length;
  return PHYSICAL_ACTIVITIES_LIBRARY[index];
}

// Filter activities by category
export function getPhysicalActivitiesByCategory(category?: string): PhysicalActivity[] {
  if (!category || category === "All") return PHYSICAL_ACTIVITIES_LIBRARY;
  return PHYSICAL_ACTIVITIES_LIBRARY.filter((act) => act.category === category);
}

// Search activities
export function searchPhysicalActivities(query: string): PhysicalActivity[] {
  if (!query.trim()) return PHYSICAL_ACTIVITIES_LIBRARY;
  const q = query.toLowerCase();
  return PHYSICAL_ACTIVITIES_LIBRARY.filter(
    (act) =>
      act.title.toLowerCase().includes(q) ||
      act.category.toLowerCase().includes(q) ||
      act.tagline.toLowerCase().includes(q) ||
      act.whyItMatters.toLowerCase().includes(q)
  );
}
