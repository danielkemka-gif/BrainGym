"use client";

import { useTheme } from "@/lib/theme-provider";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle({ size = "md" }: { size?: "sm" | "md" }) {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  const icon = theme === "dark"
    ? <Moon className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
    : theme === "light"
    ? <Sun className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
    : <Monitor className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />;

  return (
    <button
      onClick={cycle}
      title={`Theme: ${theme}`}
      className={`flex items-center justify-center rounded-lg transition-all hover:bg-accent hover:text-accent-foreground ${
        size === "sm" ? "p-1.5" : "p-2"
      } text-muted-foreground`}
    >
      {icon}
    </button>
  );
}
