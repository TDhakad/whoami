// ─────────────────────────────────────────────────────────────────────────────
// projects-carousel.tsx
//
// 3D coverflow carousel with center-card flip-in-place.
//   • Center card is dominant; side cards are angled, smaller, dimmed.
//   • Clicking a side card centers it (no flip).
//   • Active card: "Details" button (top-right) + clicking card body toggles flip.
//   • Keyboard: ArrowLeft/Right navigates; Enter/Space flips center.
//   • Pointer drag/swipe navigates.
//   • Reduced motion: no rotateY/translateZ; flip is a crossfade.
//   • NO spotlight panel below the carousel — details live on the card back.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ───────────────────────────────────────────────────── */
export interface ProjectItem {
  id:          string;
  title:       string;
  oneLiner:    string;
  outcome?:    string;
  tags:        string[];
  role?:       string;
  year?:       string;
  link?:       string;
  highlights?: string[];
}

interface ProjectsCarouselProps {
  items:   ProjectItem[];
  onOpen?: (id: string) => void;
}

/* ── Responsive hook ─────────────────────────────────────────── */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

/* ── Helpers ─────────────────────────────────────────────────── */
function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

const DRAG_THRESHOLD = 60;
const VISIBLE_SIDE   = 2;

/* ── ProjectsCarousel ────────────────────────────────────────── */
export function ProjectsCarousel({ items, onOpen }: ProjectsCarouselProps) {
  const reduced   = useReducedMotion() ?? false;
  const isDesktop = useIsDesktop();

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isFlipped,   setIsFlipped]   = React.useState(false);

  // Card dimensions
  const cardW = isDesktop ? 420 : 320;
  const cardH = isDesktop ? 400 : 360;

  // Coverflow spacing
  const OFFSET_X     = isDesktop ? 240 : 170;
  const ROTATE_Y_DEG = isDesktop ? 26  : 18;

  // Reset flip whenever a different card becomes active
  React.useEffect(() => { setIsFlipped(false); }, [activeIndex]);

  /* ── Pointer drag ── */
  const dragStartX = React.useRef<number | null>(null);
  const isDragging = React.useRef(false);

  function handlePointerDown(e: React.PointerEvent) {
    dragStartX.current = e.clientX;
    isDragging.current = false;
  }
  function handlePointerMove(e: React.PointerEvent) {
    if (dragStartX.current === null) return;
    if (Math.abs(e.clientX - dragStartX.current) > 6) isDragging.current = true;
  }
  function handlePointerUp(e: React.PointerEvent) {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (!isDragging.current) return;
    isDragging.current = false;
    if (delta < -DRAG_THRESHOLD) navigate(1);
    else if (delta > DRAG_THRESHOLD) navigate(-1);
  }

  /* ── Navigation ── */
  function navigate(dir: 1 | -1) {
    setActiveIndex((i) => clamp(i + dir, 0, items.length - 1));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft")  { e.preventDefault(); navigate(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); navigate(1);  }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsFlipped((f) => !f);
    }
  }

  function handleCardClick(index: number) {
    if (isDragging.current) return;
    if (index === activeIndex) {
      setIsFlipped((f) => !f);
    } else {
      setActiveIndex(index);
    }
  }

  const stageH = cardH + 64;

  return (
    <div className="flex w-full flex-col items-center gap-6">

      {/* ── Stage ── */}
      <div
        role="region"
        aria-label="Projects carousel"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full select-none outline-none focus-visible:outline-none"
        style={{ height: stageH }}
      >
        {/* Perspective wrapper */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: reduced ? undefined : "1200px" }}
        >
          {/* Stage floor glow */}
          <div
            aria-hidden
            className="absolute bottom-2 left-1/2 h-16 w-2/3 -translate-x-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse at center, oklch(0.78 0.07 55 / 0.08), transparent 70%)",
            }}
          />

          {/* Cards */}
          {items.map((item, index) => {
            const offset   = index - activeIndex;
            const absOff   = Math.abs(offset);
            const isActive = offset === 0;
            const isHidden = absOff > VISIBLE_SIDE + 1;

            if (isHidden) return null;

            const x          = offset * (reduced ? (isDesktop ? 200 : 140) : OFFSET_X);
            const y          = !reduced && isActive ? -8 : 0;
            const rotateY    = reduced ? 0 : offset * -ROTATE_Y_DEG;
            const scale      = isActive ? 1 : (absOff === 1 ? 0.92 : 0.85);
            const opacity    = isActive ? 1 : (absOff === 1 ? 0.72 : 0.45);
            const translateZ = reduced ? 0 : (isActive ? 80 : (absOff === 1 ? 30 : 0));
            const zIndex     = items.length - absOff;

            return (
              <CardWrapper
                key={item.id}
                item={item}
                isActive={isActive}
                isFlipped={isActive ? isFlipped : false}
                reduced={reduced}
                x={x}
                y={y}
                scale={scale}
                opacity={opacity}
                rotateY={rotateY}
                translateZ={translateZ}
                zIndex={zIndex}
                cardW={cardW}
                cardH={cardH}
                onClick={() => handleCardClick(index)}
                onFlipToggle={() => setIsFlipped((f) => !f)}
                onOpen={onOpen}
              />
            );
          })}
        </div>
      </div>

      {/* ── Nav controls + dots ── */}
      <div className="flex items-center gap-4">
        <button
          aria-label="Previous project"
          onClick={() => navigate(-1)}
          disabled={activeIndex === 0}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border border-border/45",
            "text-muted-foreground transition-colors",
            "hover:border-primary/40 hover:text-primary",
            "disabled:pointer-events-none disabled:opacity-30",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/55",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Project cards">
          {items.map((item, i) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={item.title}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/55",
                i === activeIndex
                  ? "w-5 bg-primary"
                  : "w-1.5 bg-border hover:bg-muted-foreground/50",
              )}
            />
          ))}
        </div>

        <button
          aria-label="Next project"
          onClick={() => navigate(1)}
          disabled={activeIndex === items.length - 1}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border border-border/45",
            "text-muted-foreground transition-colors",
            "hover:border-primary/40 hover:text-primary",
            "disabled:pointer-events-none disabled:opacity-30",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/55",
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* ── Hint ── */}
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground/45">
        {reduced
          ? "Click card to reveal details"
          : "Click center card to flip · Drag or arrows to navigate"}
      </p>
    </div>
  );
}

/* ── CardWrapper ─────────────────────────────────────────────── */
interface CardWrapperProps {
  item:         ProjectItem;
  isActive:     boolean;
  isFlipped:    boolean;
  reduced:      boolean;
  x:            number;
  y:            number;
  scale:        number;
  opacity:      number;
  rotateY:      number;
  translateZ:   number;
  zIndex:       number;
  cardW:        number;
  cardH:        number;
  onClick:      () => void;
  onFlipToggle: () => void;
  onOpen?:      (id: string) => void;
}

function CardWrapper({
  item,
  isActive,
  isFlipped,
  reduced,
  x, y, scale, opacity, rotateY, translateZ, zIndex,
  cardW, cardH,
  onClick,
  onFlipToggle,
  onOpen,
}: CardWrapperProps) {
  return (
    <motion.div
      aria-hidden={!isActive}
      animate={{ x, y, scale, opacity, rotateY }}
      transition={{ type: "spring", stiffness: 320, damping: 34, mass: 1 }}
      style={{
        position:        "absolute",
        width:           cardW,
        height:          cardH,
        zIndex,
        cursor:          "pointer",
        transformOrigin: "center center",
        translateZ,
      }}
      onClick={onClick}
    >
      {reduced ? (
        /* ── Reduced motion: flat + AnimatePresence crossfade ── */
        <div
          className={cn(
            "relative h-full w-full overflow-hidden rounded-3xl",
            "border border-border/25",
            "bg-gradient-to-br from-card/95 via-card/70 to-card/40",
            isActive
              ? "shadow-[0_20px_60px_-12px_rgba(0,0,0,0.20),0_4px_12px_rgba(0,0,0,0.08)]"
              : "shadow-[0_4px_16px_-4px_rgba(0,0,0,0.10)]",
            isActive && "ring-1 ring-primary/20",
          )}
        >
          <AnimatePresence mode="wait">
            {!isFlipped ? (
              <motion.div
                key="front"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex h-full flex-col p-7"
              >
                <FrontContent item={item} isActive={isActive} onFlip={onFlipToggle} />
              </motion.div>
            ) : (
              <motion.div
                key="back"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="flex h-full flex-col p-7"
              >
                <BackContent item={item} onFlip={onFlipToggle} onOpen={onOpen} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        /* ── Full 3D flip ── */
        <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
          <motion.div
            className="relative h-full w-full"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front face */}
            <div
              className={cn(
                "absolute inset-0 overflow-hidden rounded-3xl",
                "border border-border/25",
                "bg-gradient-to-br from-card/95 via-card/70 to-card/40",
                isActive
                  ? "shadow-[0_24px_64px_-14px_rgba(0,0,0,0.24),0_4px_14px_rgba(0,0,0,0.08)]"
                  : "shadow-[0_4px_20px_-6px_rgba(0,0,0,0.12)]",
                isActive && "ring-1 ring-primary/20",
              )}
              style={{ backfaceVisibility: "hidden" }}
            >
              {isActive && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-3xl"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 50% at 20% 0%, oklch(0.78 0.07 55 / 0.09), transparent)",
                  }}
                />
              )}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-3xl"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.09), transparent)",
                }}
              />
              <div className="flex h-full flex-col p-7">
                <FrontContent item={item} isActive={isActive} onFlip={onFlipToggle} />
              </div>
            </div>

            {/* Back face */}
            <div
              className={cn(
                "absolute inset-0 overflow-hidden rounded-3xl",
                "border border-border/25",
                "bg-gradient-to-br from-card via-card/85 to-card/55",
                "shadow-[0_24px_64px_-14px_rgba(0,0,0,0.24),0_4px_14px_rgba(0,0,0,0.08)]",
              )}
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 45% at 80% 100%, oklch(0.78 0.07 55 / 0.07), transparent)",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-3xl"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.09), transparent)",
                }}
              />
              <div className="flex h-full flex-col p-7">
                <BackContent item={item} onFlip={onFlipToggle} onOpen={onOpen} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

/* ── FrontContent ─────────────────────────────────────────────── */
function FrontContent({
  item,
  isActive,
  onFlip,
}: {
  item:     ProjectItem;
  isActive: boolean;
  onFlip:   () => void;
}) {
  return (
    <>
      {/* Top row: meta + Details button */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          {(item.role || item.year) && (
            <div className="flex items-center gap-2">
              {item.role && (
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-primary/70">
                  {item.role}
                </span>
              )}
              {item.role && item.year && (
                <span className="text-foreground/20">·</span>
              )}
              {item.year && (
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground/60">
                  {item.year}
                </span>
              )}
            </div>
          )}
        </div>

        {isActive && (
          <button
            aria-label="See project details"
            onClick={(e) => { e.stopPropagation(); onFlip(); }}
            className={cn(
              "flex items-center gap-1.5 rounded-full",
              "border border-primary/25 bg-primary/[0.07] px-3 py-1",
              "font-mono text-[10px] uppercase tracking-[0.15em] text-primary",
              "transition-colors hover:border-primary/45 hover:bg-primary/15",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/55",
            )}
          >
            <RotateCcw className="h-3 w-3" aria-hidden />
            Details
          </button>
        )}
      </div>

      {/* Title */}
      <h3
        className="text-lg font-semibold leading-snug text-foreground"
        style={{ fontFamily: "var(--font-heading), ui-serif, Georgia, serif" }}
      >
        {item.title}
      </h3>

      {/* One-liner */}
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-4">
        {item.oneLiner}
      </p>

      {/* Outcome */}
      {item.outcome && (
        <p className="mt-2 text-xs font-medium text-primary/75">
          ↗ {item.outcome}
        </p>
      )}

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/40 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

/* ── BackContent ──────────────────────────────────────────────── */
function BackContent({
  item,
  onFlip,
  onOpen,
}: {
  item:    ProjectItem;
  onFlip:  () => void;
  onOpen?: (id: string) => void;
}) {
  return (
    <>
      {/* Header row */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary/60">
            Case Study
          </p>
          <h3
            className="mt-1 text-base font-semibold text-foreground"
            style={{ fontFamily: "var(--font-heading), ui-serif, Georgia, serif" }}
          >
            {item.title}
          </h3>
        </div>

        <button
          aria-label="Back to front"
          onClick={(e) => { e.stopPropagation(); onFlip(); }}
          className={cn(
            "flex items-center gap-1.5 rounded-full",
            "border border-primary/25 bg-primary/[0.07] px-3 py-1",
            "font-mono text-[10px] uppercase tracking-[0.15em] text-primary",
            "transition-colors hover:border-primary/45 hover:bg-primary/15",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/55",
          )}
        >
          <RotateCcw className="h-3 w-3 scale-x-[-1]" aria-hidden />
          Back
        </button>
      </div>

      {/* Outcome */}
      {item.outcome && (
        <p className="mb-3 text-xs font-medium text-primary/80">↗ {item.outcome}</p>
      )}

      {/* Divider */}
      <div className="mb-3 h-px bg-border/30" />

      {/* Highlights */}
      {item.highlights && item.highlights.length > 0 ? (
        <ul className="flex-1 space-y-2 overflow-auto">
          {item.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span
                aria-hidden
                className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/55"
              />
              {h}
            </li>
          ))}
        </ul>
      ) : (
        <p className="flex-1 text-sm text-muted-foreground">{item.oneLiner}</p>
      )}

      {/* Tags + optional CTA */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-primary/25 bg-primary/[0.06] px-2.5 py-0.5 font-mono text-[10px] text-primary/70"
            >
              {tag}
            </span>
          ))}
        </div>

        {onOpen && (
          <button
            aria-label={`Open case study: ${item.title}`}
            onClick={(e) => { e.stopPropagation(); onOpen(item.id); }}
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full",
              "border border-foreground/15 bg-foreground/5 px-3 py-1",
              "font-mono text-[10px] uppercase tracking-[0.12em] text-foreground",
              "transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/55",
            )}
          >
            Open
            <ArrowUpRight className="h-3 w-3" aria-hidden />
          </button>
        )}
      </div>
    </>
  );
}
