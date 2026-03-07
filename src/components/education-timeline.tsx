// ─────────────────────────────────────────────────────────────────────────────
// education-timeline.tsx
//
// Scroll-driven education chapter:
//   • Left column  — sticky rail with dot buttons + labels, highlights active card
//   • Right column — all cards stacked vertically, each min-h-[75svh]
//   • IntersectionObserver drives activeIndex — no click needed to reveal info
//   • Clicking a dot smooth-scrolls to that card (instant when reduced motion)
//   • Accessibility: aria-current on active dot, semantic <article> elements
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  /** Short label shown in the pill + beside the rail node, e.g. "Masters" */
  label: string;
  /** Full degree / programme name */
  title: string;
  /** Institution name */
  org: string;
  /** Date range + optional GPA, e.g. "2024–2026 • GPA 3.5" */
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

// ─── Component ────────────────────────────────────────────────────────────────

export function EducationTimeline({
  items,
  onCta,
  className,
}: EducationTimelineProps) {
  const reduced      = useReducedMotion();
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Refs to each card <article> element
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);

  // ── IntersectionObserver: drive activeIndex from scroll ──────────────────
  React.useEffect(() => {
    const els = cardRefs.current.filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    // Track latest intersection ratio per element
    const ratioMap = new Map<Element, number>(els.map((el) => [el, 0]));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratioMap.set(entry.target, entry.intersectionRatio);
        });

        // Pick the element with the highest visible ratio
        let bestEl: Element | null = null;
        let bestRatio = -1;
        ratioMap.forEach((ratio, el) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestEl = el;
          }
        });

        if (bestEl) {
          const idx = els.indexOf(bestEl as HTMLElement);
          if (idx !== -1) setActiveIndex(idx);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: "-15% 0px -15% 0px",
      },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  // ── Dot click: scroll to card ─────────────────────────────────────────────
  function scrollToCard(index: number) {
    const el = cardRefs.current[index];
    if (!el) return;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  return (
    <div className={cn("flex w-full items-start gap-5 sm:gap-10", className)}>

      {/* ── Left Rail (sticky) ─────────────────────────────────── */}
      <div
        aria-label="Education steps"
        className="self-start sticky top-28 shrink-0"
        style={{ width: 126 }}
      >
        <div className="relative flex flex-col gap-10">
          {/* Vertical connector line */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-[18px] bottom-[18px] left-[17px] w-px bg-border/50"
          />

          {items.map((item, i) => {
            const isActive = i === activeIndex;

            return (
              <button
                key={item.id}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Jump to ${item.label}: ${item.title}`}
                onClick={() => scrollToCard(i)}
                className={cn(
                  "group relative z-10 flex items-center gap-3 rounded-lg text-left",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                )}
              >
                {/* ── Node dot ── */}
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

                  {/* Soft glow ring */}
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

      {/* ── Right: stacked cards ───────────────────────────────── */}
      <div className="min-w-0 flex-1 flex flex-col gap-12">
        {items.map((item, i) => (
          <article
            key={item.id}
            ref={(el) => { cardRefs.current[i] = el; }}
            aria-label={`${item.label}: ${item.title}`}
            className={cn(
              "relative overflow-hidden rounded-2xl",
              // Tall enough to register cleanly in the observer
              "min-h-[75svh] flex flex-col justify-center",
              "p-6 sm:p-10 py-16",
              // Border
              "border border-border/30",
              // Background depth
              "bg-gradient-to-br from-card/90 via-card/60 to-card/30",
              // Shadow
              "shadow-md shadow-black/[0.07]",
              // Glassy backdrop
              "backdrop-blur-sm",
              // Dim inactive cards subtly
              "transition-opacity duration-500",
              i === activeIndex ? "opacity-100" : "opacity-55",
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
                {item.label}
                <ChevronRight className="h-3 w-3 opacity-55" aria-hidden />
              </span>
            </div>

            {/* ── Degree title ────────────────────────── */}
            <h3
              className="text-xl font-semibold leading-snug text-foreground sm:text-2xl"
              style={{ fontFamily: "var(--font-heading), ui-serif, Georgia, serif" }}
            >
              {item.title}
            </h3>

            {/* ── Organisation ────────────────────────── */}
            <p className="mt-1.5 text-sm font-medium text-primary/75">
              {item.org}
            </p>

            {/* ── Meta (dates · GPA) ───────────────────── */}
            <p className="mt-1 font-mono text-[11px] tracking-wide text-muted-foreground">
              {item.meta}
            </p>

            {/* Divider */}
            <div className="my-5 h-px bg-border/35" />

            {/* ── Description ─────────────────────────── */}
            <p className="text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>

            {/* ── Bullets ─────────────────────────────── */}
            {item.bullets && item.bullets.length > 0 && (
              <ul className="mt-4 space-y-2.5" aria-label="Highlights">
                {item.bullets.map((bullet, bi) => (
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
            {item.ctas && item.ctas.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-3">
                {item.ctas.map((cta) => (
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
          </article>
        ))}
      </div>
    </div>
  );
}
