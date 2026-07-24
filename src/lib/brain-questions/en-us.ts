import type { BrainQuestion } from "./types";

export const BRAIN_QUESTIONS_EN_US: BrainQuestion[] = [
  // ═══════════════════════════════════════════════════════════════
  // MEMORY — mem-1 through mem-10
  // ═══════════════════════════════════════════════════════════════

  // --- Beginner (mem-1 to mem-4) ---

  {
    id: "mem-1",
    category: "memory",
    difficulty: "beginner",
    question:
      'The Super Bowl is an annual championship game of the NFL. In which month does the Super Bowl typically take place?',
    type: "multiple-choice",
    options: ["January", "February", "March", "December"],
    correctAnswer: "February",
    explanation:
      "The Super Bowl is almost always played in early February, making it one of the most-watched televised events in the United States every year.",
    hint: "It falls right after the new year begins.",
    xp: 10,
    coins: 3,
  },
  {
    id: "mem-2",
    category: "memory",
    difficulty: "beginner",
    question:
      "The American holiday Thanksgiving is celebrated on the fourth Thursday of which month?",
    type: "multiple-choice",
    options: ["November", "October", "December", "September"],
    correctAnswer: "November",
    explanation:
      "Thanksgiving falls on the fourth Thursday of November. It is a federal holiday rooted in the 1621 harvest feast shared by the Pilgrims and the Wampanoag people.",
    hint: "Fall leaves and turkey dinners come to mind.",
    xp: 10,
    coins: 3,
  },
  {
    id: "mem-3",
    category: "memory",
    difficulty: "beginner",
    question:
      "What is the name of the most famous street in Hollywood, Los Angeles, where celebrities have their names embedded in the sidewalk?",
    type: "text-input",
    correctAnswer: "Hollywood Walk of Fame",
    explanation:
      "The Hollywood Walk of Fame stretches 1.3 miles along Hollywood Boulevard and Vine Street, featuring over 2,700 brass stars honoring entertainment icons.",
    xp: 10,
    coins: 3,
  },
  {
    id: "mem-4",
    category: "memory",
    difficulty: "beginner",
    question:
      'Nigerian musician Burna Boy won a Grammy Award in 2021. What was the name of the album that won?',
    type: "multiple-choice",
    options: [
      "Twice as Tall",
      "African Giant",
      "Outside",
      "Love, Damini",
    ],
    correctAnswer: "Twice as Tall",
    explanation:
      "Burna Boy's album 'Twice as Tall' won the Grammy for Best Global Music Album in 2021, making him a global Afrobeats superstar.",
    hint: "The title suggests a concept of doubling height or ambition.",
    xp: 10,
    coins: 3,
  },

  // --- Intermediate (mem-5 to mem-7) ---

  {
    id: "mem-5",
    category: "memory",
    difficulty: "intermediate",
    question:
      "In the game of baseball, how many innings are played in a standard Major League Baseball (MLB) game?",
    type: "multiple-choice",
    options: ["9 innings", "7 innings", "10 innings", "6 innings"],
    correctAnswer: "9 innings",
    explanation:
      "A standard MLB game consists of 9 innings. If the score is tied after 9, extra innings are played until a winner is determined.",
    hint: "Each team gets a turn to bat and field in each inning.",
    xp: 15,
    coins: 5,
  },
  {
    id: "mem-6",
    category: "memory",
    difficulty: "intermediate",
    question:
      "What is the name of the largest tech company headquartered in Silicon Valley, known for its search engine and the Android operating system?",
    type: "multiple-choice",
    options: ["Google", "Apple", "Microsoft", "Meta"],
    correctAnswer: "Google",
    explanation:
      "Google, founded in 1998 by Larry Page and Sergey Brin, is headquartered in Mountain View, California, in the heart of Silicon Valley. It also owns Android, YouTube, and numerous other platforms.",
    hint: "Its name comes from 'googol,' the number 10 raised to the power of 100.",
    xp: 15,
    coins: 5,
  },
  {
    id: "mem-7",
    category: "memory",
    difficulty: "intermediate",
    question:
      "The Nigerian film industry, known as Nollywood, is the second-largest film industry in the world by number of films produced annually. Which country's film industry is the largest?",
    type: "multiple-choice",
    options: ["India (Bollywood)", "United States (Hollywood)", "China", "Nigeria"],
    correctAnswer: "India (Bollywood)",
    explanation:
      "India's film industry produces the most films per year, followed by Nigeria's Nollywood and then Hollywood. Bollywood alone releases over 1,500 films annually.",
    hint: "Think of a country with a massive population and a vibrant film culture.",
    xp: 15,
    coins: 5,
  },

  // --- Advanced (mem-8 to mem-10) ---

  {
    id: "mem-8",
    category: "memory",
    difficulty: "advanced",
    question:
      "The method of loci, also known as the 'memory palace' technique, dates back to ancient Greece. Which Greek poet is traditionally credited with inventing it?",
    type: "multiple-choice",
    options: ["Simonides of Ceos", "Homer", "Virgil", "Sappho"],
    correctAnswer: "Simonides of Ceos",
    explanation:
      "Simonides of Ceos, a Greek lyric poet from the 6th century BCE, is credited with creating the method of loci after he recalled the exact seating positions of guests at a banquet that had collapsed.",
    hint: "This poet survived a tragic building collapse and used spatial memory to identify the dead.",
    xp: 20,
    coins: 8,
  },
  {
    id: "mem-9",
    category: "memory",
    difficulty: "advanced",
    question:
      "The Ebbinghaus forgetting curve demonstrates that memory retention drops sharply after learning. Approximately what percentage of new information is lost within the first hour without reinforcement?",
    type: "multiple-choice",
    options: [
      "About 50–60%",
      "About 10–20%",
      "About 80–90%",
      "About 30–40%",
    ],
    correctAnswer: "About 50–60%",
    explanation:
      "Hermann Ebbinghaus's research showed that roughly 50–60% of newly learned information is forgotten within an hour, underscoring the critical importance of spaced repetition.",
    hint: "It's more than a quarter but less than three-quarters.",
    xp: 20,
    coins: 8,
  },
  {
    id: "mem-10",
    category: "memory",
    difficulty: "advanced",
    question:
      "What cognitive bias describes the tendency to remember information that confirms one's pre-existing beliefs while forgetting contradictory information?",
    type: "text-input",
    correctAnswer: "Confirmation bias",
    explanation:
      "Confirmation bias is a well-documented cognitive bias in which people favor information that supports their existing beliefs. It affects memory, decision-making, and even how we interpret news and social media.",
    xp: 20,
    coins: 8,
  },

  // ═══════════════════════════════════════════════════════════════
  // FOCUS — foc-1 through foc-10
  // ═══════════════════════════════════════════════════════════════

  // --- Beginner (foc-1 to foc-4) ---

  {
    id: "foc-1",
    category: "focus",
    difficulty: "beginner",
    question:
      "What common household item, often placed on a desk, is a popular tool for reducing stress and improving focus through repetitive motion?",
    type: "multiple-choice",
    options: ["Fidget spinner", "Lava lamp", "Desk fan", "Paperweight"],
    correctAnswer: "Fidget spinner",
    explanation:
      "Fidget spinners became a massive trend in 2017. Research suggests that small, repetitive movements can help some people channel nervous energy and maintain focus during tasks.",
    hint: "It spins between your fingers.",
    xp: 10,
    coins: 3,
  },
  {
    id: "foc-2",
    category: "focus",
    difficulty: "beginner",
    question:
      "The Pomodoro Technique is a popular time-management method. How many minutes of focused work does one Pomodoro session typically involve?",
    type: "multiple-choice",
    options: ["25 minutes", "15 minutes", "45 minutes", "60 minutes"],
    correctAnswer: "25 minutes",
    explanation:
      "The Pomodoro Technique, developed by Francesco Cirillo in the late 1980s, uses 25-minute work intervals followed by 5-minute breaks. The name comes from the tomato-shaped kitchen timer Cirillo used.",
    hint: "Named after a kitchen timer shaped like a red fruit.",
    xp: 10,
    coins: 3,
  },
  {
    id: "foc-3",
    category: "focus",
    difficulty: "beginner",
    question:
      "What popular Afrobeat artist from Nigeria is known for the hit song 'Ye' and has become a global icon for Afrobeats music?",
    type: "multiple-choice",
    options: ["Burna Boy", "Wizkid", "Davido", "Fireboy DML"],
    correctAnswer: "Burna Boy",
    explanation:
      "Burna Boy's 'Ye' became one of the most-streamed Afrobeats songs globally. His ability to blend Afrobeat, dancehall, and pop has made him a defining voice of modern African music.",
    hint: "This artist's name references a legendary Beatles member.",
    xp: 10,
    coins: 3,
  },
  {
    id: "foc-4",
    category: "focus",
    difficulty: "beginner",
    question:
      "Which part of the brain is primarily responsible for sustained attention and concentration?",
    type: "text-input",
    correctAnswer: "Prefrontal cortex",
    explanation:
      "The prefrontal cortex, located at the front of the brain, is the command center for executive functions including sustained attention, planning, and impulse control.",
    xp: 10,
    coins: 3,
  },

  // --- Intermediate (foc-5 to foc-7) ---

  {
    id: "foc-5",
    category: "focus",
    difficulty: "intermediate",
    question:
      "In cognitive psychology, what term describes the inability to notice a stimulus that is in plain sight because attention is focused elsewhere?",
    type: "multiple-choice",
    options: [
      "Inattentional blindness",
      "Change blindness",
      "Selective attention",
      "Tunnel vision",
    ],
    correctAnswer: "Inattentional blindness",
    explanation:
      "Inattentional blindness occurs when we fail to notice an unexpected stimulus because our attention is directed elsewhere. The famous 'invisible gorilla' experiment by Simons and Chabris demonstrated this phenomenon brilliantly.",
    hint: "You're blind to something not because it's hidden, but because you're not paying attention to it.",
    xp: 15,
    coins: 5,
  },
  {
    id: "foc-6",
    category: "focus",
    difficulty: "intermediate",
    question:
      "What does the term 'deep work' refer to, as popularized by author Cal Newport?",
    type: "multiple-choice",
    options: [
      "Concentrated, distraction-free work on cognitively demanding tasks",
      "Working late into the night to meet deadlines",
      "Working on multiple tasks simultaneously",
      "Working from a remote location",
    ],
    correctAnswer: "Concentrated, distraction-free work on cognitively demanding tasks",
    explanation:
      "Cal Newport's 'Deep Work' (2016) argues that the ability to focus without distraction on cognitively demanding tasks is becoming increasingly rare and increasingly valuable in our economy.",
    hint: "It's the opposite of shallow, scattered multitasking.",
    xp: 15,
    coins: 5,
  },
  {
    id: "foc-7",
    category: "focus",
    difficulty: "intermediate",
    question:
      "What is the name of the annual Silicon Valley conference where tech leaders, entrepreneurs, and innovators gather to discuss the future of technology?",
    type: "multiple-choice",
    options: [
      "TED Conference",
      "TechCrunch Disrupt",
      "Burning Man",
      "CES (Consumer Electronics Show)",
    ],
    correctAnswer: "TED Conference",
    explanation:
      "While several tech conferences exist, TED (Technology, Entertainment, Design) is perhaps the most iconic, originating in 1984 and now known worldwide for its 'TED Talks' that cover a vast range of ideas worth spreading.",
    hint: "The talks are famously limited to 18 minutes.",
    xp: 15,
    coins: 5,
  },

  // --- Advanced (foc-8 to foc-10) ---

  {
    id: "foc-8",
    category: "focus",
    difficulty: "advanced",
    question:
      "What is the name of the neuroscience concept describing the brain's 'default mode network' that activates when the mind is at rest and not focused on external tasks?",
    type: "multiple-choice",
    options: [
      "Default Mode Network (DMN)",
      "Central Executive Network",
      "Salience Network",
      "Reticular Activating System",
    ],
    correctAnswer: "Default Mode Network (DMN)",
    explanation:
      "The Default Mode Network is a brain network active during wakeful rest, mind-wandering, and self-referential thought. It was discovered by Marcus Raichle and his team in 2001 and has revolutionized our understanding of brain function.",
    hint: "This network activates when you're daydreaming or lost in thought.",
    xp: 20,
    coins: 8,
  },
  {
    id: "foc-9",
    category: "focus",
    difficulty: "advanced",
    question:
      "Research on 'attentional blink' shows that after detecting one target in a rapid stream of stimuli, there is a brief period where a second target is missed. Approximately how long does this attentional blink last?",
    type: "multiple-choice",
    options: [
      "200–500 milliseconds",
      "50–100 milliseconds",
      "1–2 seconds",
      "500–1000 milliseconds",
    ],
    correctAnswer: "200–500 milliseconds",
    explanation:
      "The attentional blink typically lasts 200–500 milliseconds and reveals a fundamental limitation in how our brains allocate attention over time. It suggests that processing one important stimulus temporarily consumes attentional resources.",
    hint: "It's less than a second but much longer than a single eye blink.",
    xp: 20,
    coins: 8,
  },
  {
    id: "foc-10",
    category: "focus",
    difficulty: "advanced",
    question:
      "The Stroop effect demonstrates interference in reaction time. In the classic version of this test, participants are asked to name the ink color of a word. What makes this task difficult when the word is a color name that doesn't match the ink?",
    type: "text-input",
    correctAnswer: "Automatic word reading interferes with color naming",
    explanation:
      "The Stroop effect shows that reading is an automatic process that is hard to suppress. When the word 'RED' is printed in blue ink, the automatic reading of 'RED' conflicts with the task of naming the blue color, slowing response time.",
    xp: 20,
    coins: 8,
  },

  // ═══════════════════════════════════════════════════════════════
  // THINKING — thk-1 through thk-10
  // ═══════════════════════════════════════════════════════════════

  // --- Beginner (thk-1 to thk-4) ---

  {
    id: "thk-1",
    category: "thinking",
    difficulty: "beginner",
    question:
      "If you have a basket with 3 apples and you take away 2, how many apples do you personally have?",
    type: "multiple-choice",
    options: ["2 apples", "1 apple", "3 apples", "5 apples"],
    correctAnswer: "2 apples",
    explanation:
      "This is a classic trick question! The key word is 'you take away.' If you took 2 apples, then you personally have 2 apples. The question is about what you have, not what's left in the basket.",
    hint: "Read the question carefully — it asks about what YOU have.",
    xp: 10,
    coins: 3,
  },
  {
    id: "thk-2",
    category: "thinking",
    difficulty: "beginner",
    question:
      "What common logical fallacy is committed when someone argues that a claim must be false because many people don't believe it?",
    type: "multiple-choice",
    options: [
      "Argumentum ad populum (appeal to popularity)",
      "Straw man",
      "Ad hominem",
      "Slippery slope",
    ],
    correctAnswer: "Argumentum ad populum (appeal to popularity)",
    explanation:
      "The appeal to popularity fallacy assumes that because many people believe something, it must be true. But truth isn't determined by majority opinion — the Earth was round long before most people believed it.",
    hint: "The Latin name translates to 'argument to the people.'",
    xp: 10,
    coins: 3,
  },
  {
    id: "thk-3",
    category: "thinking",
    difficulty: "beginner",
    question:
      "A traditional Jollof rice cook-off is a beloved rivalry between Nigeria and which other West African country?",
    type: "multiple-choice",
    options: ["Ghana", "Senegal", "Cameroon", "Ivory Coast"],
    correctAnswer: "Ghana",
    explanation:
      "The 'Jollof Wars' between Nigeria and Ghana is a friendly but passionate rivalry where each country claims to make the best Jollof rice. It's one of West Africa's most entertaining cultural debates!",
    hint: "This country is known for its highlife music and cocoa production.",
    xp: 10,
    coins: 3,
  },
  {
    id: "thk-4",
    category: "thinking",
    difficulty: "beginner",
    question:
      "What is the term for a question that has only two possible answers, such as 'yes' or 'no'?",
    type: "text-input",
    correctAnswer: "Binary question",
    explanation:
      "A binary question is one that can only be answered with one of two options. The term comes from 'binary,' meaning composed of two parts. In computing, binary refers to the 0 and 1 system.",
    hint: "It's named after a system of two values, like on/off or true/false.",
    xp: 10,
    coins: 3,
  },

  // --- Intermediate (thk-5 to thk-7) ---

  {
    id: "thk-5",
    category: "thinking",
    difficulty: "intermediate",
    question:
      "In critical thinking, what is the name of the error where someone draws a broad conclusion from a single example or a small sample size?",
    type: "multiple-choice",
    options: [
      "Hasty generalization",
      "False cause",
      "Red herring",
      "Begging the question",
    ],
    correctAnswer: "Hasty generalization",
    explanation:
      "A hasty generalization occurs when you draw a sweeping conclusion from insufficient evidence. For example, meeting one rude person from a city and concluding everyone there is rude is a classic hasty generalization.",
    hint: "It happens when you rush to a conclusion without enough data.",
    xp: 15,
    coins: 5,
  },
  {
    id: "thk-6",
    category: "thinking",
    difficulty: "intermediate",
    question:
      "What is 'First Principles Thinking,' a problem-solving approach famously championed by Elon Musk, which involves breaking down complex problems into their most basic, fundamental truths?",
    type: "multiple-choice",
    options: [
      "Reasoning from the most basic, undeniably true facts rather than reasoning by analogy",
      "Following the first rule in a set of guidelines",
      "Copying successful strategies from competitors",
      "Relying on intuition and gut feelings",
    ],
    correctAnswer:
      "Reasoning from the most basic, undeniably true facts rather than reasoning by analogy",
    explanation:
      "First principles thinking, originally from Aristotle, involves boiling things down to their fundamental truths and building up from there. Musk used this approach to rethink rocket costs by questioning every assumption about how rockets are traditionally built.",
    hint: "This approach was described by Aristotle and popularized in tech by a Tesla CEO.",
    xp: 15,
    coins: 5,
  },
  {
    id: "thk-7",
    category: "thinking",
    difficulty: "intermediate",
    question:
      "The 'Socratic method' is a form of cooperative argumentative dialogue. What was Socrates' nationality?",
    type: "multiple-choice",
    options: ["Greek", "Roman", "Egyptian", "Persian"],
    correctAnswer: "Greek",
    explanation:
      "Socrates (470–399 BCE) was an Athenian philosopher who pioneered a method of questioning to stimulate critical thinking and illuminate ideas. He left no writings — we know of him through his students, especially Plato.",
    hint: "He lived in Athens and was tried and executed there in 399 BCE.",
    xp: 15,
    coins: 5,
  },

  // --- Advanced (thk-8 to thk-10) ---

  {
    id: "thk-8",
    category: "thinking",
    difficulty: "advanced",
    question:
      "What is the 'Dunning-Kruger effect,' a cognitive bias identified by psychologists David Dunning and Justin Kruger in 1999?",
    type: "multiple-choice",
    options: [
      "People with low ability at a task tend to overestimate their competence",
      "People with high ability tend to underestimate their competence",
      "People tend to remember their successes more than their failures",
      "People tend to follow the opinions of authority figures",
    ],
    correctAnswer:
      "People with low ability at a task tend to overestimate their competence",
    explanation:
      "The Dunning-Kruger effect shows that people who are unskilled at a task often have an inflated view of their own ability, while true experts tend to underestimate themselves. It's a humbling reminder that confidence and competence are not the same thing.",
    hint: "It's named after two psychologists who studied the gap between confidence and skill.",
    xp: 20,
    coins: 8,
  },
  {
    id: "thk-9",
    category: "thinking",
    difficulty: "advanced",
    question:
      "In formal logic, what is the name of the paradox that states: 'This statement is false' — which creates a logical contradiction because if it's true, then it must be false, and vice versa?",
    type: "multiple-choice",
    options: [
      "The Liar Paradox",
      "Zeno's Paradox",
      "The Ship of Theseus",
      "The Trolley Problem",
    ],
    correctAnswer: "The Liar Paradox",
    explanation:
      "The Liar Paradox, attributed to Epimenides of Crete (6th century BCE), has fascinated logicians for millennia. It reveals fundamental limitations in self-referential statements and has influenced modern logic, mathematics, and computer science (including Gödel's incompleteness theorems).",
    hint: "The statement talks about its own truthfulness, creating an impossible loop.",
    xp: 20,
    coins: 8,
  },
  {
    id: "thk-10",
    category: "thinking",
    difficulty: "advanced",
    question:
      "What is 'Pascal's Wager,' an argument proposed by the 17th-century French philosopher Blaise Pascal regarding the existence of God?",
    type: "text-input",
    correctAnswer: "A wager arguing it is rational to believe in God because the potential infinite reward outweighs finite risk",
    explanation:
      "Pascal's Wager argues that even without proof of God's existence, it is rational to live as if God exists because the potential payoff (eternal happiness) is infinitely greater than the cost (some earthly sacrifices), making belief the pragmatically optimal choice.",
    xp: 20,
    coins: 8,
  },

  // ═══════════════════════════════════════════════════════════════
  // LEARNING — lrn-1 through lrn-10
  // ═══════════════════════════════════════════════════════════════

  // --- Beginner (lrn-1 to lrn-4) ---

  {
    id: "lrn-1",
    category: "learning",
    difficulty: "beginner",
    question:
      "What is the name of the cognitive psychology term that refers to the process of converting short-term memories into long-term memories?",
    type: "multiple-choice",
    options: ["Consolidation", "Encoding", "Retrieval", "Decay"],
    correctAnswer: "Consolidation",
    explanation:
      "Memory consolidation is the process by which temporary, unstable memory traces are transformed into stable, long-term memories. This process primarily occurs during sleep, which is why sleep is crucial for learning.",
    hint: "This process makes memories more permanent, like concrete setting.",
    xp: 10,
    coins: 3,
  },
  {
    id: "lrn-2",
    category: "learning",
    difficulty: "beginner",
    question:
      "Which of these is NOT one of the traditional five senses that humans use to learn about the world?",
    type: "multiple-choice",
    options: ["Taste", "Balance", "Sight", "Touch"],
    correctAnswer: "Balance",
    explanation:
      "The traditional five senses are sight, hearing, taste, smell, and touch. Balance (vestibular sense) is actually a sixth sense, though it's often grouped separately from the classic five identified by Aristotle.",
    hint: "The traditional five were described by Aristotle over 2,000 years ago.",
    xp: 10,
    coins: 3,
  },
  {
    id: "lrn-3",
    category: "learning",
    difficulty: "beginner",
    question:
      "What popular learning technique involves looking away from your notes and trying to recall the information from memory, rather than simply re-reading it?",
    type: "multiple-choice",
    options: [
      "Active recall",
      "Speed reading",
      "Highlighting",
      "Summarizing",
    ],
    correctAnswer: "Active recall",
    explanation:
      "Active recall is one of the most effective study techniques. Instead of passively re-reading, you actively test yourself on the material, which strengthens neural pathways and dramatically improves long-term retention.",
    hint: "It's the opposite of passive review — you're pulling information from your brain.",
    xp: 10,
    coins: 3,
  },
  {
    id: "lrn-4",
    category: "learning",
    difficulty: "beginner",
    question:
      "What is the name of the popular language-learning app that uses gamification, streaks, and has a famous green owl mascot named Duo?",
    type: "text-input",
    correctAnswer: "Duolingo",
    explanation:
      "Duolingo, founded in 2011 by Luis von Ahn and Severin Hacker, has become the world's most popular language-learning platform with over 500 million users. Its gamified approach makes learning feel like a game rather than a chore.",
    xp: 10,
    coins: 3,
  },

  // --- Intermediate (lrn-5 to lrn-7) ---

  {
    id: "lrn-5",
    category: "learning",
    difficulty: "intermediate",
    question:
      "What learning method, developed by German psychologist Hermann Ebbinghaus, involves reviewing material at gradually increasing intervals to improve long-term retention?",
    type: "multiple-choice",
    options: [
      "Spaced repetition",
      "Massed practice",
      "Interleaving",
      "Rote memorization",
    ],
    correctAnswer: "Spaced repetition",
    explanation:
      "Spaced repetition leverages the spacing effect: reviewing material at expanding intervals (1 day, 3 days, 7 days, 14 days, etc.) leads to far better retention than cramming. Tools like Anki use algorithms based on this principle.",
    hint: "The key is spreading out your study sessions over time, not cramming.",
    xp: 15,
    coins: 5,
  },
  {
    id: "lrn-6",
    category: "learning",
    difficulty: "intermediate",
    question:
      "In the context of learning, what does the term 'metacognition' refer to?",
    type: "multiple-choice",
    options: [
      "Thinking about your own thinking and learning processes",
      "Learning through technology and digital tools",
      "Memorizing information through repetition",
      "Learning by observing others",
    ],
    correctAnswer: "Thinking about your own thinking and learning processes",
    explanation:
      "Metacognition, meaning 'thinking about thinking,' is the awareness and understanding of one's own thought processes. Strong metacognitive skills allow you to plan, monitor, and evaluate your learning strategies for maximum effectiveness.",
    hint: "The prefix 'meta-' means 'about' — it's about cognition itself.",
    xp: 15,
    coins: 5,
  },
  {
    id: "lrn-7",
    category: "learning",
    difficulty: "intermediate",
    question:
      "The 'Feynman Technique' for learning involves four steps. What is the first and most crucial step?",
    type: "multiple-choice",
    options: [
      "Choose a concept and write it out as if teaching it to a child",
      "Read extensively about the topic",
      "Create flashcards for key terms",
      "Test yourself on the material",
    ],
    correctAnswer:
      "Choose a concept and write it out as if teaching it to a child",
    explanation:
      "The Feynman Technique, named after Nobel Prize-winning physicist Richard Feynman, starts with choosing a concept and explaining it in simple language. If you can't explain it simply, you don't understand it well enough — this reveals gaps in your knowledge.",
    hint: "This technique is named after a physicist known as 'The Great Explainer.'",
    xp: 15,
    coins: 5,
  },

  // --- Advanced (lrn-8 to lrn-10) ---

  {
    id: "lrn-8",
    category: "learning",
    difficulty: "advanced",
    question:
      "What is the 'testing effect' in cognitive psychology, and how does it relate to learning?",
    type: "multiple-choice",
    options: [
      "Taking tests enhances long-term retention more than additional study sessions",
      "Tests are the only reliable way to measure intelligence",
      "Students perform better on tests when they know the format in advance",
      "Testing is only effective for factual recall, not conceptual understanding",
    ],
    correctAnswer:
      "Taking tests enhances long-term retention more than additional study sessions",
    explanation:
      "The testing effect, robustly supported by decades of research, shows that the act of retrieving information from memory (testing) strengthens that memory more than simply re-studying the same material. This is why practice tests are one of the most powerful learning tools available.",
    hint: "Testing isn't just assessment — it's actually a learning tool itself.",
    xp: 20,
    coins: 8,
  },
  {
    id: "lrn-9",
    category: "learning",
    difficulty: "advanced",
    question:
      "What neuroscience concept explains why learning a new skill physically changes the structure of the brain through the formation of new neural connections?",
    type: "multiple-choice",
    options: [
      "Neuroplasticity",
      "Neurogenesis",
      "Myelination",
      "Synaptic pruning",
    ],
    correctAnswer: "Neuroplasticity",
    explanation:
      "Neuroplasticity is the brain's remarkable ability to reorganize itself by forming new neural connections throughout life. When you learn a new skill, your brain physically changes — neurons form new pathways and strengthen existing ones, making the brain literally bigger and more connected.",
    hint: "This term combines 'neuron' with 'plastic,' suggesting the brain is moldable.",
    xp: 20,
    coins: 8,
  },
  {
    id: "lrn-10",
    category: "learning",
    difficulty: "advanced",
    question:
      "What is the name of the cognitive phenomenon where struggling with difficult material (desirable difficulty) actually leads to better long-term learning than encountering the material easily?",
    type: "text-input",
    correctAnswer: "Desirable difficulty",
    explanation:
      "Desirable difficulties, a concept introduced by Robert Bjork, are learning conditions that introduce challenges that slow short-term learning but enhance long-term retention and transfer. Examples include spacing, interleaving, and testing — things that feel harder but produce deeper learning.",
    xp: 20,
    coins: 8,
  },

  // ═══════════════════════════════════════════════════════════════
  // CREATIVITY — crv-1 through crv-10
  // ═══════════════════════════════════════════════════════════════

  // --- Beginner (crv-1 to crv-4) ---

  {
    id: "crv-1",
    category: "creativity",
    difficulty: "beginner",
    question:
      "Which famous American artist is known for his 'drip painting' technique, particularly the masterpiece 'No. 5, 1950' which sold for $140 million?",
    type: "multiple-choice",
    options: [
      "Jackson Pollock",
      "Andy Warhol",
      "Jean-Michel Basquiat",
      "Mark Rothko",
    ],
    correctAnswer: "Jackson Pollock",
    explanation:
      "Jackson Pollock revolutionized abstract art with his 'drip technique,' pouring and splattering paint onto canvases laid on the floor. His work 'No. 5, 1950' became one of the most expensive paintings ever sold.",
    hint: "He was part of the Abstract Expressionist movement in New York.",
    xp: 10,
    coins: 3,
  },
  {
    id: "crv-2",
    category: "creativity",
    difficulty: "beginner",
    question:
      "What is the name of the technique where you write down every idea that comes to mind without judging or filtering them, often used as a brainstorming tool?",
    type: "multiple-choice",
    options: [
      "Brainstorming / Free writing",
      "Mind mapping",
      "SWOT analysis",
      "Six Thinking Hats",
    ],
    correctAnswer: "Brainstorming / Free writing",
    explanation:
      "Brainstorming, developed by Alex Osborn in 1948, encourages the free flow of ideas without criticism. The key principle is to generate as many ideas as possible, deferring judgment to later — quantity leads to quality.",
    hint: "It's the idea of letting your thoughts flow freely like a storm.",
    xp: 10,
    coins: 3,
  },
  {
    id: "crv-3",
    category: "creativity",
    difficulty: "beginner",
    question:
      "What is the name of the Nigerian art form where artists create intricate sculptures and carvings from discarded materials, turning trash into treasure?",
    type: "multiple-choice",
    options: [
      "Recycled art / Upcycling",
      "Batik art",
      "Adire textile art",
      "Bronze casting",
    ],
    correctAnswer: "Recycled art / Upcycling",
    explanation:
      "Upcycling and recycled art have become significant movements in Nigeria and across Africa, where artists transform discarded materials into beautiful sculptures and functional art. This practice combines creativity with environmental consciousness.",
    hint: "The prefix 'up' suggests making something better from what was thrown away.",
    xp: 10,
    coins: 3,
  },
  {
    id: "crv-4",
    category: "creativity",
    difficulty: "beginner",
    question:
      "What cognitive process involves connecting two unrelated ideas to create something new, and is often described as the foundation of creative thinking?",
    type: "text-input",
    correctAnswer: "Associative thinking",
    explanation:
      "Associative thinking is the ability to connect seemingly unrelated concepts to generate novel ideas. Steve Jobs famously called creativity 'just connecting things' — the magic lies in seeing relationships where others don't.",
    xp: 10,
    coins: 3,
  },

  // --- Intermediate (crv-5 to crv-7) ---

  {
    id: "crv-5",
    category: "creativity",
    difficulty: "intermediate",
    question:
      "What is the term for the creative phenomenon where an unexpected insight or solution suddenly appears after a period of incubation?",
    type: "multiple-choice",
    options: [
      "Eureka moment / Aha moment",
      "Creative block",
      "Analysis paralysis",
      "Convergent thinking",
    ],
    correctAnswer: "Eureka moment / Aha moment",
    explanation:
      "The 'Eureka moment' (from the Greek 'I have found it!') describes the sudden breakthrough in creative problem-solving that often occurs when you're relaxed or doing something else. Archimedes reportedly experienced this in his bath!",
    hint: "Archimedes supposedly shouted this word when he discovered how to measure the volume of irregular objects.",
    xp: 15,
    coins: 5,
  },
  {
    id: "crv-6",
    category: "creativity",
    difficulty: "intermediate",
    question:
      "What is the 'incubation effect' in creativity research?",
    type: "multiple-choice",
    options: [
      "Setting aside a problem and returning to it later often leads to better solutions",
      "Creative ideas need to be nurtured like eggs in an incubator",
      "Teams produce more creative work than individuals",
      "Creativity peaks during early morning hours",
    ],
    correctAnswer:
      "Setting aside a problem and returning to it later often leads to better solutions",
    explanation:
      "The incubation effect shows that stepping away from a problem allows your unconscious mind to continue working on it. Studies show that people who take breaks during creative tasks often come up with more original solutions than those who power through.",
    hint: "It's like letting your mind 'sleep on it' — but it works even when you're awake.",
    xp: 15,
    coins: 5,
  },
  {
    id: "crv-7",
    category: "creativity",
    difficulty: "intermediate",
    question:
      "What is the name of the creative brainstorming technique where participants build on each other's ideas, with the rule 'Yes, and...' instead of 'No, but...'?",
    type: "multiple-choice",
    options: [
      "Improvisational theater (Improv)",
      "Design thinking",
      "TRIZ method",
      "Lateral thinking",
    ],
    correctAnswer: "Improvisational theater (Improv)",
    explanation:
      "Improv theater's 'Yes, and...' rule is one of the most powerful creative tools in existence. Instead of shutting down ideas, you accept them ('Yes') and add to them ('and...'), creating a collaborative flow of expanding possibilities.",
    hint: "This technique comes from comedy theater where performers create scenes spontaneously.",
    xp: 15,
    coins: 5,
  },

  // --- Advanced (crv-8 to crv-10) ---

  {
    id: "crv-8",
    category: "creativity",
    difficulty: "advanced",
    question:
      "What is the 'incubation period' in the creative process, as described in Graham Wallas's four-stage model of creativity (1926)?",
    type: "multiple-choice",
    options: [
      "The second stage, between preparation and illumination, where the unconscious mind works on the problem",
      "The final stage where the creative idea is evaluated",
      "The initial stage of gathering information and research",
      "The stage where the idea is developed and refined",
    ],
    correctAnswer:
      "The second stage, between preparation and illumination, where the unconscious mind works on the problem",
    explanation:
      "Graham Wallas proposed four stages: Preparation, Incubation, Illumination, and Verification. During incubation, you step away from conscious effort, allowing your unconscious mind to make connections that your focused mind couldn't see.",
    hint: "Wallas described this stage in his 1926 book 'The Art of Thought.'",
    xp: 20,
    coins: 8,
  },
  {
    id: "crv-9",
    category: "creativity",
    difficulty: "advanced",
    question:
      "What psychological concept, proposed by Mihaly Csikszentmihalyi, describes the state of complete immersion in an activity where you lose track of time and self-consciousness?",
    type: "multiple-choice",
    options: [
      "Flow state",
      "Peak experience",
      "Self-actualization",
      "Cognitive load",
    ],
    correctAnswer: "Flow state",
    explanation:
      "Flow, described by Csikszentmihalyi in his 1990 book, is a state of optimal experience where challenge and skill are perfectly balanced. Athletes, artists, and musicians often describe entering flow during their best performances — it's where creativity and productivity peak.",
    hint: "This state occurs when challenge and skill are perfectly balanced.",
    xp: 20,
    coins: 8,
  },
  {
    id: "crv-10",
    category: "creativity",
    difficulty: "advanced",
    question:
      "What is the 'Torrance Tests of Creative Thinking' (TTCT), and what does it measure that standard IQ tests typically do not?",
    type: "text-input",
    correctAnswer:
      "A test measuring divergent thinking, originality, and creative potential rather than convergent thinking",
    explanation:
      "Developed by E. Paul Torranc in 1966, the TTCT measures divergent thinking — the ability to generate multiple unique solutions to open-ended problems. Unlike IQ tests that measure convergent thinking (one right answer), TTCT assesses originality, fluency, flexibility, and elaboration.",
    xp: 20,
    coins: 8,
  },

  // ═══════════════════════════════════════════════════════════════
  // HEALTH — hlth-1 through hlth-10
  // ═══════════════════════════════════════════════════════════════

  // --- Beginner (hlth-1 to hlth-4) ---

  {
    id: "hlth-1",
    category: "health",
    difficulty: "beginner",
    question:
      "How many hours of sleep per night are generally recommended for adults by the National Sleep Foundation?",
    type: "multiple-choice",
    options: ["7 to 9 hours", "5 to 6 hours", "10 to 12 hours", "4 to 5 hours"],
    correctAnswer: "7 to 9 hours",
    explanation:
      "The National Sleep Foundation recommends 7–9 hours of sleep for adults. Sleep is crucial for memory consolidation, immune function, emotional regulation, and physical recovery. Chronic sleep deprivation is linked to numerous health problems.",
    hint: "It's more than a workday but less than half a day.",
    xp: 10,
    coins: 3,
  },
  {
    id: "hlth-2",
    category: "health",
    difficulty: "beginner",
    question:
      "What is the recommended minimum number of minutes of moderate aerobic exercise per week for adults, according to the WHO?",
    type: "multiple-choice",
    options: [
      "150 minutes per week",
      "60 minutes per week",
      "300 minutes per week",
      "90 minutes per week",
    ],
    correctAnswer: "150 minutes per week",
    explanation:
      "The WHO recommends at least 150 minutes of moderate-intensity aerobic activity per week (about 30 minutes, 5 days a week). This can include brisk walking, cycling, or swimming — enough to raise your heart rate.",
    hint: "That's about half an hour a day, five days a week.",
    xp: 10,
    coins: 3,
  },
  {
    id: "hlth-3",
    category: "health",
    difficulty: "beginner",
    question:
      "Which vitamin, abundant in sunlight exposure, is essential for bone health and immune function?",
    type: "multiple-choice",
    options: ["Vitamin D", "Vitamin C", "Vitamin A", "Vitamin K"],
    correctAnswer: "Vitamin D",
    explanation:
      "Vitamin D, often called the 'sunshine vitamin,' is produced by the skin when exposed to sunlight. It's essential for calcium absorption, bone health, and immune function. Deficiency is common, especially in northern latitudes.",
    hint: "Your body produces this vitamin when your skin is exposed to the sun.",
    xp: 10,
    coins: 3,
  },
  {
    id: "hlth-4",
    category: "health",
    difficulty: "beginner",
    question:
      "What is the name of the process by which your body breaks down food into nutrients that can be absorbed and used for energy, growth, and repair?",
    type: "text-input",
    correctAnswer: "Digestion",
    explanation:
      "Digestion is the complex process of breaking down food into nutrients. It involves both mechanical processes (chewing, stomach contractions) and chemical processes (enzymes, stomach acid). The entire process can take 24–72 hours from mouth to elimination.",
    xp: 10,
    coins: 3,
  },

  // --- Intermediate (hlth-5 to hlth-7) ---

  {
    id: "hlth-5",
    category: "health",
    difficulty: "intermediate",
    question:
      "What is the 'gut-brain axis,' and why has it become a major focus of modern health research?",
    type: "multiple-choice",
    options: [
      "A bidirectional communication system between the gut and brain through neural, hormonal, and immune pathways",
      "The physical connection between the stomach and the brainstem",
      "A type of exercise that improves both mental and digestive health",
      "A diet plan designed to optimize brain function through gut health",
    ],
    correctAnswer:
      "A bidirectional communication system between the gut and brain through neural, hormonal, and immune pathways",
    explanation:
      "The gut-brain axis is a complex two-way communication network. Your gut contains over 100 million neurons (the 'second brain') and produces about 95% of your body's serotonin. This explains why stress affects digestion and why gut health impacts mood and cognition.",
    hint: "Your gut has more neurons than your spinal cord — it's like a second brain.",
    xp: 15,
    coins: 5,
  },
  {
    id: "hlth-6",
    category: "health",
    difficulty: "intermediate",
    question:
      "What is 'mindfulness meditation,' and what does research suggest about its effects on the brain?",
    type: "multiple-choice",
    options: [
      "A practice of focused awareness on the present moment that can physically increase gray matter in brain regions associated with attention and emotional regulation",
      "A religious practice that requires belief in a specific deity",
      "A form of hypnosis used by therapists",
      "A sleep technique for treating insomnia",
    ],
    correctAnswer:
      "A practice of focused awareness on the present moment that can physically increase gray matter in brain regions associated with attention and emotional regulation",
    explanation:
      "Mindfulness meditation involves paying attention to the present moment without judgment. Neuroscience research has shown it can physically change the brain — increasing gray matter density in the prefrontal cortex, hippocampus, and areas involved in emotional regulation.",
    hint: "Studies at Harvard have shown this practice can literally change your brain structure.",
    xp: 15,
    coins: 5,
  },
  {
    id: "hlth-7",
    category: "health",
    difficulty: "intermediate",
    question:
      "What is 'chronotype,' and how does it relate to your optimal schedule for productivity and sleep?",
    type: "multiple-choice",
    options: [
      "Your body's natural inclination toward sleep and alertness at certain times of day",
      "The type of chronograph watch best suited for athletes",
      "A dietary plan based on your blood type",
      "The amount of caffeine needed to stay awake",
    ],
    correctAnswer:
      "Your body's natural inclination toward sleep and alertness at certain times of day",
    explanation:
      "Chronotype refers to your body's natural circadian rhythm preference. 'Morning larks' peak early, 'night owls' peak late, and most people fall somewhere in between. Understanding your chronotype can help you schedule demanding tasks during your peak alertness windows.",
    hint: "Are you a morning person or a night owl? That's your chronotype.",
    xp: 15,
    coins: 5,
  },

  // --- Advanced (hlth-8 to hlth-10) ---

  {
    id: "hlth-8",
    category: "health",
    difficulty: "advanced",
    question:
      "What is 'telomere shortening,' and how does it relate to aging and chronic stress?",
    type: "multiple-choice",
    options: [
      "The progressive erosion of protective caps on chromosomes that accelerates with chronic stress, contributing to cellular aging",
      "The shrinking of brain cells due to lack of exercise",
      "The reduction of muscle mass during periods of inactivity",
      "The decrease in lung capacity as people age",
    ],
    correctAnswer:
      "The progressive erosion of protective caps on chromosomes that accelerates with chronic stress, contributing to cellular aging",
    explanation:
      "Telomeres are protective caps at the ends of chromosomes, like the plastic tips on shoelaces. They shorten with each cell division, and chronic stress accelerates this shortening. Nobel laureate Elizabeth Blackburn's research showed that meditation and healthy lifestyle choices can slow telomere shortening.",
    hint: "These structures are at the ends of chromosomes and are compared to shoelace tips.",
    xp: 20,
    coins: 8,
  },
  {
    id: "hlth-9",
    category: "health",
    difficulty: "advanced",
    question:
      "What is the 'placebo effect,' and why is it such a significant factor in medical research and clinical trials?",
    type: "multiple-choice",
    options: [
      "A phenomenon where patients experience real improvements from fake treatments due to their expectations and belief in the treatment",
      "A type of medication used as a control in drug trials",
      "A psychological condition where patients believe they are ill",
      "A method of training doctors to be more empathetic",
    ],
    correctAnswer:
      "A phenomenon where patients experience real improvements from fake treatments due to their expectations and belief in the treatment",
    explanation:
      "The placebo effect is remarkably powerful — patients given sugar pills often experience real physiological changes, including pain relief, improved mood, and even measurable changes in brain chemistry. This is why clinical trials must use double-blind methods to distinguish real treatment effects from placebo effects.",
    hint: "The word comes from the Latin for 'I shall please.'",
    xp: 20,
    coins: 8,
  },
  {
    id: "hlth-10",
    category: "health",
    difficulty: "advanced",
    question:
      "What is 'circadian rhythm disruption,' and what are its long-term health consequences according to modern research?",
    type: "text-input",
    correctAnswer:
      "Disruption of the body's internal 24-hour clock linked to increased risks of obesity, diabetes, cardiovascular disease, and cognitive decline",
    explanation:
      "Circadian rhythms are 24-hour cycles that regulate sleep, hormone release, and body temperature. Chronic disruption (from shift work, jet lag, or excessive screen time at night) has been linked to increased risks of obesity, diabetes, cardiovascular disease, depression, and even certain cancers.",
    xp: 20,
    coins: 8,
  },

  // ═══════════════════════════════════════════════════════════════
  // EMOTIONAL INTELLIGENCE — ei-1 through ei-10
  // ═══════════════════════════════════════════════════════════════

  // --- Beginner (ei-1 to ei-4) ---

  {
    id: "ei-1",
    category: "emotional-intelligence",
    difficulty: "beginner",
    question:
      "Who popularized the term 'emotional intelligence' (EQ) in his 1995 book, arguing that it is just as important as traditional intelligence (IQ)?",
    type: "multiple-choice",
    options: [
      "Daniel Goleman",
      "Howard Gardner",
      "Jean Piaget",
      "Abraham Maslow",
    ],
    correctAnswer: "Daniel Goleman",
    explanation:
      "Daniel Goleman's 1995 book 'Emotional Intelligence' brought the concept to mainstream awareness. He argued that EQ — the ability to recognize, understand, and manage our own emotions and those of others — may be even more important than IQ for success in life.",
    hint: "His book became a New York Times bestseller and changed how we think about intelligence.",
    xp: 10,
    coins: 3,
  },
  {
    id: "ei-2",
    category: "emotional-intelligence",
    difficulty: "beginner",
    question:
      "What is the term for the ability to recognize and understand your own emotions as they happen?",
    type: "multiple-choice",
    options: [
      "Self-awareness",
      "Self-regulation",
      "Empathy",
      "Social skills",
    ],
    correctAnswer: "Self-awareness",
    explanation:
      "Self-awareness is the foundation of emotional intelligence. It involves recognizing your emotions, strengths, weaknesses, values, and their impact on others. People with high self-awareness are honest with themselves and understand how their feelings affect them and their performance.",
    hint: "It's the first and most fundamental component of emotional intelligence.",
    xp: 10,
    coins: 3,
  },
  {
    id: "ei-3",
    category: "emotional-intelligence",
    difficulty: "beginner",
    question:
      "What is the name of the famous Nigerian author who wrote 'Half of a Yellow Sun' and 'Americanah,' and is known for exploring themes of identity, race, and love?",
    type: "multiple-choice",
    options: [
      "Chimamanda Ngozi Adichie",
      "Chinua Achebe",
      "Wole Soyinka",
      "Helon Habila",
    ],
    correctAnswer: "Chimamanda Ngozi Adichie",
    explanation:
      "Chimamanda Ngozi Adichie is one of Africa's most celebrated authors. Her TED talk 'The Danger of a Single Story' has been viewed over 30 million times and is a masterclass in empathy and understanding different perspectives — key components of emotional intelligence.",
    hint: "Her famous TED talk warns against reducing people to a single narrative.",
    xp: 10,
    coins: 3,
  },
  {
    id: "ei-4",
    category: "emotional-intelligence",
    difficulty: "beginner",
    question:
      "What is the term for the ability to put yourself in someone else's shoes and understand their feelings?",
    type: "text-input",
    correctAnswer: "Empathy",
    explanation:
      "Empathy is the ability to understand and share the feelings of another person. It's different from sympathy (feeling sorry for someone) — empathy means truly feeling what they feel. It's a cornerstone of emotional intelligence and healthy relationships.",
    xp: 10,
    coins: 3,
  },

  // --- Intermediate (ei-5 to ei-7) ---

  {
    id: "ei-5",
    category: "emotional-intelligence",
    difficulty: "intermediate",
    question:
      "What is the difference between 'cognitive empathy' and 'emotional empathy'?",
    type: "multiple-choice",
    options: [
      "Cognitive empathy is understanding someone's perspective; emotional empathy is actually feeling their emotions",
      "Cognitive empathy is logical; emotional empathy is irrational",
      "There is no difference — they are the same thing",
      "Cognitive empathy is more important than emotional empathy",
    ],
    correctAnswer:
      "Cognitive empathy is understanding someone's perspective; emotional empathy is actually feeling their emotions",
    explanation:
      "Cognitive empathy ('I understand how you feel') involves intellectually understanding another's perspective, while emotional empathy ('I feel what you feel') involves actually sharing their emotional experience. Both are important, but they serve different functions in relationships and communication.",
    hint: "One is about thinking, the other is about feeling.",
    xp: 15,
    coins: 5,
  },
  {
    id: "ei-6",
    category: "emotional-intelligence",
    difficulty: "intermediate",
    question:
      "What is 'emotional regulation,' and why is it considered a key skill for both personal and professional success?",
    type: "multiple-choice",
    options: [
      "The ability to manage and respond to emotional experiences in healthy, adaptive ways",
      "Suppressing all emotions to appear professional",
      "Only feeling positive emotions",
      "Controlling other people's emotions",
    ],
    correctAnswer:
      "The ability to manage and respond to emotional experiences in healthy, adaptive ways",
    explanation:
      "Emotional regulation isn't about suppressing emotions — it's about acknowledging them and choosing how to respond. People with strong emotional regulation can stay calm under pressure, recover quickly from setbacks, and maintain healthy relationships even during conflict.",
    hint: "It's not about never feeling angry or sad — it's about how you handle those feelings.",
    xp: 15,
    coins: 5,
  },
  {
    id: "ei-7",
    category: "emotional-intelligence",
    difficulty: "intermediate",
    question:
      "What is the 'amygdala hijack,' a term coined by Daniel Goleman, and how can emotionally intelligent people manage it?",
    type: "multiple-choice",
    options: [
      "When the brain's emotional center overrides rational thinking, causing impulsive reactions; managed through self-awareness and pause techniques",
      "A type of cyber attack on brain-computer interfaces",
      "When someone manipulates another person's emotions",
      "A medical condition affecting the amygdala",
    ],
    correctAnswer:
      "When the brain's emotional center overrides rational thinking, causing impulsive reactions; managed through self-awareness and pause techniques",
    explanation:
      "An amygdala hijack occurs when the amygdala (the brain's threat detection center) triggers a fight-or-flight response before the prefrontal cortex (rational thinking) can intervene. This leads to reactions we often regret. Emotional intelligence helps us create a 'pause' between stimulus and response.",
    hint: "This term describes the moment when emotion overpowers reason in the brain.",
    xp: 15,
    coins: 5,
  },

  // --- Advanced (ei-8 to ei-10) ---

  {
    id: "ei-8",
    category: "emotional-intelligence",
    difficulty: "advanced",
    question:
      "According to research by John Gottman, what is the 'magic ratio' of positive to negative interactions that predicts whether a relationship will thrive or fail?",
    type: "multiple-choice",
    options: [
      "5:1 (five positive interactions for every negative one)",
      "3:1 (three positive for every negative)",
      "10:1 (ten positive for every negative)",
      "2:1 (two positive for every negative)",
    ],
    correctAnswer: "5:1 (five positive interactions for every negative one)",
    explanation:
      "John Gottman's decades of research on couples found that stable, happy relationships maintain a ratio of at least 5 positive interactions for every 1 negative interaction. Below this ratio, relationships deteriorate. This finding has been replicated across cultures and relationship types.",
    hint: "For every criticism, you need five positive interactions to maintain balance.",
    xp: 20,
    coins: 8,
  },
  {
    id: "ei-9",
    category: "emotional-intelligence",
    difficulty: "advanced",
    question:
      "What is 'emotional labor,' a concept introduced by sociologist Arlie Hochschild, and how does it affect workers in service industries?",
    type: "multiple-choice",
    options: [
      "The effort of managing one's emotions as part of a job requirement, often leading to burnout and emotional exhaustion",
      "Physical labor that requires emotional motivation",
      "Work that involves emotional counseling",
      "The extra effort employees make to please their managers",
    ],
    correctAnswer:
      "The effort of managing one's emotions as part of a job requirement, often leading to burnout and emotional exhaustion",
    explanation:
      "Emotional labor, described by Hochschild in 1983, is the process of managing feelings and expressions to fulfill the emotional requirements of a job. Flight attendants, nurses, and customer service representatives perform significant emotional labor, which can lead to burnout when there's a mismatch between felt and displayed emotions.",
    hint: "It's the hidden work of controlling your emotions as part of your job.",
    xp: 20,
    coins: 8,
  },
  {
    id: "ei-10",
    category: "emotional-intelligence",
    difficulty: "advanced",
    question:
      "What is the 'Johari Window,' a psychological tool created by Joseph Luft and Harrington Ingham, and how does it relate to emotional intelligence?",
    type: "text-input",
    correctAnswer:
      "A framework with four quadrants (open, blind, hidden, unknown) that helps people understand the relationship between self-awareness and how others perceive them",
    explanation:
      "The Johari Window is a model for understanding self-awareness and interpersonal relationships. The four quadrants are: Open (known to self and others), Blind (unknown to self but known to others), Hidden (known to self but not others), and Unknown (unknown to both). Increasing the 'Open' area through feedback and self-disclosure is key to emotional intelligence.",
    xp: 20,
    coins: 8,
  },
];
