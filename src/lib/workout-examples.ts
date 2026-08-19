// ============================================================================
// BRAINGYM WORKOUT EXAMPLES, STEP-BY-STEP GUIDES & ACCOUNTABILITY DRILLS
// ============================================================================

export interface WorkoutExample {
  title: string;
  example: string;
  steps: string[];
  benefit: string;
  tip?: string;
  verificationPrompt?: string;
  verificationOptions?: string[];
}

const SPECIFIC_EXAMPLES: Record<string, WorkoutExample> = {
  // ─── EMOTIONAL INTELLIGENCE & EMPATHY ─────────────────────────────────
  "emotional labelling": {
    title: "Emotional Labeling (Affect Labeling)",
    example: "When you feel stressed, angry, or overwhelmed today, pause and name the exact specific emotion with precision (e.g. 'I am feeling anxious about meeting the deadline because I fear falling behind' rather than just 'I feel bad').",
    steps: [
      "Notice physical sensations of tension (tight chest, clenched jaw, racing pulse).",
      "Assign a precise emotional word to it: Frustrated, Disrespected, Insecure, or Overwhelmed.",
      "Say to yourself: 'I am noticing a feeling of [emotion]. It is just data, not who I am.'",
      "Take 2 slow breaths to let the prefrontal cortex calm the amygdala."
    ],
    benefit: "UCLA neuroimaging proves that putting feelings into words instantly shifts neural activity from the emotional amygdala to the rational right ventrolateral prefrontal cortex, reducing emotional reactivity by up to 50%.",
    tip: "Tip: The more specific your emotion vocabulary (granularity), the faster your brain regulates stress.",
    verificationPrompt: "Which emotion did you label during this exercise?",
    verificationOptions: ["Anxiety / Stress", "Frustration / Anger", "Overwhelm / Fatigue", "Calm / Focus", "Excitement / Hope"]
  },

  "active listening": {
    title: "Active Listening & Echo Practice",
    example: "In your next conversation today (in person or on a call), listen 100% without formulating your reply while the other person is speaking. Before giving your thoughts, summarize what they said in your own words (e.g. 'So what you are saying is... did I get that right?').",
    steps: [
      "Give unbroken eye contact or total focus; put your phone and other tabs away.",
      "Resist the urge to interrupt, give advice, or share your own similar story.",
      "Summarize the speaker's main point and validate their emotion before responding.",
      "Ask 1 open-ended follow-up question: 'Tell me more about how that affected you.'"
    ],
    benefit: "Engages the mirror neuron network and Theory of Mind in the medial prefrontal cortex, deepening trust and executive social reasoning.",
    tip: "Tip: True listening means listening to understand, not listening to reply.",
    verificationPrompt: "Did you summarize the other person's point before replying?",
    verificationOptions: ["Yes, I summarized their main point", "Yes, I listened without interrupting", "I practiced with a colleague/friend", "I observed my urge to interrupt"]
  },

  "empathy exercise": {
    title: "Empathy & Perspective-Taking Drill",
    example: "Think of someone who frustrated or annoyed you recently. Spend 60 seconds imagining their day from their shoes: their pressures, fears, lack of sleep, or hidden burdens that might explain their behavior.",
    steps: [
      "Bring the person and their recent action to your mind without judgment.",
      "Ask: 'What unspoken pressures, stress, or worries might they be carrying today?'",
      "Recognize that their behavior is usually about their internal state, not a personal attack on you.",
      "Send a silent wish for their peace or resolution."
    ],
    benefit: "Downregulates stress hormones, reduces anger rumination, and stimulates the anterior insula and empathy circuits.",
    tip: "Tip: Compassion is not agreeing with bad behavior; it is understanding the human condition behind it.",
    verificationPrompt: "What perspective did you discover about the other person?",
    verificationOptions: ["They may be carrying hidden stress", "Their reaction was about them, not me", "I found common ground", "I felt my anger decrease"]
  },

  "gratitude": {
    title: "Neuro-Gratitude Shift",
    example: "Identify 3 specific, non-obvious things you are grateful for today (e.g. 'The crisp morning air on my walk', 'A supportive text from my friend', 'The hot shower this morning').",
    steps: [
      "Pick 3 concrete details from the last 24 hours.",
      "Visualize each memory for 10 seconds and feel the warmth in your chest.",
      "Write them down or say them aloud with genuine appreciation."
    ],
    benefit: "Stimulates dopamine and serotonin production in the brainstem, rewiring neural pathways toward optimism and cognitive resilience.",
    verificationPrompt: "How did the gratitude reflection feel?",
    verificationOptions: ["Felt a noticeable mood lift", "Felt calmer and grounded", "Gained perspective on my day", "Noticed small blessings"]
  },

  "cognitive restructuring": {
    title: "Cognitive Restructuring & Reframing",
    example: "Take a negative automatic thought (e.g. 'I messed up the presentation, I am terrible at this') and reframe it into an objective, growth-oriented thought (e.g. 'One slide was confusing, but the team liked the data; I will practice that section next time').",
    steps: [
      "Catch the distorted negative thought (all-or-nothing thinking or catastrophizing).",
      "Examine the actual evidence: Is it 100% true, or is your inner critic exaggerating?",
      "Formulate a balanced, constructive replacement thought.",
      "Action: What is 1 constructive step you can take right now?"
    ],
    benefit: "Strengthens prefrontal executive control over catastrophic cognitive distortions.",
    verificationPrompt: "Did you successfully reframe the negative thought?",
    verificationOptions: ["Yes, created a balanced reframe", "Identified the cognitive distortion", "Felt less anxious afterward", "Took a constructive action"]
  },

  "stoic pause": {
    title: "The Stoic Pause (Stimulus vs Response)",
    example: "Between stimulus and response, there is a space. When triggered or receiving bad news, count to 10 before reacting, typing a message, or speaking.",
    steps: [
      "Notice the surge of adrenaline or urge to react impulsively.",
      "Physically pause: breathe in for 4 seconds, exhale for 6 seconds.",
      "Ask: 'What is the most constructive response in this situation?'",
      "Act deliberately rather than reacting emotionally."
    ],
    benefit: "Preserves cognitive energy and activates the orbitofrontal cortex to override rash impulses.",
    verificationPrompt: "Did you pause before reacting to a trigger today?",
    verificationOptions: ["Yes, took a 10-second pause", "Avoided an angry message/reply", "Breathed through the urge", "Responded calmly"]
  },

  // ─── LOGIC & MATH ───────────────────────────────────────────────────
  "mental math sprint": {
    title: "Mental Math Sprint",
    example: "Calculate a 15% tip on a $64 restaurant bill in your head ($6.40 + $3.20 = $9.60), or multiply 18 × 7 without paper (10 × 7 = 70, 8 × 7 = 56, 70 + 56 = 126).",
    steps: [
      "Break complex numbers into friendly chunks (e.g., 18 × 7 → (10 × 7) + (8 × 7)).",
      "Solve mentally without looking at a screen or writing it down.",
      "Complete 5 quick mental calculations in under 2 minutes."
    ],
    benefit: "Strengthens working memory and left-hemisphere parietal processing speed.",
    tip: "Tip: For percentage calculations, find 10% first by moving the decimal, then half that for 5%!",
    verificationPrompt: "Did you complete the mental math calculations in your head?",
    verificationOptions: ["Yes, calculated mentally without paper", "Used chunking strategy", "Completed all 5 problems", "Solved faster than usual"]
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
    tip: "Tip: Great leaders use this technique (Steel-Manning) before making major decisions.",
    verificationPrompt: "Did you identify compelling points for the opposing view?",
    verificationOptions: ["Yes, found strong counter-arguments", "Recognized my confirmation bias", "Gained broader perspective", "Steel-manned the opposing side"]
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
    tip: "Tip: If you can't explain it simply, you don't understand it well enough yet.",
    verificationPrompt: "Were you able to explain the concept without jargon?",
    verificationOptions: ["Yes, explained in plain language", "Pinpointed gaps in my knowledge", "Simplified a complex topic", "Practiced out loud"]
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
    tip: "Tip: The exhale should be twice as long as the inhale to trigger deep brain calmness.",
    verificationPrompt: "How many cycles of 4-7-8 breathing did you complete?",
    verificationOptions: ["Completed 4 full breath cycles", "Completed 3 breath cycles", "Felt heart rate slow down", "Felt tension leave my body"]
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
    verificationPrompt: "Did you complete the 4 box breathing cycles?",
    verificationOptions: ["Yes, completed 4 cycles", "Felt deep focus return", "Lowered stress instantly", "Calmed racing thoughts"]
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
    verificationPrompt: "What did you observe during your sensory walk?",
    verificationOptions: ["Noticed 5 distinct visual details", "Heard subtle ambient sounds", "Felt grounded in the moment", "Walked phone-free"]
  },

  "memory palace": {
    title: "Memory Palace Technique",
    example: "To remember a 5-item list (Apples, Coffee, Eggs, Spinach, Salmon): Imagine giant apples rolling through your front door, coffee spilling on your couch, eggs dancing on your TV, spinach covering your kitchen counter, and a salmon in your sink.",
    steps: [
      "Pick a familiar room (e.g., your living room or childhood home).",
      "Place vivid, exaggerated, humorous mental images of each item along a walking path.",
      "Walk through the mental path to retrieve all items in exact order."
    ],
    benefit: "Leverages spatial and visual hippocampus memory for superhuman recall.",
    verificationPrompt: "Did you recall the items in order using the mental path?",
    verificationOptions: ["Yes, recalled all items in order", "Used vivid mental images", "Walked the mental route", "Retained items effortlessly"]
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
    verificationPrompt: "Did you swap out added sugar today?",
    verificationOptions: ["Yes, avoided added sugar", "Drank water/tea instead of soda", "Chose nuts/fruit over candy", "Checked food labels"]
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
    verificationPrompt: "Did you complete the deep work sprint without switching tasks?",
    verificationOptions: ["Yes, 20 mins of single-tasking", "Kept phone on Do Not Disturb", "Finished the target task", "Ignored all distractions"]
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
    tip: "Tip: Emotional and bizarre visual stories stick in your memory 3x longer than plain words.",
    verificationPrompt: "Did you recall the items accurately after the delay?",
    verificationOptions: ["Yes, recalled accurately", "Used visual association story", "Practiced spaced retrieval", "Tested with 4+ items"]
  },
  "emotional-intelligence": {
    title: "Emotional Intelligence & Social Acuity",
    example: "Tune into the micro-expressions and body language of the next person you talk to today. Notice if their posture and tone match their words.",
    steps: [
      "Observe facial cues (brow tension, eye contact, smile authenticity).",
      "Listen for subtle vocal inflections and breathing rhythm.",
      "Validate their emotional state with a supportive acknowledgment."
    ],
    benefit: "Strengthens mirror neurons and interpersonal emotional agility.",
    verificationPrompt: "Did you observe micro-expressions and body language?",
    verificationOptions: ["Observed vocal tone and cues", "Validated their feelings", "Stayed present and engaged", "Showed active empathy"]
  },
  thinking: {
    title: "Lateral Thinking & Logic",
    example: "Question an assumption you made today. Ask: 'What if the exact opposite of what I assumed is true?'",
    steps: [
      "Identify a decision you need to make today.",
      "List 3 default assumptions you are making.",
      "Test what happens if 1 assumption is completely false."
    ],
    benefit: "Enhances cognitive flexibility and lateral problem-solving.",
    verificationPrompt: "Did you challenge your underlying assumption?",
    verificationOptions: ["Yes, found an alternate angle", "Questioned my default logic", "Avoided jumping to conclusions", "Tested multiple outcomes"]
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
    verificationPrompt: "Did you maintain focal attention for 60 seconds?",
    verificationOptions: ["Maintained 60s unbroken gaze", "Reset gently when distracted", "Felt focus sharpen", "Controlled mental drift"]
  },
  learning: {
    title: "Accelerated Learning Sprint",
    example: "Read 1 insightful article or book chapter today. Immediately write down 1 single action you will execute within 24 hours based on it.",
    steps: [
      "Absorb the core lesson with full focus.",
      "Synthesize it into 1 sentence of practical wisdom.",
      "Apply it to a current project or situation today."
    ],
    benefit: "Converts passive information into active procedural neuro-pathways.",
    verificationPrompt: "Did you extract a 1-sentence action takeaway?",
    verificationOptions: ["Yes, wrote 1 actionable takeaway", "Applied the insight immediately", "Synthesized the core concept", "Shared the learning with someone"]
  },
  health: {
    title: "Neuro-Health & Vitality Routine",
    example: "Drink 500ml (2 full glasses) of fresh water first thing in the morning with a pinch of sea salt or lemon to rehydrate your brain tissue.",
    steps: [
      "Your brain is 73% water; dehydration by just 2% drops cognitive performance by 20%.",
      "Drink a large glass of water before looking at social media or taking caffeine.",
      "Pair with 5 minutes of light stretching or brisk movement."
    ],
    benefit: "Optimizes cerebrospinal fluid circulation and neurotransmitter synthesis.",
    verificationPrompt: "Did you complete the brain hydration routine?",
    verificationOptions: ["Drank 500ml water upon waking", "Did light movement/stretching", "Avoided screen/caffeine first", "Felt mental clarity return"]
  },
  creativity: {
    title: "Divergent Creativity Sprint",
    example: "Take an everyday object (like a coffee mug or paperclip) and brainstorm 5 completely unconventional uses for it in 60 seconds.",
    steps: [
      "Set a 60-second timer.",
      "Force your brain to list wild, unconventional, and humorous ideas without judging.",
      "Aim for at least 5 distinct creative uses."
    ],
    benefit: "Stimulates divergent associative thinking in the frontopolar cortex.",
    verificationPrompt: "How many creative uses did you generate?",
    verificationOptions: ["Generated 5+ unconventional uses", "Generated 3-4 creative ideas", "Pushed past obvious ideas", "Enjoyed the divergent sprint"]
  }
};

export function getWorkoutExample(activity: {
  title?: string;
  category_id?: string;
  category?: { slug?: string };
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
      tip: "Take your time and focus on quality rather than rushing through the exercise.",
      verificationPrompt: "Did you complete all the exercise steps?",
      verificationOptions: ["Yes, completed all steps", "Followed instructions deliberately", "Felt the cognitive benefit", "Will practice again tomorrow"]
    };
  }

  // 3. Fallback to category-based rich example
  const catSlug = (activity.category?.slug || activity.category_id || "").toLowerCase();
  for (const [key, fallback] of Object.entries(CATEGORY_FALLBACK_EXAMPLES)) {
    if (catSlug.includes(key) || titleLower.includes(key)) {
      return {
        ...fallback,
        title: activity.title || fallback.title,
      };
    }
  }

  // 4. Default universal cognitive drill
  return {
    title: activity.title || "Daily Cognitive Drill",
    example: "Perform this exercise deliberately: focus 100% of your attention on the task for the full duration without multitasking.",
    steps: [
      "Read the drill and set aside any other distractions.",
      "Execute the exercise step-by-step with focus.",
      "Reflect on what felt challenging and verify completion."
    ],
    benefit: "Builds neuroplasticity and daily habit momentum.",
    tip: "Consistency over intensity: 5 focused minutes every day beats 1 hour once a week!",
    verificationPrompt: "Did you perform this exercise deliberately?",
    verificationOptions: ["Yes, performed with 100% focus", "Completed without distractions", "Reflected on the exercise", "Earned daily workout XP"]
  };
}
