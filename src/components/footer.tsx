"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Linkedin, Mail, Github } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Contact / social links ─────────────────────────────────────
   Edit these to update every reference on the page at once.
─────────────────────────────────────────────────────────────── */
const links = {
  linkedin: "https://linkedin.com/in/tushar-dhakad",
  email:    "mailto:tdhakad@asu.edu",
  github:   "https://github.com/TDhakad",
} as const;

/* ── Social icon definitions ─────────────────────────────────── */
interface SocialLink {
  key:       keyof typeof links;
  label:     string;
  icon:      React.ElementType;
  /** open in new tab – mailto / wa.me work without this */
  external?: boolean;
}

const socialLinks: SocialLink[] = [
  { key: "linkedin", label: "Open LinkedIn profile", icon: Linkedin, external: true  },
  { key: "email",    label: "Send an email",          icon: Mail,     external: false },
  { key: "github",   label: "Open GitHub profile",   icon: Github,   external: true  },
];

/* ── IconButton ──────────────────────────────────────────────── */
interface IconButtonProps {
  href:       string;
  label:      string;
  icon:       React.ElementType;
  external?:  boolean;
  reduced:    boolean | null;
}

function IconButton({ href, label, icon: Icon, external, reduced }: IconButtonProps) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : "noopener"}
      whileHover={reduced ? { opacity: 0.8 } : { y: -3, scale: 1.08 }}
      whileFocus={reduced ? { opacity: 0.8 } : { y: -3, scale: 1.08 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        /* shape */
        "relative flex h-10 w-10 items-center justify-center rounded-full",
        /* glass surface */
        "bg-foreground/5 backdrop-blur-sm border border-foreground/10",
        /* icon colour */
        "text-muted-foreground",
        /* hover glow */
        "hover:bg-primary/15 hover:border-primary/30 hover:text-primary",
        "hover:shadow-[0_0_16px_0_oklch(0.78_0.07_55_/_0.25)]",
        /* focus ring */
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        /* transition */
        "transition-colors duration-200",
      )}
    >
      <Icon size={17} strokeWidth={1.6} aria-hidden />
    </motion.a>
  );
}

/* ── Footer ──────────────────────────────────────────────────── */
export function Footer({ className }: { className?: string }) {
  const reduced   = useReducedMotion();
  const year      = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "relative w-full border-t border-foreground/[0.07]",
        className,
      )}
    >
      {/* Gradient backdrop — very low contrast */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 100%, oklch(0.18 0.012 265 / 0.6), transparent)",
        }}
      />

      {/* Main row */}
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-14 sm:flex-row sm:items-center sm:justify-between">

        {/* ── Left: identity ── */}
        <div className="flex flex-col gap-1">
          <span
            className="text-base font-semibold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-heading), ui-serif, Georgia, serif" }}
          >
            Tushar Dhakad
          </span>
          <span className="text-sm text-muted-foreground">
            Let&apos;s build something thoughtful.
          </span>
        </div>

        {/* ── Right: icon buttons ── */}
        <nav
          aria-label="Social and contact links"
          className="flex items-center gap-3"
        >
          {socialLinks.map(({ key, label, icon, external }) => (
            <IconButton
              key={key}
              href={links[key]}
              label={label}
              icon={icon}
              external={external}
              reduced={reduced}
            />
          ))}
        </nav>
      </div>

      {/* ── Bottom copyright bar ── */}
      <div className="border-t border-foreground/[0.05] px-6 py-4">
        <p className="mx-auto max-w-5xl text-center text-xs text-muted-foreground/60 sm:text-left">
          &copy; {year} Tushar Dhakad.&ensp;All rights reserved.
        </p>
      </div>
    </footer>
  );
}
