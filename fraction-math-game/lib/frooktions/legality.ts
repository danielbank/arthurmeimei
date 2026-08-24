// Placement legality contract — wayfinder ticket 02.
//
// A DROP (earned or adversary) places a piece OUTSIDE the chess move loop. Rules:
//  - lands on the dropper's own half (white: ranks 1–4; black: ranks 5–8),
//  - empty squares only, pawns never on rank 1/8,
//  - may NEVER leave the opposing king in check → checkmate-by-placement is
//    impossible and every position stays a legal FEN,
//  - a drop never changes side-to-move.
// Enforced HERE (via chess.js .put()/.remove()), not by chess.js validation.
//
// TODO(build ticket 09 + economy): implement. Stubs return safe empties so the
// scaffold shell compiles and runs.

import type { Chess, Square } from 'chess.js'
import type { PieceType } from './constants'
import type { Side } from './types'

/** Squares where `side` may legally drop `piece` in the current position. */
export function legalDropSquares(_chess: Chess, _side: Side, _piece: PieceType): Square[] {
  // TODO(ticket 09): own-half ∩ empty ∩ (pawn ⇒ not rank 1/8) ∩ (no check created)
  return []
}

/** Attempt a drop; returns true if applied. No-op stub for now. */
export function tryDrop(_chess: Chess, _side: Side, _piece: PieceType, _square: Square): boolean {
  // TODO(ticket 09): validate via legalDropSquares, then chess.put(); enforce
  // the no-check invariant by rejecting squares that would check the enemy king.
  return false
}
