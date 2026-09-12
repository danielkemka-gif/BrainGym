import { RealLifeScenario, UserRoleCategory } from "./types";

export const REAL_LIFE_SCENARIOS: RealLifeScenario[] = [
  // ─── 1. ENTREPRENEUR SCENARIO: THE 30% DISCOUNT DILEMMA ───────────────────
  {
    id: "scen-entrepreneur-discount",
    title: "The Major Customer Discount Demand",
    topicCategory: "Business & Wealth",
    roleCategory: "Entrepreneur",
    ageBracket: "26-35",
    estimatedMinutes: 10,
    coverEmoji: "🚀",
    coverIllustration: "finance",
    scenarioNarrative:
      "You run a growing business. A major repeat customer who accounts for 20% of your quarterly revenue calls you. They claim your competitor is offering the same product for 30% less and insist you match the price immediately, or they will walk away by 5 PM today.",
    contextWhyItMatters:
      "In business, panic-discounting destroys operating margins, sets a dangerous precedent, and signals lack of confidence in your core value proposition.",
    decisionPrompt: "What would you do?",
    decisionOptions: [
      {
        id: "opt-entr-1",
        letter: "A",
        text: "Immediately reduce your price by 30% to avoid losing them.",
        thinkingStyle: "Reactive Fear of Loss",
        isRecommended: false,
        consequences:
          "You keep the customer today, but wipe out your profit margin. The customer now knows price pressure works and will demand further concessions next quarter.",
        brainExplanation:
          "The amygdala perceives loss of a major client as an acute threat, triggering an immediate concession impulse that overrides rational long-term margin calculation.",
      },
      {
        id: "opt-entr-2",
        letter: "B",
        text: "Tell the customer your price is 100% final and challenge them to leave if they want cheap quality.",
        thinkingStyle: "Defensive Aggression",
        isRecommended: false,
        consequences:
          "You preserve pricing dignity, but alienate a valuable client who may walk away solely due to emotional friction rather than price.",
        brainExplanation:
          "Ego-defensive threat response activates fight-or-flight reactivity, shutting down constructive problem-solving pathways in the prefrontal cortex.",
      },
      {
        id: "opt-entr-3",
        letter: "C",
        text: "Pause, acknowledge their concern, and ask targeted questions to understand the exact scope and delivery terms before unbundling services or offering flexible volume tiers.",
        thinkingStyle: "Strategic Inquiry & Value Anchoring",
        isRecommended: true,
        consequences:
          "You discover the competitor's offer lacks warranty and fast delivery. You tailor a hybrid package that preserves your margin while addressing their cash flow constraint.",
        brainExplanation:
          "Pausing stimulates vagal tone, allowing the prefrontal cortex to dispassionately separate actual client needs from negotiating leverage tactics.",
      },
      {
        id: "opt-entr-4",
        letter: "D",
        text: "Ignore the message until tomorrow morning to make them wait.",
        thinkingStyle: "Passive Avoidance",
        isRecommended: false,
        consequences:
          "The customer feels ignored and signs a contract with the competitor before the 5 PM deadline.",
        brainExplanation:
          "Procrastination is an emotional regulation failure where the brain avoids uncomfortable conflict at the expense of outcome control.",
      },
    ],
    brainInsightTakeaway: "Good decision-making starts by understanding the problem before reacting to it. Pause. Understand. Then decide.",
    cognitiveSkillInvolved: "Inhibitory Control & Value Anchoring",
    relatedBrainChallenge: {
      id: "bc-entr-discount-info",
      title: "Negotiation Signal Identification",
      category: "Critical Thinking",
      subcategory: "Information Value",
      difficulty: "intermediate",
      type: "critical_scenario",
      estimatedTimeSec: 45,
      instruction: "Select the highest-leverage information to clarify first.",
      cognitiveSkill: "Information Triage",
      question:
        "When negotiating with a price-sensitive client, which 3 pieces of information should you clarify FIRST before altering your price?",
      options: [
        { id: "bc-o1", label: "Delivery timeline, warranty terms, and volume commitments", isCorrect: true },
        { id: "bc-o2", label: "How much money the competitor's CEO makes", isCorrect: false },
        { id: "bc-o3", label: "The customer's personal family budget", isCorrect: false },
        { id: "bc-o4", label: "Your personal rent expenses this month", isCorrect: false },
      ],
      educationalWhy:
        "Clarifying scope, speed, and warranty reveals hidden trade-offs that justify your price premium without eroding trust.",
      xpReward: 30,
      coinReward: 10,
    },
    physicalActionTask: {
      id: "task-entr-negotiation-facts",
      title: "The 3-Fact Decision Pause",
      illustrationType: "handwriting",
      durationMinutes: 5,
      physicalAction:
        "Take a pen and paper. Think of one important financial or business decision you are facing today. Write down 3 facts you must verify before making your final call.",
      cognitiveConnection:
        "Physically writing down external facts forces prefrontal working memory to override emotional impulse biases.",
      xpReward: 50,
      coinReward: 20,
    },
    journalPrompts: [
      "What decision did you apply the 3-Fact Pause to today?",
      "How did pausing change your initial emotional reaction?",
      "What is one negotiation boundary you will enforce this week?",
    ],
    suggestedReflectionTemplate:
      "Today I learned that reacting quickly isn't the same as responding wisely. When I faced my pricing decision, taking a 3-fact pause prevented me from panic concessions.",
  },

  // ─── 2. STUDENT SCENARIO: EXAM HALL FREEZE & ACTIVE RECALL ────────────────
  {
    id: "scen-student-exam-freeze",
    title: "Exam Paper Surprise & Sudden Blank Mind",
    topicCategory: "Study & Learning",
    roleCategory: "Student",
    ageBracket: "15-24",
    estimatedMinutes: 10,
    coverEmoji: "🎒",
    coverIllustration: "knowledge",
    scenarioNarrative:
      "You sit down in a high-stakes exam hall. You open Question 1 and realize it is framed in a completely unfamiliar way. Your heart races, your palms sweat, and your mind suddenly feels totally blank on concepts you studied yesterday.",
    contextWhyItMatters:
      "Acute academic anxiety constricts working memory in the developing prefrontal cortex, locking out semantic recall unless you trigger an autonomic nervous system reset.",
    decisionPrompt: "What would you do?",
    decisionOptions: [
      {
        id: "opt-stud-1",
        letter: "A",
        text: "Keep staring at Question 1 in panic, trying to force your memory to work faster.",
        thinkingStyle: "Hyper-Arousal Spiral",
        isRecommended: false,
        consequences:
          "Cortisol spikes further, wasting 15 valuable minutes while deepening the mental block.",
        brainExplanation:
          "High adrenaline levels clamp down on prefrontal synaptic connections, paralyzing working memory retrieval.",
      },
      {
        id: "opt-stud-2",
        letter: "B",
        text: "Close your eyes, take two deep physiological sighs (long exhale), skip to a familiar Question 3, and write down 3 easy keywords to jumpstart momentum.",
        thinkingStyle: "Autonomic Reset & Progressive Priming",
        isRecommended: true,
        consequences:
          "Heart rate stabilizes, dopamine and acetylcholine unlock memory pathways, and you return to Question 1 with calm clarity.",
        brainExplanation:
          "Extended exhales activate the vagus nerve, rapidly lowering sympathetic arousal and restoring hippocampal retrieval circuits.",
      },
      {
        id: "opt-stud-3",
        letter: "C",
        text: "Rush through the entire exam randomly guessing to finish before time runs out.",
        thinkingStyle: "Panic Abdication",
        isRecommended: false,
        consequences:
          "High rate of avoidable mistakes on questions you actually knew how to answer.",
        brainExplanation:
          "Abandoning executive control leads to disorganized impulsivity.",
      },
      {
        id: "opt-stud-4",
        letter: "D",
        text: "Put your pen down and accept that you failed this subject.",
        thinkingStyle: "Catastrophic Resignation",
        isRecommended: false,
        consequences:
          "Destroys academic self-efficacy and surrender of earned preparation.",
        brainExplanation:
          "Learned helplessness shuts down goal-directed cognitive drive.",
      },
    ],
    brainInsightTakeaway: "When stress locks working memory, reset your physiology first. Breathe. Start with the known. Then conquer the unknown.",
    cognitiveSkillInvolved: "Vagal Autonomic Regulation & Priming",
    relatedBrainChallenge: {
      id: "bc-stud-recall-priming",
      title: "Active Schema Retrieval",
      category: "Memory",
      subcategory: "Semantic Retrieval",
      difficulty: "intermediate",
      type: "memory_recall",
      estimatedTimeSec: 40,
      instruction: "Choose the method with the highest neural retention.",
      cognitiveSkill: "Concept Priming",
      question:
        "When studying a complex chapter, which method creates the STRONGEST long-term synaptic retention?",
      options: [
        { id: "bc-so1", label: "Closing the book and writing a 3-bullet summary from pure memory (Active Recall)", isCorrect: true },
        { id: "bc-so2", label: "Highlighting every sentence with a bright yellow marker", isCorrect: false },
        { id: "bc-so3", label: "Rereading the chapter 5 times passively while listening to music", isCorrect: false },
        { id: "bc-so4", label: "Copying the textbook word-for-word into a notebook", isCorrect: false },
      ],
      educationalWhy:
        "Active retrieval effort triggers synaptic plasticity and dendritic spine growth far more effectively than passive recognition.",
      xpReward: 30,
      coinReward: 10,
    },
    physicalActionTask: {
      id: "task-stud-blind-recall",
      title: "The 3-Minute Blind Handwritten Recall",
      illustrationType: "handwriting",
      durationMinutes: 4,
      physicalAction:
        "Close all tabs and books. Take a blank sheet of paper and write down everything you remember about the last topic you studied, without looking.",
      cognitiveConnection:
        "Blind recall strengthens neuro-muscular semantic encoding and reveals actual knowledge gaps.",
      xpReward: 50,
      coinReward: 20,
    },
    journalPrompts: [
      "How did it feel to write from memory without looking at notes?",
      "Which specific concept was easiest or hardest to recall?",
      "How will you apply the physiological sigh when you feel sudden stress?",
    ],
    suggestedReflectionTemplate:
      "Today I realized that feeling blank is a physiological reaction, not a sign of lack of intelligence. Taking a breathing reset restores my memory instantly.",
  },

  // ─── 3. PROFESSIONAL SCENARIO: WORKPLACE MEETING PUSHBACK ──────────────────
  {
    id: "scen-prof-meeting-pushback",
    title: "Unexpected Public Pushback in a Leadership Meeting",
    topicCategory: "Work & Career",
    roleCategory: "Professional",
    ageBracket: "25-45",
    estimatedMinutes: 10,
    coverEmoji: "💼",
    coverIllustration: "workplace",
    scenarioNarrative:
      "You present a strategic project proposal in a cross-functional department meeting. A senior colleague bluntly interrupts you in front of your manager, saying: 'This proposal will never work and wastes our department budget.'",
    contextWhyItMatters:
      "Workplace credibility is forged not by having no critics, but by how composed and constructive you remain when publicly challenged.",
    decisionPrompt: "What would you do?",
    decisionOptions: [
      {
        id: "opt-prof-1",
        letter: "A",
        text: "Interrupt them immediately and argue back aggressively to defend your competence.",
        thinkingStyle: "Defensive Escalation",
        isRecommended: false,
        consequences:
          "The meeting devolves into an emotional battle, making you look defensive and unprofessional to senior leadership.",
        brainExplanation:
          "Social threat triggers an ego-defense reflex that hijacks emotional composure.",
      },
      {
        id: "opt-prof-2",
        letter: "B",
        text: "Take a 2-second breath, hold neutral eye contact, and say: 'I appreciate the candid feedback. Which specific budget component or assumption concerns you most?'",
        thinkingStyle: "Strategic De-escalation & Precision Inquiry",
        isRecommended: true,
        consequences:
          "You shift the dynamic from personal attack to objective data analysis, gaining the respect of your manager and the entire room.",
        brainExplanation:
          "Reframing hostile critique into specific data inquiries forces the critic's prefrontal cortex to provide logic rather than emotional rhetoric.",
      },
      {
        id: "opt-prof-3",
        letter: "C",
        text: "Look at the floor, apologize, and offer to withdraw the proposal immediately.",
        thinkingStyle: "Submissive Collapse",
        isRecommended: false,
        consequences:
          "Signals lack of conviction in your work and weakens your standing for future leadership opportunities.",
        brainExplanation:
          "Appeasement reflex avoids immediate social tension at the cost of long-term career agency.",
      },
      {
        id: "opt-prof-4",
        letter: "D",
        text: "Complain privately to your manager after the meeting about how unfair that colleague was.",
        thinkingStyle: "Passive Triangulation",
        isRecommended: false,
        consequences:
          "Misses the opportunity to demonstrate executive presence in real-time.",
        brainExplanation:
          "Delayed venting does not develop in-the-moment emotional agility.",
      },
    ],
    brainInsightTakeaway: "Executive presence is the ability to turn emotional pushback into objective inquiry. Stay calm. Ask for precision. Lead with data.",
    cognitiveSkillInvolved: "Emotional Regulation & Precision Inquiry",
    relatedBrainChallenge: {
      id: "bc-prof-conflict-reframing",
      title: "Executive Cognitive Reframing",
      category: "Emotional Intelligence",
      subcategory: "De-escalation",
      difficulty: "intermediate",
      type: "critical_scenario",
      estimatedTimeSec: 40,
      instruction: "Choose the optimal mental reframe.",
      cognitiveSkill: "Reframing Agility",
      question:
        "When an aggressive statement is made in a meeting, what is the MOST effective psychological reframe?",
      options: [
        { id: "bc-po1", label: "Treat it as raw data about their concerns rather than an attack on your character", isCorrect: true },
        { id: "bc-po2", label: "Assume they are trying to get you fired", isCorrect: false },
        { id: "bc-po3", label: "Plan how to embarrass them in the next meeting", isCorrect: false },
        { id: "bc-po4", label: "Pretend you didn't hear it and continue speaking louder", isCorrect: false },
      ],
      educationalWhy:
        "Cognitive reframing dampens amygdala reactivity, keeping the anterior cingulate cortex focused on resolution.",
      xpReward: 30,
      coinReward: 10,
    },
    physicalActionTask: {
      id: "task-prof-uninterrupted-listening",
      title: "The 5-Minute Uninterrupted Listening Drill",
      illustrationType: "listening",
      durationMinutes: 5,
      physicalAction:
        "In your next conversation or phone call today, listen for 5 full minutes without interrupting, formulating your rebuttal, or looking at your phone.",
      cognitiveConnection:
        "Inhibiting the verbal comeback reflex strengthens prefrontal executive restraint and relational trust.",
      xpReward: 50,
      coinReward: 20,
    },
    journalPrompts: [
      "How did it feel to listen without preparing an immediate comeback?",
      "What is one piece of feedback you received recently that you can reframe constructively?",
      "How will you handle your next high-stakes meeting interaction?",
    ],
    suggestedReflectionTemplate:
      "Today I learned that the best response to aggressive criticism is calm curiosity. Asking for specific data protects my authority without escalating conflict.",
  },

  // ─── 4. PARENT SCENARIO: TRANSITIONING FROM WORK TO HOME ───────────────────
  {
    id: "scen-parent-domestic-patience",
    title: "The 6 PM Front-Door Transition & Domestic Reset",
    topicCategory: "Family & Home",
    roleCategory: "Parent",
    ageBracket: "28-50+",
    estimatedMinutes: 10,
    coverEmoji: "🏡",
    coverIllustration: "family",
    scenarioNarrative:
      "You arrive home after a grueling 9-hour workday and 1 hour stuck in traffic. You are exhausted and carrying leftover workplace tension. The moment you open the door, your children begin crying and arguing over a broken toy, and your spouse asks you an urgent household question.",
    contextWhyItMatters:
      "Depleted cognitive bandwidth makes us irritable with the people we love most. Without an intentional transition, work stress contaminates home peace.",
    decisionPrompt: "What would you do?",
    decisionOptions: [
      {
        id: "opt-par-1",
        letter: "A",
        text: "Raise your voice and shout: 'Can everyone be quiet for just five minutes after the day I had?!'",
        thinkingStyle: "Exhaustion-Driven Reactivity",
        isRecommended: false,
        consequences:
          "Increases household cortisol, creates emotional distance, and leaves you feeling guilty for the rest of the evening.",
        brainExplanation:
          "Prefrontal glucose depletion weakens impulse gating, allowing lower limbic frustration to vent onto innocent family members.",
      },
      {
        id: "opt-par-2",
        letter: "B",
        text: "Pause in your car or at the front door for 90 seconds. Take 4 slow breaths, leave work thoughts outside, smile, and enter saying: 'I am happy to see you all. Let's solve this together.'",
        thinkingStyle: "The 90-Second Transitional Reset",
        isRecommended: true,
        consequences:
          "De-escalates the room instantly, models emotional regulation for your children, and protects family intimacy.",
        brainExplanation:
          "The 90-second physiological window allows circulating adrenaline to metabolize, shifting your neural state from survival fight-mode to nurturing social engagement.",
      },
      {
        id: "opt-par-3",
        letter: "C",
        text: "Walk straight to your bedroom, lock the door, and look at your phone for 2 hours.",
        thinkingStyle: "Numbing Disconnection",
        isRecommended: false,
        consequences:
          "Leaves your partner feeling unsupported and avoids building meaningful relational connection.",
        brainExplanation:
          "Passive phone scrolling provides cheap dopamine without restoring actual parasympathetic energy.",
      },
      {
        id: "opt-par-4",
        letter: "D",
        text: "Blame your partner for not having the children calm before you arrived.",
        thinkingStyle: "Blame Displacement",
        isRecommended: false,
        consequences:
          "Creates marital friction and resentment over everyday domestic realities.",
        brainExplanation:
          "Displacement is an unhelpful cognitive defense mechanism that redirects internal discomfort onto safe external targets.",
      },
    ],
    brainInsightTakeaway: "Patience is a mental muscle that requires a transitional boundary. 90 seconds of reset before your front door protects your family's peace.",
    cognitiveSkillInvolved: "State Shifting & Autonomic Co-regulation",
    relatedBrainChallenge: {
      id: "bc-par-state-shift",
      title: "Emotional Co-Regulation Drill",
      category: "Emotional Intelligence",
      subcategory: "Empathy",
      difficulty: "intermediate",
      type: "critical_scenario",
      estimatedTimeSec: 40,
      instruction: "Select the most effective autonomic calming behavior.",
      cognitiveSkill: "Mirror Neuron Calming",
      question:
        "When an upset child or partner is emotional, what is the fastest biological way to help them calm down?",
      options: [
        { id: "bc-par-o1", label: "Lowering your own vocal tone, breathing slowly, and making calm eye contact", isCorrect: true },
        { id: "bc-par-o2", label: "Explaining all the logical reasons why they shouldn't feel upset", isCorrect: false },
        { id: "bc-par-o3", label: "Matching their loud voice so they know you are serious", isCorrect: false },
        { id: "bc-par-o4", label: "Telling them to stop overreacting", isCorrect: false },
      ],
      educationalWhy:
        "Human mirror neurons sync autonomic states; your calm nervous system acts as an external prefrontal cortex for an overwhelmed family member.",
      xpReward: 30,
      coinReward: 10,
    },
    physicalActionTask: {
      id: "task-par-door-reset",
      title: "The 90-Second Front-Door Reset Walk",
      illustrationType: "walking",
      durationMinutes: 3,
      physicalAction:
        "Before entering your home today or meeting your family, pause for 90 seconds. Take 4 deep nasal breaths and mentally declare: 'Work is finished. I enter with love and patience.'",
      cognitiveConnection:
        "Deliberate transitional rituals create clean neural boundaries between professional performance and domestic connection.",
      xpReward: 50,
      coinReward: 20,
    },
    journalPrompts: [
      "How did taking the 90-second reset change the atmosphere at home tonight?",
      "Where in your daily routine do you feel the highest impulse to react impatiently?",
      "What is one positive phrase you will say to your family tomorrow morning?",
    ],
    suggestedReflectionTemplate:
      "Today I realized that my family doesn't need my workplace stress; they need my presence. Taking 90 seconds to reset at the door changed the entire tone of our evening.",
  },

  // ─── 5. EXECUTIVE SCENARIO: TWO TOP MANAGERS IN CONFLICT ───────────────────
  {
    id: "scen-exec-team-conflict",
    title: "Resolving High-Stakes Leadership Division",
    topicCategory: "Decision Making",
    roleCategory: "Executive",
    ageBracket: "35-55+",
    estimatedMinutes: 10,
    coverEmoji: "🏢",
    coverIllustration: "workplace",
    scenarioNarrative:
      "Two of your highest-performing department heads (Sales and Product) are in a bitter disagreement over quarterly roadmap priorities. Their teams have begun taking sides, causing communication breakdowns, passive resistance, and delayed company deliverables.",
    contextWhyItMatters:
      "Executive leadership requires resolving ideological polarization by anchoring all parties to shared enterprise outcomes rather than picking personal favorites.",
    decisionPrompt: "What would you do?",
    decisionOptions: [
      {
        id: "opt-exec-1",
        letter: "A",
        text: "Pick the side of whichever manager makes the most persuasive argument and order the other to comply.",
        thinkingStyle: "Autocratic Favoritism",
        isRecommended: false,
        consequences:
          "The overruled manager feels alienated, disengages, and may quietly look for another job while their team drags its feet.",
        brainExplanation:
          "Zero-sum thinking triggers status threat, activating deep resentment in high-performing leaders.",
      },
      {
        id: "opt-exec-2",
        letter: "B",
        text: "Convene both leaders in a structured alignment session. Have each articulate the other's core objectives, then reframe priorities around a unified North Star metric with clear trade-offs.",
        thinkingStyle: "Integrative Synthesis & Perspective Reversal",
        isRecommended: true,
        consequences:
          "Both leaders feel heard, dismantle silo mentalities, and co-create an integrated roadmap that accelerates organizational velocity.",
        brainExplanation:
          "Forcing perspective-taking activates the temporoparietal junction, breaking tribal cognitive biases and enabling collaborative game theory.",
      },
      {
        id: "opt-exec-3",
        letter: "C",
        text: "Tell them to 'work it out like adults' without getting involved yourself.",
        thinkingStyle: "Executive Abdication",
        isRecommended: false,
        consequences:
          "The organizational rift widens into toxic politics, demoralizing junior employees.",
        brainExplanation:
          "Avoiding leadership arbitration allows dysfunction to entrench within the company culture.",
      },
      {
        id: "opt-exec-4",
        letter: "D",
        text: "Reassign both managers to separate trivial projects to stop the arguing.",
        thinkingStyle: "Punitive Disruption",
        isRecommended: false,
        consequences:
          "Destroys top talent morale and disrupts core company revenue pipelines.",
        brainExplanation:
          "Misdiagnosing structural conflict as interpersonal misbehavior destroys high-leverage assets.",
      },
    ],
    brainInsightTakeaway: "Great leadership does not pick a side; it elevates both sides to a higher common purpose. Align on the mission. Clarify the trade-offs.",
    cognitiveSkillInvolved: "Perspective Reversal & Integrative Synthesis",
    relatedBrainChallenge: {
      id: "bc-exec-perspective-taking",
      title: "Perspective Reversal Matrix",
      category: "Executive Decisions",
      subcategory: "Synthesis",
      difficulty: "advanced",
      type: "critical_scenario",
      estimatedTimeSec: 45,
      instruction: "Choose the strongest debiasing technique.",
      cognitiveSkill: "Cognitive Empathy",
      question:
        "What is the most effective cognitive technique for neutralizing entrenched departmental bias?",
      options: [
        { id: "bc-eo1", label: "Having each side present the opposing team's strongest argument (Steel-manning)", isCorrect: true },
        { id: "bc-eo2", label: "Voting publicly by show of hands", isCorrect: false },
        { id: "bc-eo3", label: "Threatening bonuses if people disagree", isCorrect: false },
        { id: "bc-eo4", label: "Hiring an external consultant to tell everyone what to think", isCorrect: false },
      ],
      educationalWhy:
        "Steel-manning forces neural circuits to simulate the counterpart's operational constraints, dissolving subjective confirmation bias.",
      xpReward: 30,
      coinReward: 10,
    },
    physicalActionTask: {
      id: "task-exec-strategic-priorities",
      title: "The 3-Priority North Star Alignment",
      illustrationType: "planning",
      durationMinutes: 5,
      physicalAction:
        "Identify your top team or personal challenge. Write down the 1 single overarching metric that matters most, and 2 trade-offs you are willing to make to achieve it.",
      cognitiveConnection:
        "Explicitly articulating trade-offs reduces cognitive ambiguity and prevents strategic drift.",
      xpReward: 50,
      coinReward: 20,
    },
    journalPrompts: [
      "Where is there unspoken friction in your team or life right now?",
      "What is the other person's strongest, most valid point?",
      "What shared goal can you anchor everyone around tomorrow?",
    ],
    suggestedReflectionTemplate:
      "Today I learned that conflict often arises from differing constraints rather than malice. Elevating the conversation to a shared North Star metric brings alignment.",
  },

  // ─── 6. RETIREE / MATURE ADULT SCENARIO: WISDOM TRANSFER & MENTAL SHARPNESS ─
  {
    id: "scen-retiree-vitality",
    title: "Synthesizing Wisdom & Preserving Mental Vitality",
    topicCategory: "Focus & Mindset",
    roleCategory: "Retiree",
    ageBracket: "50+",
    estimatedMinutes: 10,
    coverEmoji: "👑",
    coverIllustration: "mindset",
    scenarioNarrative:
      "You have decades of rich professional and life experience. A younger colleague, child, or mentee asks you for guidance on navigating a major career setback. You want to offer meaningful insight that empowers them rather than sounding like an old-fashioned lecture.",
    contextWhyItMatters:
      "Mentorship and active semantic synthesis stimulate neurogenesis and protect cognitive sharpness throughout life.",
    decisionPrompt: "What would you do?",
    decisionOptions: [
      {
        id: "opt-ret-1",
        letter: "A",
        text: "Tell them back in your day things were much harder and they need to toughen up.",
        thinkingStyle: "Dismissive Comparison",
        isRecommended: false,
        consequences:
          "The mentee shuts down emotionally and avoids seeking your counsel in the future.",
        brainExplanation:
          "Nostalgia bias overlooks modern nuances and closes empathetic communication channels.",
      },
      {
        id: "opt-ret-2",
        letter: "B",
        text: "Listen deeply to their dilemma, share a vulnerable story of when you faced a similar failure, and ask: 'What is the one thing this setback is teaching you about your next move?'",
        thinkingStyle: "Empowering Socratic Mentorship",
        isRecommended: true,
        consequences:
          "The mentee feels understood, internalizes the wisdom, and develops self-directed resilience.",
        brainExplanation:
          "Vulnerable storytelling activates oxytocin and dopamine in the listener, making wisdom memorable and actionable.",
      },
      {
        id: "opt-ret-3",
        letter: "C",
        text: "Tell them exactly what step-by-step actions to take and get annoyed if they don't follow every detail.",
        thinkingStyle: "Prescriptive Control",
        isRecommended: false,
        consequences:
          "Creates dependency or rebellion rather than cultivating independent critical thinking.",
        brainExplanation:
          "Micro-managing advice prevents the mentee from developing their own prefrontal problem-solving pathways.",
      },
      {
        id: "opt-ret-4",
        letter: "D",
        text: "Say you have been out of the game too long to have anything useful to contribute.",
        thinkingStyle: "Self-Minimization",
        isRecommended: false,
        consequences:
          "Wastes valuable institutional wisdom and isolates you from intergenerational vitality.",
        brainExplanation:
          "Cognitive disengagement accelerates synaptic pruning and working memory decline.",
      },
    ],
    brainInsightTakeaway: "Wisdom is not giving answers; wisdom is asking the questions that help others discover their strength. Listen. Share vulnerability. Guide.",
    cognitiveSkillInvolved: "Socratic Inquiring & Associative Synthesis",
    relatedBrainChallenge: {
      id: "bc-ret-wisdom-synthesis",
      title: "Associative Concept Mapping",
      category: "Memory",
      subcategory: "Associative Recall",
      difficulty: "intermediate",
      type: "memory_recall",
      estimatedTimeSec: 40,
      instruction: "Select the most protective neuroplastic habit.",
      cognitiveSkill: "Neuroplastic Synthesis",
      question:
        "Which daily cognitive habit provides the highest protection for long-term brain plasticity and memory recall?",
      options: [
        { id: "bc-ro1", label: "Learning a new complex skill + daily aerobic walking + social mentorship", isCorrect: true },
        { id: "bc-ro2", label: "Watching television documentaries quietly alone for 6 hours", isCorrect: false },
        { id: "bc-ro3", label: "Doing the exact same easy crossword puzzle every day without variation", isCorrect: false },
        { id: "bc-ro4", label: "Taking expensive vitamins without any mental effort", isCorrect: false },
      ],
      educationalWhy:
        "Combining cardiovascular movement with novel cognitive tasks and social interaction releases BDNF, promoting neurogenesis in the hippocampus.",
      xpReward: 30,
      coinReward: 10,
    },
    physicalActionTask: {
      id: "task-ret-walk-recall",
      title: "The 15-Minute Phone-Free Observation Walk",
      illustrationType: "nature",
      durationMinutes: 5,
      physicalAction:
        "Take a brisk 15-minute walk outside without your phone. Notice 5 unique architectural or natural details you normally overlook. When you return, recall all 5 details.",
      cognitiveConnection:
        "Aerobic movement paired with active visual-spatial encoding stimulates hippocampal neurogenesis.",
      xpReward: 50,
      coinReward: 20,
    },
    journalPrompts: [
      "What are the 5 details you noticed on your walk today?",
      "What is one piece of timeless wisdom you want to pass on to the next generation?",
      "How did sharing or reflecting on wisdom make your mind feel today?",
    ],
    suggestedReflectionTemplate:
      "Today I realized that sharing wisdom through stories and thoughtful questions strengthens both the listener's resolve and my own cognitive vitality.",
  },

  // ─── 9. ENTREPRENEUR SCENARIO 2: CASH FLOW & PAYROLL SQUEEZE ──────────────
  {
    id: "scen-entrepreneur-cashflow",
    title: "The 72-Hour Payroll & Cash Flow Emergency",
    topicCategory: "Business & Wealth",
    roleCategory: "Entrepreneur",
    ageBracket: "25-45",
    estimatedMinutes: 10,
    coverEmoji: "💰",
    coverIllustration: "finance",
    scenarioNarrative:
      "It is Wednesday morning. A client who promised to pay a ₦3,500,000 invoice delays until next month. Your team payroll of ₦2,200,000 is due on Friday. You have ₦800,000 in liquid cash. Your stress spikes immediately.",
    contextWhyItMatters:
      "Acute cash crunches trigger panic loan decisions with exorbitant interest rates that can permanently cripple an otherwise healthy business.",
    decisionPrompt: "What would you do?",
    decisionOptions: [
      {
        id: "opt-cf-1",
        letter: "A",
        text: "Take an instant high-interest loan shark app with 35% monthly interest to make payroll without anyone knowing.",
        thinkingStyle: "Panic Debt Substitution",
        isRecommended: false,
        consequences:
          "Solves Friday's problem, but locks your business into a vicious debt cycle requiring ₦770,000 in monthly interest.",
        brainExplanation:
          "Cortisol narrows cognitive scope to immediate relief, ignoring devastating second-order financial damage.",
      },
      {
        id: "opt-cf-2",
        letter: "B",
        text: "Triage cash: Offer quick 10% cash discounts for immediate settlement from 3 other clients, negotiate a split payroll release with transparent communication, and secure an institutional bank bridge line.",
        thinkingStyle: "Asymmetric Cash Triage & Proactive Transparency",
        isRecommended: true,
        consequences:
          "Two clients pay early for the discount, raising ₦1,600,000 cash. The team respects the transparent bridge update and payroll clears cleanly by Monday.",
        brainExplanation:
          "Executive prefrontal control separates uncontrollable delays from actionable leverage levers.",
      },
      {
        id: "opt-cf-3",
        letter: "C",
        text: "Switch off your phone and tell your team that the bank has a technical glitch.",
        thinkingStyle: "Deceptive Avoidance",
        isRecommended: false,
        consequences:
          "Destroys trust with your most talented staff when the truth inevitably leaks.",
        brainExplanation:
          "Shame-avoidance response harms long-term social capital and organizational loyalty.",
      },
      {
        id: "opt-cf-4",
        letter: "D",
        text: "Fire 3 staff members on Friday morning without notice to reduce the payroll bill.",
        thinkingStyle: "Reactive Knee-Jerk Destruction",
        isRecommended: false,
        consequences:
          "Demoralizes the entire company and creates immediate legal liabilities.",
        brainExplanation:
          "Aggressive defensiveness destroys long-term operational capacity to relieve temporary anxiety.",
      },
    ],
    brainInsightTakeaway: "Cash flow crises are solved with transparent leverage and calm triage, not panic borrowing or deceptive hiding. Audit. Triage. Communicate.",
    cognitiveSkillInvolved: "Financial Cash Triage & Asymmetric Risk",
    relatedBrainChallenge: {
      id: "bc-cf-triage",
      title: "Emergency Cash Buffer Calculation",
      category: "Executive Decisions",
      subcategory: "Cash Flow Triage",
      difficulty: "intermediate",
      type: "critical_scenario",
      estimatedTimeSec: 45,
      instruction: "Calculate the most effective cash acceleration lever.",
      cognitiveSkill: "Liquidity Calculations",
      question:
        "If you need ₦1,400,000 cash in 48 hours, which strategy generates liquid cash fastest without adding debt?",
      options: [
        { id: "bc-cfo1", label: "Offering a 10% immediate-payment incentive to existing trusted invoice debtors", isCorrect: true },
        { id: "bc-cfo2", label: "Running an online giveaway contest for social followers", isCorrect: false },
        { id: "bc-cfo3", label: "Selling office furniture at 90% loss", isCorrect: false },
        { id: "bc-cfo4", label: "Applying for a 90-day government grant", isCorrect: false },
      ],
      educationalWhy:
        "Incentivizing early settlement turns existing uncollected assets into instant working capital with zero recurring debt obligation.",
      xpReward: 30,
      coinReward: 10,
    },
    physicalActionTask: {
      id: "task-cf-triage-card",
      title: "10-Minute Accounts Receivable Triage List",
      illustrationType: "drawing",
      durationMinutes: 5,
      physicalAction:
        "Write down every single person, client, or company that currently owes your business or household money. Highlight the top 2 who can pay immediately with a small discount incentive.",
      cognitiveConnection:
        "Externalizing financial numbers onto paper reduces prefrontal working memory overload and stimulates concrete execution pathways.",
      xpReward: 50,
      coinReward: 20,
    },
    journalPrompts: [
      "What is your current liquid cash runway in months?",
      "How did writing down actionable receivables shift your stress level?",
      "What is one rule you will enforce to prevent future payment delays?",
    ],
    suggestedReflectionTemplate:
      "Today I learned that cash emergencies require calm arithmetic and swift negotiation rather than panicked silence. Externalizing my cash levers restored my sense of control.",
  },

  // ─── 10. STUDENT SCENARIO 2: THE 48-HOUR PROCRASTINATION BLOCK ─────────────
  {
    id: "scen-student-procrastination",
    title: "The 48-Hour Deadline & Sudden Task Paralysis",
    topicCategory: "Study & Learning",
    roleCategory: "Student",
    ageBracket: "15-25",
    estimatedMinutes: 10,
    coverEmoji: "📚",
    coverIllustration: "knowledge",
    scenarioNarrative:
      "Your final research project is due in 48 hours. You have barely started the outline. You sit in front of the blank screen, feel intense overwhelm, and involuntarily reach for your phone to watch TikTok reels to numb the discomfort.",
    contextWhyItMatters:
      "Task paralysis is not laziness; it is emotional over-arousal where the brain perceives the possibility of failure as a threat to self-worth.",
    decisionPrompt: "What would you do?",
    decisionOptions: [
      {
        id: "opt-sp-1",
        letter: "A",
        text: "Decide you work best under extreme pressure and wait until 4 AM tomorrow before typing anything.",
        thinkingStyle: "Procrastination Rationalization",
        isRecommended: false,
        consequences:
          "Sleep deprivation ruins cognitive clarity, producing messy logic and low academic scores.",
        brainExplanation:
          "The brain rationalizes avoidance to delay discomfort, trading 4 hours of present relief for severe sleep-deprived distress.",
      },
      {
        id: "opt-sp-2",
        letter: "B",
        text: "Apply the 5-Minute Micro-Start Rule: Turn off Wi-Fi, write only 3 rough bullet points without self-criticism, and let dopamine from starting build momentum.",
        thinkingStyle: "The Zeigarnik Micro-Action Protocol",
        isRecommended: true,
        consequences:
          "Starting reduces anxiety within 3 minutes. The Zeigarnik Effect kicks in, and you smoothly write 1,500 words in your first deep session.",
        brainExplanation:
          "Lowering the barrier to entry bypasses the amygdala's threat threshold, allowing the striatum to release dopamine upon task initiation.",
      },
      {
        id: "opt-sp-3",
        letter: "C",
        text: "Copy a friend's submitted paper and alter a few words to save time.",
        thinkingStyle: "Unethical Shortcut",
        isRecommended: false,
        consequences:
          "Plagiarism detectors flag the work, risking suspension or academic disciplinary action.",
        brainExplanation:
          "Panic drives high-risk shortcuts that destroy long-term reputational safety.",
      },
      {
        id: "opt-sp-4",
        letter: "D",
        text: "Email your professor claiming your laptop was stolen to buy more time.",
        thinkingStyle: "Fabricated Deception",
        isRecommended: false,
        consequences:
          "Adds immense psychological guilt and stress without resolving your writing block.",
        brainExplanation:
          "Deception multiplies cognitive load as the brain must track false narratives while anxious.",
      },
    ],
    brainInsightTakeaway: "Action precedes motivation. You do not need to feel ready to begin. Write the first terrible sentence, and the brain's focus engine will activate.",
    cognitiveSkillInvolved: "Inhibitory Activation & Momentum Generation",
    relatedBrainChallenge: {
      id: "bc-sp-zeigarnik",
      title: "Zeigarnik Momentum Activation",
      category: "Focus & Attention",
      subcategory: "Task Initiation",
      difficulty: "beginner",
      type: "focus_fire",
      estimatedTimeSec: 30,
      instruction: "Identify the highest-leverage task initiation method.",
      cognitiveSkill: "Focus Initiation",
      question:
        "Which cognitive technique is scientifically proven to break academic procrastination fastest?",
      options: [
        { id: "bc-spo1", label: "Committing to 5 minutes of imperfect micro-action with phone hidden", isCorrect: true },
        { id: "bc-spo2", label: "Waiting until you feel 100% inspired and confident", isCorrect: false },
        { id: "bc-spo3", label: "Drinking 4 cups of coffee while scrolling social media", isCorrect: false },
        { id: "bc-spo4", label: "Rewriting your study schedule for the 5th time", isCorrect: false },
      ],
      educationalWhy:
        "Lowering the cognitive cost of starting eliminates task avoidance and activates striatal dopamine loops.",
      xpReward: 30,
      coinReward: 10,
    },
    physicalActionTask: {
      id: "task-sp-5min-draft",
      title: "5-Minute Blank Paper Brain Dump",
      illustrationType: "handwriting",
      durationMinutes: 5,
      physicalAction:
        "Take a blank piece of physical paper and a pen. Write non-stop for 5 minutes about your topic without erasing or crossing out anything. Quantity over quality.",
      cognitiveConnection:
        "Kinesthetic handwriting bypasses the inner editor, flowing ideas directly from associative semantic memory.",
      xpReward: 50,
      coinReward: 20,
    },
    journalPrompts: [
      "What task were you avoiding today before taking action?",
      "How did your anxiety change once you wrote the first few lines?",
      "What is your single priority for tomorrow morning?",
    ],
    suggestedReflectionTemplate:
      "Today I realized that perfectionism was paralyzing my work. Taking a 5-minute micro-start unlocked my focus and proved that starting is 80% of the battle.",
  },

  // ─── 11. PROFESSIONAL SCENARIO 2: CREDIT THEFT IN EXECUTIVE PRESENTATION ───
  {
    id: "scen-professional-credit",
    title: "Colleague Takes Public Credit for Your Project",
    topicCategory: "Work & Career",
    roleCategory: "Professional",
    ageBracket: "22-55",
    estimatedMinutes: 10,
    coverEmoji: "💼",
    coverIllustration: "workplace",
    scenarioNarrative:
      "In a leadership meeting with the Managing Director, your peer presents the cost-saving strategy you spent 3 weeks building and presents it as 'my personal initiative', leaving your name completely out.",
    contextWhyItMatters:
      "Reacting with emotional anger in public destroys executive polish, while staying silent enables workplace exploitation.",
    decisionPrompt: "What would you do?",
    decisionOptions: [
      {
        id: "opt-pc-1",
        letter: "A",
        text: "Interrupt loudly in front of the Managing Director and call your colleague a thief and a liar.",
        thinkingStyle: "Explosive Aggression",
        isRecommended: false,
        consequences:
          "Makes you look unhinged to leadership, overshadowing the actual credit theft.",
        brainExplanation:
          "Amygdala highjack forces a public dominance display that harms executive credibility.",
      },
      {
        id: "opt-pc-2",
        letter: "B",
        text: "Seamlessly build on their presentation with deep technical nuance: 'Thank you for introducing our framework. As I uncovered in the 3-week data model, here are the implementation metrics...', then document attribution in follow-up minutes.",
        thinkingStyle: "Strategic Attribution & Value Demonstration",
        isRecommended: true,
        consequences:
          "Leadership immediately realizes you own the intellectual depth and master data. You establish mastery without drama.",
        brainExplanation:
          "Calm prefrontal tactical redirection proves expertise through evidentiary depth rather than interpersonal complaints.",
      },
      {
        id: "opt-pc-3",
        letter: "C",
        text: "Stay completely silent, go back to your desk, and quietly complain to coworkers.",
        thinkingStyle: "Passive Resentment",
        isRecommended: false,
        consequences:
          "Solidifies their credit theft and brands you as a passive office gossip.",
        brainExplanation:
          "Learned helplessness suppresses assertive prefrontal self-advocacy.",
      },
      {
        id: "opt-pc-4",
        letter: "D",
        text: "Sabotage their upcoming project quietly behind the scenes.",
        thinkingStyle: "Malicious Retaliation",
        isRecommended: false,
        consequences:
          "Damages the overall company and exposes you to career-ending disciplinary risk.",
        brainExplanation:
          "Vindictive retaliation consumes cognitive energy that should be invested in high-value output.",
      },
    ],
    brainInsightTakeaway: "Do not fight for credit with emotional words; establish ownership through intellectual depth, verifiable data, and composed execution.",
    cognitiveSkillInvolved: "Executive Composure & Assertive Attribution",
    relatedBrainChallenge: {
      id: "bc-pc-attribution",
      title: "Tactical Attribution Framing",
      category: "Executive Decisions",
      subcategory: "Leadership Communication",
      difficulty: "advanced",
      type: "critical_scenario",
      estimatedTimeSec: 45,
      instruction: "Select the highest-credibility response in executive settings.",
      cognitiveSkill: "Strategic Framing",
      question:
        "When an idea you originated is presented by someone else, how do you claim credit with maximum executive gravitas?",
      options: [
        { id: "bc-pco1", label: "Expand on the underlying data models and execution details that only the true creator understands", isCorrect: true },
        { id: "bc-pco2", label: "Slam your hands on the boardroom table and demand an apology", isCorrect: false },
        { id: "bc-pco3", label: "Walk out of the meeting in protest", isCorrect: false },
        { id: "bc-pco4", label: "Send a passive-aggressive emoji in the group chat", isCorrect: false },
      ],
      educationalWhy:
        "Demonstrating intellectual granularity and implementation mastery proves authentic authorship incontrovertibly.",
      xpReward: 30,
      coinReward: 10,
    },
    physicalActionTask: {
      id: "task-pc-posture-reset",
      title: "3-Minute Power Posture & Vagal Nerve Reset",
      illustrationType: "nature",
      durationMinutes: 3,
      physicalAction:
        "Stand tall with feet shoulder-width apart, shoulders back, and hands resting relaxed at your side. Inhale deeply for 4 seconds, hold for 4 seconds, exhale for 6 seconds. Feel your heart rate normalize.",
      cognitiveConnection:
        "Upright expansive posture combined with extended exhalations reduces salivary cortisol and activates executive prefrontal authority.",
      xpReward: 50,
      coinReward: 20,
    },
    journalPrompts: [
      "Have you ever experienced credit theft or uncredited effort at work?",
      "How does calm mastery outshine emotional defensiveness?",
      "What is one strategic project you will document with clear attribution this week?",
    ],
    suggestedReflectionTemplate:
      "Today I learned that true authority does not need to shout. When I lead with data, depth, and composure, ownership becomes undeniable.",
  },
];

/**
 * Get the best tailored scenario for a user given their role and progressive day index.
 * Deterministically rotates based on DayOfYear + dayOffset so every single day brings a fresh,
 * exciting dilemma and topic to train on!
 */
export function getTodaysPersonalizedScenario(
  role?: UserRoleCategory | null,
  dayOffset = 0
): RealLifeScenario {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  ) + dayOffset;

  // 1. Filter scenarios tailored to user's role if provided
  const roleScenarios = role
    ? REAL_LIFE_SCENARIOS.filter((s) => s.roleCategory === role)
    : REAL_LIFE_SCENARIOS;

  // 2. Rotate through matching scenarios
  if (roleScenarios.length > 0) {
    const idx = Math.abs(dayOfYear) % roleScenarios.length;
    return roleScenarios[idx];
  }

  // 3. Fallback: rotate through the entire library
  return REAL_LIFE_SCENARIOS[Math.abs(dayOfYear) % REAL_LIFE_SCENARIOS.length];
}

export function getAllScenarios(): RealLifeScenario[] {
  return REAL_LIFE_SCENARIOS;
}

export function getScenarioById(id: string): RealLifeScenario | undefined {
  return REAL_LIFE_SCENARIOS.find((s) => s.id === id);
}
