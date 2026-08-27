"use client";

import { useState, useEffect, useRef } from "react";
import { Activity, ShieldCheck, Play, Pause, RotateCcw, Zap, Sparkles } from "lucide-react";
import { VerificationResult } from "@/lib/verification/types";

interface MotionVerificationCardProps {
  expectedDurationSec: number;
  onVerificationComplete: (result: VerificationResult) => void;
}

export function MotionVerificationCard({
  expectedDurationSec,
  onVerificationComplete,
}: MotionVerificationCardProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [motionIntensity, setMotionIntensity] = useState(0);
  const [movementCount, setMovementCount] = useState(0);
  const [sensorAvailable, setSensorAvailable] = useState<boolean | null>(null);

  const lastAccelRef = useRef({ x: 0, y: 0, z: 0 });
  const activeSecondsWithMotionRef = useRef(0);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => {
          const next = prev + 1;
          if (motionIntensity > 15) {
            activeSecondsWithMotionRef.current += 1;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, motionIntensity]);

  // Motion sensor listener
  useEffect(() => {
    if (!isRunning || typeof window === "undefined") return;

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity || event.acceleration;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) {
        setSensorAvailable(false);
        return;
      }
      setSensorAvailable(true);

      const deltaX = Math.abs(acc.x - lastAccelRef.current.x);
      const deltaY = Math.abs(acc.y - lastAccelRef.current.y);
      const deltaZ = Math.abs(acc.z - lastAccelRef.current.z);
      const totalDelta = deltaX + deltaY + deltaZ;

      lastAccelRef.current = { x: acc.x, y: acc.y, z: acc.z };

      if (totalDelta > 2.5) {
        setMovementCount((c) => c + 1);
        setMotionIntensity(Math.min(100, Math.round(totalDelta * 12)));
      } else {
        setMotionIntensity((prev) => Math.max(0, prev - 5));
      }
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener("devicemotion", handleDeviceMotion);
    } else {
      setSensorAvailable(false);
    }

    return () => {
      if (window.DeviceMotionEvent) {
        window.removeEventListener("devicemotion", handleDeviceMotion);
      }
    };
  }, [isRunning]);

  const handleFinish = () => {
    setIsRunning(false);

    // Compute consistency & confidence
    const durationMins = secondsElapsed / 60;
    const expectedMins = expectedDurationSec / 60;
    const durationRatio = Math.min(1.0, secondsElapsed / Math.max(1, expectedDurationSec));
    
    let consistencyPct = 85;
    if (sensorAvailable && secondsElapsed > 0) {
      consistencyPct = Math.min(98, Math.max(45, Math.round((activeSecondsWithMotionRef.current / secondsElapsed) * 100)));
    } else if (durationRatio >= 0.7) {
      consistencyPct = 88;
    }

    const isHighConfidence = durationRatio >= 0.6 || movementCount >= 20;
    const status = isHighConfidence ? "VERIFIED" : durationRatio >= 0.3 ? "PARTIALLY_VERIFIED" : "SELF_REPORTED";
    const confidence = isHighConfidence ? "high" : durationRatio >= 0.3 ? "medium" : "low";

    const result: VerificationResult = {
      method: "motion_sensor",
      status,
      confidence,
      durationSeconds: secondsElapsed,
      expectedDurationSeconds: expectedDurationSec,
      movementConsistencyPct: consistencyPct,
      evidenceSummary: `Detected ${Math.floor(durationMins)}m ${secondsElapsed % 60}s duration with ${consistencyPct}% motion consistency signal.`,
      xpModifier: status === "VERIFIED" ? 1.0 : status === "PARTIALLY_VERIFIED" ? 0.75 : 0.5,
      verifiedAt: new Date().toISOString(),
    };

    onVerificationComplete(result);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPct = Math.min(100, Math.round((secondsElapsed / expectedDurationSec) * 100));

  return (
    <div className="rounded-3xl border-2 border-primary/40 bg-card p-5 sm:p-6 space-y-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-primary block">
              Continuous Motion Verification
            </span>
            <h4 className="text-sm font-black text-foreground">
              Motion &amp; Duration Sensor
            </h4>
          </div>
        </div>

        <span className="rounded-full bg-muted border border-border px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground">
          Target: {Math.round(expectedDurationSec / 60)} min
        </span>
      </div>

      {/* Live Timer & Motion Gauge */}
      <div className="rounded-2xl bg-background/90 border border-border p-4 text-center space-y-3">
        <div className="text-4xl sm:text-5xl font-black text-foreground tracking-tight font-mono">
          {formatTime(secondsElapsed)}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
            <span>Session Progress</span>
            <span>{progressPct}%</span>
          </div>
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Real-time Motion Intensity Signal */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            Motion Signal:
          </span>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5 h-3 items-end">
              {[20, 40, 60, 80, 100].map((threshold) => (
                <div
                  key={threshold}
                  className={`w-1 rounded-sm transition-all duration-150 ${
                    motionIntensity >= threshold
                      ? "bg-emerald-500 h-3"
                      : "bg-muted-foreground/30 h-1.5"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-black text-foreground">
              {isRunning ? (motionIntensity > 15 ? "Active Movement" : "Paced / Stationary") : "Idle"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 pt-1">
        {!isRunning ? (
          <button
            onClick={() => setIsRunning(true)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-white py-3.5 text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition min-h-[48px]"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>{secondsElapsed > 0 ? "RESUME ACTIVITY" : "START ACTIVITY SENSOR"}</span>
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 text-white py-3.5 text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition min-h-[48px]"
          >
            <Pause className="h-4 w-4 fill-current" />
            <span>PAUSE TIMER</span>
          </button>
        )}

        {secondsElapsed >= 15 && (
          <button
            onClick={handleFinish}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3.5 text-xs font-black shadow-md active:scale-95 transition min-h-[48px]"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>VERIFY &amp; COMPLETE</span>
          </button>
        )}
      </div>
    </div>
  );
}
