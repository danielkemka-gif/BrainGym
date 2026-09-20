/**
 * BRAINGYM UNIVERSAL INTERGENERATIONAL CHALLENGES & "SEE HOW OTHERS THINK"
 * 
 * Philosophy:
 * Expose users to different multi-generational mental models and problem-solving perspectives.
 * No age rankings; purely cognitive diversity and intergenerational wisdom.
 */

import { UniversalCommunityChallenge } from "./types";

export const UNIVERSAL_COMMUNITY_CHALLENGES: UniversalCommunityChallenge[] = [
  {
    id: "uc-community-50k",
    title: "The ₦50,000 Community Micro-Impact Challenge",
    universalSkill: "Problem-solving",
    prompt:
      "You have exactly ₦50,000 and 7 days to solve a tangible problem in your neighborhood or community. What would you do?",
    contextNarrative:
      "Resource constraints force us to choose between immediate relief vs sustainable systems. Different generations bring unique life experiences, networks, and perspectives to solving this challenge.",
    perspectives: [
      {
        personaLabel: "16-Year-Old Secondary Student",
        ageBracket: "13-17",
        lifeContext: "Student",
        approachTitle: "Digital Study Circle & Textbook Sharing Pool",
        reasoning:
          "I would use the ₦50,000 to buy second-hand past WAEC/JAMB exam past questions, scan key summaries with a smartphone app, and organize a weekend peer-tutoring hub in a community hall. 40+ students get free revision without buying expensive new books.",
        keyPriority: "Educational Access & Youth Peer Collaboration",
      },
      {
        personaLabel: "22-Year-Old University Graduate",
        ageBracket: "18-25",
        lifeContext: "Job seeker",
        approachTitle: "Neighborhood Clean-Up & Recyclable Sorting Hub",
        reasoning:
          "I would mobilize 15 unemployed youth volunteers, spend ₦20,000 on safety gloves and heavy-duty bags, clean a blocked market drainage, and sell the collected plastic waste to a recycling plant for ₦35,000, creating a rolling self-funding clean-up fund.",
        keyPriority: "Circular Economy, Environmental Sanitation & Youth Action",
      },
      {
        personaLabel: "35-Year-Old Corporate Manager",
        ageBracket: "26-45",
        lifeContext: "Professional",
        approachTitle: "Solar Security Light Installation on Dark Junction",
        reasoning:
          "I would purchase two 300W motion-sensor solar street lights (₦22,000 each) and mount them at the unlit intersection where street robberies happen at night. It immediately improves safety for 500+ commuters walking home from the bus stop.",
        keyPriority: "Public Safety, Infrastructure & High-Leverage Utility",
      },
      {
        personaLabel: "48-Year-Old Business Owner",
        ageBracket: "46-59",
        lifeContext: "Entrepreneur",
        approachTitle: "Market Women Micro-Inventory Wholesale Co-op",
        reasoning:
          "I would negotiate with a wholesale bulk distributor to buy 5 bags of grains at direct factory discount (saving 18%), and distribute them to 5 street vendors who currently pay extortionate daily supplier interest, boosting their profit margin permanently.",
        keyPriority: "Working Capital Efficiency & Local Merchant Empowerment",
      },
      {
        personaLabel: "62-Year-Old Senior Mentor & Elder",
        ageBracket: "60+",
        lifeContext: "Retired",
        approachTitle: "Intergenerational Conflict Mediation & Youth Apprenticeship Matching",
        reasoning:
          "I would rent a community hall, provide light refreshments (₦15,000), bring together 10 master craftsmen (carpenters, electricians, tailors) and 20 out-of-school youths to establish a structured 3-month mentorship and apprenticeship compact.",
        keyPriority: "Social Harmony, Legacy Knowledge Transfer & Community Stability",
      },
    ],
    reflectionQuestion:
      "Which perspective surprised you the most, and how did their life stage influence their problem-solving strategy?",
  },

  {
    id: "uc-digital-distraction",
    title: "The 48-Hour Digital Noise Detox & Deep Focus Experiment",
    universalSkill: "Focus",
    prompt:
      "If you had to eliminate 80% of your digital notifications and screen time for 48 hours, which core area of your life would experience the fastest transformation?",
    contextNarrative:
      "Information overload affects every generation differently: teens face social anxiety, professionals face email fatigue, and elders face news anxiety.",
    perspectives: [
      {
        personaLabel: "16-Year-Old Student",
        ageBracket: "13-17",
        lifeContext: "Student",
        approachTitle: "Restoring Self-Worth & Homework Speed",
        reasoning:
          "Without Instagram reels and WhatsApp status updates, I noticed my homework takes 45 minutes instead of 3 hours, and I stopped comparing my life to curated influencer videos.",
        keyPriority: "Mental Clarity & Emotional Peace",
      },
      {
        personaLabel: "35-Year-Old Professional",
        ageBracket: "26-45",
        lifeContext: "Professional",
        approachTitle: "Deep Strategic Output & Family Presence",
        reasoning:
          "Turning off Slack and email push notifications after 6 PM restored my evening presence with my kids and allowed me to finish a 30-page quarterly strategy report in one sitting.",
        keyPriority: "High-Cognitive Output & Relational Boundary",
      },
      {
        personaLabel: "60-Year-Old Retiree",
        ageBracket: "60+",
        lifeContext: "Retired",
        approachTitle: "Physical Movement & Book Reading",
        reasoning:
          "Stepping away from 24/7 political cable news and forwarded WhatsApp panic rumors lowered my blood pressure and gave me time for my daily 5,000-step garden walk and deep reading.",
        keyPriority: "Cardiovascular Calm & Intentional Living",
      },
    ],
    reflectionQuestion:
      "What is one notification category on your phone that you can permanently disable right now to reclaim focus?",
  },
];

export function getAllUniversalChallenges(): UniversalCommunityChallenge[] {
  return UNIVERSAL_COMMUNITY_CHALLENGES;
}

export function getUniversalChallengeById(id: string): UniversalCommunityChallenge | undefined {
  return UNIVERSAL_COMMUNITY_CHALLENGES.find((c) => c.id === id);
}
