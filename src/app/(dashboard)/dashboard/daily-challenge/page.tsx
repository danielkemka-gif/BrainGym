"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  ALL_GAMES,
  calculateStars,
  getXpForStars,
  getCoinsForStars,
  type GameConfig,
} from "@/lib/games/config";
import { GAME_ICONS } from "@/lib/icons";
import { GAME_ILLUSTRATIONS } from "@/components/brain-illustrations";
import {
  ArrowLeft,
  Trophy,
  Zap,
  TrendingUp,
  Crown,
  Medal,
  Flame,
} from "lucide-react";
import { Confetti } from "@/components/ui/confetti";
import { motion, AnimatePresence } from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────

const GAME_IDS = [
  "memory_match",
  "number_sequence",
  "word_scramble",
  "reaction_speed",
  "color_match",
] as const;

type Phase = "intro" | "playing" | "results" | "leaderboard";

interface GameResult {
  game_id: string;
  score: number;
  stars: number;
}

interface LeaderboardEntry {
  user_id: string;
  name: string | null;
  avatar_url: string | null;
  brain_age: number;
  total_score: number;
  rank: number;
}

// ─── Seeded Shuffle ───────────────────────────────────────────────────────

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getTodayGames(): GameConfig[] {
  const seed = simpleHash(getTodayString());
  const shuffled = seededShuffle([...GAME_IDS], seed);
  const picked = shuffled.slice(0, 3);
  return picked
    .map((id) => ALL_GAMES.find((g) => g.id === id))
    .filter(Boolean) as GameConfig[];
}

// ─── Brain Age Calculation ────────────────────────────────────────────────

function calculateBrainAge(totalScore: number): number {
  if (totalScore >= 3000) return 18;
  if (totalScore >= 2800) return 20;
  if (totalScore >= 2600) return 22;
  if (totalScore >= 2400) return 24;
  if (totalScore >= 2200) return 26;
  if (totalScore >= 2000) return 28;
  if (totalScore >= 1800) return 30;
  if (totalScore >= 1600) return 32;
  if (totalScore >= 1400) return 34;
  if (totalScore >= 1200) return 36;
  if (totalScore >= 1000) return 40;
  if (totalScore >= 800) return 44;
  if (totalScore >= 600) return 48;
  if (totalScore >= 400) return 52;
  if (totalScore >= 200) return 56;
  if (totalScore >= 100) return 60;
  return 70;
}

function getBrainAgeColor(age: number): string {
  if (age <= 22) return "text-green-500";
  if (age <= 30) return "text-emerald-500";
  if (age <= 40) return "text-yellow-500";
  if (age <= 50) return "text-orange-500";
  return "text-red-500";
}

function getBrainAgeGradient(age: number): string {
  if (age <= 22) return "from-green-500 to-emerald-600";
  if (age <= 30) return "from-emerald-500 to-teal-600";
  if (age <= 40) return "from-yellow-500 to-amber-600";
  if (age <= 50) return "from-orange-500 to-red-500";
  return "from-red-500 to-rose-600";
}

function getBrainAgeLabel(age: number): string {
  if (age <= 20) return "Exceptional!";
  if (age <= 25) return "Outstanding!";
  if (age <= 30) return "Excellent!";
  if (age <= 35) return "Great!";
  if (age <= 40) return "Good";
  if (age <= 50) return "Keep training!";
  return "Room to grow!";
}

// ─── Mini Game Components ─────────────────────────────────────────────────

function MiniMemoryGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [phase, setPhase] = useState<"preview" | "play" | "done">("preview");
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const EMOJIS = useMemo(() => {
    const pool = ["🧠", "🎯", "💡", "⚡", "🔥", "💎", "🌟", "🎯"];
    const picked = pool.slice(0, 4);
    const pairs = [...picked, ...picked];
    const shuffled = [...pairs].sort(() => Math.random() - 0.5);
    return shuffled.map((emoji, i) => ({ id: i, emoji, flipped: true, matched: false }));
  }, []);

  useEffect(() => {
    setCards(EMOJIS);
    timeoutRef.current = setTimeout(() => {
      setCards((prev) => prev.map((c) => ({ ...c, flipped: false })));
      setPhase("play");
    }, 2500);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [EMOJIS]);

  function handleClick(id: number) {
    if (phase !== "play") return;
    if (flippedIds.length >= 2) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const newFlipped = [...flippedIds, id];
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)));
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts((a) => a + 1);
      const [a, b] = newFlipped;
      const cardA = cards.find((c) => c.id === a)!;
      const cardB = cards.find((c) => c.id === b)!;

      if (cardA.emoji === cardB.emoji) {
        timeoutRef.current = setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === a || c.id === b ? { ...c, matched: true } : c))
          );
          setFlippedIds([]);
          setMatchedPairs((p) => {
            const next = p + 1;
            if (next >= 4) {
              timeoutRef.current = setTimeout(() => {
                setPhase("done");
                const score = Math.max(100, 500 - (attempts + 1) * 30);
                onComplete(score);
              }, 400);
            }
            return next;
          });
        }, 400);
      } else {
        timeoutRef.current = setTimeout(() => {
          setCards((prev) => prev.map((c) => (c.id === a || c.id === b ? { ...c, flipped: false } : c)));
          setFlippedIds([]);
        }, 700);
      }
    }
  }

  return (
    <div className="space-y-3">
      {phase === "preview" && (
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          Memorize the positions...
        </p>
      )}
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleClick(card.id)}
            disabled={phase !== "play" || card.matched}
            className={`aspect-square rounded-xl text-xl font-bold transition-all ${
              card.matched
                ? "bg-green-500/20 border-2 border-green-500/30 scale-95"
                : card.flipped
                ? "bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg"
                : "bg-muted border-2 border-border hover:border-primary/30 hover:shadow-md"
            }`}
          >
            {card.flipped || card.matched ? card.emoji : "?"}
          </button>
        ))}
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {matchedPairs}/4 pairs · {attempts} attempts
      </p>
    </div>
  );
}

function MiniNumberGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [phase, setPhase] = useState<"show" | "input" | "done">("show");
  const [sequence] = useState(() => {
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 10));
  });
  const [userInput, setUserInput] = useState("");
  const [showTimer, setShowTimer] = useState(3000);

  useEffect(() => {
    if (phase !== "show") return;
    const interval = setInterval(() => {
      setShowTimer((t) => {
        if (t <= 100) {
          clearInterval(interval);
          setPhase("input");
          return 0;
        }
        return t - 100;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [phase]);

  function handleSubmit() {
    const correct = sequence.join("") === userInput;
    const score = correct ? 500 : Math.max(0, userInput.split("").filter((c, i) => c === sequence[i]?.toString()).length * 100);
    onComplete(score);
    setPhase("done");
  }

  return (
    <div className="space-y-3">
      {phase === "show" && (
        <div className="text-center">
          <div className="flex justify-center gap-2">
            {sequence.map((num, i) => (
              <div key={i} className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-lg font-bold text-white shadow-lg">
                {num}
              </div>
            ))}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-100"
              style={{ width: `${(showTimer / 3000) * 100}%` }}
            />
          </div>
        </div>
      )}
      {phase === "input" && (
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">Enter the sequence:</p>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.replace(/\D/g, "").slice(0, 5))}
            onKeyDown={(e) => { if (e.key === "Enter" && userInput.length === 5) handleSubmit(); }}
            autoFocus
            maxLength={5}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-lg font-mono tracking-[0.5em] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="?????"
          />
          <button
            onClick={handleSubmit}
            disabled={userInput.length !== 5}
            className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 px-4 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

function MiniWordGame({ onComplete }: { onComplete: (score: number) => void }) {
  const WORDS = useMemo(() => ["brain", "focus", "smart", "think", "learn", "quick", "sharp", "logic"], []);
  const [target] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [scrambled] = useState(() => target.split("").sort(() => Math.random() - 0.5).join(""));
  const [guess, setGuess] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit() {
    setDone(true);
    const correct = guess.toLowerCase() === target.toLowerCase();
    const score = correct ? 500 : Math.max(0, guess.toLowerCase().split("").filter((c, i) => c === target[i]).length * 100);
    onComplete(score);
  }

  if (done) {
    return (
      <div className="text-center">
        <p className={`text-sm font-medium ${guess.toLowerCase() === target.toLowerCase() ? "text-green-500" : "text-red-500"}`}>
          {guess.toLowerCase() === target.toLowerCase() ? "Correct!" : `The word was: ${target}`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-xs text-muted-foreground mb-1">Unscramble this word:</p>
        <p className="text-2xl font-bold tracking-[0.3em] text-primary">{scrambled.toUpperCase()}</p>
      </div>
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && guess.trim()) handleSubmit(); }}
        autoFocus
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder="Type the word..."
      />
      <button
        onClick={handleSubmit}
        disabled={!guess.trim()}
        className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
      >
        Submit
      </button>
    </div>
  );
}

function MiniReactionGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [phase, setPhase] = useState<"waiting" | "ready" | "go" | "done">("waiting");
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  function startRound() {
    setPhase("ready");
    const delay = 1000 + Math.random() * 2000;
    timeoutRef.current = setTimeout(() => {
      setPhase("go");
      setStartTime(performance.now());
    }, delay);
  }

  function handleTap() {
    if (phase === "waiting") {
      startRound();
      return;
    }
    if (phase === "ready") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setPhase("done");
      onComplete(0);
      return;
    }
    if (phase === "go") {
      const rt = Math.round(performance.now() - startTime);
      const newTimes = [...times, rt];
      setTimes(newTimes);
      setReactionTime(rt);
      const nextRound = round + 1;
      setRound(nextRound);

      if (nextRound >= 3) {
        const avg = Math.round(newTimes.reduce((a, b) => a + b, 0) / newTimes.length);
        const score = avg < 200 ? 500 : avg < 300 ? 400 : avg < 400 ? 300 : avg < 600 ? 200 : 100;
        setPhase("done");
        onComplete(score);
      } else {
        setPhase("waiting");
      }
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-muted-foreground">
        Round {Math.min(round + 1, 3)}/3 · Tap when the screen turns green!
      </p>
      <button
        onClick={handleTap}
        className={`w-full h-24 rounded-xl text-lg font-bold transition-all ${
          phase === "waiting"
            ? "bg-muted text-muted-foreground"
            : phase === "ready"
            ? "bg-red-500 text-white animate-pulse"
            : phase === "go"
            ? "bg-green-500 text-white scale-105 shadow-lg shadow-green-500/30"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {phase === "waiting" && "Tap to start"}
        {phase === "ready" && "Wait..."}
        {phase === "go" && "TAP NOW!"}
        {phase === "done" && (reactionTime > 0 ? `${reactionTime}ms` : "Too early!")}
      </button>
      {times.length > 0 && (
        <div className="flex justify-center gap-2">
          {times.map((t, i) => (
            <span key={i} className="text-xs text-muted-foreground">R{i + 1}: {t}ms</span>
          ))}
        </div>
      )}
    </div>
  );
}

function MiniColorGame({ onComplete }: { onComplete: (score: number) => void }) {
  const COLORS = ["red", "blue", "green", "yellow", "purple", "orange"];
  const COLOR_HEX: Record<string, string> = {
    red: "#ef4444",
    blue: "#3b82f6",
    green: "#22c55e",
    yellow: "#eab308",
    purple: "#a855f7",
    orange: "#f97316",
  };

  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const [options, setOptions] = useState<string[]>([]);

  const totalRounds = 5;

  const generateRound = useCallback(() => {
    const wordIdx = Math.floor(Math.random() * COLORS.length);
    const colorIdx = Math.floor(Math.random() * COLORS.length);
    const word = COLORS[wordIdx];
    const color = COLORS[colorIdx];
    setCurrentWord(word);
    setCurrentColor(color);

    const correctOption = color;
    const wrongOptions = COLORS.filter((c) => c !== color);
    const shuffled = [...wrongOptions].sort(() => Math.random() - 0.5).slice(0, 2);
    const opts = [correctOption, ...shuffled].sort(() => Math.random() - 0.5);
    setOptions(opts);
  }, []);

  useEffect(() => { generateRound(); }, [generateRound]);

  function handleChoice(choice: string) {
    const isCorrect = choice === currentColor;
    const nextRound = round + 1;

    if (isCorrect) setCorrect((c) => c + 1);
    setRound(nextRound);

    if (nextRound >= totalRounds) {
      const finalCorrect = isCorrect ? correct + 1 : correct;
      const score = Math.round((finalCorrect / totalRounds) * 500);
      onComplete(score);
    } else {
      generateRound();
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-sm text-muted-foreground">
        Round {Math.min(round + 1, totalRounds)}/{totalRounds} · Pick the COLOR, not the word!
      </p>
      <div className="text-center">
        <p className="text-3xl font-bold" style={{ color: COLOR_HEX[currentColor] }}>
          {currentWord.toUpperCase()}
        </p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleChoice(opt)}
            className="h-12 rounded-xl font-bold text-sm capitalize transition-all hover:scale-105 hover:shadow-md"
            style={{ backgroundColor: COLOR_HEX[opt], color: "white" }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────

export default function DailyChallengePage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [existingResult, setExistingResult] = useState<{
    brain_age: number;
    total_score: number;
  } | null>(null);

  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);

  const [brainAge, setBrainAge] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<LeaderboardEntry | null>(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  const todayGames = useMemo(() => getTodayGames(), []);
  const todayStr = useMemo(() => getTodayString(), []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setLoading(false);
        return;
      }
      setUserId(data.user.id);

      const { data: streakData } = await supabase
        .from("streaks")
        .select("current_streak")
        .eq("user_id", data.user.id)
        .single();
      if (streakData) setStreak(streakData.current_streak);

      const { data: existing } = await supabase
        .from("daily_challenge_scores")
        .select("brain_age, total_score")
        .eq("user_id", data.user.id)
        .eq("challenge_date", todayStr)
        .eq("completed", true)
        .single();

      if (existing) {
        setAlreadyCompleted(true);
        setExistingResult(existing);
      }

      setLoading(false);
    });
  }, [todayStr]);

  async function loadLeaderboard() {
    setLeaderboardLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("daily_challenge_scores")
      .select("user_id, brain_age, total_score, completed")
      .eq("challenge_date", todayStr)
      .eq("completed", true)
      .order("total_score", { ascending: false })
      .limit(50);

    if (!data) {
      setLeaderboardLoading(false);
      return;
    }

    const userIds = [...new Set(data.map((d) => d.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, name, avatar_url")
      .in("user_id", userIds);

    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.user_id, p])
    );

    const entries: LeaderboardEntry[] = data.map((d, i) => ({
      user_id: d.user_id,
      name: profileMap.get(d.user_id)?.name ?? "Anonymous",
      avatar_url: profileMap.get(d.user_id)?.avatar_url ?? null,
      brain_age: d.brain_age,
      total_score: d.total_score,
      rank: i + 1,
    }));

    setLeaderboard(entries);

    if (userId) {
      const me = entries.find((e) => e.user_id === userId);
      setMyRank(me ?? null);
    }

    setLeaderboardLoading(false);
  }

  function handleGameComplete(score: number) {
    const game = todayGames[currentGameIndex];
    const levelConfig = game.levels[3];
    const stars = calculateStars(score, levelConfig);
    const result: GameResult = {
      game_id: game.id,
      score,
      stars,
    };

    const newResults = [...gameResults, result];
    setGameResults(newResults);

    if (currentGameIndex < todayGames.length - 1) {
      setCurrentGameIndex((i) => i + 1);
    } else {
      const total = newResults.reduce((sum, r) => sum + r.score, 0);
      const age = calculateBrainAge(total);
      setTotalScore(total);
      setBrainAge(age);
      setShowConfetti(true);
      setPhase("results");

      if (userId) {
        const supabase = createClient();
        supabase.from("daily_challenge_scores").upsert(
          {
            user_id: userId,
            challenge_date: todayStr,
            game_1_id: newResults[0]?.game_id,
            game_1_score: newResults[0]?.score ?? 0,
            game_1_stars: newResults[0]?.stars ?? 0,
            game_2_id: newResults[1]?.game_id,
            game_2_score: newResults[1]?.score ?? 0,
            game_2_stars: newResults[1]?.stars ?? 0,
            game_3_id: newResults[2]?.game_id,
            game_3_score: newResults[2]?.score ?? 0,
            game_3_stars: newResults[2]?.stars ?? 0,
            total_score: total,
            brain_age: age,
            completed: true,
            completed_at: new Date().toISOString(),
          },
          { onConflict: "user_id,challenge_date" }
        );

        const xp = 50 + streak * 5;
        if (xp > 0) {
          supabase.from("xp_ledger").insert({
            user_id: userId,
            amount: xp,
            reason: "daily_challenge_complete",
            reference_type: "challenge",
          });
        }
      }
    }
  }

  const miniGameComponents: Record<string, React.FC<{ onComplete: (score: number) => void }>> = {
    memory_match: MiniMemoryGame,
    number_sequence: MiniNumberGame,
    word_scramble: MiniWordGame,
    reaction_speed: MiniReactionGame,
    color_match: MiniColorGame,
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  // ─── Intro Phase ──────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <Link
          href="/dashboard/games"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Games
        </Link>

        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-4xl shadow-lg shadow-violet-500/20">
            ⚡
          </div>
          <h1 className="text-2xl font-bold">Daily Brain Age Challenge</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Play 3 quick brain games and discover your Brain Age for today.
            Compete on the leaderboard!
          </p>

          {streak > 0 && (
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1.5 text-sm font-bold text-orange-500">
              <Flame className="h-4 w-4" />
              {streak} day streak!
            </div>
          )}

          {alreadyCompleted && existingResult && (
            <div className="mt-4 rounded-xl border border-border bg-background p-4">
              <p className="text-xs text-muted-foreground">Today&apos;s Brain Age</p>
              <p className={`text-3xl font-bold ${getBrainAgeColor(existingResult.brain_age)}`}>
                {existingResult.brain_age}
              </p>
              <p className="text-xs text-muted-foreground">
                Score: {existingResult.total_score.toLocaleString()}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setPhase("leaderboard")}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border px-4 text-sm font-medium hover:bg-accent"
                >
                  <Trophy className="h-3.5 w-3.5" /> Leaderboard
                </button>
                <Link
                  href="/dashboard"
                  className="inline-flex h-9 flex-1 items-center justify-center rounded-xl border border-border px-4 text-sm font-medium hover:bg-accent"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Today&apos;s Games</h3>
          {todayGames.map((game, i) => {
            const Illust = GAME_ILLUSTRATIONS[game.iconKey];
            const Icon = GAME_ICONS[game.iconKey];
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${game.gradient} text-white overflow-hidden`}>
                  {Illust ? <Illust className="h-9 w-9" /> : Icon ? <Icon className="h-6 w-6" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{game.title}</p>
                  <p className="text-xs text-muted-foreground">{game.description}</p>
                </div>
                <span className="text-xs font-bold text-muted-foreground">
                  Game {i + 1}
                </span>
              </motion.div>
            );
          })}
        </div>

        {!alreadyCompleted && (
          <button
            onClick={() => setPhase("playing")}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-6 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 active:scale-[0.98]"
          >
            <Zap className="h-4 w-4" />
            Start Challenge
          </button>
        )}
      </div>
    );
  }

  // ─── Playing Phase ────────────────────────────────────────────────────
  if (phase === "playing") {
    const game = todayGames[currentGameIndex];
    const MiniGame = game ? miniGameComponents[game.id] : null;
    const Illust = game ? GAME_ILLUSTRATIONS[game.iconKey] : null;
    const Icon = game ? GAME_ICONS[game.iconKey] : null;
    const progress = ((currentGameIndex) / todayGames.length) * 100;

    return (
      <div className="mx-auto max-w-lg space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (currentGameIndex > 0) {
                setCurrentGameIndex((i) => i - 1);
                setGameResults((r) => r.slice(0, -1));
              } else {
                setPhase("intro");
              }
            }}
            className="rounded-lg p-2 hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-primary">
              Game {currentGameIndex + 1}/3
            </span>
          </div>
          <div className="text-sm font-bold text-muted-foreground">
            {gameResults.reduce((s, r) => s + r.score, 0)}
          </div>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {game && (
          <motion.div
            key={currentGameIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="mb-4 flex items-center gap-3">
              {(Illust || Icon) && (
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${game.gradient} text-white overflow-hidden`}>
                  {Illust ? <Illust className="h-8 w-8" /> : Icon ? <Icon className="h-5 w-5" /> : null}
                </div>
              )}
              <div>
                <h2 className="font-bold">{game.title}</h2>
                <p className="text-xs text-muted-foreground">{game.description}</p>
              </div>
            </div>

            {MiniGame && <MiniGame onComplete={handleGameComplete} />}
          </motion.div>
        )}

        <div className="flex gap-2">
          {gameResults.map((r, i) => (
            <div key={i} className="flex-1 rounded-xl border border-border bg-card p-2 text-center">
              <p className="text-[10px] text-muted-foreground">
                {todayGames[i]?.title?.split(" ")[0]}
              </p>
              <p className="text-sm font-bold">{r.score}</p>
              <div className="mt-0.5 flex justify-center gap-0.5">
                {[1, 2, 3].map((s) => (
                  <span key={s} className={`text-[8px] ${s <= r.stars ? "text-amber-400" : "text-muted-foreground/30"}`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
          {Array.from({ length: Math.max(0, 3 - gameResults.length) }, (_, i) => (
            <div key={`empty-${i}`} className="flex-1 rounded-xl border border-dashed border-border p-2 text-center">
              <p className="text-[10px] text-muted-foreground/50">Game {gameResults.length + i + 1}</p>
              <p className="text-sm font-bold text-muted-foreground/30">—</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Results Phase ────────────────────────────────────────────────────
  if (phase === "results") {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <Confetti active={showConfetti} duration={5000} />

        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <div className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${getBrainAgeGradient(brainAge)} text-white text-4xl font-bold shadow-lg`}>
              {brainAge}
            </div>
          </motion.div>

          <h2 className="text-2xl font-bold">Your Brain Age</h2>
          <p className={`text-sm font-semibold ${getBrainAgeColor(brainAge)}`}>
            {getBrainAgeLabel(brainAge)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Lower is better · Biological age baseline
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-primary/10 p-4">
              <div className="flex items-center justify-center gap-1">
                <Trophy className="h-4 w-4 text-violet-400" />
                <p className="text-2xl font-bold text-violet-400">{totalScore.toLocaleString()}</p>
              </div>
              <p className="text-xs text-muted-foreground">Total Score</p>
            </div>
            <div className="rounded-xl bg-orange-500/10 p-4">
              <div className="flex items-center justify-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" />
                <p className="text-2xl font-bold text-orange-500">{streak}</p>
              </div>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </div>

          {streak >= 3 && (
            <div className="mt-3 rounded-xl border border-orange-500/10 bg-orange-500/5 p-3">
              <p className="text-xs font-medium text-orange-500">
                <Zap className="mr-1 inline h-3 w-3" />
                Streak Bonus: +{50 + streak * 5} XP
              </p>
            </div>
          )}

          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-semibold text-left">Game Breakdown</h3>
            {gameResults.map((result, i) => {
              const game = todayGames[i];
              if (!game) return null;
              const Illust = GAME_ILLUSTRATIONS[game.iconKey];
              const Icon = GAME_ICONS[game.iconKey];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                >
                  <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${game.gradient} text-white overflow-hidden`}>
                    {Illust ? <Illust className="h-6 w-6" /> : Icon ? <Icon className="h-4 w-4" /> : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{game.title}</p>
                    <p className="text-xs text-muted-foreground">{result.score} pts</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <span key={s} className={`text-sm ${s <= result.stars ? "text-amber-400" : "text-muted-foreground/30"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => { loadLeaderboard(); setPhase("leaderboard"); }}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-6 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl active:scale-[0.98]"
            >
              <Trophy className="h-4 w-4" /> Leaderboard
            </button>
            <Link
              href="/dashboard"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-border px-6 text-sm font-medium hover:bg-accent"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Leaderboard Phase ────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPhase("results")}
          className="rounded-lg p-2 hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Daily Leaderboard</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <Crown className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Top Performers</p>
            <p className="text-xs text-muted-foreground">
              Today&apos;s brain challenge rankings
            </p>
          </div>
        </div>
      </div>

      {leaderboardLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <Medal className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">
            No entries yet today. Be the first!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry) => {
            const isMe = userId && entry.user_id === userId;
            const rankEmoji =
              entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : null;

            return (
              <motion.div
                key={entry.user_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: entry.rank * 0.03 }}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                  isMe
                    ? "border-primary/30 bg-primary/5"
                    : "border-border"
                }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {rankEmoji || entry.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">
                    {entry.name}
                    {isMe && <span className="ml-1 text-xs text-primary">(You)</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.total_score.toLocaleString()} pts
                  </p>
                </div>
                <span className={`text-sm font-bold ${getBrainAgeColor(entry.brain_age)}`}>
                  {entry.brain_age}
                </span>
                <span className="text-[10px] text-muted-foreground">age</span>
              </motion.div>
            );
          })}

          {myRank && !leaderboard.find((e) => e.user_id === userId) && (
            <div className="mt-2 flex items-center gap-3 rounded-xl border border-dashed border-border px-4 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
                {myRank.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">
                  {myRank.name} <span className="text-xs text-primary">(You)</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {myRank.total_score.toLocaleString()} pts
                </p>
              </div>
              <span className={`text-sm font-bold ${getBrainAgeColor(myRank.brain_age)}`}>
                {myRank.brain_age}
              </span>
              <span className="text-[10px] text-muted-foreground">age</span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => setPhase("results")}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-border px-6 text-sm font-medium hover:bg-accent"
        >
          Back to Results
        </button>
        <Link
          href="/dashboard"
          className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
