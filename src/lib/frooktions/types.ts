// Frooktions shared types. See the wayfinder map: wayfinder/frooktions/MAP.md
// and glossary: fraction-math-game/CONTEXT.md

import type { PieceType } from './constants'

/** chess.js colours: white = the player's team, black = the adversary ("robots"). */
export type Side = 'w' | 'b'

/** The four difficulty bands the player chooses from (reward ladder, ticket 03). */
export type Tier = 'pawn' | 'minor' | 'rook' | 'queen'

/** Game phases (ticket 06). The loop only drops/moves during `playing`. */
export type Phase = 'setup' | 'playing' | 'game-over'

/** Outcome once `chess.js` reports game over (ticket 06). */
export type GameResult = 'win' | 'lose' | 'draw'

/** A piece earned by a correct answer, awaiting placement (place-then-earn). */
export interface PendingPiece {
  type: PieceType
}
