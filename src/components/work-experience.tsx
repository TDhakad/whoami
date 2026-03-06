// ─────────────────────────────────────────────────────────────────────────────
// work-experience.tsx
//
// "Role Deck + Deep-Dive Canvas" layout for the Work Experience section.
//
// Desktop (≥ md / 768 px):
//   Two columns:
//     Left  → RoleDeck  – compact role cards, keyboard-navigable vertical list
//     Right → DeepDiveCanvas – sticky panel showing the selected role
//   "Open Chapter" expands the canvas full-width in-place (no modal).
//
// Mobile (< md):
//   Stacked RoleDeck list → selecting a role opens a vaul bottom-sheet drawer.
//
// Accessibility:
//   - role="listbox" + role="option" + aria-selected on deck items
//   - ArrowUp / ArrowDown moves selection
//   - aria-live="polite" on canvas
//   - prefers-reduced-motion respected throughout
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ExternalLink, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
} from "@/components/ui/drawer";

// ─── Types ────────────────────────────────────────────────────────────────────

export type WorkRoleType = "Full-time" | "Intern" | "Freelance" | "Contract";

export type WorkRole = {
  id: string;
  /** Intern | Full-time | Freelance | Contract */
  type: WorkRoleType;
  title: string;
  company: string;
  /** e.g. "Jun 2023 – Present" */
  dates: string;
  /** One-line hook shown in the deck card */
  hook: string;
  techBullets: string[];
  businessBullets: string[];
  skills: string[];
  /** Short narrator line shown in the Chapter expansion */
  narratorLine?: string;
  supervisor?: { name: string; role: string };
  companyUrl?: string;
};

interface WorkExperienceProps {
  roles: WorkRole[];
  className?: string;
}

// ─── Role type badge colour map ───────────────────────────────────────────────

const roleBadgeClass: Record<WorkRoleType, string> = {
  "Full-time": "bg-primary/10 text-primary/80 border-primary/20",
  "Intern":    "bg-sky-400/10 text-sky-400/80 border-sky-400/20",
  "Freelance": "bg-emerald-400/10 text-emerald-400/80 border-emerald-400/20",
  "Contract":  "bg-violet-400/10 text-violet-400/80 border-violet-400/20",
};

// ─── Mobile breakpoint hook ───────────────────────────────────────────────────

function useIsMobile(breakpoint = 768) {
  const [m, setM] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setM(mq.matches);
    const h = (e: MediaQueryListEvent) => setM(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, [breakpoint]);
  return m;
}

// ─── Root component ───────────────────────────────────────────────────────────

export function WorkExperience({ roles, className }: WorkExperienceProps) {
  const isMobile       = useIsMobile();
  const reduced        = useReducedMotion();
  const [selectedId, setSelectedId]     = React.useState<string>(roles[0]?.id ?? "");
  const [chapterOpen, setChapterOpen]   = React.useState(false);
  const [drawerOpen, setDrawerOpen]     = React.useState(false);
  const deckRef                         = React.useRef<HTMLDivElement>(null);
  const itemRefs                        = React.useRef<(HTMLButtonElement | null)[]>([]);

  const selectedIndex = roles.findIndex((r) => r.id === selectedId);
  const selectedRole  = roles[selectedIndex] ?? roles[0];

  // ── Selection ──────────────────────────────────────────────────────────────

  function selectRole(id: string) {
    if (id === selectedId) return;
    setChapterOpen(false);
    setSelectedId(id);
  }

  function handleDeckKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const next = Math.min(index + 1, roles.length - 1);
      selectRole(roles[next].id);
      itemRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = Math.max(index - 1, 0);
      selectRole(roles[prev].id);
      itemRefs.current[prev]?.focus();
    }
  }

  function handleCardClick(role: WorkRole) {
    if (isMobile) {
      setSelectedId(role.id);
      setDrawerOpen(true);
    } else {
      selectRole(role.id);
    }
  }

  // ── Chapter ────────────────────────────────────────────────────────────────

  function openChapter() {
    setChapterOpen(true);
  }
  function closeChapter() {
    setChapterOpen(false);
  }

  // ── Seed selection on desktop ──────────────────────────────────────────────
  React.useEffect(() => {
    if (isMobile === false && !selectedId && roles.length > 0) {
      setSelectedId(roles[0].id);
    }
  }, [isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Chapter expansion transitions ─────────────────────────────────────────

  const canvasTransition = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 320, damping: 32 };

  return (
    <div className={cn("relative w-full", className)}>

      <AnimatePresence mode="wait">

        {/* ── Normal (deck + canvas) view ───────────────────────────────── */}
        {!chapterOpen && (
          <motion.div
            key="normal"
            initial={reduced ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? {} : { opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25 }}
            className="md:grid md:grid-cols-[0.9fr_1.3fr] md:gap-10"
          >
            {/* ── RoleDeck ──────────────────────────────────────────────── */}
            <div
              ref={deckRef}
              role="listbox"
              aria-label="Work roles"
              aria-orientation="vertical"
              className="flex flex-col gap-2.5"
            >
              {roles.map((role, i) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  isSelected={role.id === selectedId}
                  ref={(el) => { itemRefs.current[i] = el; }}
                  onClick={() => handleCardClick(role)}
                  onKeyDown={(e) => handleDeckKeyDown(e, i)}
                  reduced={!!reduced}
                />
              ))}
            </div>

            {/* ── DeepDiveCanvas (desktop) ───────────────────────────────── */}
            <div className="hidden md:block">
              <div className="sticky" style={{ top: "96px" }}>
                <AnimatePresence mode="wait">
                  {selectedRole && (
                    <motion.div
                      key={selectedRole.id}
                      initial={reduced ? {} : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduced ? {} : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                    >
                      <DeepDiveCanvas
                        role={selectedRole}
                        onOpenChapter={openChapter}
                        reduced={!!reduced}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Chapter expansion view ────────────────────────────────────── */}
        {chapterOpen && selectedRole && (
          <motion.div
            key="chapter"
            initial={reduced ? {} : { opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? {} : { opacity: 0, scale: 0.98, y: 16 }}
            transition={canvasTransition}
          >
            <ChapterView
              role={selectedRole}
              onClose={closeChapter}
              reduced={!!reduced}
            />
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── Mobile bottom-sheet drawer ────────────────────────────────────── */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[92dvh]">
          {selectedRole && (
            <MobileCanvas
              role={selectedRole}
              onClose={() => setDrawerOpen(false)}
            />
          )}
        </DrawerContent>
      </Drawer>

    </div>
  );
}

// ─── RoleCard ─────────────────────────────────────────────────────────────────

interface RoleCardProps {
  role: WorkRole;
  isSelected: boolean;
  onClick: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  reduced: boolean;
}

const RoleCard = React.forwardRef<HTMLButtonElement, RoleCardProps>(
  ({ role, isSelected, onClick, onKeyDown, reduced }, ref) => {
    return (
      <motion.button
        ref={ref}
        role="option"
        aria-selected={isSelected}
        tabIndex={0}
        onClick={onClick}
        onKeyDown={onKeyDown}
        whileHover={reduced ? {} : { x: 2 }}
        whileTap={reduced ? {} : { scale: 0.985 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={cn(
          "group relative w-full rounded-xl border p-4 text-left",
          "transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/55",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          // idle
          !isSelected && [
            "border-border/30 bg-card/35",
            "hover:border-primary/20 hover:bg-card/60",
          ],
          // selected
          isSelected && [
            "border-primary/30 bg-card/65",
            "shadow-[0_0_0_1px_oklch(0.78_0.07_55_/_0.15),0_4px_20px_oklch(0.78_0.07_55_/_0.10)]",
          ],
        )}
      >
        {/* Selected left bar */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-0 left-0 w-[3px] rounded-l-xl bg-primary/70",
            "transition-opacity duration-200",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        />

        <div className="pl-1">
          {/* Row 1: badge + dates */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "rounded-full border px-2 py-0.5",
                "font-mono text-[9px] font-medium uppercase tracking-[0.18em]",
                roleBadgeClass[role.type] ?? roleBadgeClass["Full-time"],
              )}
            >
              {role.type}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/60 shrink-0">
              {role.dates}
            </span>
          </div>

          {/* Row 2: title + company */}
          <p className="mt-2 text-sm font-semibold leading-snug text-foreground">
            {role.title}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {role.company}
          </p>

          {/* Row 3: hook */}
          <p
            className={cn(
              "mt-2.5 text-xs leading-relaxed transition-colors",
              isSelected ? "text-muted-foreground" : "text-muted-foreground/60 group-hover:text-muted-foreground/80",
            )}
          >
            {role.hook}
          </p>
        </div>
      </motion.button>
    );
  }
);
RoleCard.displayName = "RoleCard";

// ─── DeepDiveCanvas ───────────────────────────────────────────────────────────

interface DeepDiveCanvasProps {
  role: WorkRole;
  onOpenChapter: () => void;
  reduced: boolean;
}

function DeepDiveCanvas({ role, onOpenChapter, reduced }: DeepDiveCanvasProps) {
  return (
    <div
      aria-label={`Details: ${role.title} at ${role.company}`}
      aria-live="polite"
      className={cn(
        "overflow-hidden rounded-2xl",
        "border border-border/35",
        "bg-card/55 backdrop-blur-md",
        "shadow-lg shadow-black/[0.07]",
      )}
    >
      {/* Header shimmer band */}
      <div
        className={cn(
          "relative overflow-hidden px-6 pb-5 pt-6",
          !reduced && "inspector-shimmer",
          reduced && "bg-[oklch(0.78_0.07_55_/_0.04)]",
        )}
      >
        <div aria-hidden className="noise-overlay pointer-events-none absolute inset-0 rounded-t-2xl" />

        {/* Type badge */}
        <span
          className={cn(
            "relative rounded-full border px-2 py-0.5",
            "font-mono text-[9px] font-medium uppercase tracking-[0.18em]",
            roleBadgeClass[role.type] ?? roleBadgeClass["Full-time"],
          )}
        >
          {role.type}
        </span>

        {/* Title + company */}
        <h3 className="relative mt-2 text-lg font-semibold leading-snug text-foreground">
          {role.title}
        </h3>
        <p className="relative mt-0.5 text-sm text-muted-foreground">
          {role.company}
        </p>
        <p className="relative mt-1 font-mono text-[11px] text-muted-foreground/55">
          {role.dates}
        </p>
      </div>

      {/* Hairline */}
      <div className="h-px bg-border/30" />

      {/* Body */}
      <div className="px-6 pb-6 pt-5">

        {/* Technical Implementation */}
        <BulletGroup label="Technical Implementation" bullets={role.techBullets} />

        {/* Business Impact */}
        <BulletGroup label="Business Impact" bullets={role.businessBullets} className="mt-5" />

        {/* Skills chips */}
        {role.skills.length > 0 && (
          <div className="mt-5">
            <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/55">
              Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {role.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-primary/20 bg-primary/[0.07] px-2.5 py-0.5 font-mono text-[10px] text-primary/75"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Supervisor + company URL */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {role.supervisor && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
              <UserRound className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>{role.supervisor.name}</span>
              <span className="text-muted-foreground/40">·</span>
              <span>{role.supervisor.role}</span>
            </div>
          )}
          {role.companyUrl && (
            <a
              href={role.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1 text-xs text-muted-foreground/60",
                "hover:text-primary transition-colors focus:outline-none",
                "focus-visible:ring-2 focus-visible:ring-primary/55 rounded",
              )}
            >
              {role.company}
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          )}
        </div>

        {/* Open Chapter CTA */}
        <button
          onClick={onOpenChapter}
          className={cn(
            "mt-5 inline-flex items-center gap-2 rounded-full",
            "border border-primary/30 bg-primary/[0.08] px-4 py-2",
            "text-xs font-medium text-primary/80",
            "transition-all hover:bg-primary/[0.14] hover:border-primary/45 hover:text-primary",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/55",
          )}
        >
          Open Chapter
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </button>

      </div>
    </div>
  );
}

// ─── ChapterView ──────────────────────────────────────────────────────────────

interface ChapterViewProps {
  role: WorkRole;
  onClose: () => void;
  reduced: boolean;
}

function ChapterView({ role, onClose, reduced }: ChapterViewProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl",
        "border border-primary/20",
        "bg-card/60 backdrop-blur-md",
        "shadow-xl shadow-black/[0.10]",
      )}
    >
      {/* Back + eyebrow bar */}
      <div
        className={cn(
          "relative flex items-center justify-between overflow-hidden px-6 py-4",
          !reduced && "inspector-shimmer",
          reduced && "bg-[oklch(0.78_0.07_55_/_0.04)]",
        )}
      >
        <div aria-hidden className="noise-overlay pointer-events-none absolute inset-0" />

        <button
          onClick={onClose}
          className={cn(
            "relative inline-flex items-center gap-1.5 rounded-full",
            "border border-border/35 bg-card/50 px-3 py-1.5",
            "text-xs font-medium text-muted-foreground",
            "transition-colors hover:border-primary/30 hover:text-primary",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/55",
          )}
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
          Back
        </button>

        <p className="relative font-mono text-[10px] uppercase tracking-[0.22em] text-primary/55">
          Chapter
        </p>
      </div>

      {/* Narrator line */}
      {role.narratorLine && (
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : 0.15, duration: 0.4, ease: "easeOut" }}
          className="border-b border-border/20 bg-primary/[0.04] px-6 py-3"
        >
          <p className="text-xs italic text-muted-foreground/70 text-balance">
            &ldquo;{role.narratorLine}&rdquo;
          </p>
        </motion.div>
      )}

      {/* Chapter body — two column on md+ */}
      <div className="px-6 pb-10 pt-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5",
                "font-mono text-[9px] font-medium uppercase tracking-[0.18em]",
                roleBadgeClass[role.type],
              )}
            >
              {role.type}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground/55">{role.dates}</span>
          </div>
          <h2
            className="mt-3 text-2xl font-semibold leading-snug text-foreground"
            style={{ fontFamily: "var(--font-heading), ui-serif, Georgia, serif" }}
          >
            {role.title}
          </h2>
          <p className="mt-1 text-base text-muted-foreground">{role.company}</p>
        </div>

        {/* Two columns for bullets on md+ */}
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <BulletGroup label="Technical Implementation" bullets={role.techBullets} large />
          </div>
          <div>
            <BulletGroup label="Business Impact" bullets={role.businessBullets} large />
          </div>
        </div>

        {/* Skills */}
        {role.skills.length > 0 && (
          <div className="mt-8">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/55">
              Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {role.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-primary/20 bg-primary/[0.07] px-3 py-1 font-mono text-[11px] text-primary/75"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Supervisor + link */}
        {(role.supervisor || role.companyUrl) && (
          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border/20 pt-6">
            {role.supervisor && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground/70">
                <UserRound className="h-4 w-4 shrink-0" aria-hidden />
                <span className="font-medium">{role.supervisor.name}</span>
                <span className="text-muted-foreground/40">·</span>
                <span>{role.supervisor.role}</span>
              </div>
            )}
            {role.companyUrl && (
              <a
                href={role.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-1.5 text-sm text-muted-foreground/60",
                  "hover:text-primary transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/55 rounded",
                )}
              >
                Visit {role.company}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// ─── MobileCanvas (inside Drawer) ────────────────────────────────────────────

interface MobileCanvasProps {
  role: WorkRole;
  onClose: () => void;
}

function MobileCanvas({ role, onClose }: MobileCanvasProps) {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Header */}
      <div className="relative overflow-hidden px-6 pb-4 pt-5">
        <div aria-hidden className="inspector-shimmer pointer-events-none absolute inset-0" />
        <div className="relative flex items-start justify-between">
          <div className="flex-1 mr-3">
            <span
              className={cn(
                "rounded-full border px-2 py-0.5",
                "font-mono text-[9px] font-medium uppercase tracking-[0.18em]",
                roleBadgeClass[role.type],
              )}
            >
              {role.type}
            </span>
            <h3 className="mt-2 text-base font-semibold leading-snug text-foreground">
              {role.title}
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{role.company}</p>
            <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/50">{role.dates}</p>
          </div>
          <DrawerClose asChild>
            <button
              aria-label="Close panel"
              className={cn(
                "relative mt-0.5 shrink-0 rounded-full border border-border/30 p-1.5",
                "text-muted-foreground hover:text-foreground transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/55",
              )}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </DrawerClose>
        </div>
      </div>

      {/* Hairline */}
      <div className="mx-6 h-px bg-border/30" />

      {/* Scrollable body */}
      <div className="overflow-y-auto px-6 pb-8 pt-5">
        <BulletGroup label="Technical Implementation" bullets={role.techBullets} />
        <BulletGroup label="Business Impact" bullets={role.businessBullets} className="mt-5" />

        {role.skills.length > 0 && (
          <div className="mt-5">
            <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/55">
              Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {role.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-primary/20 bg-primary/[0.07] px-2.5 py-0.5 font-mono text-[10px] text-primary/75"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {(role.supervisor || role.companyUrl) && (
          <div className="mt-5 flex flex-wrap gap-3 border-t border-border/20 pt-4">
            {role.supervisor && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                <UserRound className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>{role.supervisor.name} · {role.supervisor.role}</span>
              </div>
            )}
            {role.companyUrl && (
              <a
                href={role.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-primary transition-colors"
              >
                {role.company} <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── BulletGroup (shared) ─────────────────────────────────────────────────────

function BulletGroup({
  label,
  bullets,
  large,
  className,
}: {
  label: string;
  bullets: string[];
  large?: boolean;
  className?: string;
}) {
  if (!bullets.length) return null;
  return (
    <div className={className}>
      <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/55">
        {label}
      </p>
      <ul className={cn("space-y-2", large ? "space-y-3" : "space-y-2")}>
        {bullets.map((b, i) => (
          <li
            key={i}
            className={cn(
              "flex gap-2.5 leading-relaxed text-muted-foreground",
              large ? "text-sm" : "text-xs",
            )}
          >
            <span
              aria-hidden
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50"
            />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
