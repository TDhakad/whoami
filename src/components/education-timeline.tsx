// ─────────────────────────────────────────────────────────────────────────────
// education-timeline.tsx
//
// Vertical rail timeline — "Interactive Data Pipeline" style:
//   • Left column  — thin rail + circular node buttons with glow + pulse
//   • Right column — one large card revealing the selected step
//   • Nodes: pulsing ring on active, glow halo, scale transition on select
//   • Card:  fade + directional slide via AnimatePresence
//   • Accessibility: aria-current, aria-controls, arrow-key navigation
//   • Reduced motion: pulse disabled, card uses quick fade only
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EducationTimelineCta = {
  label: string;
  action: "scene" | "route" | "download";
  target: string;
};

export type EducationTimelineItem = {
  id: string;
  /** Short label shown in the pill + beside the rail node, e.g. "Bachelors" */
  label: string;
  /** Full degree / programme name */
  title: string;
  /** Institution name */
  org: string;
  /** Date range + optional GPA, e.g. "2019–2023 • GPA 3.9" */
  meta: string;
  /** One-paragraph description */
  description: string;
  bullets?: string[];
  ctas?: EducationTimelineCta[];
};

interface EducationTimelineProps {
  items: EducationTimelineItem[];
  onCta?: (cta: EducationTimelineCta) => void;
  className?: string;
}

// ─── Card animation variants ──────────────────────────────────────────────────

const cardVariants = {
  initial: (dir: 1 | -1) => ({ opacity: 0, y: dir * 14 }),
  animate: { opacity: 1, y: 0 },
  exit:    (dir: 1 | -1) => ({ opacity: 0, y: dir * -14 }),
};

const cardVariantsReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function EducationTimeline({
  items,
  onCta,
  className,
}: EducationTimelineProps) {
  const [activeId, setActiveId]     = React.useState(items[0]?.id ?? "");
  const [direction, setDirection]   = React.useState<1 | -1>(1);
  const reduced                     = useReducedMotion();
  const cardId                      = React.useId();
  const nodeRefs                    = React.useRef<(HTMLButtonElement | null)[]>([]);

  const activeIndex = items.findIndex((i) => i.id === activeId);
  const activeItem  = items[activeIndex] ?? items[0];

  function handleSelect(id: string) {
    const newIdx = items.findIndex((i) => i.id === id);
    const curIdx = items.findIndex((i) => i.id === activeId);
    if (newIdx === curIdx) return;
    setDirection(newIdx > curIdx ? 1 : -1);
    setActiveId(id);
  }

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const next = Math.min(index + 1, items.length - 1);
      handleSelect(items[next].id);
      nodeRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = Math.max(index - 1, 0);
      handleSelect(items[prev].id);
      nodeRefs.current[prev]?.focus();
    }
  }

  return (
    <div className={cn("flex w-full items-start gap-5 sm:gap-9", className)}>

      {/* ── Left Rail ────────────────────────────────────────── */}
      <div
        aria-label="Education steps"
        className="relative flex shrink-0 flex-col items-start"
        style={{ width: 126 }}
      >
        {/* Vertical connector line — drawn behind nodes */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[18px] bottom-[18px] left-[17px] w-px bg-border/50"
        />

        {/* Node list */}
        <div className="relative z-10 flex flex-col gap-10">
          {items.map((item, i) => {
            const isActive = item.id === activeId;

            return (
              <button
                key={item.id}
                ref={(el) => { nodeRefs.current[i] = el; }}
                aria-current={isActive ? "step" : undefined}
                aria-controls={cardId}
                aria-label={`${item.label}: ${item.title}`}
                onClick={() => handleSelect(item.id)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={cn(
                  "group flex items-center gap-3 rounded-lg text-left",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                )}
              >
                {/* ── Node dot — 36×36 touch target ── */}
                <span
                  aria-hidden
                  className="relative flex h-9 w-9 shrink-0 items-center justify-center"
                >
                  {/* Pulsing outer ring — active only, suppressed on reduced motion */}
                  {isActive && !reduced && (
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-primary/22"
                      animate={{ scale: [1, 2.1], opacity: [0.55, 0] }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeOut",
                        repeatDelay: 0.4,
                      }}
                    />
                  )}

                  {/* Soft glow ring — active state only */}
                  <motion.span
                    aria-hidden
                    className="absolute rounded-full"
                    style={{ width: 26, height: 26 }}
                    initial={false}
                    animate={
                      isActive
                        ? {
                            opacity: 1,
                            boxShadow: [
                              "0 0 0 2.5px oklch(0.78 0.07 55 / 0.22)",
                              "0 0 16px 6px oklch(0.78 0.07 55 / 0.26)",
                            ].join(", "),
                          }
                        : { opacity: 0, boxShadow: "none" }
                    }
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />

                  {/* Core dot */}
                  <motion.span
                    aria-hidden
                    className={cn(
                      "relative z-10 rounded-full transition-colors",
                      isActive
                        ? "bg-primary"
                        : "bg-muted-foreground/35 group-hover:bg-primary/55",
                    )}
                    animate={{ scale: isActive ? 1 : 0.6 }}
                    whileHover={!isActive ? { scale: 0.78 } : undefined}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    style={{ width: 14, height: 14 }}
                  />
                </span>

                {/* ── Node label ── */}
                <motion.span
                  className="truncate text-xs font-medium leading-none"
                  initial={false}
                  animate={
                    isActive
                      ? { opacity: 1, color: "var(--color-primary)" }
                      : { opacity: 0.6, color: "var(--color-muted-foreground)" }
                  }
                  transition={{ duration: 0.22 }}
                >
                  {item.label}
                </motion.span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right Card ───────────────────────────────────────── */}
      <div className="min-w-0 flex-1">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.article
            key={activeId}
            id={cardId}
            aria-live="polite"
            custom={direction}
            variants={reduced ? cardVariantsReduced : cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: reduced ? 0.15 : 0.28,
              ease: "easeInOut",
            }}
            className={cn(
              "relative overflow-hidden rounded-2xl",
              // Padding
              "p-6 sm:p-8",
              // Border — subtle separation only, no accent stroke
              "border border-border/30",
              // Background depth
              "bg-gradient-to-br from-card/90 via-card/60 to-card/30",
              // Shadow
              "shadow-md shadow-black/[0.07]",
              // Backdrop blur for glassy feel
              "backdrop-blur-sm",
            )}
          >
            {/* Decorative inner warm glow — top-left corner */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background:
                  "radial-gradient(ellipse 65% 35% at 15% 0%, oklch(0.78 0.07 55 / 0.06), transparent)",
              }}
            />

            {/* ── Pill label ─────────────────────────── */}
            <div className="mb-5">
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/[0.08] px-3 py-1 text-xs font-medium text-primary">
                {activeItem.label}
                <ChevronRight className="h-3 w-3 opacity-55" aria-hidden />
              </span>
            </div>

            {/* ── Degree title ────────────────────────── */}
            <h3
              className="text-xl font-semibold leading-snug text-foreground sm:text-2xl"
              style={{ fontFamily: "var(--font-heading), ui-serif, Georgia, serif" }}
            >
              {activeItem.title}
            </h3>

            {/* ── Organisation ────────────────────────── */}
            <p className="mt-1.5 text-sm font-medium text-primary/75">
              {activeItem.org}
            </p>

            {/* ── Meta (dates · GPA) ───────────────────── */}
            <p className="mt-1 font-mono text-[11px] tracking-wide text-muted-foreground">
              {activeItem.meta}
            </p>

            {/* Divider */}
            <div className="my-5 h-px bg-border/35" />

            {/* ── Description ─────────────────────────── */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {activeItem.description}
            </p>

            {/* ── Bullets ─────────────────────────────── */}
            {activeItem.bullets && activeItem.bullets.length > 0 && (
              <ul className="mt-4 space-y-2.5" aria-label="Highlights">
                {activeItem.bullets.map((bullet, bi) => (
                  <li
                    key={bi}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <span
                      aria-hidden
                      className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/55"
                    />
                    {bullet}
                  </li>
                ))}
              </ul>
            )}

            {/* ── CTA buttons ─────────────────────────── */}
            {activeItem.ctas && activeItem.ctas.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-3">
                {activeItem.ctas.map((cta) => (
                  <button
                    key={cta.label}
                    onClick={() => onCta?.(cta)}
                    className={cn(
                      "rounded-full border border-primary/25 bg-primary/[0.08] px-4 py-1.5",
                      "text-xs font-medium text-primary",
                      "transition-colors hover:border-primary/45 hover:bg-primary/15",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/55",
                    )}
                  >
                    {cta.label}
                  </button>
                ))}
              </div>
            )}
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
