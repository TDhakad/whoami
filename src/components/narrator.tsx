"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSceneContext } from "@/components/scene-context";
import { narratorLines } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

interface NarratorProps {
  className?: string;
}

export function Narrator({ className }: NarratorProps) {
  const { activeSceneIndex } = useSceneContext();
  const reduced = useReducedMotion();
  const line = narratorLines[activeSceneIndex] ?? "";

  return (
    <div
      className={cn(
        "pointer-events-auto fixed bottom-6 left-1/2 z-40 -translate-x-1/2 sm:left-6 sm:translate-x-0",
        className
      )}
    >
      <motion.div
        key={activeSceneIndex}
        initial={{ opacity: 0, y: reduced ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduced ? 0 : -6 }}
        transition={{ duration: reduced ? 0.2 : 0.5, ease: "easeOut" }}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        tabIndex={0}
        className={cn(
          "flex max-w-[320px] items-center gap-3 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-xs text-foreground shadow-[0_10px_40px_-30px_rgba(0,0,0,0.6)] backdrop-blur-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        <span className="h-2 w-2 rounded-full bg-primary/80" aria-hidden />
        <span className="text-pretty">{line}</span>
      </motion.div>
    </div>
  );
}
