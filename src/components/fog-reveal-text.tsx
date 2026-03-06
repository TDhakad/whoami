"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FogRevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FogRevealText({ children, className, delay = 0 }: FogRevealTextProps) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;

  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  /**
   * Key idea:
   * - "Fog" is made of multiple radial blobs (not a full-width bar).
   * - We fade fog out while text sharpens.
   * - Use blend-mode multiply for light theme (dark fog), and screen for dark theme.
   * - We apply a soft mask so the fog doesn’t read as a rectangle.
   */
  return (
    <span className={cn("relative inline-block", className)}>
      {/* Text: starts hidden in fog, then sharp */}
      <motion.span
        className="relative z-[2] inline-block will-change-[filter,opacity,transform]"
        initial={{ opacity: 0, filter: "blur(14px)" }}
        animate={{
          opacity: [0, 0.35, 1],
          filter: ["blur(14px)", "blur(6px)", "blur(0px)"],
        }}
        transition={{
          duration: 1.35,
          ease,
          delay: delay + 0.1,
          times: [0, 0.55, 1],
        }}
      >
        {children}
      </motion.span>

      {/* Fog layer (black-ish fog on light, subtle mist on dark) */}
      <motion.span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-[-18%] z-[1]",
          // soften edges so it doesn't look like a box
          "[mask-image:radial-gradient(closest-side,rgba(0,0,0,1)_55%,transparent_100%)]",
          "[mask-repeat:no-repeat] [mask-position:center] [mask-size:140%_140%]"
        )}
        initial={{ opacity: 1, filter: "blur(22px)" }}
        animate={{ opacity: [1, 1, 0], filter: ["blur(28px)", "blur(20px)", "blur(10px)"] }}
        transition={{
          duration: 1.35,
          ease,
          delay,
          times: [0, 0.6, 1],
        }}
        style={{
          transform: "translateZ(0)",
          // dark fog for light theme, lighter mist for dark theme
          mixBlendMode: "multiply",
          background: [
            // Fog blobs (organic) — darker center, fading out
            "radial-gradient(42% 55% at 30% 55%, rgba(0,0,0,0.42), transparent 70%)",
            "radial-gradient(45% 60% at 55% 45%, rgba(0,0,0,0.34), transparent 72%)",
            "radial-gradient(35% 50% at 72% 60%, rgba(0,0,0,0.28), transparent 75%)",
            // slight general haze
            "radial-gradient(70% 90% at 50% 55%, rgba(0,0,0,0.16), transparent 70%)",
          ].join(","),
        }}
      />

      {/* Floating micro-wisps (prevents “flat fog sheet” look) */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-[-22%] z-[1]"
        initial={{ opacity: 0.85 }}
        animate={{ opacity: [0.85, 0.7, 0] }}
        transition={{ duration: 1.55, ease, delay: delay + 0.05, times: [0, 0.6, 1] }}
        style={{
          transform: "translateZ(0)",
          mixBlendMode: "multiply",
          filter: "blur(34px)",
          background: [
            "radial-gradient(30% 45% at 40% 35%, rgba(0,0,0,0.22), transparent 72%)",
            "radial-gradient(28% 42% at 62% 62%, rgba(0,0,0,0.18), transparent 75%)",
          ].join(","),
        }}
      />

      {/* Dark-mode correction: override blend & opacity so it doesn't over-darken */}
      <style jsx>{`
        :global(.dark) .fog-darkfix {
          mix-blend-mode: screen !important;
          opacity: 0.55 !important;
        }
      `}</style>
    </span>
  );
}