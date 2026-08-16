"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/lib/i18n";
import {
  ALL_GAMES,
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
import { GameIntro } from "@/components/games/game-intro";
import { Countdown } from "@/components/games/countdown";
import { ErrorBoundary } from "@/components/games/error-boundary";

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

type Phase = "select" | "intro" | "countdown" | "play" | "result";

const SPECIALIZED_GAMES = new Set(["number_sequence", "word_scramble", "reaction_speed", "color_match"]);

export default function MemoryMatchPage() {
  const params = useParams();
  const { t } = useI18n();
  const gameId = params.gameId as string;
  const game = ALL_GAMES.find((g) => g.id === gameId);

  const [userId, setUserId] = useState<string | null>(null);
  const [progress, setProgress] = useState<GameProgress[]>([]);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("select");

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

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Live refs so timer/win callbacks never read stale values
  const scoreRef = useRef(0);
  const matchedPairsRef = useRef(0);
  const timeLeftRef = useRef(0);
  const endGameRef = useRef<(won: boolean) => void>(() => {});
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { matchedPairsRef.current = matchedPairs; }, [matchedPairs]);
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);

  // Load user + progress
  useEffect(() => {
    const supabase = createClient();
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!data.user) return;
        setUserId(data.user.id);
        const { data: progressData } = await supabase
          .from("game_progress")
          .select("user_id, game_id, level_number, stars, score, best_time_ms, completed_at")
          .eq("user_id", data.user.id)
          .eq("game_id", gameId);
        setProgress(progressData || []);
      } catch {
        // ignore — games still playable without saved progress
      } finally {
        setProgressLoaded(true);
      }
    })();
  }, [gameId]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Quick-start from ?level=N (client-side, avoids useSearchParams Suspense)
  useEffect(() => {
    if (!game || !progressLoaded) return;
    try {
      const q = new URLSearchParams(window.location.search).get("level");
      if (!q) return;
      const n = parseInt(q, 10);
      if (Number.isNaN(n) || n < 1 || n > game.levels.length) return;
      const prev = progress.find((p) => p.level_number === n - 1);
      const unlocked = n === 1 || (prev && prev.stars > 0);
      if (unlocked) startLevel(n);
    } catch {
      // ignore — malformed URL is not fatal
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressLoaded]);

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

    // Specialized games manage their own intro/countdown internally
    if (SPECIALIZED_GAMES.has(gameId)) {
      setSelectedLevel(levelNum);
      setPhase("play");
      return;
    }

    // Memory match: deal cards, then show instructions before play
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
    scoreRef.current = 0;
    setMoves(0);
    setCombo(0);
    setMatchedPairs(0);
    matchedPairsRef.current = 0;
    setGameOver(false);
    setTimeLeft(Math.floor(config.timeLimitMs / 1000));
    timeLeftRef.current = Math.floor(config.timeLimitMs / 1000);
    setSelectedLevel(levelNum);
    setTimerRunning(false);
    setPhase("intro");
  }

  function beginMemoryPlay() {
    setPhase("play");
    setTimerRunning(true);
  }

  // Timer — reads live refs so an expired timeout keeps the real score
  useEffect(() => {
    if (!timerRunning || phase !== "play") return;
    timerRef.current = setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) {
        clearInterval(timerRef.current!);
        setTimerRunning(false);
        endGameRef.current(false);
      }
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, phase]);

  // Check match
  useEffect(() => {
    if (flippedIds.length !== 2) return;
    const [a, b] = flippedIds;
    const cardA = cards[a];
    const cardB = cards[b];

    if (cardA.emoji === cardB.emoji) {
      // Match! — compute new totals from live refs (never drops the last pair)
      const newCombo = combo + 1;
      const bonus = Math.floor(newCombo / 3) * 25;
      const points = 50 + bonus;
      const newScore = scoreRef.current + points;
      const newMatched = matchedPairsRef.current + 1;

      timeoutRef.current = setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === a || c.id === b ? { ...c, matched: true } : c
          )
        );
        setScore(newScore);
        scoreRef.current = newScore;
        setCombo(newCombo);
        setMatchedPairs(newMatched);
        matchedPairsRef.current = newMatched;
        setFlippedIds([]);

        const config = game?.levels[(selectedLevel || 1) - 1];
        if (config && newMatched >= (config.params.pairs as number)) {
          endGameRef.current(true);
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

    const finalScore = won ? scoreRef.current + Math.floor(timeLeftRef.current * 5) : scoreRef.current;
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
      try {
        const elapsedMs = Math.max(1, (config.timeLimitMs || 60000) - timeLeftRef.current * 1000);
        await supabase
          .from("game_progress")
          .upsert({
            user_id: userId,
            game_id: gameId,
            level_number: selectedLevel,
            stars: Math.max(stars, existing?.stars || 0),
            score: Math.max(finalScore, existing?.score || 0),
            best_time_ms: won ? Math.min(elapsedMs, existing?.best_time_ms || Infinity) : existing?.best_time_ms,
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
      } catch {
        // ignore — local progress still updates below
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
          best_time_ms: won ? timeLeftRef.current * 1000 : null,
          completed_at: new Date().toISOString(),
        }];
      });
    }

    setPhase("result");
  }

  useEffect(() => {
    endGameRef.current = endGame;
  });

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
      try {
        await supabase
          .from("game_progress")
          .upsert({
            user_id: userId,
            game_id: gameId,
            level_number: selectedLevel,
            stars: Math.max(stars, existing?.stars || 0),
            score: Math.max(finalScore, existing?.score || 0),
            best_time_ms: timeLeftMs > 0 ? Math.min(timeLeftMs, existing?.best_time_ms || Infinity) : existing?.best_time_ms,
          }, { onConflict: "user_id,game_id,level_number" });

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
      } catch {
        // ignore — local progress still updates below
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
      setSelectedLevel(null);
      setTimerRunning(false);
    },
  };

  if (gameId === "number_sequence" && phase === "play" && selectedLevel) {
    const config = game.levels[selectedLevel - 1];
    return (
      <ErrorBoundary key={`${gameId}-${selectedLevel}`}>
        <NumberSequenceGame level={selectedLevel} config={config} gradient={game.gradient} {...sharedCallbacks} />
      </ErrorBoundary>
    );
  }
  if (gameId === "word_scramble" && phase === "play" && selectedLevel) {
    const config = game.levels[selectedLevel - 1];
    return (
      <ErrorBoundary key={`${gameId}-${selectedLevel}`}>
        <WordScrambleGame level={selectedLevel} config={config} gradient={game.gradient} {...sharedCallbacks} />
      </ErrorBoundary>
    );
  }
  if (gameId === "reaction_speed" && phase === "play" && selectedLevel) {
    const config = game.levels[selectedLevel - 1];
    return (
      <ErrorBoundary key={`${gameId}-${selectedLevel}`}>
        <ReactionSpeedGame level={selectedLevel} config={config} gradient={game.gradient} {...sharedCallbacks} />
      </ErrorBoundary>
    );
  }
  if (gameId === "color_match" && phase === "play" && selectedLevel) {
    const config = game.levels[selectedLevel - 1];
    return (
      <ErrorBoundary key={`${gameId}-${selectedLevel}`}>
        <ColorMatchGame level={selectedLevel} config={config} gradient={game.gradient} {...sharedCallbacks} />
      </ErrorBoundary>
    );
  }

  const gridCols = selectedLevel
    ? (game.levels[selectedLevel - 1]?.params.gridCols as number) || 4
    : 4;

  // ─── Level Select ──────────────────────────────────────────────────
  if (phase === "select") {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/games" aria-label="Back to games" className="flex min-h-[44px] items-center justify-center rounded-lg p-2 hover:bg-accent">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold sm:text-2xl flex items-center gap-2">
              {(() => { const GameIcon = GAME_ICONS[game.iconKey]; return GameIcon ? <GameIcon className="h-7 w-7 text-primary" /> : null; })()} {game.title}
            </h1>
            <p className="text-sm text-muted-foreground">{game.description}</p>
          </div>
        </div>

        {!progressLoaded ? (
          <div className="grid gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {game.levels.map((level) => {
              const state = getLevelState(level.level);
              const params: string[] = [];
              if (level.params.pairs) params.push(`${level.params.pairs} pairs`);
              if (level.params.words) params.push(`${level.params.words} words`);
              if (level.params.targets) params.push(`${level.params.targets} targets`);
              if (level.params.rounds) params.push(`${level.params.rounds} rounds`);
              if (level.params.startLen) params.push(`${level.params.startLen}–${level.params.maxLen} digits`);
              params.push(`${Math.floor(level.timeLimitMs / 1000)}s`);
              return (
                <motion.button
                  key={level.level}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(level.level * 0.05, 0.3) }}
                  disabled={!state.unlocked}
                  onClick={() => startLevel(level.level)}
                  className={`flex items-center gap-3 sm:gap-4 rounded-xl border p-3 sm:p-4 text-left transition-all touch-manipulation ${
                    state.unlocked
                      ? "border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 cursor-pointer active:scale-[0.98]"
                      : "border-border/50 bg-muted/30 opacity-50 cursor-not-allowed"
                  }`}
                >
                  {/* Level number */}
                  <div className={`flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl text-base sm:text-lg font-bold ${
                    state.completed
                      ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-500"
                      : state.unlocked
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {state.unlocked ? level.level : <Lock className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm sm:text-base font-semibold">Level {level.level}</span>
                      <DifficultyBadge d={level.difficulty} />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      {params.join(" · ") || "Custom"}
                    </p>
                    {state.bestScore > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Best: {state.bestScore} pts
                      </p>
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm sm:text-lg leading-tight">
                      {state.stars === 3 ? "⭐⭐⭐" : state.stars === 2 ? "⭐⭐" : state.stars === 1 ? "⭐" : "☆☆☆"}
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      +{getXpForStars(3, level.level)} XP
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ─── Memory match: intro ───────────────────────────────────────────
  if (phase === "intro") {
    const config = game.levels[(selectedLevel || 1) - 1];
    return (
      <GameIntro
        title={game.title}
        description="Flip the cards and find every matching pair before time runs out."
        steps={[
          "Tap any card to flip it and reveal its icon.",
          "Tap a second card to try to find its match.",
          "Match every pair to win — combos earn bonus points!",
        ]}
        level={selectedLevel || 1}
        difficulty={config?.difficulty || "easy"}
        timeLimitSec={Math.floor((config?.timeLimitMs || 30000) / 1000)}
        goal={`${config?.targetScore || 100}+ pts`}
        gradient={game.gradient}
        onStart={() => setPhase("countdown")}
        onBack={() => setPhase("select")}
      />
    );
  }

  // ─── Memory match: countdown ───────────────────────────────────────
  if (phase === "countdown") {
    return <Countdown label="Get ready to match pairs..." onDone={beginMemoryPlay} />;
  }

  // ─── Memory match: play ────────────────────────────────────────────
  if (phase === "play") {
    const config = game.levels[(selectedLevel || 1) - 1];
    const totalPairs = config?.params.pairs as number;
    const progressPercent = totalPairs > 0 ? (matchedPairs / totalPairs) * 100 : 0;

    return (
      <div className="mx-auto max-w-lg space-y-4">
        {/* HUD */}
        <div className="flex items-center justify-between">
          <button onClick={() => { setPhase("select"); setTimerRunning(false); }}
            aria-label="Back to level select"
            className="flex min-h-[44px] items-center justify-center rounded-lg p-2 hover:bg-accent">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            {combo >= 2 && (
              <div className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-bold text-orange-500">
                <Zap className="h-3 w-3" /> {combo}x
              </div>
            )}
            <div className={`rounded-full px-3 py-1.5 text-sm font-bold ${
              timeLeft <= 10 ? "bg-red-500/10 text-red-500" : "bg-muted"
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
              aria-label={card.flipped || card.matched ? `Card ${card.emoji}` : "Hidden card"}
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
    <div className="mx-auto max-w-md w-full space-y-4 sm:space-y-6 py-6 sm:py-8 text-center px-3 sm:px-0">
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          {resultStars > 0 ? (
            <>
              <div className="mb-4 text-6xl">
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
              className={`h-8 w-8 sm:h-10 sm:w-10 ${
                s <= resultStars ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
              }`}
            />
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-xl bg-muted/50 p-2 sm:p-3">
          <p className="text-base sm:text-xl font-bold">{score}</p>
          <p className="text-[11px] sm:text-xs text-muted-foreground">Score</p>
        </div>
        <div className="rounded-xl bg-primary/10 p-2 sm:p-3">
          <p className="text-base sm:text-xl font-bold text-primary">+{resultXp}</p>
          <p className="text-[11px] sm:text-xs text-muted-foreground">XP</p>
        </div>
        <div className="rounded-xl bg-amber-500/10 p-2 sm:p-3">
          <p className="text-base sm:text-xl font-bold text-amber-500">+{resultCoins}</p>
          <p className="text-[11px] sm:text-xs text-muted-foreground">Coins</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={() => startLevel(selectedLevel!)}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary/90 min-h-[48px] touch-manipulation"
        >
          <RotateCcw className="h-4 w-4" /> Retry
        </button>
        {resultStars > 0 && selectedLevel! < 10 && getLevelState(selectedLevel! + 1).unlocked && (
          <button
            onClick={() => startLevel(selectedLevel! + 1)}
            className={`flex items-center gap-2 rounded-xl bg-gradient-to-r ${game.gradient} px-6 py-3 text-sm font-bold text-white hover:opacity-90 min-h-[48px] touch-manipulation`}
          >
            <Play className="h-4 w-4" /> Next Level
          </button>
        )}
        <button
          onClick={() => { setPhase("select"); setSelectedLevel(null); }}
          className="flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium hover:bg-accent min-h-[48px] touch-manipulation"
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
