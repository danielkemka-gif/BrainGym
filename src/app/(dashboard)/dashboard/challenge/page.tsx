"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getBrainQuestions, QUIZ_LANGUAGES, type BrainQuestion, type BrainQuestionLocale } from "@/lib/brain-questions";
import { CATEGORIES, QUICK_FIRE_DURATIONS } from "@/lib/constants";
import { updateCategoryScore } from "@/lib/brain-scores";
import { unlockSpeedDemon } from "@/lib/achievements";
import {
  ArrowLeft, Clock, Zap, Trophy, Coins, RotateCcw,
  CheckCircle2, XCircle, Flame, Send, Lightbulb, Star, Target, Globe, Brain, Lock, Crown, Sparkles
} from "lucide-react";
import { BrainTaskPlayer } from "@/components/games/brain-task-player";
import { DailyReminder, checkAndShowReminder } from "@/components/games/daily-reminder";
import { pickBrainTasks, type BrainTask } from "@/lib/brain-tasks";
import { CATEGORY_ILLUSTRATIONS } from "@/components/brain-illustrations";
import { pickPremiumScenarios, type PremiumScenario } from "@/lib/premium-scenarios";

const CAT_EMOJI: Record<string, string> = {
  memory: "🧠", focus: "🎯", thinking: "💡", learning: "📚",
  health: "❤️", creativity: "🎨", "emotional-intelligence": "🤝",
};

const REACTIONS: Record<string, { correct: string[]; wrong: string[] }> = {
  pcm: {
    correct: [
      "Sharp! You too sabi! 🎯",
      "Oga, your brain no dey play! 💪",
      "Chop knuckle! You don get am! ✊",
      "Na you be the real Oga! 👑",
      "Your brain dey fire on all cylinders! 🔥",
      "Wahala! You too correct! ⚡",
      "No wahala at all! You sabi! ✅",
      "E choke! You nail am! 🎯",
    ],
    wrong: [
      "No wahala, you go get the next one! 💪",
      "E no go always easy — that na how we learn! 📚",
      "No give up! Your brain dey grow with every question! 🧠",
      "Hmmm, e happen! Try the next one! 🎯",
      "Learning na the real win! Keep going! 🔥",
      "Every mistake na step to being better! 💡",
    ],
  },
  en: {
    correct: [
      "Sharp mind! Well done! 🎯",
      "Your brain is absolutely on fire! 💪",
      "Brilliant! You nailed it! ✊",
      "Top-notch performance! 👑",
      "Your neurons are firing perfectly! 🔥",
      "Incredible! You're on a roll! ⚡",
      "Perfect score! Keep it up! ✅",
      "Absolutely smashing it! 🎯",
    ],
    wrong: [
      "No worries, you'll get the next one! 💪",
      "It's not always easy — that's how we learn! 📚",
      "Don't give up! Your brain grows with every question! 🧠",
      "Tricky one! Try the next! 🎯",
      "Learning is the real win! Keep going! 🔥",
      "Every mistake is a step towards mastery! 💡",
    ],
  },
  "en-us": {
    correct: [
      "Nailed it! Sharp thinking! 🎯",
      "Your brain is on another level! 💪",
      "That was awesome! Great job! ✊",
      "You're crushing it! Keep going! 👑",
      "Lightning fast brain! 🔥",
      "Unstoppable! You're on fire! ⚡",
      "Perfect! You're a natural! ✅",
      "Smashed it! Way to go! 🎯",
    ],
    wrong: [
      "No sweat, you got the next one! 💪",
      "It's tough sometimes — that's how you grow! 📚",
      "Don't quit! Every question makes you smarter! 🧠",
      "That was tricky! Try the next one! 🎯",
      "Learning is the real victory! Keep at it! 🔥",
      "Every miss is a lesson! You'll get it! 💡",
    ],
  },
  fr: {
    correct: [
      "Brillant! Bien joué! 🎯",
      "Votre cerveau est en feu! 💪",
      "Magnifique! Vous y êtes! ✊",
      "Performance exceptionnelle! 👑",
      "Vos neurones fonctionnent parfaitement! 🔥",
      "Incroyable! Vous êtes en pleine forme! ⚡",
      "Score parfait! Continuez! ✅",
      "Fantastique! Vous dominiez! 🎯",
    ],
    wrong: [
      "Pas de souci, vous aurez la prochaine! 💪",
      "Ce n'est pas toujours facile — c'est comme ça qu'on apprend! 📚",
      "N'abandondez pas! Votre cerveau grandit à chaque question! 🧠",
      "Difficile! Essayez la suivante! 🎯",
      "Apprendre est la vraie victoire! Continuez! 🔥",
      "Chaque erreur est un pas vers la maîtrise! 💡",
    ],
  },
  pt: {
    correct: [
      "Esperto! Muito bem! 🎯",
      "Seu cérebro está pegando fogo! 💪",
      "Sensacional! Você acertou! ✊",
      "Desempenho incrível! 👑",
      "Seus neurônios estão funcionando perfeitamente! 🔥",
      "Incrível! Você está arrasando! ⚡",
      "Pontuação perfeita! Continue assim! ✅",
      "Demais! Você está dominando! 🎯",
    ],
    wrong: [
      "Sem problema, você acerta a próxima! 💪",
      "Não é sempre fácil — é assim que aprendemos! 📚",
      "Desista! Seu cérebro cresce a cada questão! 🧠",
      "Difícil! Tente a próxima! 🎯",
      "Aprender é a verdadeira vitória! Continue! 🔥",
      "Cada erro é um passo para a maestria! 💡",
    ],
  },
};

function getCorrectReaction(lang: string): string {
  const reactions = REACTIONS[lang]?.correct || REACTIONS.en.correct;
  return reactions[Math.floor(Math.random() * reactions.length)];
}

function getWrongReaction(lang: string): string {
  const reactions = REACTIONS[lang]?.wrong || REACTIONS.en.wrong;
  return reactions[Math.floor(Math.random() * reactions.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "setup" | "countdown" | "active" | "feedback" | "finished";
type AnswerState = "unanswered" | "correct" | "wrong";

type SessionItem =
  | { kind: "trivia"; question: BrainQuestion }
  | { kind: "brain_task"; task: BrainTask }
  | { kind: "premium_preview"; scenario: PremiumScenario };

export default function ChallengePage() {
  const [duration, setDuration] = useState(60);
  const [quizLang, setQuizLang] = useState<BrainQuestionLocale>("en");
  const [phase, setPhase] = useState<Phase>("setup");
  const [countdownValue, setCountdownValue] = useState(3);

  const [questions, setQuestions] = useState<BrainQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0);

  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [showHint, setShowHint] = useState(false);

  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [questionLog, setQuestionLog] = useState<{
    question: string; correct: boolean; xp: number; coins: number; category: string;
  }[]>([]);

  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const qTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const persistedRef = useRef(false);

  const [sessionItems, setSessionItems] = useState<SessionItem[]>([]);
  const [brainTaskScores, setBrainTaskScores] = useState<{ task: BrainTask; score: number }[]>([]);
  const [brainTaskPhase, setBrainTaskPhase] = useState<"idle" | "active" | "done">("idle");
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [premiumAnswered, setPremiumAnswered] = useState<Record<number, { correct: boolean; skipped: boolean }>>({});

  const currentTrivia = questions[currentIndex];
  const currentItem = sessionItems[currentIndex];

  // Check premium status on mount
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setIsPremium(false); return; }
      supabase
        .from("subscriptions")
        .select("status, current_period_end")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          const active = data?.status === "active" || (data?.status === "trialing" && data.current_period_end && new Date(data.current_period_end) > new Date());
          setIsPremium(!!active);
        });
    });
  }, []);

  // Pick questions on start
  const pickQuestions = useCallback(() => {
    const allQuestions = getBrainQuestions(quizLang);
    const shuffled = shuffle(allQuestions);
    const maxQ = duration <= 30 ? 6 : duration <= 60 ? 9 : 12;
    return shuffled.slice(0, Math.min(maxQ, shuffled.length));
  }, [duration, quizLang]);

  // Start challenge
  const startChallenge = useCallback(() => {
    const picked = pickQuestions();
    if (picked.length === 0) { setError("No questions available."); return; }

    const brainTasks = pickBrainTasks(duration <= 30 ? 2 : duration <= 60 ? 3 : 4, Date.now());
    const premiumScenarios = pickPremiumScenarios(duration <= 30 ? 1 : 2, Date.now());

    const items: SessionItem[] = [];
    let bIdx = 0;
    let qIdx = 0;
    let pIdx = 0;
    const totalSlots = picked.length + brainTasks.length + premiumScenarios.length;
    const spacing = Math.max(2, Math.floor(totalSlots / (brainTasks.length + 1)));
    const premiumSlot1 = Math.floor(totalSlots * 0.3);
    const premiumSlot2 = Math.floor(totalSlots * 0.7);

    for (let i = 0; i < totalSlots; i++) {
      if (pIdx < premiumScenarios.length && (i === premiumSlot1 || i === premiumSlot2)) {
        items.push({ kind: "premium_preview", scenario: premiumScenarios[pIdx] });
        pIdx++;
      } else if (bIdx < brainTasks.length && (i + 1) % spacing === 0 && qIdx >= 1) {
        items.push({ kind: "brain_task", task: brainTasks[bIdx] });
        bIdx++;
      } else if (qIdx < picked.length) {
        items.push({ kind: "trivia", question: picked[qIdx] });
        qIdx++;
      }
    }
    while (qIdx < picked.length) { items.push({ kind: "trivia", question: picked[qIdx] }); qIdx++; }
    while (bIdx < brainTasks.length) { items.push({ kind: "brain_task", task: brainTasks[bIdx] }); bIdx++; }

    setSessionItems(items);
    setQuestions(picked);
    setCurrentIndex(0);
    setTimeLeft(duration);
    setStreak(0); setBestStreak(0); setCorrectCount(0);
    setTotalXp(0); setTotalCoins(0); setQuestionLog([]);
    setBrainTaskScores([]);
    setBrainTaskPhase("idle");
    setPremiumAnswered({});
    setPhase("countdown");
    setCountdownValue(3);
    persistedRef.current = false;
  }, [duration, pickQuestions]);

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdownValue <= 0) { setPhase("active"); return; }
    const t = setTimeout(() => setCountdownValue(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdownValue]);

  // Global timer
  useEffect(() => {
    if (phase !== "active") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // Per-question timer
  useEffect(() => {
    if (phase !== "active" || answerState !== "unanswered" || !currentTrivia || currentItem?.kind === "brain_task" || currentItem?.kind === "premium_preview") return;
    const qTime = currentTrivia.difficulty === "beginner" ? 20 : currentTrivia.difficulty === "intermediate" ? 25 : 30;
    setQuestionTimeLeft(qTime);
    qTimerRef.current = setInterval(() => {
      setQuestionTimeLeft(prev => {
        if (prev <= 1) {
          if (qTimerRef.current) clearInterval(qTimerRef.current);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (qTimerRef.current) clearInterval(qTimerRef.current); };
  }, [phase, currentIndex, answerState, currentTrivia, currentItem]);

  // Focus input on text questions
  useEffect(() => {
    if (phase === "active" && currentItem?.kind === "trivia" && currentTrivia?.type === "text-input" && answerState === "unanswered") {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [phase, currentTrivia, answerState, currentIndex, currentItem]);

  // Persist quiz results when finished
  useEffect(() => {
    if (phase !== "finished" || persistedRef.current || questions.length === 0) return;
    persistedRef.current = true;

    const persistResults = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Persist XP to ledger
        if (totalXp > 0) {
          await supabase.from("xp_ledger").insert({
            user_id: user.id,
            amount: totalXp,
            reason: "quick_fire_quiz",
          });
        }

        // Persist coins to ledger
        if (totalCoins > 0) {
          await supabase.from("coins_ledger").insert({
            user_id: user.id,
            amount: totalCoins,
            reason: "quick_fire_quiz",
          });
        }

        // Update brain scores per category based on quiz performance
        const categoryResults: Record<string, { correct: number; total: number }> = {};
        for (const log of questionLog) {
          if (!categoryResults[log.category]) {
            categoryResults[log.category] = { correct: 0, total: 0 };
          }
          categoryResults[log.category].total++;
          if (log.correct) categoryResults[log.category].correct++;
        }

        for (const [catSlug, result] of Object.entries(categoryResults)) {
          const cat = CATEGORIES.find((c) => c.slug === catSlug);
          if (cat) {
            const accuracy = result.correct / result.total;
            await updateCategoryScore(user.id, cat.id, accuracy > 0.5, accuracy > 0.8 ? "advanced" : accuracy > 0.5 ? "intermediate" : "beginner");
          }
        }

        // Unlock Speed Demon achievement
        const unlocked = await unlockSpeedDemon(user.id);
        if (unlocked.length > 0) {
          // Achievement unlocked — could show notification
        }
      } catch {
        // Silently fail
      }
    };

    persistResults();
  }, [phase, totalXp, totalCoins, questionLog, questions.length]);

  function isCorrect(answer: string): boolean {
    if (!currentTrivia) return false;
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
    if (currentTrivia.type === "text-input") {
      return norm(answer) === norm(currentTrivia.correctAnswer);
    }
    return answer === currentTrivia.correctAnswer;
  }

  const handleSubmit = useCallback((timedOut = false) => {
    if (answerState !== "unanswered" || !currentTrivia) return;
    if (qTimerRef.current) clearInterval(qTimerRef.current);

    let correct = false;
    if (!timedOut) {
      if (currentTrivia.type === "multiple-choice" && selectedOption) {
        correct = isCorrect(selectedOption);
      } else if (currentTrivia.type === "text-input" && textInput.trim()) {
        correct = isCorrect(textInput);
      }
    }

    const streakBonus = correct ? Math.min(streak + 1, 5) : 0;
    const xp = correct ? (currentTrivia.xp + streakBonus * 3) : 0;
    const coins = correct ? currentTrivia.coins : 0;

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setCorrectCount(c => c + 1);
    } else {
      setStreak(0);
    }
    setTotalXp(x => x + xp);
    setTotalCoins(c => c + coins);
    setQuestionLog(log => [...log, {
      question: currentTrivia.question.substring(0, 50) + "...",
      correct, xp, coins, category: currentTrivia.category,
    }]);
    setAnswerState(correct ? "correct" : "wrong");
  }, [answerState, currentTrivia, selectedOption, textInput, streak, bestStreak]);

  function nextQuestion() {
    if (currentIndex < sessionItems.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setTextInput("");
      setShowHint(false);
      setAnswerState("unanswered");
      setBrainTaskPhase("idle");
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase("finished");
    }
  }

  function handleBrainTaskComplete(score: number) {
    if (!currentItem || currentItem.kind !== "brain_task") return;
    setBrainTaskScores(prev => [...prev, { task: currentItem.task, score }]);
    setTotalXp(x => x + currentItem.task.xpReward);
    setTotalCoins(c => c + currentItem.task.coinReward);
    setQuestionLog(log => [...log, {
      question: `[Brain Task] ${currentItem.task.title}`,
      correct: score > 0,
      xp: currentItem.task.xpReward,
      coins: currentItem.task.coinReward,
      category: currentItem.task.category,
    }]);
    setBrainTaskPhase("done");
  }

  function handlePremiumAnswer(answer: string) {
    if (!currentItem || currentItem.kind !== "premium_preview") return;
    if (qTimerRef.current) clearInterval(qTimerRef.current);
    const correct = answer === currentItem.scenario.correctAnswer;
    const xp = correct ? currentItem.scenario.xp : 0;
    const coins = correct ? currentItem.scenario.coins : 0;
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
      setCorrectCount(c => c + 1);
    } else {
      setStreak(0);
    }
    setTotalXp(x => x + xp);
    setTotalCoins(c => c + coins);
    setQuestionLog(log => [...log, {
      question: `[Premium] ${currentItem.scenario.title}`,
      correct, xp, coins, category: currentItem.scenario.category,
    }]);
    setPremiumAnswered(prev => ({ ...prev, [currentIndex]: { correct, skipped: false } }));
    setAnswerState(correct ? "correct" : "wrong");
  }

  function handlePremiumSkip() {
    if (!currentItem || currentItem.kind !== "premium_preview") return;
    if (qTimerRef.current) clearInterval(qTimerRef.current);
    setPremiumAnswered(prev => ({ ...prev, [currentIndex]: { correct: false, skipped: true } }));
    setQuestionLog(log => [...log, {
      question: `[Premium] ${currentItem.scenario.title}`,
      correct: false, xp: 0, coins: 0, category: currentItem.scenario.category,
    }]);
    setAnswerState("wrong");
  }

  function formatTime(s: number) {
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  }

  // ═══ SETUP ═══
  if (phase === "setup") {
    return (
      <div className="mx-auto w-full max-w-lg space-y-6 overflow-x-hidden">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground min-h-[44px]">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="w-full max-w-full overflow-x-hidden rounded-2xl border border-border bg-card p-4 text-center sm:p-6 lg:p-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-4xl shadow-lg shadow-orange-500/20">
            ⚡
          </div>
          <h1 className="text-xl font-bold sm:text-2xl">Quick-Fire Brain Quiz</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Test your brain with fun questions across Memory, Focus, Thinking, and more!
            Plus real-life brain tasks to train everyday cognitive skills! 🧠
          </p>

          <div className="mt-6 rounded-xl border border-border bg-background p-4 text-left">
            <h3 className="mb-3 text-sm font-semibold flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" /> {quizLang === "pcm" ? "How e dey work" : quizLang === "fr" ? "Comment ça marche" : quizLang === "pt" ? "Como funciona" : quizLang === "en-us" ? "How it works" : "How it works"}
            </h3>
            <div className="space-y-3">
              {(quizLang === "pcm"
                ? [
                    "Pick your time — 30s (quick blast), 60s (sweet spot), or 90s (full brain workout)",
                    "Each question get multiple choice OR type-your-answer mode",
                    "Answer correct = XP + coins. Fast answer = MORE bonus!",
                    "Get consecutive answers correct = Streak combo = DOUBLE bonus! 🔥",
                    "If you no know, use the hint — but e go reduce your XP small",
                    "Set a daily reminder so you no go miss your brain workout!",
                  ]
                : quizLang === "fr"
                ? [
                    "Choisissez votre temps — 30s (rapide), 60s (idéal), ou 90s (défi complet)",
                    "Chaque question est à choix multiple OU à réponse libre",
                    "Des tâches cérébrales réelles sont mélangées — comptez, souvenez-vous, respirez! 🧠",
                    "Bonne réponse = XP + coins. Réponse rapide = PLUS de bonus!",
                    "Réponses consécutives correctes = combo streak = DOUBLE bonus! 🔥",
                    "Réglez un rappel quotidien pour ne jamais manquer votre entraînement!",
                  ]
                : quizLang === "pt"
                ? [
                    "Escolha seu tempo — 30s (rápido), 60s (ideal), ou 90s (desafio completo)",
                    "Cada questão é múltipla escolha OU resposta digitada",
                    "Tarefas cerebrais reais são misturadas — conte, lembre-se, respire! 🧠",
                    "Acertou = XP + coins. Resposta rápida = MAIS bônus!",
                    "Acertos consecutivos = combo streak = DOBRO de bônus! 🔥",
                    "Defina um lembrete diário para nunca perder seu treino cerebral!",
                  ]
                : quizLang === "en-us"
                ? [
                    "Pick your time — 30s (quick blast), 60s (sweet spot), or 90s (full brain workout)",
                    "Each question is multiple choice OR type-your-answer mode",
                    "Real-life brain tasks mixed in — count things, recall memories, breathe! 🧠",
                    "Answer correct = XP + coins. Fast answer = MORE bonus!",
                    "Get consecutive answers correct = Streak combo = DOUBLE bonus! 🔥",
                    "Set a daily reminder so you never miss your brain workout!",
                  ]
                : [
                    "Pick your time — 30s (quick blast), 60s (sweet spot), or 90s (full brain workout)",
                    "Each question is multiple choice OR type-your-answer mode",
                    "Real-life brain tasks are mixed in — count things, recall memories, breathe! 🧠",
                    "Answer correct = XP + coins. Fast answer = MORE bonus!",
                    "Get consecutive answers correct = Streak combo = DOUBLE bonus! 🔥",
                    "Premium questions give you a taste of AI Coach & Decision Lab — unlock to answer! 👑",
                  ]
              ).map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-background p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brain categories</p>
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map(c => (
                  <span key={c.id} className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs">
                    {(() => { const Illust = CATEGORY_ILLUSTRATIONS[c.slug]; return Illust ? <Illust className="h-4 w-4" /> : <span>{CAT_EMOJI[c.slug] || "🧠"}</span>; })()} {c.label}
                  </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-medium">Choose your time limit</p>
            <div className="flex justify-center gap-2 sm:gap-3">
              {QUICK_FIRE_DURATIONS.map(d => (
                <button key={d} onClick={() => setDuration(d)}
                  className={`min-h-[44px] touch-manipulation rounded-xl border px-5 py-3 text-sm font-medium transition-all active:scale-[0.97] ${
                    duration === d
                      ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "border-border hover:border-muted-foreground"
                  }`}>
                  {d}s
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" /> Quiz language
            </p>
            <div className="grid grid-cols-1 gap-2">
              {QUIZ_LANGUAGES.map(lang => (
                <button key={lang.value} onClick={() => setQuizLang(lang.value)}
                  className={`min-h-[48px] touch-manipulation flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all active:scale-[0.97] ${
                    quizLang === lang.value
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                      : "border-border hover:border-muted-foreground/50 hover:bg-accent/50"
                  }`}>
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="min-w-0">
                    <p className={quizLang === lang.value ? "text-primary" : "text-foreground"}>
                      {lang.nativeLabel}
                    </p>
                    <p className="text-xs text-muted-foreground">{lang.label}</p>
                  </div>
                  {quizLang === lang.value && (
                    <div className="ml-auto h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          <div className="mt-6">
            <DailyReminder />
          </div>

          <button onClick={startChallenge}
            className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl hover:shadow-orange-500/30 active:scale-[0.98]">
            <Zap className="h-4 w-4" />
            {quizLang === "pcm" ? "Oya, Start! 🔥" : quizLang === "fr" ? "C'est parti! 🔥" : quizLang === "pt" ? "Vamos começar! 🔥" : quizLang === "en-us" ? "Let's Go! 🔥" : "Let's Go! 🔥"}
          </button>
        </div>
      </div>
    );
  }

  // ═══ COUNTDOWN ═══
  if (phase === "countdown") {
    const phrases: Record<number, string> = { 3: "Get ready...", 2: "Set...", 1: quizLang === "pcm" ? "Oya GO! 🚀" : quizLang === "fr" ? "C'est parti! 🚀" : quizLang === "pt" ? "Vamos lá! 🚀" : "Let's rock it! 🚀" };
    return (
      <div className="mx-auto flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-6 text-5xl font-bold text-primary animate-bounce sm:text-7xl">
            {countdownValue || "GO!"}
          </div>
          <p className="text-lg text-muted-foreground font-medium">{phrases[countdownValue] || "Go!"}</p>
        </div>
      </div>
    );
  }

  // ═══ FINISHED ═══
  if (phase === "finished") {
    const triviaTotal = questions.length;
    const total = sessionItems.length;
    const triviaAccuracy = triviaTotal > 0 ? Math.round((correctCount / triviaTotal) * 100) : 0;
    const accuracy = total > 0 ? Math.round((correctCount / triviaTotal) * 100) : 0;
    const brainTasksDone = brainTaskScores.length;
    const brainTotalScore = brainTaskScores.reduce((sum, b) => sum + b.score, 0);
    const grade = triviaAccuracy >= 90
      ? (quizLang === "pcm" ? "Oga Level! 🏆" : quizLang === "fr" ? "Niveau Oga! 🏆" : quizLang === "pt" ? "Nível Oga! 🏆" : quizLang === "en-us" ? "Champion Level! 🏆" : "Champion Level! 🏆")
      : triviaAccuracy >= 70
      ? (quizLang === "pcm" ? "You too sabi! 🔥" : quizLang === "fr" ? "Très bien! 🔥" : quizLang === "pt" ? "Muito bem! 🔥" : quizLang === "en-us" ? "Great work! 🔥" : "Great work! 🔥")
      : triviaAccuracy >= 50
      ? (quizLang === "pcm" ? "Not bad at all! 💪" : quizLang === "fr" ? "Pas mal du tout! 💪" : quizLang === "pt" ? "Nada mal! 💪" : "Not bad at all! 💪")
      : (quizLang === "pcm" ? "Keep practicing, you go get there! 🧠" : quizLang === "fr" ? "Continuez, vous y arriverez! 🧠" : quizLang === "pt" ? "Continue praticando, você vai conseguir! 🧠" : "Keep practicing, you'll get there! 🧠");
    const reaction = triviaAccuracy >= 80
      ? getCorrectReaction(quizLang)
      : "Every question is a learning opportunity!";

    return (
      <div className="mx-auto w-full max-w-lg space-y-6 overflow-x-hidden">
        <div className="rounded-2xl border border-border bg-card p-4 text-center sm:p-6 lg:p-8">
          <div className="mx-auto mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-3xl sm:text-4xl shadow-lg shadow-green-500/20">
            🎉
          </div>
          <h2 className="text-xl font-bold sm:text-2xl">{grade}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{reaction}</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-primary/10 p-4">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <p className="text-2xl font-bold text-green-500">{correctCount}</p>
              </div>
              <p className="text-xs text-muted-foreground">Correct out of {total}</p>
            </div>
            <div className="rounded-xl bg-amber-500/10 p-4">
              <div className="flex items-center justify-center gap-1">
                <Coins className="h-4 w-4 text-amber-500" />
                <p className="text-2xl font-bold text-amber-500">{totalCoins}</p>
              </div>
              <p className="text-xs text-muted-foreground">Coins earned</p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-violet-500/10 p-4">
              <div className="flex items-center justify-center gap-1">
                <Trophy className="h-4 w-4 text-violet-400" />
                <p className="text-2xl font-bold text-violet-400">+{totalXp}</p>
              </div>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </div>
            <div className="rounded-xl bg-orange-500/10 p-4">
              <div className="flex items-center justify-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <p className="text-2xl font-bold text-orange-500">{bestStreak}</p>
              </div>
              <p className="text-xs text-muted-foreground">Best streak</p>
            </div>
          </div>

          {brainTasksDone > 0 && (
            <div className="mt-3 rounded-xl bg-primary/5 border border-primary/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Brain Tasks: {brainTasksDone}</span>
              </div>
              <div className="space-y-1">
                {brainTaskScores.map((bt, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground truncate flex-1">{bt.task.title}</span>
                    <span className="font-bold text-primary ml-2">+{bt.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 rounded-xl bg-muted/50 p-3">
            <p className="text-sm font-medium">Accuracy: <span className="text-primary font-bold">{accuracy}%</span></p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                style={{ width: `${accuracy}%` }} />
            </div>
          </div>

          {questionLog.length > 0 && (
            <div className="mt-6 rounded-xl border border-border bg-background p-4 text-left">
              <h3 className="mb-3 text-sm font-semibold">Question breakdown</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {questionLog.map((log, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {log.correct
                      ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                      : <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />}
                    <span className="truncate text-muted-foreground flex-1">{log.question}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {log.xp > 0 && <span className="text-xs text-violet-400">+{log.xp}xp</span>}
                      {log.coins > 0 && <span className="text-xs text-amber-500">+{log.coins}c</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button onClick={() => { setPhase("setup"); setSelectedOption(null); setTextInput(""); setAnswerState("unanswered"); }}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <RotateCcw className="h-4 w-4" /> Play Again
            </button>
            <Link href="/dashboard"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-border px-6 text-sm font-medium hover:bg-accent">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ═══ ACTIVE / FEEDBACK ═══
  if (!currentItem) { setPhase("finished"); return null; }
  const isBrainTask = currentItem.kind === "brain_task";
  const isPremiumPreview = currentItem.kind === "premium_preview";
  const category = !isBrainTask && !isPremiumPreview && currentTrivia ? CATEGORIES.find(c => c.id === currentTrivia.category) : null;
  const progress = sessionItems.length > 0 ? (currentIndex + 1) / sessionItems.length : 0;
  const timePercent = duration > 0 ? (timeLeft / duration) * 100 : 0;
  const isUrgent = timeLeft <= 10;
  const qTimePercent = !isBrainTask && currentTrivia ? (currentTrivia.difficulty === "beginner" ? 20 : currentTrivia.difficulty === "intermediate" ? 25 : 30) : 25;
  const qTimeVisual = (questionTimeLeft / qTimePercent) * 100;

  return (
    <div className="mx-auto w-full max-w-lg space-y-3 sm:space-y-4 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between min-w-0">
        <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setPhase("setup"); }}
          aria-label="Back to setup"
          className="min-h-[44px] touch-manipulation text-sm text-muted-foreground hover:text-foreground active:scale-[0.97]">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-1 sm:gap-3 min-w-0">
          {streak >= 2 && (
            <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-1 text-[10px] sm:text-xs font-bold text-orange-500 animate-pulse whitespace-nowrap">
              <Flame className="h-3 w-3" /> {streak}x
            </div>
          )}
          <div className={`flex items-center gap-1 rounded-full px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-bold whitespace-nowrap ${isUrgent ? "bg-red-500/10 text-red-500" : "bg-muted"}`}>
            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="text-[10px] sm:text-xs text-muted-foreground font-medium whitespace-nowrap">
          {currentIndex + 1}/{sessionItems.length}
        </div>
      </div>

      {/* Time bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full transition-all duration-1000 ${isUrgent ? "bg-red-500" : "bg-primary"}`}
          style={{ width: `${timePercent}%` }} />
      </div>

      {/* Question timer */}
      {answerState === "unanswered" && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div className={`h-full rounded-full transition-all duration-1000 ${
            qTimeVisual < 30 ? "bg-red-500" : qTimeVisual < 60 ? "bg-yellow-500" : "bg-green-500"
          }`} style={{ width: `${qTimeVisual}%` }} />
        </div>
      )}

      {/* Progress */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${progress * 100}%` }} />
      </div>

      {/* Question card, Brain Task, or Premium Preview */}
      {isBrainTask ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden p-4 sm:p-5">
          <BrainTaskPlayer
            key={`bt-${currentIndex}`}
            task={currentItem.task}
            onComplete={handleBrainTaskComplete}
          />
          {brainTaskPhase === "done" && (
            <button onClick={nextQuestion}
              className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl active:scale-[0.98]">
              {currentIndex < sessionItems.length - 1 ? "Next Challenge →" : "See Results 🎉"}
            </button>
          )}
        </div>
      ) : isPremiumPreview ? (
        <div className="rounded-2xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-500/5 via-card to-orange-500/5 overflow-hidden">
          {/* Premium badge */}
          <div className="flex items-center justify-between border-b border-amber-400/20 px-5 py-3 bg-amber-500/5">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">{currentItem.scenario.title}</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Sparkles className="h-3 w-3" /> Premium
            </span>
          </div>

          <div className="p-4 sm:p-5 space-y-4">
            {/* Scenario */}
            <p className="text-base sm:text-lg font-bold leading-relaxed text-balance">{currentItem.scenario.scenario}</p>

            {isPremium ? (
              <>
                {/* Premium users: answer normally */}
                <div className="space-y-2">
                  {currentItem.scenario.options.map((opt, i) => {
                    const isSelected = selectedOption === opt;
                    const isCorrectOpt = answerState !== "unanswered" && opt === currentItem.scenario.correctAnswer;
                    const isWrongSelected = answerState === "wrong" && isSelected && opt !== currentItem.scenario.correctAnswer;
                    return (
                      <button key={i} onClick={() => { if (answerState === "unanswered") setSelectedOption(opt); }}
                        disabled={answerState !== "unanswered"}
                        className={`min-h-[52px] touch-manipulation w-full rounded-xl border p-4 text-left text-sm font-medium transition-all active:scale-[0.97] ${
                          isCorrectOpt ? "border-green-500 bg-green-500/10 text-green-500"
                          : isWrongSelected ? "border-red-500 bg-red-500/10 text-red-500"
                          : isSelected ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-muted-foreground/50 hover:bg-muted/50"
                        }`}>
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current/20 text-xs font-bold">
                            {String.fromCharCode(65 + i)}
                          </span>
                          {opt}
                          {isCorrectOpt && <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />}
                          {isWrongSelected && <XCircle className="ml-auto h-4 w-4 text-red-500" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {answerState !== "unanswered" && (
                  <div className={`rounded-xl p-4 border ${answerState === "correct" ? "bg-green-500/5 border-green-500/10" : "bg-red-500/5 border-red-500/10"}`}>
                    <p className="text-sm font-semibold mb-1">
                      {answerState === "correct" ? getCorrectReaction(quizLang) : getWrongReaction(quizLang)}
                    </p>
                    <p className="text-sm text-muted-foreground">{currentItem.scenario.explanation}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Free users: show teaser + upgrade CTA */}
                <div className="relative">
                  <div className="space-y-2 opacity-40 blur-[2px] pointer-events-none select-none">
                    {currentItem.scenario.options.map((opt, i) => (
                      <div key={i} className="w-full rounded-xl border border-border p-4 text-left text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current/20 text-xs font-bold">
                            {String.fromCharCode(65 + i)}
                          </span>
                          {opt}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-xl bg-card/95 backdrop-blur-sm border border-amber-400/30 p-6 text-center max-w-xs shadow-xl">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                        <Lock className="h-6 w-6 text-amber-500" />
                      </div>
                      <p className="text-sm font-bold mb-1">Premium Question</p>
                      <p className="text-xs text-muted-foreground mb-3">
                        {currentItem.scenario.featureIcon} {currentItem.scenario.featureDescription}
                      </p>
                      <Link href="/dashboard/settings"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl active:scale-[0.98]">
                        <Crown className="h-3 w-3" /> Unlock Premium — ₦3,500/mo
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Skip button for free users */}
                <button onClick={handlePremiumSkip}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border px-6 text-sm font-medium hover:bg-accent transition-all">
                  {currentIndex < sessionItems.length - 1 ? "Skip — Next Challenge →" : "Skip — See Results 🎉"}
                </button>
              </>
            )}
          </div>
        </div>
      ) : currentTrivia ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2 min-w-0">
              {(() => { const Illust = CATEGORY_ILLUSTRATIONS[currentTrivia.category]; return Illust ? <Illust className="h-4 w-4 sm:h-5 sm:w-5" /> : <span className="text-base sm:text-lg">{CAT_EMOJI[currentTrivia.category] || "🧠"}</span>; })()}
              <span className="text-xs sm:text-sm text-muted-foreground truncate">{category?.label}</span>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-medium capitalize ${
              currentTrivia.difficulty === "beginner" ? "text-green-500 bg-green-500/10"
                : currentTrivia.difficulty === "intermediate" ? "text-yellow-500 bg-yellow-500/10"
                : "text-red-500 bg-red-500/10"
            }`}>{currentTrivia.difficulty}</span>
          </div>

          <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
            <h2 className="text-base sm:text-lg font-bold leading-relaxed text-balance">{currentTrivia.question}</h2>

            {currentTrivia.type === "multiple-choice" && currentTrivia.options && (
              <div className="space-y-2 sm:space-y-3">
                {currentTrivia.options.map((opt, i) => {
                  const isSelected = selectedOption === opt;
                  const isCorrectOpt = answerState !== "unanswered" && opt === currentTrivia.correctAnswer;
                  const isWrongSelected = answerState === "wrong" && isSelected && opt !== currentTrivia.correctAnswer;
                  return (
                    <button key={i} onClick={() => { if (answerState === "unanswered") setSelectedOption(opt); }}
                      disabled={answerState !== "unanswered"}
                      className={`min-h-[52px] touch-manipulation w-full rounded-xl border p-4 text-left text-sm font-medium transition-all active:scale-[0.97] ${
                        isCorrectOpt
                          ? "border-green-500 bg-green-500/10 text-green-500"
                          : isWrongSelected
                          ? "border-red-500 bg-red-500/10 text-red-500"
                          : isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-muted-foreground/50 hover:bg-muted/50"
                      }`}>
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current/20 text-xs font-bold">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="flex-1 min-w-0">{opt}</span>
                        {isCorrectOpt && <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-green-500" />}
                        {isWrongSelected && <XCircle className="ml-auto h-4 w-4 shrink-0 text-red-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {currentTrivia.type === "text-input" && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input ref={inputRef} type="text" value={textInput}
                    onChange={e => setTextInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && textInput.trim() && answerState === "unanswered") handleSubmit(); }}
                    disabled={answerState !== "unanswered"}
                    placeholder="Type your answer here..."
                    className="min-h-[48px] flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50" />
                  {answerState === "unanswered" && (
                    <button onClick={() => handleSubmit()} disabled={!textInput.trim()}
                      className="min-h-[48px] touch-manipulation inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary px-4 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 active:scale-[0.97]">
                      <Send className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {answerState !== "unanswered" && (
                  <p className={`text-sm font-medium ${answerState === "correct" ? "text-green-500" : "text-red-500"}`}>
                    Correct answer: <span className="font-bold">{currentTrivia.correctAnswer}</span>
                  </p>
                )}
              </div>
            )}

            {currentTrivia.hint && answerState === "unanswered" && (
              <div>
                {!showHint ? (
                  <button onClick={() => setShowHint(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                    <Lightbulb className="h-3 w-3" /> Need a hint? (-2 XP)
                  </button>
                ) : (
                  <div className="rounded-lg bg-yellow-500/5 border border-yellow-500/10 p-3">
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">💡 {currentTrivia.hint}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 rounded-lg bg-violet-500/10 px-2.5 py-1.5 sm:px-3">
                <Trophy className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-violet-400" />
                <span className="text-[11px] sm:text-xs font-bold text-violet-400">+{currentTrivia.xp + (streak > 0 ? streak * 3 : 0)} XP</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1.5 sm:px-3">
                <Coins className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500" />
                <span className="text-[11px] sm:text-xs font-bold text-amber-500">+{currentTrivia.coins} coins</span>
              </div>
            </div>

            {answerState !== "unanswered" && (
              <div className={`rounded-xl p-4 border ${
                answerState === "correct"
                  ? "bg-green-500/5 border-green-500/10"
                  : "bg-red-500/5 border-red-500/10"
              }`}>
                <p className="text-sm font-semibold mb-1">
                  {answerState === "correct"
                    ? getCorrectReaction(quizLang)
                    : getWrongReaction(quizLang)}
                </p>
                <p className="text-sm text-muted-foreground">{currentTrivia.explanation}</p>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Actions — trivia and premium only */}
      {!isBrainTask && !isPremiumPreview && currentTrivia && (
        <div className="flex gap-2 sm:gap-3">
          {answerState === "unanswered" ? (
            <button onClick={() => handleSubmit()}
              disabled={currentTrivia.type === "multiple-choice" ? !selectedOption : !textInput.trim()}
              className="touch-manipulation inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-green-500/25 transition-all hover:shadow-xl active:scale-[0.97] disabled:opacity-50">
              Submit Answer
            </button>
          ) : (
            <button onClick={nextQuestion}
              className="touch-manipulation inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl active:scale-[0.97]">
              {currentIndex < sessionItems.length - 1 ? "Next Challenge →" : "See Results 🎉"}
            </button>
          )}
        </div>
      )}

      {/* Actions — premium preview (premium users only) */}
      {isPremiumPreview && isPremium && (
        <div className="flex gap-2 sm:gap-3">
          {answerState === "unanswered" ? (
            <button onClick={() => handlePremiumAnswer(selectedOption || "")}
              disabled={!selectedOption}
              className="touch-manipulation inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 text-sm font-bold text-white shadow-lg shadow-green-500/25 transition-all hover:shadow-xl active:scale-[0.97] disabled:opacity-50">
              <Crown className="h-4 w-4" /> Submit Premium Answer
            </button>
          ) : (
            <button onClick={nextQuestion}
              className="touch-manipulation inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:shadow-xl active:scale-[0.97]">
              {currentIndex < sessionItems.length - 1 ? "Next Challenge →" : "See Results 🎉"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
