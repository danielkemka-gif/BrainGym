'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Brain, TrendingUp, Clock, Calendar, Sparkles, Target, Zap } from 'lucide-react';

interface HabitAnalysis {
  optimalFrequency: number;
  currentFrequency: number;
  bestTime: string;
  bestDay: string;
  avgSessionLength: number;
  consistencyScore: number;
  predictedStreak: number;
  recommendation: string;
  habitStrength: 'building' | 'maintaining' | 'declining';
  suggestedAdjustment: string;
}

export function AdaptiveHabitIntelligence() {
  const [analysis, setAnalysis] = useState<HabitAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const loadData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Gather training data
      const [workoutsRes, streakRes, momentumRes] = await Promise.all([
        supabase
          .from('workout_sessions')
          .select('date, started_at, completed_at')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(90),
        supabase
          .from('streaks')
          .select('current_streak, longest_streak')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('brain_momentum')
          .select('score, calculated_at')
          .eq('user_id', user.id)
          .order('calculated_at', { ascending: false })
          .limit(14),
      ]);

      const workouts = workoutsRes.data ?? [];
      const streak = streakRes.data?.current_streak ?? 0;
      const longest = streakRes.data?.longest_streak ?? 0;

      // Calculate current frequency (workouts per week in last 4 weeks)
      const fourWeeksAgo = new Date(Date.now() - 28 * 86400000);
      const recentWorkouts = workouts.filter(w => new Date(w.date) >= fourWeeksAgo);
      const currentFrequency = Math.round((recentWorkouts.length / 4) * 10) / 10;

      // Optimal frequency: based on momentum trend
      const momentumScores = momentumRes.data ?? [];
      const momentumTrend = momentumScores.length >= 2
        ? momentumScores[0].score - momentumScores[momentumScores.length - 1].score
        : 0;

      let optimalFrequency = 5; // Default 5 days/week
      if (momentumTrend > 10) optimalFrequency = 4; // Already growing fast
      else if (momentumTrend > 0) optimalFrequency = 5;
      else if (momentumTrend > -10) optimalFrequency = 6;
      else optimalFrequency = 7; // Need to train more

      // Best day analysis
      const dayCounts: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (const w of workouts) {
        const day = dayNames[new Date(w.date).getDay()];
        dayCounts[day]++;
      }
      const bestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Mon';

      // Consistency score
      const consistencyScore = Math.min(100, Math.round((currentFrequency / 7) * 100));

      // Habit strength
      let habitStrength: 'building' | 'maintaining' | 'declining' = 'maintaining';
      if (currentFrequency >= 5 && streak >= 7) habitStrength = 'maintaining';
      else if (currentFrequency < 3 || streak < 3) habitStrength = 'building';
      if (momentumTrend < -15) habitStrength = 'declining';

      // Predicted streak continuation
      const predictedStreak = Math.round(longest * (currentFrequency / 7));

      // Recommendations
      let recommendation = '';
      let suggestedAdjustment = '';
      if (habitStrength === 'building') {
        recommendation = `You're building your habit. Train ${optimalFrequency} days this week to strengthen it.`;
        suggestedAdjustment = `Start with 15-minute sessions. Consistency matters more than duration.`;
      } else if (habitStrength === 'maintaining') {
        recommendation = `Great momentum! Keep training ${optimalFrequency} days/week to maintain.`;
        suggestedAdjustment = `Try increasing difficulty in your weakest category.`;
      } else {
        recommendation = `Your habit needs attention. Even 5 minutes on ${bestDay}s can help.`;
        suggestedAdjustment = `Set a reminder for your preferred time. Short sessions beat no sessions.`;
      }

      setAnalysis({
        optimalFrequency: Math.round(optimalFrequency),
        currentFrequency,
        bestTime: 'Morning',
        bestDay,
        avgSessionLength: 15,
        consistencyScore,
        predictedStreak,
        recommendation,
        habitStrength,
        suggestedAdjustment,
      });
    } catch (err) {
      console.error('Failed to load habit analysis:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const strengthColor = {
    building: 'from-blue-500 to-cyan-500',
    maintaining: 'from-green-500 to-emerald-500',
    declining: 'from-red-500 to-orange-500',
  }[analysis.habitStrength];

  const strengthLabel = {
    building: 'Building',
    maintaining: 'Strong',
    declining: 'Needs Care',
  }[analysis.habitStrength];

  const strengthBadge = {
    building: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    maintaining: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    declining: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  }[analysis.habitStrength];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Adaptive Habits</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Your personalized training rhythm</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${strengthBadge}`}>
          {strengthLabel}
        </span>
      </div>

      {/* Optimal vs Current frequency */}
      <div className="flex items-center gap-4 mb-4 sm:mb-6">
        <div className="flex-1 text-center p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-gray-800">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.currentFrequency}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">days/week now</div>
        </div>
        <div className="text-center">
          <TrendingUp className="w-5 h-5 text-purple-500 mx-auto mb-1" />
          <div className="text-xs text-gray-500 dark:text-gray-400">optimal</div>
        </div>
        <div className="flex-1 text-center p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{analysis.optimalFrequency}</div>
          <div className="text-xs text-purple-500 dark:text-purple-400">days/week</div>
        </div>
      </div>

      {/* Habit streak ring (simplified) */}
      <div className="flex items-center gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Calendar className="w-4 h-4 text-blue-500" />
          Best day: <span className="font-medium">{analysis.bestDay}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4 text-green-500" />
          Best time: <span className="font-medium">{analysis.bestTime}</span>
        </div>
      </div>

      {/* Consistency meter */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
          <span>Consistency Score</span>
          <span className="font-mono">{analysis.consistencyScore}%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${analysis.consistencyScore}%` }}
            transition={{ duration: 1 }}
            className={`h-full rounded-full bg-gradient-to-r ${strengthColor}`}
          />
        </div>
      </div>

      {/* Recommendation */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-200/50 dark:border-indigo-800/50">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">{analysis.recommendation}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{analysis.suggestedAdjustment}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
