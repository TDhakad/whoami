// ─────────────────────────────────────────────────────────────────────────────
// learning-shelf.tsx
//
// "Learning Shelf + Golden Nuggets" – two-column editorial directory.
//
// Desktop (≥ md / 768 px):
//   LEFT  : filter tabs + scrollable resource list
//   RIGHT : sticky inspector panel ("Golden Nugget") that updates on selection
//
// Mobile (< md):
//   Full-width stacked: tabs + list first, inspector panel below.
//
// Accessibility:
//   Tabs use role="tablist" / role="tab" with aria-selected + aria-controls.
//   Resource list uses role="listbox"; items use role="option" + aria-selected.
//   Inspector uses aria-live="polite" so screen readers announce content changes.
//   Keyboard: Tab to reach list, Up/Down arrow keys to navigate items.
//   Visible focus rings on all interactive elements.
//
// Reduced motion:
//   Inspector crossfade animation and shimmer gradient disabled.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { ExternalLink, Youtube, BookOpen, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Hooks ───────────────────────────────────────────────────────────────────

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

export type LearningResourceType = "youtube" | "course" | "article";

export type LearningItem = {
  id: string;
  type: LearningResourceType;
  title: string;
  author: string;
  source?: string;
  duration?: string;
  tags: string[];
  nugget: string;
  appliedIn: string[];
  url?: string;
};

interface LearningShelfProps {
  items: LearningItem[];
  defaultType?: LearningResourceType;
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS: { key: LearningResourceType; label: string }[] = [
  { key: "youtube", label: "YouTube" },
  { key: "course",  label: "Courses"  },
  { key: "article", label: "Articles" },
];

const TYPE_LABELS: Record<LearningResourceType, string> = {
  youtube: "YouTube",
  course:  "Course",
  article: "Article",
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function ResourceIcon({
  type,
  className,
}: {
  type: LearningResourceType;
  className?: string;
}) {
  if (type === "youtube")
    return <Youtube className={cn("shrink-0", className)} aria-hidden />;
  if (type === "course")
    return <BookOpen className={cn("shrink-0", className)} aria-hidden />;
  return <FileText className={cn("shrink-0", className)} aria-hidden />;
}

// ─── Inspector panel ─────────────────────────────────────────────────────────

interface InspectorProps {
  item: LearningItem;
  reduced: boolean;
}

function Inspector({ item, reduced }: InspectorProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 rounded-xl border border-border/60 bg-card/40 p-6",
        "shadow-lg backdrop-blur-md",
        // subtle ring on dark
        "dark:border-border/40 dark:bg-card/30",
      )}
    >
      {/* ── Header with optional ocean shimmer ────────────────────────── */}
      <div className="relative overflow-hidden rounded-lg px-4 py-3">
        {/* base dim background */}
        <div className="absolute inset-0 rounded-lg bg-primary/10" />

        {/* ocean shimmer gradient (disabled on reduced motion) */}
        {!reduced && (
          <div
            aria-hidden
            className="shimmer-ocean absolute inset-0 rounded-lg"
          />
        )}

        <span className="relative font-mono text-[10px] tracking-[0.25em] uppercase text-primary/80">
          Golden Nugget
        </span>
      </div>

      {/* ── Title + author + badge ─────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-start gap-2">
          <h3 className="flex-1 text-base font-semibold leading-snug text-foreground">
            {item.title}
          </h3>
          <span className="mt-0.5 shrink-0 rounded-full border border-border/50 bg-muted px-2.5 py-0.5 font-mono text-[10px] tracking-wider uppercase text-muted-foreground">
            {TYPE_LABELS[item.type]}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {item.author}
          {item.source && (
            <span className="ml-1.5 text-muted-foreground/60">
              · {item.source}
            </span>
          )}
        </p>
      </div>

      {/* ── Nugget text ────────────────────────────────────────────────── */}
      <blockquote className="border-l-2 border-primary/40 pl-4">
        <p className="text-sm leading-relaxed text-foreground/85 italic">
          "{item.nugget}"
        </p>
      </blockquote>

      {/* ── Applied in ────────────────────────────────────────────────── */}
      {item.appliedIn.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground/70">
            Applied in
          </p>
          <ul className="flex flex-col gap-1.5">
            {item.appliedIn.map((applied, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/75">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" aria-hidden />
                {applied}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Tags ──────────────────────────────────────────────────────── */}
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

      {/* ── Open resource button ──────────────────────────────────────── */}
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "mt-1 inline-flex items-center gap-2 self-start rounded-lg border border-border/60",
            "bg-muted/50 px-4 py-2 text-sm font-medium text-foreground/80",
            "transition-colors duration-150 hover:border-primary/50 hover:bg-accent/50 hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          )}
        >
          Open resource
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function LearningShelf({
  items,
  defaultType = "youtube",
  className,
}: LearningShelfProps) {
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  const [activeType, setActiveType] =
    React.useState<LearningResourceType>(defaultType);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // ── Filtered list ────────────────────────────────────────────────────────
  const filtered = React.useMemo(
    () => items.filter((item) => item.type === activeType),
    [items, activeType],
  );

  // Keep selection valid: if selected item no longer in filtered list,
  // fall back to first item of the new tab.
  React.useEffect(() => {
    if (filtered.length === 0) {
      setSelectedId(null);
      return;
    }
    const stillVisible = filtered.some((i) => i.id === selectedId);
    if (!stillVisible) setSelectedId(filtered[0].id);
  }, [filtered, selectedId]);

  const selectedItem = filtered.find((i) => i.id === selectedId) ?? null;

  // ── Tab change ───────────────────────────────────────────────────────────
  const handleTabChange = (type: LearningResourceType) => {
    setActiveType(type);
    // selection resolves via useEffect above
  };

  // ── Keyboard navigation inside list ─────────────────────────────────────
  const handleListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const idx = filtered.findIndex((i) => i.id === selectedId);
    if (idx === -1) return;
    let next = idx;
    if (e.key === "ArrowDown") next = Math.min(idx + 1, filtered.length - 1);
    if (e.key === "ArrowUp")   next = Math.max(idx - 1, 0);
    if (e.key === "Home")      next = 0;
    if (e.key === "End")       next = filtered.length - 1;
    setSelectedId(filtered[next].id);
  };

  // ── Inspector animation variants ─────────────────────────────────────────
  const inspectorVariants: Variants = reduced
    ? {
        initial: {},
        animate: {},
        exit:    {},
      }
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" as const } },
        exit:    { opacity: 0, y: -6, transition: { duration: 0.18, ease: "easeIn" as const } },
      };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={cn("w-full", className)}>
      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="Filter resources by type"
        className="mb-6 flex gap-1 rounded-lg border border-border/50 bg-muted/40 p-1"
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            id={`tab-${key}`}
            aria-selected={activeType === key}
            aria-controls={`panel-${key}`}
            onClick={() => handleTabChange(key)}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
              activeType === key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Two-column layout ────────────────────────────────────────────── */}
      <div
        id={`panel-${activeType}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeType}`}
        className="flex flex-col gap-6 md:flex-row md:items-start"
      >
        {/* LEFT: Resource list */}
        <div className="md:w-[52%] md:shrink-0">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No {activeType} resources yet.
            </p>
          ) : (
            <ul
              role="listbox"
              aria-label={`${TYPE_LABELS[activeType]} resources`}
              onKeyDown={handleListKeyDown}
              className="flex flex-col gap-1"
            >
              {filtered.map((resource) => {
                const isSelected = resource.id === selectedId;
                return (
                  <li key={resource.id} role="none">
                    <button
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={isSelected ? 0 : -1}
                      onClick={() => setSelectedId(resource.id)}
                      className={cn(
                        "group w-full rounded-lg px-4 py-3.5 text-left transition-colors duration-150",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                        isSelected
                          ? "bg-accent/50 shadow-sm"
                          : "hover:bg-muted/60",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className={cn(
                            "mt-0.5 flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-150",
                            isSelected
                              ? "bg-primary/15 text-primary"
                              : "bg-muted text-muted-foreground group-hover:text-foreground/70",
                          )}
                        >
                          <ResourceIcon type={resource.type} className="h-3.5 w-3.5" />
                        </div>

                        {/* Text */}
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "truncate text-sm font-medium leading-snug transition-colors duration-150",
                              isSelected ? "text-foreground" : "text-foreground/80 group-hover:text-foreground",
                            )}
                          >
                            {resource.title}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {resource.author}
                            {resource.source && (
                              <span className="ml-1 opacity-60">· {resource.source}</span>
                            )}
                            {resource.duration && (
                              <span className="ml-1 opacity-60">· {resource.duration}</span>
                            )}
                          </p>

                          {/* Tags */}
                          {resource.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {resource.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* RIGHT: Inspector panel */}
        <div
          className="min-w-0 flex-1 md:sticky"
          style={{ top: "96px" }}
          aria-live="polite"
          aria-atomic="true"
          aria-label="Resource details"
        >
          {selectedItem ? (
            reduced ? (
              <Inspector item={selectedItem} reduced={reduced} />
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selectedItem.id}
                  variants={inspectorVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Inspector item={selectedItem} reduced={reduced} />
                </motion.div>
              </AnimatePresence>
            )
          ) : (
            <div className="rounded-xl border border-border/40 bg-card/20 px-6 py-12 text-center text-sm text-muted-foreground">
              Select a resource to see details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
