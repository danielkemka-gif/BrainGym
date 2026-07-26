"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import {
  ALL_GAMES,
  MEMORY_MATCH,
  calculateStars,
  getXpForStars,
  getCoinsForStars,
  type GameProgress,
  type LevelState,
} from "@/lib/games/config";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Play, Lock, Star, Trophy, Zap } from "lucide-react";
import { GAME_ICONS } from "@/lib/icons";
import { NumberSequenceGame } from "@/components/games/number-sequence";
import { WordScrambleGame } from "@/components/games/word-scramble";
import { ReactionSpeedGame } from "@/components/games/reaction-speed";
import { ColorMatchGame } from "@/components/games/color-match";

const CARD_EMOJIS = [
  "🧠", "🎯", "💡", "🔥", "⭐", "🎮", "🧩", "💎",
  "🚀", "🎲", "🎪", "🎨", "🎵", "🌟", "💪", "🦾",
  "🦊", "🦋", "🌸", "🍀",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

export default function MemoryMatchPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const gameId = params.gameId as string;
  const game = ALL_GAMES.find((g) => g.id === gameId);

  const [userId, setUserId] = useState<string | null>(null);
  const [progress, setProgress] = useState<GameProgress[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [phase, setPhase] = useState<"select" | "play" | "result">("select");

  // Game state
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [combo, setCombo] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Result
  const [resultStars, setResultStars] = useState(0);
  const [resultXp, setResultXp] = useState(0);
  const [resultCoins, setResultCoins] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load user + progress
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      setUserId(data.user.id);
      supabase
        .from("game_progress")
        .select("user_id, game_id, level_number, stars, score, best_time_ms, completed_at")
        .eq("user_id", data.user.id)
        .eq("game_id", gameId)
        .then(({ data }) => setProgress(data || []));
    });
  }, [gameId]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function getLevelState(levelNum: number): LevelState {
    const p = progress.find((pr) => pr.level_number === levelNum);
    const unlocked = levelNum === 1 || progress.some((pr) => pr.level_number === levelNum - 1 && pr.stars > 0);
    return {
      unlocked,
      completed: !!p && p.stars > 0,
      stars: p?.stars || 0,
      bestScore: p?.score || 0,
      bestTime: p?.best_time_ms || null,
    };
  }

  function startLevel(levelNum: number) {
    const config = game?.levels[levelNum - 1];
    if (!config) return;

    const pairs = config.params.pairs as number;
    const gridCols = config.params.gridCols as number;
    const emojis = shuffle(CARD_EMOJIS).slice(0, pairs);
    const deck = shuffle([...emojis, ...emojis].map((emoji, i) => ({
      id: i,
      emoji,
      flipped: false,
      matched: false,
    })));

    setCards(deck);
    setFlippedIds([]);
    setScore(0);
    setMoves(0);
    setCombo(0);
    setMatchedPairs(0);
    setGameOver(false);
    setTimeLeft(Math.floor(config.timeLimitMs / 1000));
    setSelectedLevel(levelNum);
    setPhase("play");
    setTimerRunning(true);
  }

  // Timer
  useEffect(() => {
    if (!timerRunning || phase !== "play") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setTimerRunning(false);
          endGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerRunning, phase]);

  // Check match
  useEffect(() => {
    if (flippedIds.length !== 2) return;
    const [a, b] = flippedIds;
    const cardA = cards[a];
    const cardB = cards[b];

    if (cardA.emoji === cardB.emoji) {
      // Match!
      const newCombo = combo + 1;
      const bonus = Math.floor(newCombo / 3) * 25;
      const points = 50 + bonus;

      timeoutRef.current = setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === a || c.id === b ? { ...c, matched: true } : c
          )
        );
        setScore((s) => s + points);
        setCombo(newCombo);
        setMatchedPairs((p) => p + 1);
        setFlippedIds([]);

        // Check win
        const config = game?.levels[(selectedLevel || 1) - 1];
        if (config && matchedPairs + 1 >= (config.params.pairs as number)) {
          endGame(true);
        }
      }, 500);
    } else {
      // No match
      setCombo(0);
      timeoutRef.current = setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === a || c.id === b ? { ...c, flipped: false } : c
          )
        );
        setFlippedIds([]);
      }, 800);
    }
    setMoves((m) => m + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flippedIds]);

  function handleCardClick(id: number) {
    if (flippedIds.length >= 2) return;
    if (cards[id].flipped || cards[id].matched) return;
    if (gameOver) return;

    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)));
    setFlippedIds((prev) => [...prev, id]);
  }

  async function endGame(won: boolean) {
    setTimerRunning(false);
    setGameOver(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const config = game?.levels[(selectedLevel || 1) - 1];
    if (!config || !userId) {
      setPhase("result");
      return;
    }

    const finalScore = won ? score + Math.floor(timeLeft * 5) : score;
    const stars = won ? calculateStars(finalScore, config) : 0;
    const xp = getXpForStars(stars, selectedLevel || 1);
    const coins = getCoinsForStars(stars, selectedLevel || 1);

    setResultStars(stars);
    setResultXp(xp);
    setResultCoins(coins);

    // Save progress
    const supabase = createClient();
    const existing = progress.find((p) => p.level_number === selectedLevel);
    if (!existing || stars > existing.stars || finalScore > existing.score) {
      await supabase.from("game_progress").upsert({
        user_id: userId,
        game_id: gameId,
        level_number: selectedLevel,
        stars: Math.max(stars, existing?.stars || 0),
        score: Math.max(finalScore, existing?.score || 0),
        best_time_ms: won ? Math.min(timeLeft * 1000, existing?.best_time_ms || Infinity) : existing?.best_time_ms,
      }, { onConflict: "user_id,game_id,level_number" });

      // Credit XP and coins to main economy
      if (xp > 0) {
        await supabase.from("xp_ledger").insert({
          user_id: userId,
          amount: xp,
          reason: `game_${gameId}_complete`,
          reference_type: "game",
        });
      }
      if (coins > 0) {
        await supabase.from("coins_ledger").insert({
          user_id: userId,
          amount: coins,
          reason: `game_${gameId}_complete`,
          reference_type: "game",
        });
      }

      // Update local progress
      setProgress((prev) => {
        const filtered = prev.filter((p) => p.level_number !== selectedLevel);
        return [...filtered, {
          user_id: userId,
          game_id: gameId,
          level_number: selectedLevel!,
          stars: Math.max(stars, existing?.stars || 0),
          score: Math.max(finalScore, existing?.score || 0),
          best_time_ms: won ? timeLeft * 1000 : null,
          completed_at: new Date().toISOString(),
        }];
      });
    }

    setPhase("result");
  }

  async function endGameWithScore(finalScore: number, stars: number, timeLeftMs: number) {
    setTimerRunning(false);
    setGameOver(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const config = game?.levels[(selectedLevel || 1) - 1];
    if (!config || !userId) {
      setPhase("result");
      return;
    }

    const xp = getXpForStars(stars, selectedLevel || 1);
    const coins = getCoinsForStars(stars, selectedLevel || 1);

    setResultStars(stars);
    setResultXp(xp);
    setResultCoins(coins);
    setScore(finalScore);

    // Save progress
    const supabase = createClient();
    const existing = progress.find((p) => p.level_number === selectedLevel);
    if (!existing || stars > existing.stars || finalScore > existing.score) {
      await supabase.from("game_progress").upsert({
        user_id: userId,
        game_id: gameId,
        level_number: selectedLevel,
        stars: Math.max(stars, existing?.stars || 0),
        score: Math.max(finalScore, existing?.score || 0),
        best_time_ms: timeLeftMs > 0 ? Math.min(timeLeftMs, existing?.best_time_ms || Infinity) : existing?.best_time_ms,
      }, { onConflict: "user_id,game_id,level_number" });

      // Credit XP and coins to main economy
      if (xp > 0) {
        await supabase.from("xp_ledger").insert({
          user_id: userId,
          amount: xp,
          reason: `game_${gameId}_complete`,
          reference_type: "game",
        });
      }
      if (coins > 0) {
        await supabase.from("coins_ledger").insert({
          user_id: userId,
          amount: coins,
          reason: `game_${gameId}_complete`,
          reference_type: "game",
        });
      }

      setProgress((prev) => {
        const filtered = prev.filter((p) => p.level_number !== selectedLevel);
        return [...filtered, {
          user_id: userId,
          game_id: gameId,
          level_number: selectedLevel!,
          stars: Math.max(stars, existing?.stars || 0),
          score: Math.max(finalScore, existing?.score || 0),
          best_time_ms: timeLeftMs > 0 ? timeLeftMs : null,
          completed_at: new Date().toISOString(),
        }];
      });
    }

    setPhase("result");
  }

  if (!game) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Game not found</p>
          <Link href="/dashboard/games" className="mt-4 inline-block text-primary hover:underline">
            Back to Games
          </Link>
        </div>
      </div>
    );
  }

  // ─── Route to specialized game component ──────────────────────────────
  const sharedCallbacks = {
    onComplete: (finalScore: number, stars: number, timeLeftMs: number) => {
      endGameWithScore(finalScore, stars, timeLeftMs);
    },
    onExit: () => {
      setPhase("select");
      setTimerRunning(false);
    },
  };

  if (gameId === "number_sequence" && phase === "play" && selectedLevel) {
    const config = game.levels[selectedLevel - 1];
    return <NumberSequenceGame level={selectedLevel} config={config} gradient={game.gradient} {...sharedCallbacks} />;
  }
  if (gameId === "word_scramble" && phase === "play" && selectedLevel) {
    const config = game.levels[selectedLevel - 1];
    return <WordScrambleGame level={selectedLevel} config={config} gradient={game.gradient} {...sharedCallbacks} />;
  }
  if (gameId === "reaction_speed" && phase === "play" && selectedLevel) {
    const config = game.levels[selectedLevel - 1];
    return <ReactionSpeedGame level={selectedLevel} config={config} gradient={game.gradient} {...sharedCallbacks} />;
  }
  if (gameId === "color_match" && phase === "play" && selectedLevel) {
    const config = game.levels[selectedLevel - 1];
    return <ColorMatchGame level={selectedLevel} config={config} gradient={game.gradient} {...sharedCallbacks} />;
  }

  const gridCols = selectedLevel
    ? (game.levels[selectedLevel - 1]?.params.gridCols as number) || 4
    : 4;

  // ─── Level Select ──────────────────────────────────────────────────
  if (phase === "select") {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/games" className="rounded-lg p-2 hover:bg-accent min-h-[44px] flex items-center justify-center">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {(() => { const GameIcon = GAME_ICONS[game.iconKey]; return GameIcon ? <GameIcon className="h-7 w-7 text-primary" /> : null; })()} {game.title}
            </h1>
            <p className="text-sm text-muted-foreground">{game.description}</p>
          </div>
        </div>

        <div className="grid gap-3">
          {game.levels.map((level) => {
            const state = getLevelState(level.level);
            return (
              <motion.button
                key={level.level}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: level.level * 0.05 }}
                disabled={!state.unlocked}
                onClick={() => startLevel(level.level)}
                className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                  state.unlocked
                    ? "border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
                    : "border-border/50 bg-muted/30 opacity-50 cursor-not-allowed"
                }`}
              >
                {/* Level number */}
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-lg font-bold ${
                  state.completed
                    ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-500"
                    : state.unlocked
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {state.unlocked ? level.level : <Lock className="h-5 w-5" />}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Level {level.level}</span>
                    <DifficultyBadge d={level.difficulty} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {level.params.pairs ? `${level.params.pairs} pairs` : ""}
                    {level.params.words ? `${level.params.words} words` : ""}
                    {level.params.targets ? `${level.params.targets} targets` : ""}
                    {level.params.rounds ? `${level.params.rounds} rounds` : ""}
                    {" · "}
                    {Math.floor(level.timeLimitMs / 1000)}s
                  </p>
                  {state.bestScore > 0 && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Best: {state.bestScore} pts
                    </p>
                  )}
                </div>

                {/* Stars */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg">
                    {state.stars === 3 ? "⭐⭐⭐" : state.stars === 2 ? "⭐⭐" : state.stars === 1 ? "⭐" : "☆☆☆"}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    +{getXpForStars(3, level.level)} XP
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Play ──────────────────────────────────────────────────────────
  if (phase === "play") {
    const config = game.levels[(selectedLevel || 1) - 1];
    const totalPairs = config?.params.pairs as number;
    const progressPercent = totalPairs > 0 ? (matchedPairs / totalPairs) * 100 : 0;

    return (
      <div className="mx-auto max-w-lg space-y-4">
        {/* HUD */}
        <div className="flex items-center justify-between">
          <button onClick={() => { setPhase("select"); setTimerRunning(false); }}
            className="rounded-lg p-2 hover:bg-accent min-h-[44px] flex items-center justify-center">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            {combo >= 2 && (
              <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-bold text-orange-500 animate-pulse">
                <Zap className="h-3 w-3" /> {combo}x
              </div>
            )}
            <div className={`rounded-full px-3 py-1.5 text-sm font-bold ${
              timeLeft <= 10 ? "bg-red-500/10 text-red-500 animate-pulse" : "bg-muted"
            }`}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </div>
            <div className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
              {score}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${game.gradient}`}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Card grid */}
        <div
          className="grid gap-2 mx-auto"
          style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
        >
          {cards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              whileTap={{ scale: 0.95 }}
              className={`aspect-square rounded-lg sm:rounded-xl text-lg sm:text-2xl font-bold transition-all duration-200 ${
                card.matched
                  ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 scale-95 opacity-70"
                  : card.flipped
                  ? `bg-gradient-to-br ${game.gradient} text-white shadow-lg`
                  : "bg-card border-2 border-border hover:border-primary/30 hover:shadow-md"
              }`}
            >
              {card.flipped || card.matched ? card.emoji : "?"}
            </motion.button>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          {matchedPairs}/{totalPairs} pairs · {moves} moves
        </p>
      </div>
    );
  }

  // ─── Result ────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-md space-y-6 py-8 text-center">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          {resultStars > 0 ? (
            <>
              <div className="mb-4 text-6xl animate-bounce">
                {resultStars === 3 ? "🏆" : resultStars === 2 ? "🎉" : "👏"}
              </div>
              <h2 className="text-2xl font-bold">
                {resultStars === 3 ? "Perfect!" : resultStars === 2 ? "Great Job!" : "Well Done!"}
              </h2>
            </>
          ) : (
            <>
              <div className="mb-4 text-6xl">💪</div>
              <h2 className="text-2xl font-bold">Keep Trying!</h2>
              <p className="text-muted-foreground">You&apos;ll get it next time!</p>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Stars */}
      <div className="flex justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <motion.div
            key={s}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3 + s * 0.2, type: "spring", bounce: 0.6 }}
          >
            <Star
              className={`h-10 w-10 ${
                s <= resultStars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
              }`}
            />
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-muted/50 p-3">
          <p className="text-xl font-bold">{score}</p>
          <p className="text-xs text-muted-foreground">Score</p>
        </div>
        <div className="rounded-xl bg-primary/10 p-3">
          <p className="text-xl font-bold text-primary">+{resultXp}</p>
          <p className="text-xs text-muted-foreground">XP</p>
        </div>
        <div className="rounded-xl bg-amber-500/10 p-3">
          <p className="text-xl font-bold text-amber-500">+{resultCoins}</p>
          <p className="text-xs text-muted-foreground">Coins</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => startLevel(selectedLevel!)}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 min-h-[48px]"
        >
          <RotateCcw className="h-4 w-4" /> Retry
        </button>
        {resultStars > 0 && selectedLevel! < 10 && getLevelState(selectedLevel! + 1).unlocked && (
          <button
            onClick={() => startLevel(selectedLevel! + 1)}
            className={`flex items-center gap-2 rounded-xl bg-gradient-to-r ${game.gradient} px-6 py-3 text-sm font-bold text-white hover:opacity-90 min-h-[48px]`}
          >
            <Play className="h-4 w-4" /> Next Level
          </button>
        )}
        <button
          onClick={() => setPhase("select")}
          className="flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium hover:bg-accent min-h-[48px]"
        >
          Levels
        </button>
      </div>
    </div>
  );
}

function DifficultyBadge({ d }: { d: string }) {
  const colors: Record<string, string> = {
    easy: "bg-green-500/10 text-green-500",
    medium: "bg-yellow-500/10 text-yellow-500",
    hard: "bg-orange-500/10 text-orange-500",
    expert: "bg-red-500/10 text-red-500",
    master: "bg-purple-500/10 text-purple-500",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${colors[d] || colors.easy}`}>
      {d}
    </span>
  );
}
