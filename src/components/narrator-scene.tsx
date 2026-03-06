"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NarratorSceneProps {
  text: string;
  visible: boolean;
  tone?: "warm" | "mysterious";
  onDismiss?: () => void;
}

export function NarratorScene({ text, visible, tone = "mysterious", onDismiss }: NarratorSceneProps) {
  const reduced = useReducedMotion();
  const accent =
    tone === "warm"
      ? "oklch(0.78 0.07 55 / 0.22)"
      : "oklch(0.58 0.05 265 / 0.22)";

  return (
    <AnimatePresence>
      {visible && text ? (
        <motion.div
          key={text}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.2 : 0.55, ease: "easeOut" }}
          className="pointer-events-auto absolute inset-0 z-50 flex cursor-pointer items-center justify-center"
          role="button"
          tabIndex={0}
          aria-label="Dismiss narrator"
          onClick={onDismiss}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " " || e.key === "Escape") && onDismiss) {
              e.preventDefault();
              onDismiss();
            }
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 30%, color-mix(in oklab, var(--foreground) 12%, transparent), transparent 65%)",
              opacity: 0.7,
            }}
            aria-hidden
          />

          <div className="absolute inset-0 overflow-hidden" aria-hidden>
            <div
              className={cn(
                "narrator-ink narrator-ink--primary absolute inset-[-25%]",
                reduced && "narrator-ink--reduced"
              )}
              style={{
                background:
                  "radial-gradient(40% 60% at 20% 20%, rgba(255,255,255,0.08), transparent 70%)," +
                  "radial-gradient(35% 50% at 70% 40%, rgba(255,255,255,0.06), transparent 75%)," +
                  `radial-gradient(60% 90% at 50% 70%, ${accent}, transparent 70%)`,
              }}
            />
            <div
              className={cn(
                "narrator-ink narrator-ink--secondary absolute inset-[-30%]",
                reduced && "narrator-ink--reduced"
              )}
              style={{
                background:
                  "radial-gradient(45% 55% at 30% 60%, rgba(255,255,255,0.05), transparent 75%)," +
                  "radial-gradient(40% 50% at 65% 65%, rgba(255,255,255,0.04), transparent 78%)," +
                  "linear-gradient(120deg, rgba(0,0,0,0.18), transparent 60%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 100% at 50% 40%, transparent 30%, rgba(0,0,0,0.35) 100%)",
                opacity: 0.6,
              }}
            />
            <div className="narrator-grain absolute inset-0" />
          </div>

          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 text-center">
            <span className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Narrator
            </span>
            <p className="text-balance text-2xl font-semibold text-foreground sm:text-3xl">
              {text}
            </p>
            <span className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
              Click anywhere to continue
            </span>
          </div>

          <style jsx>{`
            .narrator-ink {
              filter: blur(12px);
              opacity: 0.55;
              animation: narrator-drift 10s ease-in-out infinite;
            }

            .narrator-ink--secondary {
              filter: blur(16px);
              opacity: 0.45;
              animation-duration: 14s;
            }

            .narrator-ink--reduced {
              animation: none;
              filter: blur(8px);
              opacity: 0.4;
            }

            .narrator-grain {
              background-image: radial-gradient(rgba(255, 255, 255, 0.08) 0.6px, transparent 0.6px);
              background-size: 3px 3px;
              opacity: 0.16;
              mix-blend-mode: overlay;
            }

            :global(.dark) .narrator-grain {
              opacity: 0.12;
            }

            @keyframes narrator-drift {
              0% {
                transform: translate3d(-2%, 0%, 0);
              }
              50% {
                transform: translate3d(2%, -2%, 0);
              }
              100% {
                transform: translate3d(-2%, 0%, 0);
              }
            }
          `}</style>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
