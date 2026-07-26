import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminStatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: { value: number; positive: boolean };
  className?: string;
  iconClassName?: string;
}

export function AdminStatsCard({
  icon: Icon,
  label,
  value,
  trend,
  className,
  iconClassName,
}: AdminStatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10",
            iconClassName
          )}
        >
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
      {trend && (
        <p
          className={cn(
            "mt-2 text-xs font-medium",
            trend.positive ? "text-emerald-500" : "text-red-500"
          )}
        >
          {trend.positive ? "+" : ""}
          {trend.value}% from last week
        </p>
      )}
    </div>
  );
}
