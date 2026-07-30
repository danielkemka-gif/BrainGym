'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getUnreadReminders,
  dismissReminder,
  generateReminders,
  getReminderIcon,
  getReminderColor,
  type SmartReminder,
} from '@/lib/reminders';
import { useAuth } from '@/lib/auth';
import { Bell, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function SmartRemindersSection() {
  const { user, supabase } = useAuth();
  const [reminders, setReminders] = useState<SmartReminder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReminders = useCallback(async () => {
    if (!user) return;
    try {

      // Generate fresh reminders
      await generateReminders(user.id);

      // Load unread
      const unread = await getUnreadReminders(user.id);
      setReminders(unread);
    } catch (err) {
      console.error('Failed to load reminders:', err);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const handleDismiss = async (id: string) => {
    await dismissReminder(id);
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  if (loading || reminders.length === 0) return null;

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {reminders.map((reminder, index) => (
          <motion.div
            key={reminder.id}
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: 'auto' }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative"
          >
            <div className={`flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r ${
              reminder.priority >= 3
                ? 'from-red-500/10 to-pink-500/10 border border-red-200 dark:border-red-800'
                : reminder.priority >= 2
                ? 'from-orange-500/10 to-amber-500/10 border border-orange-200 dark:border-orange-800'
                : 'from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-800'
            }`}>
              {/* Icon */}
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getReminderColor(reminder.reminder_type)} flex items-center justify-center text-white text-sm shrink-0`}>
                {getReminderIcon(reminder.reminder_type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900 dark:text-white">{reminder.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{reminder.message}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {reminder.action_url && (
                  <Link
                    href={reminder.action_url}
                    className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 transition"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                )}
                <button
                  onClick={() => handleDismiss(reminder.id)}
                  className="p-1.5 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 transition min-h-[44px] touch-manipulation"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
