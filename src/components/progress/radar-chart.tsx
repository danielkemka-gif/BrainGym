"use client";

import { CATEGORIES } from "@/lib/constants";

interface RadarChartProps {
  scores: Record<string, number>;
  size?: number;
}

export function RadarChart({ scores, size = 300 }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;
  const levels = [25, 50, 75, 100];
  const numAxes = CATEGORIES.length;

  function point(i: number, value: number) {
    const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
    const r = (value / 100) * radius;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  const topPoints = levels
    .map((level) =>
      Array.from({ length: numAxes }, (_, i) => point(i, level))
    )
    .map((pts) => pts.map((p) => `${p.x},${p.y}`).join(" "));

  const dataPoints = CATEGORIES.map((c, i) => point(i, scores[c.id] ?? 0));
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto"
    >
      {topPoints.map((poly, li) => (
        <polygon
          key={li}
          points={poly}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={1}
        />
      ))}

      {CATEGORIES.map((c, i) => {
        const p = point(i, 100);
        return (
          <line
            key={c.id}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="hsl(var(--border))"
            strokeWidth={1}
          />
        );
      })}

      <polygon
        points={dataPolygon}
        fill="hsl(var(--primary) / 0.15)"
        stroke="hsl(var(--primary))"
        strokeWidth={2}
      />

      {CATEGORIES.map((c, i) => {
        const p = point(i, 110);
        return (
          <text
            key={c.id}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground"
            fontSize={11}
          >
            {c.label}
          </text>
        );
      })}

      {CATEGORIES.map((c, i) => {
        const p = point(i, scores[c.id] ?? 0);
        return (
          <text
            key={`label-${c.id}`}
            x={p.x}
            y={p.y - 8}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground"
            fontSize={10}
            fontWeight={600}
          >
            {scores[c.id] ?? "—"}
          </text>
        );
      })}
    </svg>
  );
}
