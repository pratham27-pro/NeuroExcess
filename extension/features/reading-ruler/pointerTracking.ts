import { useEffect, useState } from "react"

import type { RulerFollowMode } from "~lib/settings/schema"

export interface RulerPosition {
  top: number
  visible: boolean
}

/** Tracks mouse/keyboard-focus position, rAF-throttled, to drive the reading ruler's band. */
export function useRulerPosition(
  followMode: RulerFollowMode,
  bandHeightPx: number,
  active: boolean
): RulerPosition {
  const [top, setTop] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!active) {
      setVisible(false)
      return
    }

    let rafId: number | undefined
    let latestCenterY: number | undefined

    function scheduleUpdate(centerY: number) {
      latestCenterY = centerY
      if (rafId !== undefined) return
      rafId = requestAnimationFrame(() => {
        rafId = undefined
        if (latestCenterY !== undefined) {
          setTop(latestCenterY - bandHeightPx / 2)
          setVisible(true)
        }
      })
    }

    function onMouseMove(event: MouseEvent) {
      if (followMode === "mouse" || followMode === "both") {
        scheduleUpdate(event.clientY)
      }
    }

    function onFocusIn(event: FocusEvent) {
      if (followMode !== "keyboard" && followMode !== "both") return
      const target = event.target
      if (target instanceof HTMLElement) {
        const rect = target.getBoundingClientRect()
        scheduleUpdate(rect.top + rect.height / 2)
      }
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true })
    window.addEventListener("focusin", onFocusIn)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("focusin", onFocusIn)
      if (rafId !== undefined) cancelAnimationFrame(rafId)
    }
  }, [followMode, bandHeightPx, active])

  return { top, visible }
}
