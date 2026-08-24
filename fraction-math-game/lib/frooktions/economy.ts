// Economy: drops, escalation, penalty pawn — wayfinder ticket 04 (constants) +
// ticket 02 (drops obey the placement contract, mirrored to the adversary half).
//
// Pure and framework-free (unit-tested in game.test.ts). An injectable `rng`
// makes drops deterministic in tests.

import type { Chess } from 'chess.js'
import { escalationPool, type PieceType } from './constants'
import { legalDropSquares } from './legality'

/** Pick the adversary's next drop type from the elapsed-time escalation pool. */
export function nextAdversaryDropType(
  elapsedSec: number,
  rng: () => number = Math.random
): PieceType {
  const pool = escalationPool(elapsedSec)
  return pool[Math.floor(rng() * pool.length)]
}

/** Drop one adversary (black) piece on a legal mirror square. Mutates `chess`.
 *  Returns the dropped type, or null if no legal square. */
export function adversaryDrop(
  chess: Chess,
  elapsedSec: number,
  rng: () => number = Math.random
): PieceType | null {
  const type = nextAdversaryDropType(elapsedSec, rng)
  const squares = legalDropSquares(chess, 'b', type)
  if (squares.length === 0) return null
  chess.put({ type, color: 'b' }, squares[Math.floor(rng() * squares.length)])
  return type
}

/** Wrong-answer penalty: drop one black pawn on a legal mirror square (ticket 03).
 *  Mutates `chess`; returns true if applied. */
export function penaltyPawn(chess: Chess, rng: () => number = Math.random): boolean {
  const squares = legalDropSquares(chess, 'b', 'p')
  if (squares.length === 0) return false
  chess.put({ type: 'p', color: 'b' }, squares[Math.floor(rng() * squares.length)])
  return true
}
