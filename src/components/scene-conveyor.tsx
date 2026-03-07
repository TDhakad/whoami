// ─────────────────────────────────────────────────────────────────────────────
// scene-conveyor.tsx
//
// Sticky-camera scroll storytelling system.
//
// Architecture:
//   • Outer wrapper  — creates scroll height (scenes.length × 100 vh)
//   • Sticky camera  — position:sticky; top:0; height:100vh; overflow:hidden
//   • Scene layers   — absolute inset-0; only active scene rendered visible
//
// Scroll behaviour:
//   • Direct mapping: window.scrollY → progress (no lerp / smoothing)
//   • Snap to nearest scene on scroll-end (native scrollend + debounce fallback)
//   • prefers-reduced-motion: snap uses behavior:"auto"; no translateY
//
// Visibility rules — NO blur, ever:
//   • absDist > VISIBLE_RANGE  → visibility:hidden, opacity:0
//   • absDist < FADE_START     → opacity:1
//   • between                  → short linear crossfade
//   • pointer-events only on the centred active scene
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSceneContext } from "@/components/scene-context";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

// Crossfade constants (fractions of one scene height = one scene-px unit).
// Scenes beyond VISIBLE_RANGE are completely hidden — nothing bleeds through.
const VISIBLE_RANGE = 0.52; // slightly past 0.5 so both sides are never simultaneously zero
const FADE_START    = 0.32; // below this distance → full opacity
const MAX_TRANSLATE = 20;   // px — subtle parallax offset; 0 when reduced motion

// ─── prefers-reduced-motion ───────────────────────────────────────────────────

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SceneConveyorProps {
  scenes:           React.ReactNode[];
  className?:       string;
  /** Height of each scene as a percentage of viewport height. Default: 100. */
  sceneHeightVh?:   number;
  onSceneChange?:   (nextIndex: number, prevIndex: number) => void;
  onSceneProgress?: (activeIndex: number, progress: number) => void;
  /** Overlaid node (e.g. narrator). Rendered above all scenes. */
  overlay?:         React.ReactNode;
  /** When true, dims the camera with brightness only — never blur. */
  pauseActive?:     boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SceneConveyor({
  scenes,
  className,
  sceneHeightVh  = 100,
  onSceneChange,
  onSceneProgress,
  overlay,
  pauseActive    = false,
}: SceneConveyorProps) {
  const reduced   = usePrefersReducedMotion();
  const { setActiveSceneIndex } = useSceneContext();

  const wrapperRef     = React.useRef<HTMLDivElement | null>(null);
  const sceneRefs      = React.useRef<Array<HTMLDivElement | null>>([]);
  const activeIndexRef = React.useRef(0);
  const isSnappingRef  = React.useRef(false);

  const n = scenes.length;

  // ── RAF loop: scroll → scene visibility (no lerp) ────────────────────────

  React.useEffect(() => {
    if (n === 0) return;
    let raf = 0;

    const tick = () => {
      const vh        = window.innerHeight || 1;
      const scenePx   = (sceneHeightVh / 100) * vh;
      const maxScroll = Math.max(0, (n - 1) * scenePx);
      const scrollY   = clamp(window.scrollY, 0, maxScroll);
      const progress  = scenePx > 0 ? scrollY / scenePx : 0;
      const activeIdx = clamp(Math.round(progress), 0, n - 1);

      // Callbacks (narration, etc. — feature-flagged in page.tsx)
      onSceneProgress?.(activeIdx, progress);

      if (activeIdx !== activeIndexRef.current) {
        const prev = activeIndexRef.current;
        activeIndexRef.current = activeIdx;
        setActiveSceneIndex(activeIdx);
        onSceneChange?.(activeIdx, prev);
      }

      sceneRefs.current.forEach((el, index) => {
        if (!el) return;

        // Signed distance from this scene's centre to the current scroll head.
        //   negative → scene is ahead / below viewport (not yet reached)
        //   positive → scene is behind / above viewport (scrolled past)
        const dist    = progress - index;
        const absDist = Math.abs(dist);

        // ── Completely hidden ─────────────────────────────────────────────
        if (absDist > VISIBLE_RANGE) {
          el.style.visibility    = "hidden";
          el.style.opacity       = "0";
          el.style.pointerEvents = "none";
          el.setAttribute("aria-hidden", "true");
          return;
        }

        // ── Opacity: full in centre zone, short linear fade at each edge ──
        const opacity =
          absDist < FADE_START
            ? 1
            : clamp(
                1 - (absDist - FADE_START) / (VISIBLE_RANGE - FADE_START),
                0,
                1,
              );

        // ── Subtle vertical parallax — NO blur ────────────────────────────
        //   dist < 0 → scene is below → starts at +MAX_TRANSLATE (enters from bottom)
        //   dist > 0 → scene is above → exits toward -MAX_TRANSLATE (leaves to top)
        const translateY = reduced
          ? 0
          : clamp(dist * -(MAX_TRANSLATE * 2), -MAX_TRANSLATE, MAX_TRANSLATE);

        // ── Apply ─────────────────────────────────────────────────────────
        el.style.visibility    = opacity > 0.01 ? "visible" : "hidden";
        el.style.opacity       = opacity.toFixed(3);
        el.style.transform     = reduced
          ? "translate3d(0,0,0)"
          : `translate3d(0,${translateY.toFixed(1)}px,0)`;
        el.style.filter        = "none"; // ← NEVER blur
        el.style.pointerEvents = absDist < 0.25 ? "auto" : "none";
        el.style.zIndex        = String(Math.round((VISIBLE_RANGE - absDist) * 40));
        el.setAttribute("aria-hidden", absDist > 0.3 ? "true" : "false");
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, sceneHeightVh, n, setActiveSceneIndex]);

  // ── Snap to nearest scene on scroll-end ──────────────────────────────────

  React.useEffect(() => {
    if (n === 0) return;

    let snapTimer: ReturnType<typeof setTimeout> | null = null;

    const doSnap = () => {
      if (isSnappingRef.current) return;

      const vh        = window.innerHeight || 1;
      const scenePx   = (sceneHeightVh / 100) * vh;
      const maxScroll = Math.max(0, (n - 1) * scenePx);
      const progress  = clamp(window.scrollY, 0, maxScroll) / scenePx;
      const nearest   = clamp(Math.round(progress), 0, n - 1);
      const target    = nearest * scenePx;

      if (Math.abs(window.scrollY - target) < 4) return; // already landed

      isSnappingRef.current = true;
      window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
      // Release guard after smooth scroll settles (~600 ms)
      setTimeout(() => { isSnappingRef.current = false; }, 650);
    };

    const onScroll = () => {
      if (isSnappingRef.current) return;
      if (snapTimer) clearTimeout(snapTimer);
      snapTimer = setTimeout(doSnap, 120);
    };

    // Prefer native scrollend (Chrome 114+, FF 109+, Safari 17.4+)
    const supportsScrollEnd = "onscrollend" in window;
    if (supportsScrollEnd) {
      window.addEventListener("scrollend", doSnap, { passive: true });
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      if (snapTimer) clearTimeout(snapTimer);
      if (supportsScrollEnd) {
        window.removeEventListener("scrollend", doSnap);
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    };
  }, [reduced, sceneHeightVh, n]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      ref={wrapperRef}
      className={cn("relative w-full", className)}
      style={{ height: `${n * sceneHeightVh}vh` }}
    >
      {/* Sticky camera — never scrolls; clips overflow so nothing bleeds out */}
      <div className="sticky top-0 h-screen w-screen overflow-hidden">

        {/* Inner wrapper: brightness-only dim for pauseActive; no blur */}
        <div
          className="relative h-full w-full"
          style={{
            filter:        pauseActive ? "brightness(0.82)" : "none",
            transition:    "filter 280ms ease",
            pointerEvents: pauseActive ? "none" : undefined,
          }}
        >
          {scenes.map((scene, index) => (
            <div
              key={index}
              ref={(node) => { sceneRefs.current[index] = node; }}
              aria-hidden={index !== 0 ? "true" : "false"}
              className="absolute inset-0 flex h-full w-full items-center justify-center will-change-transform"
              style={{
                // Painted defaults — RAF overrides on the very first tick.
                visibility:    index === 0 ? "visible" : "hidden",
                opacity:       index === 0 ? "1" : "0",
                pointerEvents: index === 0 ? "auto" : "none",
              }}
            >
              {scene}
            </div>
          ))}
        </div>

        {/* Overlay (narrator, etc.) — sits above all scene layers */}
        {overlay}
      </div>
    </div>
  );
}

