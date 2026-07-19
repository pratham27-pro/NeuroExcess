export type { FeatureId } from "~lib/settings/schema"

/**
 * Contract for a feature that mutates the live page DOM/CSS directly (as opposed to
 * features that render as a React overlay in the content script's shadow root).
 */
export interface FeatureController<S> {
  /** Applies the feature using the given settings. Idempotent — safe to call while already applied. */
  apply(settings: S): void
  /** Fully reverts all DOM/CSS/listener side effects this controller made. Safe to call when not applied. */
  remove(): void
  isApplied(): boolean
}
