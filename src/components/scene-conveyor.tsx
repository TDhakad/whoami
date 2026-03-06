"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSceneContext } from "@/components/scene-context";
import { FLAGS } from "@/lib/flags";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);

    onChange();

    if ("addEventListener" in media) {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  return reduced;
}

interface SceneConveyorProps {
  scenes: React.ReactNode[];
  className?: string;
  sceneHeightVh?: number;
  onSceneChange?: (nextIndex: number, prevIndex: number) => void;
  onSceneProgress?: (activeIndex: number, progress: number) => void;
  overlay?: React.ReactNode;
  pauseActive?: boolean;
}

const MAX_SHIFT = 25;
const MAX_BLUR = 8;
const TITLE_SHIFT = 18;
const TITLE_BLUR = 10;
const TITLE_SCALE = 0.985;

export function SceneConveyor({
  scenes,
  className,
  sceneHeightVh = 100,
  onSceneChange,
  onSceneProgress,
  overlay,
  pauseActive = false,
}: SceneConveyorProps) {
  const reduced = usePrefersReducedMotion();
  const { setActiveSceneIndex } = useSceneContext();
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const sceneRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const titleRefs = React.useRef<Array<HTMLElement | null>>([]);
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const activeIndexRef = React.useRef(-1);

  React.useEffect(() => {
    if (!wrapperRef.current) return;

    let frame = 0;

    const tick = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) {
        frame = window.requestAnimationFrame(tick);
        return;
      }

      const rect = wrapper.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const scenePx = (sceneHeightVh / 100) * vh;
      const total = scenes.length * scenePx;
      const maxScroll = Math.max(0, total - scenePx);
      const scrolled = clamp(-rect.top, 0, maxScroll);
      const progress = scenePx === 0 ? 0 : scrolled / scenePx;
      const activeIndex = clamp(Math.round(progress), 0, scenes.length - 1);

      onSceneProgress?.(activeIndex, progress);

      if (activeIndex !== activeIndexRef.current) {
        const prevIndex = activeIndexRef.current;
        activeIndexRef.current = activeIndex;
        setActiveSceneIndex(activeIndex);
        if (prevIndex >= 0) {
          onSceneChange?.(activeIndex, prevIndex);
        }
      }

      sceneRefs.current.forEach((scene, index) => {
        if (!scene) return;

        const local = progress - index;
        const clamped = clamp(local, -1, 1);
        const abs = Math.abs(clamped);
        const t = (clamped + 1) / 2;

        let translatePercent = 0;
        let opacity = 1;
        let blur = 0;

        if (reduced) {
          opacity = clamp(1 - abs * 1.6, 0, 1);
        } else {
          translatePercent = lerp(MAX_SHIFT, -MAX_SHIFT, t);
          opacity = clamp(1 - abs * 0.9, 0, 1);
          blur = clamp(abs * (MAX_BLUR * 0.4), 0, MAX_BLUR);
        }

        scene.style.opacity = `${opacity}`;
        scene.style.transform = reduced
          ? "translate3d(0, 0, 0)"
          : `translate3d(0, ${translatePercent}%, 0)`;
        // Feature flag: set FLAGS.TRANSITION_BLUR_ENABLED = true to re-enable per-scene blur.
        scene.style.filter = (reduced || !FLAGS.TRANSITION_BLUR_ENABLED) ? "none" : `blur(${blur.toFixed(2)}px)`;
        scene.style.pointerEvents = abs <= 0.5 ? "auto" : "none";
        scene.style.zIndex = `${Math.round((1 - abs) * 20) + 10}`;
        scene.style.visibility = abs > 0.85 ? "hidden" : "visible";
        scene.setAttribute("aria-hidden", abs > 0.8 ? "true" : "false");

        const title = titleRefs.current[index];
        if (!title) return;

        if (reduced) {
          const titleOpacity = clamp(1 - abs * 1.3, 0, 1);
          title.style.opacity = `${titleOpacity}`;
          title.style.transform = "none";
          title.style.filter = "none";
        } else {
          const titleOpacity = clamp(1 - abs * 1.05, 0, 1);
          const titleTranslate = lerp(TITLE_SHIFT, -TITLE_SHIFT, t);
          const titleBlur = clamp(abs * TITLE_BLUR, 0, TITLE_BLUR);
          const titleScale = lerp(TITLE_SCALE, 1, 1 - abs);

          title.style.opacity = `${titleOpacity}`;
          title.style.transform = `translate3d(0, ${titleTranslate}px, 0) scale(${titleScale.toFixed(3)})`;
          // Feature flag: set FLAGS.TRANSITION_BLUR_ENABLED = true to re-enable title blur.
          title.style.filter = FLAGS.TRANSITION_BLUR_ENABLED ? `blur(${titleBlur.toFixed(2)}px)` : "none";
        }
      });

      const overlay = overlayRef.current;
      if (overlay) {
        if (reduced) {
          overlay.style.transform = "translate3d(0, 0, 0)";
        } else {
          const drift = clamp((progress - 1) * 4, -8, 8);
          overlay.style.transform = `translate3d(0, ${drift}px, 0)`;
        }
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [reduced, sceneHeightVh, scenes.length]);

  return (
    <div
      ref={wrapperRef}
      className={cn("relative w-full", className)}
      style={{ height: `${scenes.length * sceneHeightVh}vh` }}
    >
      <div className="sticky top-0 h-screen w-screen overflow-hidden">
        <div className="relative h-full w-full">
          <div
            ref={overlayRef}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[35vh]"
            style={{
              background:
                "linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 22%, transparent), transparent 60%)",
              opacity: 0.35,
            }}
          />
          <div
            className="relative h-full w-full"
            style={{
              filter: pauseActive
                ? reduced
                  ? "brightness(0.86)"
                  : "blur(6px) brightness(0.82)"
                : "none",
              transition: "filter 300ms ease",
              pointerEvents: pauseActive ? "none" : undefined,
            }}
          >
            {scenes.map((scene, index) => (
              <div
                key={index}
                ref={(node) => {
                  sceneRefs.current[index] = node;
                  titleRefs.current[index] = node
                    ? (node.querySelector("[data-scene-title]") as HTMLElement | null)
                    : null;
                }}
                className="absolute inset-0 flex h-full w-full items-center justify-center will-change-transform"
              >
                {scene}
              </div>
            ))}
          </div>
          {overlay}
        </div>
      </div>
    </div>
  );
}
