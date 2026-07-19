// Max safe CSS z-index — the same trick ad-blocker/reader-mode overlays use to sit above
// arbitrary page stacking contexts, shared so every CSUI overlay feature stays consistent.
export const OVERLAY_Z_INDEX = 2147483647
