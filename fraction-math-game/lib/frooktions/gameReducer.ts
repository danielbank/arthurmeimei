// The single source of truth — wayfinder ticket 06. A pure reducer over the whole
// game state; React is only a view. Logic lives in the sibling pure modules.
//
// TODO(build ticket 11 + 12): flesh out each action.

import { Chess } from 'chess.js'
import { START_FEN } from './constants'
import type { GameResult, PendingPiece, Phase } from './types'
import type { PieceType } from './constants'
import type { Square } from 'chess.js'

export interface GameState {
  chess: Chess
  fen: string
  phase: Phase
  tickCount: number
  hintMode: boolean
  pending: PendingPiece | null
  result: GameResult | null
}

export type GameAction =
  | { type: 'TICK' }
  | { type: 'EARN_PIECE'; piece: PieceType }
  | { type: 'PLACE_PIECE'; square: Square }
  | { type: 'WRONG_ANSWER' }
  | { type: 'TOGGLE_HINT' }
  | { type: 'RESTART' }

export function initGameState(): GameState {
  const chess = new Chess(START_FEN)
  return {
    chess,
    fen: chess.fen(),
    phase: 'setup',
    tickCount: 0,
    hintMode: false,
    pending: null,
    result: null,
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'TOGGLE_HINT':
      return { ...state, hintMode: !state.hintMode }
    case 'RESTART':
      return initGameState()
    // TODO(ticket 11/12): TICK (drops, moves, escalation, win/lose),
    // EARN_PIECE, PLACE_PIECE, WRONG_ANSWER.
    default:
      return state
  }
}
