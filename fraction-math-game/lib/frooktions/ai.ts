// AI move picker — wayfinder ticket 12. chess.js is the source of truth; this only
// asks js-chess-engine for a move given the current FEN, normalises it to
// chess.js's lowercase form, and fills in a promotion when needed.
//
// Runs inline (the sanctioned v1 shortcut from ticket 06 Q3). engine.worker.ts is
// the documented upgrade path if move computation ever janks the UI.

import { aiMove as engineMove } from 'js-chess-engine'
import { Chess, type Square } from 'chess.js'
import { ENGINE_LEVEL } from './constants'
import type { GameMove } from './gameReducer'

/** Ask the engine for the side-to-move's move. Returns null if none (game over). */
export function computeAiMove(fen: string, level: number = ENGINE_LEVEL): GameMove | null {
  let result: Record<string, string>
  try {
    result = engineMove(fen, level) as Record<string, string>
  } catch {
    return null
  }
  const entry = Object.entries(result)[0]
  if (!entry) return null

  const from = entry[0].toLowerCase()
  const to = entry[1].toLowerCase()

  // a pawn reaching the last rank must promote — default to queen
  const piece = new Chess(fen).get(from as Square)
  const promoting = piece?.type === 'p' && (to[1] === '8' || to[1] === '1')
  return promoting ? { from, to, promotion: 'q' } : { from, to }
}
