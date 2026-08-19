"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { DRILL_BANK, DrillItem } from "@/lib/cognitive-matrix";
import { Confetti } from "@/components/ui/confetti";
import {
  Swords,
  Users,
  Trophy,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  Share2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Bot,
  Play,
} from "lucide-react";

interface DuelPlayer {
  id: string;
  name: string;
  avatar: string | null;
  score: number;
  accuracy: number;
  roundsWon: number;
  currentAnswer?: string | null;
  isAi?: boolean;
}

const BOT_OPPONENTS = [
  { name: "Dr. Adaobi (Neuroscientist)", title: "Cognitive Master", avatar: null, speedMs: 3200, accuracyRate: 0.85 },
  { name: "Kenzo (Speed Strategist)", title: "Speed Builder", avatar: null, speedMs: 2400, accuracyRate: 0.75 },
  { name: "Maya (Logic Grandmaster)", title: "Logic Detective", avatar: null, speedMs: 3800, accuracyRate: 0.90 },
  { name: "Tunde (Memory Champion)", title: "Memory Master", avatar: null, speedMs: 2900, accuracyRate: 0.80 },
];

export function LiveBrainDuel() {
  const { user, supabase } = useAuth();
  const [phase, setPhase] = useState<"lobby" | "waiting_room" | "in_round" | "round_result" | "finished">("lobby");
  const [roomCode, setRoomCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds] = useState(5);
  const [roundDrills, setRoundDrills] = useState<DrillItem[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Players
  const [player1, setPlayer1] = useState<DuelPlayer>({
    id: "p1",
    name: "You",
    avatar: null,
    score: 0,
    accuracy: 100,
    roundsWon: 0,
  });

  const [player2, setPlayer2] = useState<DuelPlayer>({
    id: "p2",
    name: "Dr. Adaobi",
    avatar: null,
    score: 0,
    accuracy: 100,
    roundsWon: 0,
    isAi: true,
  });

  // Current Round State
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [roundTimeLeft, setRoundTimeLeft] = useState(15);
  const [roundWinner, setRoundWinner] = useState<"player1" | "player2" | "tie" | null>(null);
  const [p1AnswerTimeMs, setP1AnswerTimeMs] = useState<number | null>(null);
  const [p2AnswerTimeMs, setP2AnswerTimeMs] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const roundStartTimeRef = useRef<number>(Date.now());

  // Generate 5 rapid round drills
  const prepareDrills = () => {
    const shuffled = [...DRILL_BANK].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  // Start 1v1 Match vs Online Opponent / Sparring Partner
  const startMatch = (customBot?: typeof BOT_OPPONENTS[0]) => {
    const selectedBot = customBot || BOT_OPPONENTS[Math.floor(Math.random() * BOT_OPPONENTS.length)];
    const drills = prepareDrills();
    setRoundDrills(drills);
    setCurrentRound(0);
    setPlayer1({
      id: user?.id || "p1",
      name: user?.user_metadata?.name || "You",
      avatar: user?.user_metadata?.avatar_url || null,
      score: 0,
      accuracy: 100,
      roundsWon: 0,
    });
    setPlayer2({
      id: "bot-" + Date.now(),
      name: selectedBot.name,
      avatar: selectedBot.avatar,
      score: 0,
      accuracy: 100,
      roundsWon: 0,
      isAi: true,
    });
    setPhase("in_round");
    startRound(0, drills);
  };

  // Create Challenge Room with Code
  const handleCreateRoom = () => {
    const code = "BG-" + Math.floor(1000 + Math.random() * 9000);
    setRoomCode(code);
    setPhase("waiting_room");
  };

  // Start a specific round
  const startRound = (roundIdx: number, drills: DrillItem[]) => {
    setSelectedOptionId(null);
    setP1AnswerTimeMs(null);
    setP2AnswerTimeMs(null);
    setRoundWinner(null);
    setRoundTimeLeft(15);
    roundStartTimeRef.current = Date.now();

    const activeDrill = drills[roundIdx];
    if (!activeDrill) return;

    // Simulate AI Opponent response
    const bot = BOT_OPPONENTS[0];
    const simulatedBotSpeed = Math.floor(2000 + Math.random() * 3000);
    const simulatedBotCorrect = Math.random() < bot.accuracyRate;

    setTimeout(() => {
      setP2AnswerTimeMs(simulatedBotSpeed);
    }, simulatedBotSpeed);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRoundTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          evaluateRoundEnd(null, simulatedBotCorrect, simulatedBotSpeed);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle Player 1 option selection
  const handleSelectOption = (optId: string) => {
    if (selectedOptionId || phase !== "in_round") return;
    const elapsed = Date.now() - roundStartTimeRef.current;
    setSelectedOptionId(optId);
    setP1AnswerTimeMs(elapsed);

    const drill = roundDrills[currentRound];
    const isCorrect = drill.options?.find((o) => o.id === optId)?.isCorrect ?? false;

    // Simulate bot
    const botCorrect = Math.random() < 0.8;
    const botElapsed = Math.floor(2500 + Math.random() * 2500);

    if (timerRef.current) clearInterval(timerRef.current);

    setTimeout(() => {
      evaluateRoundEnd(isCorrect, botCorrect, botElapsed, elapsed);
    }, 600);
  };

  // Evaluate Round Winner
  const evaluateRoundEnd = (
    p1Correct: boolean | null,
    p2Correct: boolean,
    p2Time: number,
    p1Time: number = 15000
  ) => {
    let winner: "player1" | "player2" | "tie" = "tie";
    let p1Points = 0;
    let p2Points = 0;

    if (p1Correct && p2Correct) {
      if (p1Time < p2Time) {
        winner = "player1";
        p1Points = 120;
        p2Points = 80;
      } else {
        winner = "player2";
        p2Points = 120;
        p1Points = 80;
      }
    } else if (p1Correct && !p2Correct) {
      winner = "player1";
      p1Points = 100;
      p2Points = 0;
    } else if (!p1Correct && p2Correct) {
      winner = "player2";
      p2Points = 100;
      p1Points = 0;
    }

    setRoundWinner(winner);
    setPlayer1((prev) => ({
      ...prev,
      score: prev.score + p1Points,
      roundsWon: prev.roundsWon + (winner === "player1" ? 1 : 0),
    }));
    setPlayer2((prev) => ({
      ...prev,
      score: prev.score + p2Points,
      roundsWon: prev.roundsWon + (winner === "player2" ? 1 : 0),
    }));

    setPhase("round_result");
  };

  // Advance to next round or finish
  const handleNextRound = () => {
    if (currentRound + 1 < totalRounds) {
      const next = currentRound + 1;
      setCurrentRound(next);
      setPhase("in_round");
      startRound(next, roundDrills);
    } else {
      setPhase("finished");
      if (player1.score >= player2.score) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }

      // Grant rewards
      if (user) {
        const xpEarned = player1.score >= player2.score ? 150 : 50;
        const coinsEarned = player1.score >= player2.score ? 50 : 15;
        try {
          supabase.rpc("grant_xp", { p_user_id: user.id, p_amount: xpEarned, p_reason: "brain_duel_reward" }).then(() => {});
          supabase.rpc("grant_coins", { p_user_id: user.id, p_amount: coinsEarned, p_reason: "brain_duel_reward" }).then(() => {});
        } catch {
          // Silently ignore reward errors
        }
      }
    }
  };

  const copyRoomLink = () => {
    const url = `${window.location.origin}/dashboard/challenges?duel=${roomCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const activeDrill = roundDrills[currentRound];

  // ─── Phase 1: Lobby & Opponent Selection ──────────────────────────────
  if (phase === "lobby") {
    return (
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-8 space-y-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 via-red-500 to-purple-600 text-white shadow-lg shadow-orange-500/25">
              <Swords className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-foreground flex items-center gap-2">
                <span>Head-to-Head Brain Duel Arena</span>
                <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-bold text-orange-600 dark:text-orange-400">
                  2 Players ⚔️
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Challenge friends, colleagues, or community thinkers to a 5-round cognitive showdown
              </p>
            </div>
          </div>

          <button
            onClick={handleCreateRoom}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2.5 text-xs font-bold transition active:scale-95 touch-manipulation min-h-[44px]"
          >
            <Share2 className="h-4 w-4" /> Create Private Duel Room
          </button>
        </div>

        {/* Action Grid: Instant Match or Invite */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quick Match with Sparring Partner */}
          <div className="rounded-2xl border border-border bg-card/60 p-5 space-y-4 hover:border-primary/50 transition">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <h3 className="text-sm font-bold text-foreground">Instant 1v1 Matchmaking</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Match instantly with an active thinker or master sparring bot for a fast 5-round cognitive battle.
            </p>
            <button
              onClick={() => startMatch()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 hover:brightness-105 transition active:scale-95 min-h-[46px] touch-manipulation"
            >
              <Swords className="h-4 w-4" /> Start Instant 1v1 Duel
            </button>
          </div>

          {/* Create Room / Invite Link */}
          <div className="rounded-2xl border border-border bg-card/60 p-5 space-y-4 hover:border-purple-500/50 transition">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <h3 className="text-sm font-bold text-foreground">Challenge a Friend / Colleague</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Generate an instant challenge room code and share it on WhatsApp, Telegram, or SMS.
            </p>
            <button
              onClick={handleCreateRoom}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 text-xs sm:text-sm font-bold shadow-md shadow-purple-600/20 transition active:scale-95 min-h-[46px] touch-manipulation"
            >
              <Share2 className="h-4 w-4" /> Generate Challenge Link
            </button>
          </div>
        </div>

        {/* Featured Sparring Thinkers */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Featured Sparring Thinkers
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {BOT_OPPONENTS.map((bot) => (
              <div
                key={bot.name}
                className="rounded-xl border border-border bg-card p-3 flex items-center justify-between gap-2"
              >
                <div>
                  <h4 className="text-xs font-bold text-foreground">{bot.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{bot.title}</p>
                </div>
                <button
                  onClick={() => startMatch(bot)}
                  className="rounded-lg bg-primary/10 hover:bg-primary/20 text-primary px-2.5 py-1 text-xs font-semibold transition active:scale-95"
                >
                  Duel
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Phase 2: Waiting Room / Share Link ──────────────────────────────
  if (phase === "waiting_room") {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 text-center max-w-lg mx-auto space-y-6 shadow-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600">
          <Share2 className="h-8 w-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">Challenge Room Ready!</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Share this room code with a friend to begin the 1v1 brain duel.
          </p>
        </div>

        {/* Room Code Box */}
        <div className="p-4 rounded-2xl bg-muted/60 border border-border text-center space-y-2">
          <span className="text-[10px] font-bold uppercase text-muted-foreground">Room Code</span>
          <p className="text-3xl font-black font-mono tracking-widest text-primary">{roomCode}</p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={copyRoomLink}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-xs sm:text-sm font-bold text-primary-foreground shadow-md transition hover:bg-primary/90 active:scale-95 min-h-[46px] touch-manipulation"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? "Link Copied to Clipboard!" : "Copy Challenge Link"}</span>
          </button>

          <button
            onClick={() => startMatch()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 px-4 text-xs font-semibold text-foreground hover:bg-accent transition"
          >
            <span>Play with AI Sparring Partner while waiting →</span>
          </button>

          <button
            onClick={() => setPhase("lobby")}
            className="text-xs text-muted-foreground hover:text-foreground pt-2 underline"
          >
            Cancel and return to lobby
          </button>
        </div>
      </div>
    );
  }

  // ─── Phase 3: Active Duel Round / In-Round Arena ───────────────────────
  if (phase === "in_round" && activeDrill) {
    return (
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 space-y-5 max-w-2xl mx-auto shadow-md">
        {/* Split Player Score Bar */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-muted/50 border border-border">
          {/* Player 1 */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xs">
              {player1.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-foreground truncate">{player1.name}</p>
              <span className="text-sm font-black text-primary">{player1.score} pts</span>
            </div>
          </div>

          {/* Player 2 (Opponent) */}
          <div className="flex items-center justify-end gap-2.5 text-right">
            <div>
              <p className="text-xs font-bold text-foreground truncate">{player2.name}</p>
              <span className="text-sm font-black text-orange-600 dark:text-orange-400">{player2.score} pts</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white font-bold text-xs">
              {player2.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Round Progress & Timer Header */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-foreground uppercase tracking-wider">
            Round {currentRound + 1} of {totalRounds}: {activeDrill.title}
          </span>
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-xs ${
              roundTimeLeft <= 4 ? "bg-red-500/20 text-red-600 animate-pulse" : "bg-muted text-foreground"
            }`}
          >
            <Clock className="h-3 w-3" />
            <span>{roundTimeLeft}s</span>
          </div>
        </div>

        {/* Main Prompt */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3">
          {activeDrill.context && (
            <p className="text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-lg whitespace-pre-line">
              {activeDrill.context}
            </p>
          )}
          <h3 className="text-sm sm:text-base font-bold text-foreground leading-relaxed">
            {activeDrill.prompt}
          </h3>

          {/* Multiple Choice Options */}
          {activeDrill.options && (
            <div className="space-y-2 pt-2">
              {activeDrill.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={!!selectedOptionId}
                    className={`w-full flex items-center gap-3 rounded-xl border p-3.5 text-left text-xs sm:text-sm font-medium transition active:scale-[0.98] min-h-[46px] touch-manipulation ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary ring-1 ring-primary font-bold"
                        : "border-border hover:border-primary/40 bg-card"
                    }`}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current/20 text-xs font-bold">
                      {opt.id.toUpperCase()}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Phase 4: Round Result Popup / Next Round ─────────────────────────
  if (phase === "round_result") {
    return (
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 text-center max-w-lg mx-auto space-y-5 shadow-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-3xl">
          {roundWinner === "player1" ? "🎉" : roundWinner === "player2" ? "⚡" : "🤝"}
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">
            {roundWinner === "player1"
              ? "You Won Round " + (currentRound + 1) + "! 🔥"
              : roundWinner === "player2"
              ? player2.name + " took this round!"
              : "Round Tied!"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {roundWinner === "player1"
              ? "Fast, accurate response locked in +120 points!"
              : "Keep pushing — next round is starting!"}
          </p>
        </div>

        {/* Round Scores */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-muted/40 border border-border text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground">Your Score</span>
            <p className="text-lg font-black text-primary">{player1.score} pts</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-muted-foreground">{player2.name}</span>
            <p className="text-lg font-black text-orange-600 dark:text-orange-400">{player2.score} pts</p>
          </div>
        </div>

        <button
          onClick={handleNextRound}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 py-3 px-6 text-sm font-bold text-primary-foreground shadow-md transition hover:bg-primary/90 active:scale-95 min-h-[46px] touch-manipulation"
        >
          <span>{currentRound + 1 < totalRounds ? "Next Round →" : "See Final Match Result 🏆"}</span>
        </button>
      </div>
    );
  }

  // ─── Phase 5: Final Match Finished & Winner Podium ────────────────────
  if (phase === "finished") {
    const isP1Winner = player1.score >= player2.score;
    return (
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 text-center max-w-xl mx-auto space-y-6 shadow-xl">
        <Confetti active={showConfetti} />

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-purple-600 text-white shadow-xl shadow-orange-500/20">
          <Trophy className="h-10 w-10" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-foreground">
            {isP1Winner ? "Match Victory! 👑" : "Great Battle!"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {isP1Winner
              ? "You defeated " + player2.name + " in the 5-Round Brain Duel!"
              : player2.name + " edged out the win this time. Rematch?"}
          </p>
        </div>

        {/* Final Leaderboard Comparison */}
        <div className="p-4 rounded-2xl bg-muted/50 border border-border grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-primary">You</span>
            <p className="text-2xl font-black text-foreground">{player1.score} pts</p>
            <span className="text-[10px] text-green-600 font-bold">{player1.roundsWon} Rounds Won</span>
          </div>
          <div className="space-y-1 border-l border-border/80">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{player2.name}</span>
            <p className="text-2xl font-black text-foreground">{player2.score} pts</p>
            <span className="text-[10px] text-muted-foreground font-bold">{player2.roundsWon} Rounds Won</span>
          </div>
        </div>

        {/* Rewards Earned */}
        <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-around text-xs font-bold">
          <span className="text-violet-600 dark:text-violet-400">
            +{isP1Winner ? 150 : 50} XP Awarded
          </span>
          <span className="text-amber-600 dark:text-amber-400">
            +{isP1Winner ? 50 : 15} Coins Earned
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => startMatch()}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-xs sm:text-sm font-bold text-primary-foreground shadow-md transition hover:bg-primary/90 active:scale-95 min-h-[46px] touch-manipulation"
          >
            <RotateCcw className="h-4 w-4" /> Rematch Duel
          </button>

          <button
            onClick={() => setPhase("lobby")}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border py-3 px-4 text-xs sm:text-sm font-bold text-foreground hover:bg-accent transition active:scale-95 min-h-[46px] touch-manipulation"
          >
            Back to Arena Lobby
          </button>
        </div>
      </div>
    );
  }

  return null;
}
