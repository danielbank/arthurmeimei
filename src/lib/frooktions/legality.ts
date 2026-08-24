// Placement legality contract — wayfinder ticket 02.
//
// A DROP places a piece OUTSIDE the chess move loop. Rules:
//  - lands on the dropper's own half (white: ranks 1–4; black: ranks 5–8),
//  - empty squares only, pawns never on rank 1/8,
//  - may NEVER leave the opposing king in check → checkmate-by-placement is
//    impossible and every position stays a legal FEN,
//  - a drop never changes side-to-move.
// Enforced HERE (via chess.js), not by chess.js move validation.

import { Chess, type Color, type Square } from 'chess.js'
import type { PieceType } from './constants'
import type { Side } from './types'

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const

function ownRanks(side: Side): number[] {
  return side === 'w' ? [1, 2, 3, 4] : [5, 6, 7, 8]
}

function enemyOf(side: Side): Color {
  return side === 'w' ? 'b' : 'w'
}

function findKing(chess: Chess, color: Color): Square | null {
  for (const row of chess.board()) {
    for (const cell of row) {
      if (cell && cell.type === 'k' && cell.color === color) return cell.square
    }
  }
  return null
}

/** Would dropping `piece` for `side` on `square` put the ENEMY king in check?
 *  (Adding a friendly piece can never check one's own king, so self-check is
 *  impossible and not tested.) */
function dropChecksEnemy(chess: Chess, side: Side, piece: PieceType, square: Square): boolean {
  const clone = new Chess(chess.fen())
  const placed = clone.put({ type: piece, color: side }, square)
  if (!placed) return true // couldn't place → treat as illegal
  const enemyKing = findKing(clone, enemyOf(side))
  if (!enemyKing) return false
  return clone.isAttacked(enemyKing, side)
}

/** Squares where `side` may legally drop `piece` in the current position. */
export function legalDropSquares(chess: Chess, side: Side, piece: PieceType): Square[] {
  const out: Square[] = []
  for (const rank of ownRanks(side)) {
    if (piece === 'p' && (rank === 1 || rank === 8)) continue // pawns off the back rank
    for (const f of FILES) {
      const square = `${f}${rank}` as Square
      if (chess.get(square)) continue // empty squares only
      if (dropChecksEnemy(chess, side, piece, square)) continue // no check by placement
      out.push(square)
    }
  }
  return out
}

/** True if the square is a legal drop for `side`'s `piece`. */
export function canDrop(chess: Chess, side: Side, piece: PieceType, square: Square): boolean {
  return legalDropSquares(chess, side, piece).includes(square)
}

/** Apply a drop, mutating `chess`. Returns true if it was legal and applied.
 *  A drop never changes side-to-move. */
export function tryDrop(chess: Chess, side: Side, piece: PieceType, square: Square): boolean {
  if (!canDrop(chess, side, piece, square)) return false
  chess.put({ type: piece, color: side }, square)
  return true
}
