// The single source of truth — wayfinder ticket 06. A pure reducer over the whole
// game state; React is only a view. Each board-changing action works on a fresh
// Chess (cloned from the current FEN) so state stays immutable and testable.
//
// TICK drives time, the grace→playing transition, and adversary timed drops +
// escalation. APPLY_MOVE (dispatched by the engine loop, ticket 12) applies an AI
// move and is where checkmate/draw is detected — drops can never end the game
// (ticket 02: no check by placement).

import { Chess, type Square } from 'chess.js'
import { ADVERSARY_DROP_INTERVAL_MS, GRACE_PERIOD_MS, START_FEN, type PieceType } from './constants'
import { adversaryDrop, penaltyPawn } from './economy'
import { tryDrop } from './legality'
import type { GameResult, PendingPiece, Phase } from './types'

/** The tick loop fires once per second, so tickCount is elapsed seconds. */
const GRACE_SEC = GRACE_PERIOD_MS / 1000
const DROP_INTERVAL_SEC = ADVERSARY_DROP_INTERVAL_MS / 1000

export interface GameState {
  chess: Chess
  fen: string
  phase: Phase
  tickCount: number
  hintMode: boolean
  pending: PendingPiece | null
  result: GameResult | null
}

export type GameMove = { from: string; to: string; promotion?: string }

export type GameAction =
  | { type: 'TICK'; rng?: () => number }
  | { type: 'EARN_PIECE'; piece: PieceType }
  | { type: 'PLACE_PIECE'; square: string }
  | { type: 'WRONG_ANSWER'; rng?: () => number }
  | { type: 'APPLY_MOVE'; move: GameMove }
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

/** Player is white. Only CHECKMATE (win/lose) or STALEMATE (draw) end the game —
 *  NOT insufficient-material / fifty-move / threefold draws. The game deliberately
 *  starts as two lone kings (which chess.js would call an insufficient-material
 *  draw), and material flows in continuously, so those draw rules must not fire. */
export function evaluateGameOver(chess: Chess): GameResult | null {
  if (chess.isCheckmate()) return chess.turn() === 'b' ? 'win' : 'lose'
  if (chess.isStalemate()) return 'draw'
  return null
}

/** Return the next state after a board mutation performed on `chess`. */
function afterBoardChange(
  state: GameState,
  chess: Chess,
  extra: Partial<GameState> = {}
): GameState {
  const result = evaluateGameOver(chess)
  return {
    ...state,
    ...extra,
    chess,
    fen: chess.fen(),
    result,
    phase: result ? 'game-over' : (extra.phase ?? state.phase),
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'TOGGLE_HINT':
      return { ...state, hintMode: !state.hintMode }

    case 'RESTART':
      return initGameState()

    case 'TICK': {
      if (state.phase === 'game-over') return state
      const tickCount = state.tickCount + 1
      // grace period gates the start of the assault
      if (state.phase === 'setup') {
        return tickCount >= GRACE_SEC
          ? { ...state, tickCount, phase: 'playing' }
          : { ...state, tickCount }
      }
      // playing: adversary timed drop on cadence
      const sinceGrace = tickCount - GRACE_SEC
      if (sinceGrace > 0 && sinceGrace % DROP_INTERVAL_SEC === 0) {
        const chess = new Chess(state.chess.fen())
        adversaryDrop(chess, tickCount, action.rng)
        return afterBoardChange(state, chess, { tickCount })
      }
      return { ...state, tickCount }
    }

    case 'EARN_PIECE': {
      // place-then-earn: only one pending piece at a time (ticket 04)
      if (state.pending) return state
      return { ...state, pending: { type: action.piece } }
    }

    case 'PLACE_PIECE': {
      if (!state.pending) return state
      const chess = new Chess(state.chess.fen())
      if (!tryDrop(chess, 'w', state.pending.type, action.square as Square)) return state
      return afterBoardChange(state, chess, { pending: null })
    }

    case 'WRONG_ANSWER': {
      const chess = new Chess(state.chess.fen())
      penaltyPawn(chess, action.rng)
      return afterBoardChange(state, chess)
    }

    case 'APPLY_MOVE': {
      const chess = new Chess(state.chess.fen())
      try {
        chess.move(action.move)
      } catch {
        return state // illegal move from the engine — ignore
      }
      return afterBoardChange(state, chess)
    }

    default:
      return state
  }
}
