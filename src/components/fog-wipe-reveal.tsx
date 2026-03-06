"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FogWipeRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FogWipeReveal({ children, className, delay = 0 }: FogWipeRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <span className={cn("relative inline-block overflow-hidden", className)}>
      <motion.span
        className="relative z-[1] inline-block will-change-[filter,opacity]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease, delay: delay + 0.15 }}
      >
        {children}
      </motion.span>

      <motion.span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-[-20%] z-[2]",
          "fog-wipe-darkfix",
          "[mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,1)_45%,rgba(0,0,0,1)_55%,transparent_100%)]",
          "[mask-size:220%_100%] [mask-repeat:no-repeat]"
        )}
        initial={{ opacity: 1, maskPosition: "-60% 0%" }}
        animate={{ opacity: [1, 1, 0], maskPosition: "160% 0%" }}
        transition={{ duration: 1.2, ease, delay, times: [0, 0.7, 1] }}
        style={{
          transform: "translateZ(0)",
          mixBlendMode: "multiply",
          background: [
            "radial-gradient(35% 55% at 20% 45%, rgba(0,0,0,0.45), transparent 70%)",
            "radial-gradient(40% 60% at 45% 55%, rgba(0,0,0,0.32), transparent 72%)",
            "radial-gradient(38% 58% at 70% 50%, rgba(0,0,0,0.28), transparent 75%)",
            "radial-gradient(60% 90% at 50% 55%, rgba(0,0,0,0.18), transparent 70%)",
          ].join(","),
        }}
      />

      <style jsx>{`
        :global(.dark) .fog-wipe-darkfix {
          mix-blend-mode: screen !important;
          opacity: 0.6 !important;
        }
      `}</style>
    </span>
  );
}
