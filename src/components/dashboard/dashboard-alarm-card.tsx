"use client";

import { useEffect, useState } from "react";
import {
  AlarmScheduleConfig,
  getAlarmConfig,
  saveAlarmConfig,
  testAlarmNow,
  getNextAlarmCountdown,
  requestAlarmNotificationPermission,
} from "@/lib/alarm-notifications";
import {
  Bell,
  BellRing,
  Clock,
  Volume2,
  Smartphone,
  CheckCircle2,
  Zap,
  Sparkles,
  ChevronDown,
} from "lucide-react";

export function DashboardAlarmCard() {
  const [config, setConfig] = useState<AlarmScheduleConfig>(getAlarmConfig());
  const [countdownText, setCountdownText] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionGranted(Notification.permission === "granted");
    }

    const { formattedText } = getNextAlarmCountdown(config.time);
    setCountdownText(formattedText);

    const interval = setInterval(() => {
      const updated = getNextAlarmCountdown(config.time);
      setCountdownText(updated.formattedText);
    }, 30000);

    return () => clearInterval(interval);
  }, [config.time]);

  const handleToggleEnable = () => {
    const updated = { ...config, enabled: !config.enabled };
    setConfig(updated);
    saveAlarmConfig(updated);
  };

  const handleSetTime = (newTime: string) => {
    const updated = { ...config, time: newTime };
    setConfig(updated);
    saveAlarmConfig(updated);
    const { formattedText } = getNextAlarmCountdown(newTime);
    setCountdownText(formattedText);
    setShowTimePicker(false);
  };

  const handleTestAlarm = async () => {
    setIsTesting(true);
    const res = await testAlarmNow();
    if (res.notificationGranted) {
      setPermissionGranted(true);
    }
    setTestSuccess(true);
    setTimeout(() => {
      setIsTesting(false);
      setTestSuccess(false);
    }, 3000);
  };

  const handleRequestPermission = async () => {
    const granted = await requestAlarmNotificationPermission();
    setPermissionGranted(granted);
    if (granted) {
      handleTestAlarm();
    }
  };

  return (
    <div className="rounded-3xl border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-card to-primary/10 p-5 sm:p-6 shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400">
            <BellRing className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                DAILY WORKOUT ALARM
              </span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <h3 className="text-sm sm:text-base font-black text-foreground">
              Smartphone Alarm &amp; Notification
            </h3>
          </div>
        </div>

        {/* Enable / Disable Toggle Button */}
        <button
          onClick={handleToggleEnable}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-black transition active:scale-95 border ${
            config.enabled
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
              : "bg-muted text-muted-foreground border-border"
          }`}
        >
          <span>{config.enabled ? "Alarm Active" : "Alarm Paused"}</span>
        </button>
      </div>

      {/* Alarm Time & Quick Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
        {/* Current Alarm Time */}
        <div className="rounded-2xl border border-border bg-background/95 p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              SCHEDULED TIME
            </span>
            <span className="text-[11px] font-black text-primary">
              {config.enabled ? `Rings ${countdownText}` : "Disabled"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl sm:text-3xl font-mono font-black text-foreground">
              {config.time}
            </span>

            <button
              onClick={() => setShowTimePicker(!showTimePicker)}
              className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-0.5"
            >
              <span>Change</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Action Buttons: Test Alarm + Enable Sound */}
        <div className="space-y-2">
          <button
            onClick={handleTestAlarm}
            disabled={isTesting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary/90 text-white py-3 px-4 text-xs font-black shadow-md shadow-primary/20 transition active:scale-95 min-h-[44px]"
          >
            <Smartphone className="h-4 w-4" />
            <span>
              {testSuccess
                ? "🔔 Alarm Ringing on Phone!"
                : isTesting
                ? "Testing Alarm..."
                : "Test Smartphone Alarm Now"}
            </span>
          </button>

          {!permissionGranted && (
            <button
              onClick={handleRequestPermission}
              className="w-full text-center text-[11px] font-bold text-muted-foreground hover:text-foreground underline"
            >
              Enable device push notifications on this phone
            </button>
          )}
        </div>
      </div>

      {/* Quick Time Presets Dropdown */}
      {showTimePicker && (
        <div className="rounded-2xl border border-border bg-card p-3 space-y-2 animate-in fade-in">
          <span className="text-[10px] font-black uppercase text-muted-foreground block">
            CHOOSE WORKOUT TIME PRESET:
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { time: "06:30", label: "🌅 Morning 6:30 AM" },
              { time: "07:30", label: "☀️ Morning 7:30 AM" },
              { time: "13:00", label: "🥪 Midday 1:00 PM" },
              { time: "18:00", label: "🌆 Evening 6:00 PM" },
              { time: "19:30", label: "🌙 Night 7:30 PM" },
              { time: "21:00", label: "🛌 Night 9:00 PM" },
            ].map((p) => (
              <button
                key={p.time}
                onClick={() => handleSetTime(p.time)}
                className={`rounded-xl border p-2 text-center transition font-bold ${
                  config.time === p.time
                    ? "border-primary bg-primary/10 text-primary font-black"
                    : "border-border bg-background text-foreground hover:border-primary/40"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
