"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  dismissReminder,
  generateReminders,
  getUnreadReminders,
  getReminderIcon,
  type SmartReminder,
} from "@/lib/reminders";
import { formatDistanceToNow } from "date-fns";

export function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reminders, setReminders] = useState<SmartReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissingId, setDismissingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) {
      setReminders([]);
      setLoading(false);
      return;
    }

    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        await generateReminders(user.id);
        const unread = await getUnreadReminders(user.id);
        if (active) setReminders(unread);
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!open || !containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const unreadCount = reminders.length;

  const handleDismiss = async (id: string) => {
    setDismissingId(id);
    try {
      await dismissReminder(id);
      setReminders((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to dismiss notification", err);
    } finally {
      setDismissingId(null);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label="Open notifications"
        className="relative flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold leading-none text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[320px] max-w-[calc(100vw-1rem)] overflow-hidden rounded-3xl border border-border bg-background shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Notifications</p>
              <p className="text-xs text-muted-foreground">{unreadCount} unread item{unreadCount === 1 ? "" : "s"}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-muted-foreground transition hover:bg-accent hover:text-foreground"
              aria-label="Close notifications"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-sm text-muted-foreground">Loading notifications…</div>
            ) : reminders.length === 0 ? (
              <div className="p-5 text-center text-sm text-muted-foreground">No new notifications</div>
            ) : (
              reminders.map((reminder) => (
                <div key={reminder.id} className="group flex gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-accent">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-sm">
                    {getReminderIcon(reminder.reminder_type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{reminder.title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground line-clamp-2">{reminder.message}</p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{formatDistanceToNow(new Date(reminder.created_at), { addSuffix: true })}</span>
                      {reminder.action_url && (
                        <a
                          href={reminder.action_url}
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDismiss(reminder.id)}
                    disabled={dismissingId === reminder.id}
                    className="rounded-full p-1 text-muted-foreground transition hover:bg-accent hover:text-foreground"
                    aria-label="Dismiss notification"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
