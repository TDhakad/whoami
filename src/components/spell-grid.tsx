"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { SpellItem } from "@/lib/portfolio-data";

interface SpellGridProps {
  spells: SpellItem[];
  className?: string;
}

export function SpellGrid({ spells, className }: SpellGridProps) {
  const reduced = useReducedMotion();
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {spells.map((spell, index) => {
        const isOpen = openIndex === index;

        const expandedContent = (
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">What I built:</span>{" "}
              {spell.built}
            </p>
            <p>
              <span className="font-medium text-foreground">What I learned:</span>{" "}
              {spell.learned}
            </p>
          </div>
        );

        return (
          <div
            key={spell.name}
            className="rounded-2xl border border-border/40 bg-card/30 p-4 transition-colors"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-3 text-left"
              aria-expanded={isOpen}
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Spell</p>
                <p className="mt-1 text-base font-semibold text-foreground">{spell.name}</p>
              </div>
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-transform",
                  isOpen && "rotate-45"
                )}
                aria-hidden
              >
                +
              </span>
            </button>

            {reduced ? (
              isOpen ? expandedContent : null
            ) : (
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    {expandedContent}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </div>
  );
}
