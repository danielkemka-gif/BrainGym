"use client";

import { useEffect, useRef, useCallback } from "react";

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  opacity: number;
  shape: "rect" | "circle";
}

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e",
  "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#a855f7", "#f472b6", "#fbbf24",
];

export function Confetti({ active, duration = 4000 }: { active: boolean; duration?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const piecesRef = useRef<ConfettiPiece[]>([]);
  const startTimeRef = useRef<number>(0);

  const createPieces = useCallback((width: number, height: number): ConfettiPiece[] => {
    const pieces: ConfettiPiece[] = [];
    const count = Math.min(80, Math.floor(width / 10));
    for (let i = 0; i < count; i++) {
      pieces.push({
        x: width * 0.5 + (Math.random() - 0.5) * width * 0.4,
        y: height * 0.3,
        vx: (Math.random() - 0.5) * 8,
        vy: -(Math.random() * 6 + 4),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 6 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.12 + Math.random() * 0.08,
        opacity: 1,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      });
    }
    return pieces;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const elapsed = Date.now() - startTimeRef.current;
    const fadeStart = duration * 0.6;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of piecesRef.current) {
      p.x += p.vx;
      p.vy += p.gravity;
      p.y += p.vy;
      p.vx *= 0.99;
      p.rotation += p.rotationSpeed;

      if (elapsed > fadeStart) {
        p.opacity = Math.max(0, 1 - (elapsed - fadeStart) / (duration - fadeStart));
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    if (elapsed < duration) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [duration]);

  useEffect(() => {
    if (!active) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    piecesRef.current = createPieces(canvas.width, canvas.height);
    startTimeRef.current = Date.now();

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [active, createPieces, animate]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
