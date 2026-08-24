// Economy: drops, escalation, penalty pawn, place-then-earn — wayfinder ticket 04
// (constants) + ticket 02 (drops obey the placement contract, mirrored).
//
// Pure and framework-free so it can be unit-tested without React (ticket 11).
//
// TODO(build ticket 11): implement drop scheduling + escalation + penalty; route
// every adversary drop through legality.tryDrop (mirror contract, no check).

import type { Chess } from 'chess.js'
import { escalationPool, type PieceType } from './constants'

/** Pick the adversary's next drop type from the elapsed-time escalation pool. */
export function nextAdversaryDropType(
  elapsedSec: number,
  rng: () => number = Math.random
): PieceType {
  const pool = escalationPool(elapsedSec)
  return pool[Math.floor(rng() * pool.length)]
}

/** Apply one adversary timed drop to the board. No-op stub for now. */
export function adversaryDrop(_chess: Chess, _elapsedSec: number): boolean {
  // TODO(ticket 11): choose type via nextAdversaryDropType, find a legal mirror
  // square (legality.legalDropSquares for black), apply via legality.tryDrop.
  return false
}

/** Apply the wrong-answer penalty pawn to the adversary (single-Submit tiers). */
export function penaltyPawn(_chess: Chess): boolean {
  // TODO(ticket 11): drop one black pawn per the mirror contract.
  return false
}
