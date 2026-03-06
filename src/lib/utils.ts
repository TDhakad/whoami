import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes safely, resolving conflicts via tailwind-merge.
 *
 * @example
 * cn("px-4 py-2", condition && "bg-primary", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Consistent keyboard focus ring using the design-token `--ring` colour.
 * Drop onto any interactive element that doesn't already have a ring style.
 *
 * @example
 * <button className={cn(focusRing, "...")}>Click me</button>
 */
export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/**
 * Prose-width constraint — useful for long-form text containers.
 * Sets max-width to 65ch and applies `text-balance` via the helper class.
 */
export const proseWidth = "max-w-[65ch] text-balance";
