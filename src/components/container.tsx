import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Constrain width and centre. Defaults to true. */
  narrow?: boolean;
}

/**
 * A centred, padded page container.
 *
 * Usage:
 * ```tsx
 * <Container>…content…</Container>
 * <Container narrow>…narrower content…</Container>
 * ```
 */
export function Container({
  children,
  className,
  narrow = false,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        narrow ? "max-w-3xl" : "max-w-6xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
