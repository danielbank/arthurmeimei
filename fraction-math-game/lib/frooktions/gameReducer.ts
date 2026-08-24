// The single source of truth — wayfinder ticket 06. A pure reducer over the whole
// game state; React is only a view. Each board-changing action works on a fresh
// Chess (cloned from the current FEN) so state stays immutable and testable.
//
// TICK drives time, the grace→playing transition, and adversary timed drops +
// escalation. APPLY_MOVE (dispatched by the engine loop, ticket 12) applies an AI
// move and is where checkmate/draw is detected — drops can never end the game
// (ticket 02: no check by placement).

import { Chess, type Square } from 'chess.js'
import {
  ADVERSARY_DROP_INTERVAL_MS,
  GRACE_PERIOD_MS,
  PIECE_NAME,
  START_FEN,
  type PieceType,
} from './constants'
import { adversaryDrop, penaltyPawn } from './economy'
import { tryDrop } from './legality'
import type { GameResult, PendingPiece, Phase } from './types'

/** The tick loop fires once per second, so tickCount is elapsed seconds. */
const GRACE_SEC = GRACE_PERIOD_MS / 1000
const DROP_INTERVAL_SEC = ADVERSARY_DROP_INTERVAL_MS / 1000
const LOG_CAP = 40

/** A battle-log entry. `you` = the player's team, `foe` = the robots. Newest first. */
export interface LogEntry {
  t: number
  kind: 'you' | 'foe' | 'move' | 'sys'
  text: string
}

const RESULT_TEXT: Record<GameResult, string> = {
  win: 'You win! 🎉',
  lose: 'The robots win 🤖',
  draw: 'Draw — neither side can force a win.',
}

function pushLog(log: LogEntry[], entry: LogEntry): LogEntry[] {
  const next = [entry, ...log]
  return next.length > LOG_CAP ? next.slice(0, LOG_CAP) : next
}

export interface GameState {
  chess: Chess
  fen: string
  phase: Phase
  tickCount: number
  hintMode: boolean
  pending: PendingPiece | null
  result: GameResult | null
  log: LogEntry[]
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
    log: [{ t: 0, kind: 'sys', text: 'Kings ready on e1 & e8 — build your team!' }],
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

/** Return the next state after a board mutation performed on `chess`. Optionally
 *  logs the action, and always logs the result if the game just ended. */
function afterBoardChange(
  state: GameState,
  chess: Chess,
  extra: Partial<GameState> = {},
  logEntry?: LogEntry
): GameState {
  const result = evaluateGameOver(chess)
  let log = state.log
  if (logEntry) log = pushLog(log, logEntry)
  if (result) log = pushLog(log, { t: state.tickCount, kind: 'sys', text: RESULT_TEXT[result] })
  return {
    ...state,
    ...extra,
    chess,
    fen: chess.fen(),
    result,
    phase: result ? 'game-over' : (extra.phase ?? state.phase),
    log,
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
        const dropped = adversaryDrop(chess, tickCount, action.rng)
        const entry: LogEntry | undefined = dropped
          ? { t: tickCount, kind: 'foe', text: `Robots drop a ${PIECE_NAME[dropped]}` }
          : undefined
        return afterBoardChange(state, chess, { tickCount }, entry)
      }
      return { ...state, tickCount }
    }

    case 'EARN_PIECE': {
      // place-then-earn: only one pending piece at a time (ticket 04)
      if (state.pending) return state
      return {
        ...state,
        pending: { type: action.piece },
        log: pushLog(state.log, {
          t: state.tickCount,
          kind: 'you',
          text: `Earned a ${PIECE_NAME[action.piece]} — place it!`,
        }),
      }
    }

    case 'PLACE_PIECE': {
      if (!state.pending) return state
      const chess = new Chess(state.chess.fen())
      const type = state.pending.type
      if (!tryDrop(chess, 'w', type, action.square as Square)) return state
      return afterBoardChange(
        state,
        chess,
        { pending: null },
        {
          t: state.tickCount,
          kind: 'you',
          text: `Placed a ${PIECE_NAME[type]} on ${action.square}`,
        }
      )
    }

    case 'WRONG_ANSWER': {
      const chess = new Chess(state.chess.fen())
      penaltyPawn(chess, action.rng)
      return afterBoardChange(
        state,
        chess,
        {},
        {
          t: state.tickCount,
          kind: 'foe',
          text: 'Wrong answer → robots +1 pawn',
        }
      )
    }

    case 'APPLY_MOVE': {
      const chess = new Chess(state.chess.fen())
      let san: string
      try {
        san = chess.move(action.move).san
      } catch {
        return state // illegal move from the engine — ignore
      }
      const mover = chess.turn() === 'b' ? 'Your team' : 'Robots' // side that just moved
      return afterBoardChange(
        state,
        chess,
        {},
        {
          t: state.tickCount,
          kind: 'move',
          text: `${mover}: ${san}`,
        }
      )
    }

    default:
      return state
  }
}
