export interface WorkoutExample {
  title: string;
  example: string;
  steps: string[];
  benefit: string;
  tip?: string;
}

const SPECIFIC_EXAMPLES: Record<string, WorkoutExample> = {
  // Logic & Math
  "mental math sprint": {
    title: "Mental Math Sprint",
    example: "Calculate a 15% tip on a $64 restaurant bill in your head ($6.40 + $3.20 = $9.60), or multiply 18 × 7 without paper (10 × 7 = 70, 8 × 7 = 56, 70 + 56 = 126).",
    steps: [
      "Break complex numbers into friendly chunks (e.g., 18 × 7 → (10 × 7) + (8 × 7)).",
      "Solve mentally without looking at a screen or writing it down.",
      "Complete 5 quick mental calculations in under 2 minutes."
    ],
    benefit: "Strengthens working memory and left-hemisphere parietal processing speed.",
    tip: "Tip: For percentage calculations, find 10% first by moving the decimal, then half that for 5%!"
  },
  "counter argument": {
    title: "Counter-Argument & Lateral Thinking",
    example: "Take an opinion you strongly hold (e.g., 'Remote work is always better than office work') and write down 2 genuinely compelling arguments for the opposite side.",
    steps: [
      "Pick any recent belief or decision you made.",
      "Force yourself to argue the opposite perspective with strong evidence.",
      "Identify 1 valid point the opposing side has that you previously overlooked."
    ],
    benefit: "Reduces cognitive bias, expands cognitive flexibility, and builds prefrontal cortex resilience.",
    tip: "Tip: Great leaders use this technique (Steel-Manning) before making major decisions."
  },
  "feynman technique": {
    title: "Feynman Learning Sprint",
    example: "Explain a complex concept you learned recently (e.g., how blockchain works, or how inflation occurs) as if speaking out loud to a 10-year-old child.",
    steps: [
      "Choose a topic or skill you encountered today.",
      "Explain it out loud in 60 seconds without using technical jargon or buzzwords.",
      "If you stumble or use complex terms, pinpoint that gap and simplify it."
    ],
    benefit: "Transforms passive recall into deep conceptual mastery.",
    tip: "Tip: If you can't explain it simply, you don't understand it well enough yet."
  },
  "4-7-8 breathing": {
    title: "4-7-8 Deep Relaxation Breathing",
    example: "Inhale quietly through your nose for 4 seconds, hold your breath steadily for 7 seconds, then exhale completely through your mouth with a whoosh sound for 8 seconds.",
    steps: [
      "Sit upright with your back straight and rest the tip of your tongue behind your front teeth.",
      "Inhale through the nose: 1... 2... 3... 4.",
      "Hold your breath: 1... 2... 3... 4... 5... 6... 7.",
      "Exhale audibly through mouth: 1... 2... 3... 4... 5... 6... 7... 8. Repeat for 4 full cycles."
    ],
    benefit: "Activates the parasympathetic nervous system (vagus nerve), slashing cortisol and heart rate in under 90 seconds.",
    tip: "Tip: The exhale should be twice as long as the inhale to trigger deep brain calmness."
  },
  "deep breathing": {
    title: "Box Breathing Focus Drill",
    example: "Used by Navy SEALs before high-pressure operations: Inhale 4s, Hold 4s, Exhale 4s, Hold empty 4s. Repeat 4 times.",
    steps: [
      "Inhale slowly through your nose for 4 seconds.",
      "Hold your lungs full of air for 4 seconds.",
      "Exhale smoothly through your mouth for 4 seconds.",
      "Hold your lungs empty for 4 seconds before the next breath."
    ],
    benefit: "Calms sympathetic nervous system and sharpens executive focus under pressure.",
  },
  "sensory walk": {
    title: "Sensory Awareness Drill",
    example: "While walking for 5 minutes, observe your surroundings using the 5-4-3-2-1 method: Notice 5 things you can see, 4 textures you can touch, 3 sounds you hear, 2 scents, and 1 taste.",
    steps: [
      "Put your phone away and walk at a steady pace.",
      "Look for details you normally ignore (leaf patterns, building textures, distant birds).",
      "Anchor your attention in the present moment without judging your thoughts."
    ],
    benefit: "Decreases Default Mode Network (mind-wandering) hyperactivity and improves sensory acuity.",
  },
  "memory palace": {
    title: "Memory Palace Technique",
    example: "To remember a 5-item grocery list (Apples, Coffee, Eggs, Spinach, Salmon): Imagine giant apples rolling through your front door, coffee spilling on your couch, eggs dancing on your TV, spinach covering your kitchen counter, and a salmon in your sink.",
    steps: [
      "Pick a familiar room (e.g., your living room or childhood home).",
      "Place vivid, exaggerated, humorous mental images of each item along a walking path.",
      "Walk through the mental path to retrieve all items in exact order."
    ],
    benefit: "Leverages spatial and visual hippocampus memory for superhuman recall.",
  },
  "no sugar": {
    title: "Zero Added Sugar Sprint",
    example: "Swap afternoon sodas, sweet coffee syrups, or candy bars for sparkling water with lemon, raw walnuts, blueberries, or green tea.",
    steps: [
      "Check food labels today for hidden sugars (high fructose corn syrup, maltose, sucrose).",
      "Replace 1 sweet snack with brain-healthy fats (almonds, avocado, dark chocolate >85%).",
      "Stay hydrated with water to eliminate false sugar cravings."
    ],
    benefit: "Prevents glucose spikes and afternoon brain fog, boosting BDNF (Brain-Derived Neurotrophic Factor).",
  },
  "deep work": {
    title: "Single-Tasking Deep Work Sprint",
    example: "Set a 20-minute timer. Close all browser tabs except one. Put your phone in another room or on Do Not Disturb, and work on 1 single task until the bell rings.",
    steps: [
      "Choose 1 specific outcome (e.g., write a report outline, solve 3 hard coding bugs).",
      "Eliminate all audio and visual notifications.",
      "If a random thought enters your head, jot it on a scrap paper and return immediately to the task."
    ],
    benefit: "Strengthens anterior cingulate cortex and trains sustained attentional endurance.",
  }
};

const CATEGORY_FALLBACK_EXAMPLES: Record<string, WorkoutExample> = {
  memory: {
    title: "Memory & Recall Training",
    example: "Memorize a 7-digit number or 4 random words (e.g., 'Falcon, Velvet, Oxygen, Lantern'), do another task for 2 minutes, then write them down from memory.",
    steps: [
      "Look at the target information for 15 seconds.",
      "Create a silly visual story linking the items together in your mind.",
      "Recall all items without looking after a brief 60-second delay."
    ],
    benefit: "Stimulates synaptic plasticity in the hippocampus for long-term encoding.",
    tip: "Tip: Emotional and bizarre visual stories stick in your memory 3x longer than plain words."
  },
  logic: {
    title: "Logical Reasoning & Problem Solving",
    example: "Solve a riddle or deduce the solution to a scenario without guessing (e.g., 'If all Bloops are Razzies and all Razzies are Lizzies, are all Bloops definitely Lizzies? → Yes').",
    steps: [
      "Read the premise carefully and identify the given constraints.",
      "Eliminate impossible answers one by one.",
      "Verify the logic chain before concluding."
    ],
    benefit: "Engages the dorsolateral prefrontal cortex for analytical reasoning.",
  },
  focus: {
    title: "Attentional Control & Focus",
    example: "Focus your unbroken gaze on the second hand of a watch or a single spot on the wall for 60 seconds without letting your mind wander. If distracted, gently reset.",
    steps: [
      "Pick a focal point and breathe steadily.",
      "Notice when thoughts attempt to pull you away.",
      "Gently return your attention to the focal anchor without frustration."
    ],
    benefit: "Builds top-down executive attentional stamina.",
  },
  speed: {
    title: "Processing Speed Sprint",
    example: "Name as many items belonging to a category (e.g., animals that start with 'C' — Cat, Camel, Cheetah, Cow, Crab, Crocodile) in 45 seconds as fast as you can.",
    steps: [
      "Set a 45-second timer.",
      "Say each answer out loud rapidly without pausing.",
      "Aim for at least 8 to 12 items before the timer ends."
    ],
    benefit: "Accelerates neural firing rate and verbal fluency in the temporal lobe.",
  },
  language: {
    title: "Verbal Agility & Vocabulary",
    example: "Learn 1 new word today (e.g., 'Perspicacious' = having a ready insight into things) and use it in a conversation or sentence today.",
    steps: [
      "Read the word, pronunciation, and definition.",
      "Create 2 custom example sentences using the word.",
      "Recall and use it naturally later today."
    ],
    benefit: "Enriches the mental lexicon in Wernicke's and Broca's areas.",
  },
  mindfulness: {
    title: "Mindfulness & Mental Reset",
    example: "Close your eyes for 2 minutes. Scan your body from the top of your head down to your toes, releasing any tension in your jaw, shoulders, and forehead.",
    steps: [
      "Find a comfortable seated position with feet flat on the floor.",
      "Take 3 slow, deep belly breaths.",
      "Consciously drop your shoulders and unclench your jaw.",
      "Notice the physical sensation of calm spread through your chest."
    ],
    benefit: "Lowers amygdala hyperactivity and promotes alpha brainwave state for creative clarity.",
  },
  nutrition: {
    title: "Brain Health & Habit Routine",
    example: "Drink 500ml (2 full glasses) of fresh water first thing in the morning with a pinch of sea salt or lemon to rehydrate your brain tissue.",
    steps: [
      "Your brain is 73% water; dehydration by just 2% drops cognitive performance by 20%.",
      "Drink a large glass of water before looking at social media or taking caffeine.",
      "Pair with a handful of walnuts (rich in DHA Omega-3s)."
    ],
    benefit: "Optimizes cerebrospinal fluid circulation and neurotransmitter synthesis.",
  },
};

export function getWorkoutExample(activity: {
  title?: string;
  category_id?: string;
  description?: string;
  instructions?: string;
}): WorkoutExample {
  const titleLower = (activity.title || "").toLowerCase();

  // 1. Check specific matches
  for (const [key, val] of Object.entries(SPECIFIC_EXAMPLES)) {
    if (titleLower.includes(key)) {
      return val;
    }
  }

  // 2. Check if instructions exist in the activity record
  if (activity.instructions && activity.instructions.length > 20) {
    return {
      title: activity.title || "Workout Activity",
      example: activity.description || `Practical application of ${activity.title}.`,
      steps: activity.instructions.split("\n").filter((s) => s.trim().length > 0).slice(0, 4),
      benefit: "Strengthens neural pathways and cognitive agility through deliberate daily repetition.",
      tip: "Take your time and focus on quality rather than rushing through the exercise."
    };
  }

  // 3. Fallback to category-based rich example
  const cat = (activity.category_id || "").toLowerCase();
  if (CATEGORY_FALLBACK_EXAMPLES[cat]) {
    const fallback = CATEGORY_FALLBACK_EXAMPLES[cat];
    return {
      ...fallback,
      title: activity.title || fallback.title,
    };
  }

  // 4. Default universal cognitive drill
  return {
    title: activity.title || "Daily Cognitive Drill",
    example: "Perform this exercise deliberately: focus 100% of your attention on the task for the full duration without multitasking.",
    steps: [
      "Read the drill and set aside any other distractions.",
      "Execute the exercise step-by-step with focus.",
      "Reflect on what felt challenging and mark as completed."
    ],
    benefit: "Builds neuroplasticity and daily habit momentum.",
    tip: "Consistency over intensity: 5 focused minutes every day beats 1 hour once a week!"
  };
}
