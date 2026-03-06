// ─── Feature flags ────────────────────────────────────────────────────────────
// Set a flag to `true` to re-enable the corresponding feature.

export const FLAGS = {
  /** Feature flag: set true to re-enable narration interludes. */
  NARRATION_ENABLED: false,
  /** Feature flag: set true to re-enable transition blur/dim effect. */
  TRANSITION_BLUR_ENABLED: false,
} as const;
