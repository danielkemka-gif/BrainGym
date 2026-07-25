"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Trophy, TrendingUp, Brain, Flame, Star, Zap, Target, Diamond } from "lucide-react";

const FAKE_PERFORMERS = [
  { name: "Adaeze O.", level: 8, xp: 54200, color: "from-amber-500 to-orange-500" },
  { name: "Kofi M.", level: 6, xp: 22100, color: "from-violet-500 to-purple-500" },
  { name: "Chidinma E.", level: 5, xp: 12400, color: "from-emerald-500 to-teal-500" },
];

const TICKER_ITEMS = [
  { text: "Chidi just unlocked Memory Whiz!", Icon: Brain },
  { text: "Amina completed a 7-day streak!", Icon: Flame },
  { text: "Kofi reached Level 5!", Icon: Star },
  { text: "Fatima crushed a Quick-Fire challenge!", Icon: Zap },
  { text: "Emeka finished 10 focus activities!", Icon: Target },
  { text: "Ngozi earned 500 XP today!", Icon: Diamond },
];

function useRandomCount(min: number, max: number, interval: number) {
  const [value, setValue] = useState(() => Math.floor(Math.random() * (max - min + 1)) + min);
  useEffect(() => {
    const id = setInterval(() => {
      setValue(Math.floor(Math.random() * (max - min + 1)) + min);
    }, interval);
    return () => clearInterval(id);
  }, [min, max, interval]);
  return value;
}

export function SocialProof() {
  const activeUsers = useRandomCount(45, 200, 12000);
  const workoutsToday = useRandomCount(800, 2000, 30000);
  const levelUps = useRandomCount(20, 80, 20000);

  return (
    <div className="space-y-4">
      {/* Community Pulse */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <div className="mb-3 flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Community Pulse</h3>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{activeUsers}</span> users are training right now
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{workoutsToday.toLocaleString()}</span> workouts completed today
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-400" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{levelUps}</span> people just leveled up
            </p>
          </div>
        </div>
      </motion.div>

      {/* Top Performers */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <div className="mb-3 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold">Top Performers This Week</h3>
        </div>

        <div className="space-y-2">
          {FAKE_PERFORMERS.map((user, i) => (
            <div key={user.name} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-[11px] text-muted-foreground">{user.xp.toLocaleString()} XP</p>
              </div>
              <span
                className={`rounded-full bg-gradient-to-r ${user.color} px-2.5 py-0.5 text-[11px] font-semibold text-white`}
              >
                Lvl {user.level}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Achievements Ticker */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="overflow-hidden rounded-2xl border border-border bg-card p-5"
      >
        <h3 className="mb-3 text-sm font-semibold">Recent Achievements</h3>
        <div className="relative">
          <div className="marquee flex gap-8 whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <item.Icon className="h-3.5 w-3.5 shrink-0" />
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <style>{`
        .marquee {
          animation: marquee-scroll 20s linear infinite;
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
