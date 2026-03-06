"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn, focusRing } from "@/lib/utils";

type Mode = "light" | "dark" | "system";

const modes: { value: Mode; label: string; Icon: React.ElementType }[] = [
  { value: "light", label: "Light theme", Icon: Sun },
  { value: "dark", label: "Dark theme", Icon: Moon },
  { value: "system", label: "System theme", Icon: Monitor },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Reserve space to avoid layout shift
    return (
      <div
        className={cn(
          "flex items-center gap-1 rounded-full border border-border bg-muted p-1",
          className
        )}
        aria-hidden
      >
        {modes.map(({ value }) => (
          <span key={value} className="h-7 w-7 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Select colour theme"
      className={cn(
        "flex items-center gap-1 rounded-full border border-border bg-muted p-1",
        className
      )}
    >
      {modes.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={active}
            onClick={() => setTheme(value)}
            className={cn(
              focusRing,
              "flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-all duration-200",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon size={14} strokeWidth={1.75} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
