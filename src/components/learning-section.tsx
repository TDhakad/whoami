// ─────────────────────────────────────────────────────────────────────────────
// learning-section.tsx  —  Container with mode toggle
//
// Renders a premium two-segment toggle that switches between:
//   "shelf"     → KnowledgeShelf  (MODE B: visual book spines)
//   "directory" → LearningSyllabus (MODE A: editorial list + inspector)
//
// Mode preference is persisted in localStorage ("learning_mode").
//
// Accessibility
//   • Toggle uses role="radiogroup" + role="radio" + aria-checked
//   • AnimatePresence content swap is aria-live safe (mode label shown)
//   • Reduced motion: toggle thumb jumps instantly; no crossfade on swap
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import * as React from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Library, AlignJustify } from "lucide-react";
import { cn } from "@/lib/utils";
import { KnowledgeShelf } from "@/components/knowledge-shelf";
import { LearningSyllabus } from "@/components/learning-syllabus";
import type { LearningItem } from "@/components/learning-syllabus";

// ─── Re-export canonical type for consumers (e.g. page.tsx) ──────────────────
export type { LearningItem } from "@/components/learning-syllabus";

// ─── (LearningItem type defined in learning-syllabus.tsx and re-exported above) ─

type LearningSectionItem = LearningItem;

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "shelf" | "directory";

const MODES: { key: Mode; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { key: "shelf",     label: "Shelf",     Icon: Library       },
  { key: "directory", label: "Directory", Icon: AlignJustify  },
];

// ─── Reduced-motion hook ──────────────────────────────────────────────────────

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// ─── ModeToggle ───────────────────────────────────────────────────────────────

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
  reduced: boolean;
}

function ModeToggle({ mode, onChange, reduced }: ModeToggleProps) {
  return (
    <LayoutGroup id="learning-mode-toggle">
      <div
        role="radiogroup"
        aria-label="Learning view mode"
        className={cn(
          "relative flex gap-0.5 rounded-xl border border-border/50 p-1",
          "bg-muted/30 backdrop-blur-sm",
          "shadow-[0_1px_3px_oklch(0_0_0/0.12)]",
        )}
      >
        {MODES.map(({ key, label, Icon }) => {
          const isActive = mode === key;
          return (
            <button
              key={key}
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(key)}
              className={cn(
                "relative z-10 flex items-center gap-1.5 rounded-lg px-4 py-1.5",
                "text-sm font-medium transition-colors duration-150 select-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80",
              )}
            >
              {/* Sliding thumb — rendered behind the label */}
              {isActive && (
                <motion.span
                  layoutId={reduced ? undefined : "toggle-thumb"}
                  className="absolute inset-0 rounded-lg bg-card shadow-sm"
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{ zIndex: -1 }}
                />
              )}
              <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {label}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

// ─── LearningSection ──────────────────────────────────────────────────────────

interface LearningSectionProps {
  items: LearningItem[];
  className?: string;
}

export function LearningSection({ items, className }: LearningSectionProps) {
  const reduced = usePrefersReducedMotion();

  // Hydration-safe: start with default "shelf", load localStorage on mount
  const [mode, setMode] = React.useState<Mode>("shelf");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("learning_mode") as Mode | null;
    if (saved === "shelf" || saved === "directory") setMode(saved);
  }, []);

  const handleModeChange = (next: Mode) => {
    setMode(next);
    localStorage.setItem("learning_mode", next);
  };

  // Content swap variants
  const contentV = reduced
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.22 } },
        exit:    { opacity: 0, transition: { duration: 0.14 } },
      };

  return (
    <div className={cn("w-full", className)}>
      {/* Toggle */}
      <div className="mb-8 flex justify-center">
        {/* Prevent layout shift before localStorage loads */}
        <div className={cn("transition-opacity duration-200", mounted ? "opacity-100" : "opacity-0")}>
          <ModeToggle mode={mode} onChange={handleModeChange} reduced={reduced} />
        </div>
      </div>

      {/* Content area — stable minimum height prevents layout jump */}
      <AnimatePresence mode="wait" initial={false}>
        {mode === "shelf" ? (
          <motion.div
            key="shelf"
            {...(reduced ? {} : contentV)}
          >
            <KnowledgeShelf items={items} />
          </motion.div>
        ) : (
          <motion.div
            key="directory"
            {...(reduced ? {} : contentV)}
          >
            <LearningSyllabus items={items} defaultType="youtube" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
