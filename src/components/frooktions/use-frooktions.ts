'use client'

// Game loop — wayfinder ticket 12. One reducer is the source of truth; two
// intervals drive it: the tick clock (1s → TICK: time, grace, adversary drops,
// escalation) and the army move cadence (→ APPLY_MOVE for whichever side is to
// move). Both armies run the same engine, so material decides.

import { useEffect, useReducer, useRef } from 'react'
import { gameReducer, initGameState } from '@/lib/frooktions/gameReducer'
import { computeAiMove } from '@/lib/frooktions/ai'
import { ARMY_HALF_MOVE_INTERVAL_MS } from '@/lib/frooktions/constants'

export function useFrooktions() {
  const [state, dispatch] = useReducer(gameReducer, undefined, initGameState)

  // keep the latest state reachable from the interval callbacks (updated in an
  // effect, not during render)
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  // tick clock — one dispatch per second
  useEffect(() => {
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(id)
  }, [])

  // army moves — the side to move plays every N ms while the game is live
  useEffect(() => {
    const id = setInterval(() => {
      const s = stateRef.current
      if (s.phase !== 'playing') return
      const move = computeAiMove(s.fen)
      if (move) dispatch({ type: 'APPLY_MOVE', move })
    }, ARMY_HALF_MOVE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return { state, dispatch }
}
