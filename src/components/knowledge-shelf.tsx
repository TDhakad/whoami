// ─────────────────────────────────────────────────────────────────────────────
// knowledge-shelf.tsx
//
// Two-state learning section:
//   Resting  — horizontal row of vertical book spines on a thin shelf line.
//   Canvas   — clicking a spine opens an in-scene "chapter canvas" overlay.
//
// Layout / interactions
//   • Each spine is a <button> with rotated title text (CSS writing-mode).
//   • ArrowLeft / ArrowRight moves focus between spines.
//   • Enter / Space opens the canvas; Escape closes it.
//   • Canvas traps focus (close btn auto-focused on open; Tab loops within).
//   • Framer-motion: spine hover lift + canvas fade-scale-in.
//   • prefers-reduced-motion: no translate/scale, opacity-only transitions.
//
// Accessibility
//   • Spine buttons: aria-label="Open chapter: {title} by {author}"
//                    aria-pressed={isOpen}
//   • Canvas: role="dialog" aria-modal aria-labelledby
//   • aria-label on close button.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { ExternalLink, X, Youtube, BookOpen, FileText, Award } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type KnowledgeItemType = "youtube" | "course" | "article";

export type KnowledgeItem = {
  id: string;
  title: string;
  author: string;
  type: KnowledgeItemType;
  completed?: string;
  nugget: string;
  tags: string[];
  url?: string;
  certificateUrl?: string;
  // Unified LearningItem fields (optional for backwards compat)
  source?: string;
  duration?: string;
  appliedIn?: string[];
};

interface KnowledgeShelfProps {
  items: KnowledgeItem[];
  className?: string;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Per-type colour palette using our CSS custom properties as fallbacks. */
const SPINE_PALETTE: Record<KnowledgeItemType, { bg: string; border: string; icon: string }> = {
  youtube:  { bg: "oklch(0.18 0.018 22  / 0.85)", border: "oklch(0.42 0.12 22  / 0.55)", icon: "oklch(0.72 0.14 22)" },
  course:   { bg: "oklch(0.18 0.010 265 / 0.85)", border: "oklch(0.38 0.07 200  / 0.55)", icon: "oklch(0.70 0.09 200)" },
  article:  { bg: "oklch(0.18 0.012 55  / 0.85)", border: "oklch(0.42 0.07 55   / 0.55)", icon: "oklch(0.78 0.07 55)" },
};

function TypeIcon({
  type,
  className,
  style,
}: {
  type: KnowledgeItemType;
  className?: string;
  style?: React.CSSProperties;
}) {
  const cls = cn("shrink-0", className);
  if (type === "youtube") return <Youtube className={cls} aria-hidden style={style} />;
  if (type === "course")  return <BookOpen className={cls} aria-hidden style={style} />;
  return <FileText className={cls} aria-hidden style={style} />;
}

const TYPE_LABEL: Record<KnowledgeItemType, string> = {
  youtube: "YouTube",
  course:  "Course",
  article: "Article",
};

// ─── Focus Trap hook ─────────────────────────────────────────────────────────

/**
 * Traps keyboard focus inside `containerRef` while `active` is true.
 * On activation, focuses the first focusable element inside the container.
 */
function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, active: boolean) {
  React.useEffect(() => {
    if (!active || !containerRef.current) return;

    const FOCUSABLE = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(",");

    const el = containerRef.current;
    const focusable = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (focusable.length) focusable[0].focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const nodes = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!nodes.length) return;
      const first = nodes[0];
      const last  = nodes[nodes.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [active, containerRef]);
}

// ─── Individual Spine ─────────────────────────────────────────────────────────

interface SpineProps {
  item: KnowledgeItem;
  index: number;
  isSelected: boolean;
  reduced: boolean;
  setRef: (el: HTMLButtonElement | null) => void;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
}

function Spine({ item, isSelected, reduced, setRef, onClick, onKeyDown }: SpineProps) {
  const palette = SPINE_PALETTE[item.type];

  /* Motion variants for the spine lift */
  const spineVariants: Variants = {
    rest:    { y: 0,  scale: 1 },
    hover:   { y: reduced ? 0 : -8, scale: reduced ? 1 : 1.02 },
    selected:{ y: reduced ? 0 : -6, scale: 1 },
  };

  return (
    <motion.button
      ref={setRef}
      aria-label={`Open chapter: ${item.title} by ${item.author}`}
      aria-pressed={isSelected}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={0}
      initial="rest"
      whileHover="hover"
      animate={isSelected ? "selected" : "rest"}
      variants={spineVariants}
      transition={{ duration: reduced ? 0 : 0.18, ease: "easeOut" }}
      className={cn(
        "group relative flex cursor-pointer flex-col items-center justify-between",
        "rounded-t-sm rounded-b-none px-2.5 py-3",
        "border-x border-t border-b-0",
        "select-none outline-none",
        "transition-[background-color,box-shadow] duration-200",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // selected glow
        isSelected && "shadow-[0_-8px_24px_-4px_var(--glow)]",
      )}
      style={{
        width: "clamp(44px,6vw,60px)",
        height: "clamp(160px,20vh,220px)",
        background: palette.bg,
        borderColor: palette.border,
        // CSS variable for the glow colour
        ["--glow" as string]: isSelected
          ? SPINE_PALETTE[item.type].icon.replace("oklch(", "oklch(").replace(")", " / 0.35)")
          : "transparent",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Type icon — top */}
      <TypeIcon
        type={item.type}
        className="h-3.5 w-3.5 transition-opacity duration-200 group-hover:opacity-100"
        style={{ color: palette.icon, opacity: isSelected ? 1 : 0.7 } as React.CSSProperties}
      />

      {/* Rotated title */}
      <span
        className={cn(
          "max-w-[170px] overflow-hidden text-ellipsis whitespace-nowrap",
          "text-[10px] font-medium leading-none tracking-[0.08em]",
          "transition-colors duration-200",
          isSelected ? "text-foreground" : "text-foreground/60 group-hover:text-foreground/90",
        )}
        style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
      >
        {item.title}
      </span>

      {/* Author — bottom */}
      <span
        className={cn(
          "max-w-[36px] overflow-hidden text-ellipsis whitespace-nowrap",
          "font-mono text-[8px] uppercase tracking-[0.1em]",
          isSelected ? "text-foreground/80" : "text-foreground/40 group-hover:text-foreground/60",
        )}
        style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}
      >
        {item.author}
      </span>
    </motion.button>
  );
}

// ─── Chapter Canvas ───────────────────────────────────────────────────────────

interface CanvasProps {
  item: KnowledgeItem;
  reduced: boolean;
  onClose: () => void;
}

function ChapterCanvas({ item, reduced, onClose }: CanvasProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, true);

  /* Close on Escape */
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: reduced ? 0.1 : 0.22 } },
    exit:   { opacity: 0, transition: { duration: reduced ? 0.05 : 0.15 } },
  };

  const cardVariants: Variants = {
    hidden:  { opacity: 0, scale: reduced ? 1 : 0.95, y: reduced ? 0 : 12 },
    visible: {
      opacity: 1, scale: 1, y: 0,
      transition: { duration: reduced ? 0.1 : 0.28, ease: "easeOut", delay: reduced ? 0 : 0.04 },
    },
    exit: {
      opacity: 0, scale: reduced ? 1 : 0.97, y: reduced ? 0 : -8,
      transition: { duration: reduced ? 0.05 : 0.18, ease: "easeIn" },
    },
  };

  const palette = SPINE_PALETTE[item.type];

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-8"
      style={{ background: "oklch(0.09 0.008 265 / 0.78)", backdropFilter: "blur(6px)" }}
      // Click backdrop to close
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="canvas-title"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn(
          "relative w-full max-w-xl overflow-hidden",
          "rounded-2xl border border-border/60 bg-card/95",
          "shadow-2xl backdrop-blur-xl",
        )}
      >
        {/* Accent bar at top */}
        <div
          className="h-[3px] w-full"
          style={{
            background: `linear-gradient(90deg, ${palette.icon}, ${palette.border})`,
          }}
          aria-hidden
        />

        <div className="flex flex-col gap-5 p-6 sm:p-7">
          {/* ── Header row ──────────────────────────────────────────── */}
          <div className="flex items-start gap-4">
            {/* Type badge + icon */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
              style={{ background: palette.bg, borderColor: palette.border }}
            >
              <TypeIcon type={item.type} className="h-4 w-4" style={{ color: palette.icon } as React.CSSProperties} />
            </div>

            {/* Titles */}
            <div className="min-w-0 flex-1">
              <h3
                id="canvas-title"
                className="text-base font-semibold leading-snug text-foreground"
                style={{ fontFamily: "var(--font-heading), ui-serif, Georgia, serif" }}
              >
                {item.title}
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{item.author}</p>
            </div>

            {/* Close */}
            <button
              aria-label="Close chapter canvas"
              onClick={onClose}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                "border border-border/50 bg-muted/50 text-muted-foreground",
                "transition-colors duration-150 hover:border-border hover:bg-muted hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          {/* ── Metadata row ──────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-border/40 bg-muted px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {TYPE_LABEL[item.type]}
            </span>
            {item.completed && (
              <span className="rounded-full border border-border/40 bg-muted px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Completed {item.completed}
              </span>
            )}
          </div>

          {/* ── Golden Nugget ─────────────────────────────────────────── */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <p className="mb-2 font-mono text-[10px] tracking-[0.22em] uppercase text-primary/60">
              Golden Nugget
            </p>
            <blockquote className="border-l-2 border-primary/40 pl-3">
              <p className="text-sm leading-relaxed text-foreground/85 italic">
                "{item.nugget}"
              </p>
            </blockquote>
          </div>

          {/* ── Tags ──────────────────────────────────────────────────── */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent/60 px-2.5 py-0.5 text-xs text-accent-foreground/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* ── Action buttons ────────────────────────────────────────── */}
          {(item.url || item.certificateUrl) && (
            <div className="flex flex-wrap gap-2.5 pt-1">
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border border-border/60",
                    "bg-muted/50 px-4 py-2 text-sm font-medium text-foreground/80",
                    "transition-colors duration-150 hover:border-primary/40 hover:bg-accent/40 hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  )}
                >
                  Open resource
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              )}
              {item.certificateUrl && (
                <a
                  href={item.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border",
                    "px-4 py-2 text-sm font-medium",
                    "transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  )}
                  style={{
                    borderColor: palette.border,
                    background: palette.bg,
                    color: palette.icon,
                  }}
                >
                  <Award className="h-3.5 w-3.5" aria-hidden />
                  View certificate
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export function KnowledgeShelf({ items, className }: KnowledgeShelfProps) {
  const reduced = usePrefersReducedMotion();

  const [openId, setOpenId] = React.useState<string | null>(null);
  const spineRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const openItem = items.find((i) => i.id === openId) ?? null;

  /* Return focus to the triggering spine when canvas closes */
  const handleClose = React.useCallback(() => {
    const id = openId;
    setOpenId(null);
    if (id) {
      // rAF ensures the button is unmounted/mounted before focusing
      requestAnimationFrame(() => {
        spineRefs.current[id]?.focus();
      });
    }
  }, [openId]);

  /* ArrowLeft / ArrowRight navigation between spines */
  const handleSpineKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = items[(idx + 1) % items.length];
        spineRefs.current[next.id]?.focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = items[(idx - 1 + items.length) % items.length];
        spineRefs.current[prev.id]?.focus();
      }
    },
    [items],
  );

  return (
    <div className={cn("relative w-full select-none", className)}>
      {/* ── Hint text ──────────────────────────────────────────────────── */}
      <p
        className="mb-4 text-center font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50"
        aria-hidden
      >
        click a spine to open its chapter canvas
      </p>

      {/* ── Shelf container ────────────────────────────────────────────── */}
      <div className="relative">
        {/* Spines row */}
        <div
          className="flex items-end justify-center gap-1 sm:gap-1.5"
          role="group"
          aria-label="Knowledge shelf"
        >
          {items.map((item, idx) => (
            <Spine
              key={item.id}
              item={item}
              index={idx}
              isSelected={openId === item.id}
              reduced={reduced}
              setRef={(el) => { spineRefs.current[item.id] = el; }}
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              onKeyDown={(e) => handleSpineKeyDown(e, idx)}
            />
          ))}
        </div>

        {/* Shelf line */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.45 0.02 265 / 0.6) 20%, oklch(0.55 0.04 55 / 0.5) 50%, oklch(0.45 0.02 265 / 0.6) 80%, transparent)",
          }}
          aria-hidden
        />
        {/* Shelf shadow / depth */}
        <div
          className="h-1.5 w-full rounded-b-sm"
          style={{ background: "oklch(0.06 0.005 265 / 0.6)" }}
          aria-hidden
        />

        {/* ── Chapter Canvas overlay (in-scene) ──────────────────────── */}
        <AnimatePresence mode="wait">
          {openItem && (
            <ChapterCanvas
              key={openItem.id}
              item={openItem}
              reduced={reduced}
              onClose={handleClose}
            />
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
