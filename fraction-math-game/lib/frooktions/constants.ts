// Frooktions tuning constants — wayfinder ticket 04 (Pacing, cadence & escalation).
// ALL VALUES ARE PLAYTEST STARTING POINTS, not final. Both armies run the same
// engine, so the game is decided by material; these knobs set the tension.

/** chess.js piece types (lowercase). */
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'

/** Adversary auto-drops one piece this often. */
export const ADVERSARY_DROP_INTERVAL_MS = 10_000

/** Each army makes a half-move this often (runs FASTER than drops, ticket 04 Q1). */
export const ARMY_HALF_MOVE_INTERVAL_MS = 4_000

/** No adversary drops or army moves for this long at the start (setup → playing). */
export const GRACE_PERIOD_MS = 10_000

/** Place-then-earn: a correct answer's piece must be placed before the next one. */
export const MAX_PENDING_PIECES = 1

/** Flat penalty pawn per wrong Submit (Pawn/Minor/Rook tiers; Queen is exempt). */
export const WRONG_ANSWER_PENALTY_PAWNS = 1

/** Two kings: white (player) on e1, black (adversary) on e8, white to move. */
export const START_FEN = '4k3/8/8/8/8/8/8/4K3 w - - 0 1'

/** js-chess-engine AI level (0–4) for BOTH armies — kept modest and equal. */
export const ENGINE_LEVEL = 2

/** Reward ladder: which piece each tier grants (ticket 03). Minor = knight/bishop
 *  chosen at placement, represented as 'n' until the player picks. */
export const TIER_PIECE: Record<'pawn' | 'minor' | 'rook' | 'queen', PieceType> = {
  pawn: 'p',
  minor: 'n',
  rook: 'r',
  queen: 'q',
}

/** Adversary drop-quality escalation, keyed to elapsed seconds (ticket 04 Q2).
 *  A wrong-answer penalty pawn is a SECOND material channel on top of this. */
export const ESCALATION: ReadonlyArray<{ untilSec: number; pool: readonly PieceType[] }> = [
  { untilSec: 30, pool: ['p'] },
  { untilSec: 75, pool: ['p', 'n', 'b'] },
  { untilSec: 150, pool: ['p', 'n', 'b', 'r'] },
  { untilSec: Infinity, pool: ['p', 'n', 'b', 'r', 'q'] },
]

/** The adversary's drop pool for a given elapsed time. */
export function escalationPool(elapsedSec: number): readonly PieceType[] {
  return (ESCALATION.find((s) => elapsedSec < s.untilSec) ?? ESCALATION[ESCALATION.length - 1]).pool
}
