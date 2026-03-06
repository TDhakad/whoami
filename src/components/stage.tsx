"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type LayerName = "background" | "mid" | "foreground";

interface StageContextValue {
  register: (layer: LayerName, node: HTMLDivElement | null) => void;
}

const StageContext = React.createContext<StageContextValue | null>(null);

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
    };
    return;
  }, []);

  return reduced;
}

function useIsTouchDevice(): boolean {
  const [touch, setTouch] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setTouch(hasTouch);
  }, []);

  return touch;
}

function lerp(from: number, to: number, ease: number) {
  return from + (to - from) * ease;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

interface StageProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface StageComponent extends React.FC<StageProps> {
  Background: React.ForwardRefExoticComponent<StageLayerProps & React.RefAttributes<HTMLDivElement>>;
  Mid: React.ForwardRefExoticComponent<StageLayerProps & React.RefAttributes<HTMLDivElement>>;
  Foreground: React.ForwardRefExoticComponent<StageLayerProps & React.RefAttributes<HTMLDivElement>>;
}

const MAX_TRANSLATE: Record<LayerName, number> = {
  background: 10,
  mid: 6,
  foreground: 0,
};

const StageRoot = ({ children, className, ...props }: StageProps) => {
  const reduced = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();
  const isEnabled = !reduced && !isTouch;

  const layerRefs = React.useRef<Record<LayerName, HTMLDivElement | null>>({
    background: null,
    mid: null,
    foreground: null,
  });

  const current = React.useRef({ x: 0, y: 0 });
  const target = React.useRef({ x: 0, y: 0 });

  const register = React.useCallback((layer: LayerName, node: HTMLDivElement | null) => {
    layerRefs.current[layer] = node;
  }, []);

  React.useEffect(() => {
    if (!isEnabled) {
      Object.values(layerRefs.current).forEach((node) => {
        if (node) node.style.transform = "none";
      });
      return;
    }

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const { innerWidth, innerHeight } = window;
      if (!innerWidth || !innerHeight) return;

      target.current.x = (event.clientX / innerWidth - 0.5) * 2;
      target.current.y = (event.clientY / innerHeight - 0.5) * 2;
    };

    const handleReset = () => {
      target.current.x = 0;
      target.current.y = 0;
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerleave", handleReset);
    window.addEventListener("blur", handleReset);

    let frame = 0;

    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.08);
      current.current.y = lerp(current.current.y, target.current.y, 0.08);

      const clampedX = clamp(current.current.x, -1, 1);
      const clampedY = clamp(current.current.y, -1, 1);

      (Object.keys(MAX_TRANSLATE) as LayerName[]).forEach((layer) => {
        const node = layerRefs.current[layer];
        if (!node) return;

        const max = MAX_TRANSLATE[layer];
        if (max === 0) {
          node.style.transform = "none";
          return;
        }

        const translateX = clampedX * max;
        const translateY = clampedY * max;
        node.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
      });

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleReset);
      window.removeEventListener("blur", handleReset);
      window.cancelAnimationFrame(frame);
    };
  }, [isEnabled]);

  return (
    <StageContext.Provider value={{ register }}>
      <div
        className={cn("relative isolate", className)}
        style={{ perspective: "1200px" }}
        {...props}
      >
        {children}
      </div>
    </StageContext.Provider>
  );
};

interface StageLayerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function createLayer(layer: LayerName, baseClassName: string) {
  const Layer = React.forwardRef<HTMLDivElement, StageLayerProps>(
    ({ className, ...props }, ref) => {
      const ctx = React.useContext(StageContext);

      const setRef = React.useCallback(
        (node: HTMLDivElement | null) => {
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }

          ctx?.register(layer, node);
        },
        [ctx, ref]
      );

      return (
        <div ref={setRef} className={cn(baseClassName, className)} {...props} />
      );
    }
  );

  Layer.displayName = `Stage.${layer[0].toUpperCase()}${layer.slice(1)}`;
  return Layer;
}

export const Stage = StageRoot as StageComponent;

Stage.Background = createLayer("background", "absolute inset-0 z-0 will-change-transform");
Stage.Mid = createLayer("mid", "relative z-10 will-change-transform");
Stage.Foreground = createLayer("foreground", "relative z-20");
