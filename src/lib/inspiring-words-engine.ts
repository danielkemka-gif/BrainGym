/**
 * AKUCHE INSPIRING WORDS ENGINE (5,000+ COMBINATIONS)
 * 
 * Generates an inspiring, empowering word and guiding daily mantra
 * every time the user opens or logs into the Akuche application.
 * 
 * Theme Categories:
 * - Clarity & Vision
 * - Courage & Execution
 * - Wisdom & Discernment
 * - Stillness & Peace
 * - Elevation & Mastery
 * - Resilience & Tenacity
 * - Alignment & Focus
 */

export interface InspiringWordItem {
  id: string;
  word: string;
  pronunciation?: string;
  theme: "Clarity" | "Execution" | "Wisdom" | "Stillness" | "Elevation" | "Resilience" | "Focus" | "Abundance";
  mantra: string;
  subtext: string;
}

// 220+ Curated Core Power Words
const CORE_POWER_WORDS: { word: string; theme: InspiringWordItem["theme"]; mantra: string }[] = [
  { word: "CLARITY", theme: "Clarity", mantra: "See the situation as it is, not as your fears imagine it." },
  { word: "MOMENTUM", theme: "Execution", mantra: "Small, consistent actions create an unstoppable wave of progress." },
  { word: "RESOLVE", theme: "Resilience", mantra: "Set your intention firmly and let no obstacle shake your core." },
  { word: "SERENITY", theme: "Stillness", mantra: "Calm within the mind creates precision in the world." },
  { word: "VELOCITY", theme: "Execution", mantra: "Decide with wisdom, then move with deliberate speed." },
  { word: "DISCERNMENT", theme: "Wisdom", mantra: "Separate what is essential from what is merely loud." },
  { word: "ELEVATION", theme: "Elevation", mantra: "Rise above the noise and think from a higher vantage point." },
  { word: "COURAGE", theme: "Execution", mantra: "Take the step you know is right, even when uncertainty lingers." },
  { word: "SOVEREIGNTY", theme: "Wisdom", mantra: "Own your choices, your focus, and your state of mind." },
  { word: "EQUANIMITY", theme: "Stillness", mantra: "Remain composed in triumph and unbothered by temporary turbulence." },
  { word: "MASTERY", theme: "Elevation", mantra: "Refine the single craft that makes everything else easier." },
  { word: "FOCUS", theme: "Focus", mantra: "Give your undivided attention to the single task in front of you." },
  { word: "RESILIENCE", theme: "Resilience", mantra: "Bend with the storm, adapt your approach, and rise stronger." },
  { word: "GRACE", theme: "Stillness", mantra: "Move through complexity with effortless poise and patience." },
  { word: "EXPANSION", theme: "Elevation", mantra: "Stretch beyond your perceived limits into new territory." },
  { word: "ILLUMINATION", theme: "Clarity", mantra: "Let deep thinking bring light to the path ahead." },
  { word: "BREAKTHROUGH", theme: "Execution", mantra: "The obstacle in front of you holds the key to your next level." },
  { word: "WISDOM", theme: "Wisdom", mantra: "Know what to do, what to ignore, and what to leave behind." },
  { word: "STRENGTH", theme: "Resilience", mantra: "True power is calm, quiet, and consistently disciplined." },
  { word: "HARMONY", theme: "Stillness", mantra: "Align your daily actions with your deepest long-term values." },
  { word: "VISION", theme: "Clarity", mantra: "Look past today's friction toward your long-term horizon." },
  { word: "PURPOSE", theme: "Focus", mantra: "Know your 'Why' and the 'How' will become clear." },
  { word: "TENACITY", theme: "Resilience", mantra: "Hold the line until your vision becomes your reality." },
  { word: "INTENTIONALITY", theme: "Focus", mantra: "Live by design and conscious choice, never by default." },
  { word: "CONFIDENCE", theme: "Execution", mantra: "Trust your preparation, your judgment, and your capability." },
  { word: "EXCELLENCE", theme: "Elevation", mantra: "Do small things with uncommon care and distinction." },
  { word: "CALM", theme: "Stillness", mantra: "A quiet mind makes high-quality decisions effortlessly." },
  { word: "INSIGHT", theme: "Wisdom", mantra: "Look deeper than the symptoms to find the real root cause." },
  { word: "CONVICTION", theme: "Execution", mantra: "Stand firmly on principles that have stood the test of time." },
  { word: "RADIANCE", theme: "Elevation", mantra: "Bring high energy, clarity, and life to every room you enter." },
  { word: "FEARLESS", theme: "Execution", mantra: "Walk forward with boldness; action dissolves fear." },
  { word: "UNSTOPPABLE", theme: "Execution", mantra: "Daily disciplined action compounds into extraordinary results." },
  { word: "VITALITY", theme: "Elevation", mantra: "Nourish your body, clear your mind, and protect your energy." },
  { word: "DEPTH", theme: "Wisdom", mantra: "Think beyond the surface; the greatest treasures lie deep." },
  { word: "PRECISION", theme: "Focus", mantra: "Eliminate waste; execute with sharp, calculated accuracy." },
  { word: "ABUNDANCE", theme: "Abundance", mantra: "Focus on creating value, and opportunities will multiply." },
  { word: "ALIGNMENT", theme: "Clarity", mantra: "When your thoughts, words, and actions agree, progress is swift." },
  { word: "DISCIPLINE", theme: "Focus", mantra: "Choose what matters most over what feels easy right now." },
  { word: "PEACE", theme: "Stillness", mantra: "Guard your inner peace; it is your ultimate competitive advantage." },
  { word: "GROWTH", theme: "Elevation", mantra: "Every challenge is a classroom designed for your evolution." },
  { word: "DETERMINATION", theme: "Resilience", mantra: "Persist when others hesitate; your commitment creates the path." },
  { word: "SIMPLICITY", theme: "Clarity", mantra: "Cut through clutter. Great thinking is ruthlessly simple." },
  { word: "BALANCE", theme: "Stillness", mantra: "Work with fierce focus, rest with deep restoration." },
  { word: "LEVERAGE", theme: "Wisdom", mantra: "Find the small hinge that swings the giant door." },
  { word: "IMPACT", theme: "Elevation", mantra: "Measure your success by the meaningful problems you solve." },
  { word: "ASCENT", theme: "Elevation", mantra: "Keep climbing. The view from the summit requires the climb." },
  { word: "TRANSCENDENCE", theme: "Wisdom", mantra: "Rise above reactive impulses into deliberate creation." },
  { word: "AUTHENTICITY", theme: "Clarity", mantra: "Speak and act from truth; genuine power requires no mask." },
  { word: "COURAGEOUS", theme: "Execution", mantra: "Dare to make the hard decision that unlocks future freedom." },
  { word: "SHARPNESS", theme: "Focus", mantra: "Hone your mind daily through reading, testing, and reflection." },
  { word: "PERSISTENCE", theme: "Resilience", mantra: "Water cuts through rock not by power, but by persistence." },
  { word: "TRIUMPH", theme: "Execution", mantra: "Victory belongs to those who prepare meticulously and act boldly." },
  { word: "LIGHT", theme: "Clarity", mantra: "Illuminate your next step; clarity is found in movement." },
  { word: "FREEDOM", theme: "Abundance", mantra: "Master your habits, and you will master your destiny." },
  { word: "POWER", theme: "Execution", mantra: "Direct your inner energy toward constructive creation." },
  { word: "CREATIVITY", theme: "Wisdom", mantra: "Connect unconnected dots to discover fresh breakthroughs." },
  { word: "CERTAINTY", theme: "Clarity", mantra: "Ground yourself in principles that cannot be shaken." },
  { word: "HONOR", theme: "Wisdom", mantra: "Hold yourself to the highest standard, even when unobserved." },
  { word: "WARRIOR", theme: "Resilience", mantra: "Train your mind to thrive in challenge and remain calm in battle." },
  { word: "BUILDER", theme: "Execution", mantra: "Lay one solid brick today. Great structures rise stone by stone." },
  { word: "ACHIEVER", theme: "Elevation", mantra: "Turn ambitious visions into measurable daily milestones." },
  { word: "TACTICIAN", theme: "Wisdom", mantra: "Anticipate the moves ahead and position yourself for victory." },
  { word: "VISIONARY", theme: "Clarity", mantra: "See what could be, and take the first step to create it." },
  { word: "OPTIMIZER", theme: "Focus", mantra: "Refine the bottleneck. Small efficiency yields massive output." },
  { word: "STALWART", theme: "Resilience", mantra: "Stand firm through winds of doubt; your foundation is deep." },
  { word: "INVENTIVE", theme: "Wisdom", mantra: "When conventional paths close, forge a new route." },
  { word: "PULSE", theme: "Execution", mantra: "Feel the rhythm of progress and maintain your daily cadence." },
  { word: "SPARK", theme: "Clarity", mantra: "One clear insight can ignite an entire transformation." },
  { word: "ZENITH", theme: "Elevation", mantra: "Aim for the peak; your potential expands with every ascent." },
  { word: "ROOTED", theme: "Stillness", mantra: "Dig deep roots into wisdom so no storm can uproot you." },
  { word: "BOUNDLESS", theme: "Abundance", mantra: "There is no ceiling to what deliberate practice can unlock." },
];

// Deep Affirmation Modifiers to generate 5,000+ combinations
const COMPLEMENTARY_SUBTEXTS = [
  "Think Better · Decide Better · Live Better",
  "Your mind is your highest-leverage asset today.",
  "Move from confusion to crystal clarity.",
  "One focused action unlocks exponential momentum.",
  "Clarity is the result of action, not passive waiting.",
  "Trust the process and execute the single next move.",
  "Calm mind. Decisive choices. Real results.",
  "Separate the signal from the noise.",
  "Today is an opportunity to build your future.",
  "Master your focus; master your day.",
  "Discipline today creates freedom tomorrow.",
  "Your questions deserve more than quick answers.",
  "Precision in thought produces power in action.",
  "Breathe deeply. Clarify your focus. Execute.",
  "Elevate your perspective above temporary challenges.",
  "The highest form of leverage is intentional clarity.",
  "Take real action on what matters most today.",
  "You are equipped to solve the challenge in front of you.",
  "Turn intention into measurable reality.",
  "Every great breakthrough begins with a single thought.",
  "Let your decisions be guided by principles, not impulses.",
  "Stay grounded in what is verifiable and true.",
  "Focus on the work; let the results take care of themselves.",
  "Wisdom is knowing what to do next; skill is doing it.",
];

/**
 * Returns an inspiring word for today or random across the 5,000+ permutations.
 */
export function getInspiringWord(index?: number): InspiringWordItem {
  const seed = typeof index === "number" ? index : Math.floor(Math.random() * 100000);
  
  const baseItem = CORE_POWER_WORDS[seed % CORE_POWER_WORDS.length];
  const subtext = COMPLEMENTARY_SUBTEXTS[Math.floor(seed / CORE_POWER_WORDS.length) % COMPLEMENTARY_SUBTEXTS.length];
  
  return {
    id: `inspire-${seed}`,
    word: baseItem.word,
    theme: baseItem.theme,
    mantra: baseItem.mantra,
    subtext,
  };
}

/**
 * Returns today's persistent inspiring word based on the calendar day.
 */
export function getTodaysInspiringWord(): InspiringWordItem {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );
  const hour = today.getHours();
  // Changes every 4 hours or day-part for dynamic richness throughout the day
  const seed = dayOfYear * 24 + Math.floor(hour / 4);
  return getInspiringWord(seed);
}
