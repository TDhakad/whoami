"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InterludeDialogProps {
  text: string;
  show: boolean;
  className?: string;
}

export function InterludeDialog({ text, show, className }: InterludeDialogProps) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {show && text ? (
        <motion.div
          key={text}
          initial={{ opacity: 0, y: reduced ? 0 : 12, scale: reduced ? 1 : 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: reduced ? 0 : -10, scale: reduced ? 1 : 0.99 }}
          transition={{ duration: reduced ? 0.25 : 0.6, ease: "easeOut" }}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={cn(
            "relative mx-auto w-full max-w-md overflow-hidden rounded-[999px] border border-border/70 bg-background/55 px-5 py-3 text-sm text-foreground shadow-[0_18px_60px_-40px_rgba(0,0,0,0.7)] backdrop-blur-xl",
            className
          )}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={cn(
                "interlude-ocean absolute inset-[-20%]",
                reduced && "interlude-ocean--reduced"
              )}
              aria-hidden
            />
            <div className="interlude-noise absolute inset-0" aria-hidden />
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <span className="rounded-full border border-primary/30 bg-primary/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-primary">
              Narrator
            </span>
            <span className="text-pretty">{text}</span>
          </div>

          <style jsx>{`
            .interlude-ocean {
              background-image:
                radial-gradient(120% 80% at 20% 10%, rgba(255,255,255,0.14), transparent 60%),
                radial-gradient(120% 80% at 80% 0%, rgba(255,255,255,0.12), transparent 65%),
                linear-gradient(120deg, rgba(255,255,255,0.08), transparent 55%),
                linear-gradient(220deg, rgba(0,0,0,0.2), transparent 60%);
              filter: blur(6px);
              animation: interlude-drift 8s ease-in-out infinite;
              opacity: 0.7;
            }

            .interlude-ocean--reduced {
              animation: none;
              filter: blur(4px);
              opacity: 0.5;
            }

            .interlude-noise {
              background-image: radial-gradient(rgba(255, 255, 255, 0.08) 0.5px, transparent 0.5px);
              background-size: 3px 3px;
              opacity: 0.2;
              mix-blend-mode: overlay;
            }

            :global(.dark) .interlude-ocean {
              background-image:
                radial-gradient(120% 80% at 20% 10%, rgba(255,255,255,0.08), transparent 60%),
                radial-gradient(120% 80% at 80% 0%, rgba(255,255,255,0.06), transparent 65%),
                linear-gradient(120deg, rgba(255,255,255,0.06), transparent 55%),
                linear-gradient(220deg, rgba(0,0,0,0.3), transparent 60%);
              opacity: 0.55;
            }

            @keyframes interlude-drift {
              0% {
                transform: translate3d(-3%, 0%, 0);
              }
              50% {
                transform: translate3d(3%, -2%, 0);
              }
              100% {
                transform: translate3d(-3%, 0%, 0);
              }
            }
          `}</style>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
