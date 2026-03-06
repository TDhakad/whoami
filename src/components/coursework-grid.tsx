// ─────────────────────────────────────────────────────────────────────────────
// coursework-grid.tsx
//
// Grid + inspector panel layout for the Coursework section.
//
// Desktop (≥ md / 768 px):
//   Two columns — left: card grid, right: sticky inspector panel.
//   Inspector updates on card selection; cross-fades between items.
//
// Mobile (< md):
//   Full-width stacked grid.
//   Selecting a card opens a vaul bottom-sheet drawer for the inspector.
//
// Accessibility:
//   Cards use role="option" + aria-selected inside role="listbox".
//   Inspector panel is labelled and live-updated via aria-live.
//
// Reduced motion:
//   Shimmer animation and Framer Motion transitions are disabled
//   when prefers-reduced-motion: reduce is set.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
} from "@/components/ui/drawer";

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Returns true when viewport < breakpoint, null during SSR. */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

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

// ─── Types ────────────────────────────────────────────────────────────────────

export type CourseworkItem = {
  id: string;
  title: string;
  summary: string;
  skills: string[];
  content?: string;
  projectLink?: { label: string; target: string };
};

interface CourseworkGridProps {
  items: CourseworkItem[];
  onProjectLinkClick?: (target: string) => void;
  className?: string;
}

// ─── Root component ──────────────────────────────────────────────────────────

export function CourseworkGrid({
  items,
  onProjectLinkClick,
  className,
}: CourseworkGridProps) {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  // selectedId: seeded to first item on desktop once we know viewport size
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    if (isMobile === false && selectedId === null && items.length > 0) {
      setSelectedId(items[0].id);
    }
  }, [isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedItem = items.find((i) => i.id === selectedId) ?? null;

  function handleSelect(item: CourseworkItem) {
    setSelectedId(item.id);
    if (isMobile) {
      setDrawerOpen(true);
    }
  }

  return (
    <>
      {/* ── Two-column layout on desktop ── */}
      <div className={cn("md:grid md:grid-cols-[1.4fr_0.9fr] md:gap-10", className)}>

        {/* Left — card grid */}
        <div
          role="listbox"
          aria-label="Coursework disciplines"
          aria-orientation="vertical"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2"
        >
          {items.map((item) => (
            <GridCard
              key={item.id}
              item={item}
              isSelected={item.id === selectedId}
              onSelect={() => handleSelect(item)}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* Right — sticky inspector panel (desktop only) */}
        <div className="hidden md:block">
          <div className="sticky" style={{ top: "96px" }}>
            <AnimatePresence mode="wait">
              {selectedItem && (
                <motion.div
                  key={selectedItem.id}
                  initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                  exit={reducedMotion ? {} : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <InspectorPanel
                    item={selectedItem}
                    onProjectLinkClick={onProjectLinkClick}
                    reducedMotion={reducedMotion}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Mobile bottom-sheet drawer ── */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[90dvh]">
          {selectedItem && (
            <MobileInspector
              item={selectedItem}
              onProjectLinkClick={onProjectLinkClick}
              onClose={() => setDrawerOpen(false)}
            />
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

// ─── Grid card ────────────────────────────────────────────────────────────────

interface GridCardProps {
  item: CourseworkItem;
  isSelected: boolean;
  onSelect: () => void;
  reducedMotion: boolean;
}

function GridCard({ item, isSelected, onSelect, reducedMotion }: GridCardProps) {
  return (
    <motion.button
      role="option"
      aria-selected={isSelected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      whileHover={reducedMotion ? {} : { y: -2 }}
      whileTap={reducedMotion ? {} : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        // Base
        "group relative w-full overflow-hidden rounded-2xl text-left",
        "border bg-card/40 p-5 shadow-sm shadow-black/[0.04]",
        "transition-colors duration-200",
        // Focus ring
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/55",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // Idle state
        !isSelected && [
          "border-border/35",
          "hover:border-primary/25 hover:bg-card/70 hover:shadow-md hover:shadow-black/[0.06]",
        ],
        // Selected state
        isSelected && [
          "border-primary/30 bg-card/70",
          // ambient glow via box-shadow
          "shadow-[0_0_0_1px_oklch(0.78_0.07_55_/_0.18),0_4px_18px_oklch(0.78_0.07_55_/_0.12)]",
        ],
      )}
    >
      {/* Left accent bar — only when selected */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-0 w-[3px] rounded-l-2xl",
          "bg-primary/70 transition-opacity duration-200",
          isSelected ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Content */}
      <div className="pl-1">
        {/* Eyebrow */}
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary/55">
          Discipline
        </p>

        {/* Title */}
        <p className="mt-1.5 text-sm font-semibold leading-snug text-foreground">
          {item.title}
        </p>

        {/* Summary */}
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {item.summary}
        </p>

        {/* Skill count hint */}
        <p
          className={cn(
            "mt-4 font-mono text-[10px] transition-colors",
            isSelected
              ? "text-primary/70"
              : "text-primary/40 group-hover:text-primary/60",
          )}
        >
          {item.skills.length} skills
          {isSelected ? " · inspecting ↗" : " · click to inspect →"}
        </p>
      </div>
    </motion.button>
  );
}

// ─── Inspector panel (desktop) ────────────────────────────────────────────────

interface InspectorPanelProps {
  item: CourseworkItem;
  onProjectLinkClick?: (target: string) => void;
  reducedMotion: boolean;
}

function InspectorPanel({ item, onProjectLinkClick, reducedMotion }: InspectorPanelProps) {
  return (
    <div
      aria-label={`Inspector: ${item.title}`}
      aria-live="polite"
      className={cn(
        "overflow-hidden rounded-2xl",
        "border border-border/35",
        // Glass
        "bg-card/55 backdrop-blur-md",
        "shadow-lg shadow-black/[0.08]",
      )}
    >
      {/* Shimmer header band */}
      <div
        className={cn(
          "relative overflow-hidden px-6 pb-5 pt-6",
          !reducedMotion && "inspector-shimmer",
          reducedMotion && "bg-[oklch(0.78_0.07_55_/_0.04)]",
        )}
      >
        {/* Noise grain overlay */}
        <div aria-hidden className="noise-overlay pointer-events-none absolute inset-0 rounded-t-2xl" />

        <p className="relative font-mono text-[10px] uppercase tracking-[0.22em] text-primary/55">
          Inspector
        </p>
        <h3 className="relative mt-1.5 text-base font-semibold leading-snug text-foreground">
          {item.title}
        </h3>
        <p className="relative mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {item.summary}
        </p>
      </div>

      {/* Hairline */}
      <div className="h-px bg-border/30" />

      {/* Body */}
      <div className="px-6 pb-6 pt-5">
        {item.content && (
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            {item.content}
          </p>
        )}

        {item.skills.length > 0 && (
          <div className="mb-5">
            <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
              Skills acquired
            </p>
            <div className="flex flex-wrap gap-2">
              {item.skills.map((skill) => (
                <span
                  key={skill}
                  className={cn(
                    "rounded-full border border-primary/20 bg-primary/[0.07] px-2.5 py-1",
                    "font-mono text-[10px] text-primary/75",
                  )}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {item.projectLink && (
          <button
            onClick={() => {
              if (onProjectLinkClick) {
                onProjectLinkClick(item.projectLink!.target);
              }
            }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full",
              "border border-border/45 bg-card px-3.5 py-1.5",
              "text-xs font-medium text-muted-foreground",
              "transition-colors hover:border-primary/35 hover:text-primary",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/55",
            )}
          >
            {item.projectLink.label}
            <ExternalLink className="h-3 w-3" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Mobile inspector (inside Drawer) ────────────────────────────────────────

interface MobileInspectorProps {
  item: CourseworkItem;
  onProjectLinkClick?: (target: string) => void;
  onClose: () => void;
}

function MobileInspector({ item, onProjectLinkClick, onClose }: MobileInspectorProps) {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Header row */}
      <div className="relative flex items-start justify-between overflow-hidden px-6 pb-4 pt-5">
        {/* Shimmer uses CSS class so it respects prefers-reduced-motion automatically */}
        <div aria-hidden className="inspector-shimmer pointer-events-none absolute inset-0" />

        <div className="relative">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary/55">
            Inspector
          </p>
          <h3 className="mt-1.5 text-base font-semibold leading-snug text-foreground">
            {item.title}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {item.summary}
          </p>
        </div>

        <DrawerClose asChild>
          <button
            aria-label="Close inspector"
            className={cn(
              "relative ml-4 mt-0.5 shrink-0 rounded-full p-1.5",
              "text-muted-foreground hover:text-foreground",
              "transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/55",
            )}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </DrawerClose>
      </div>

      {/* Hairline */}
      <div className="mx-6 h-px bg-border/30" />

      {/* Scrollable body */}
      <div className="overflow-y-auto px-6 pb-8 pt-5">
        {item.content && (
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            {item.content}
          </p>
        )}

        {item.skills.length > 0 && (
          <div className="mb-5">
            <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
              Skills acquired
            </p>
            <div className="flex flex-wrap gap-2">
              {item.skills.map((skill) => (
                <span
                  key={skill}
                  className={cn(
                    "rounded-full border border-primary/20 bg-primary/[0.07] px-2.5 py-1",
                    "font-mono text-[10px] text-primary/75",
                  )}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {item.projectLink && (
          <button
            onClick={() => {
              onClose();
              if (onProjectLinkClick) {
                onProjectLinkClick(item.projectLink!.target);
              }
            }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full",
              "border border-border/45 bg-card px-3.5 py-1.5",
              "text-xs font-medium text-muted-foreground",
              "transition-colors hover:border-primary/35 hover:text-primary",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/55",
            )}
          >
            {item.projectLink.label}
            <ExternalLink className="h-3 w-3" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}

