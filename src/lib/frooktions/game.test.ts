// Unit tests for the pure economy + reducer — wayfinder ticket 11. Run: pnpm test

import { test, expect } from 'vitest'
import { Chess } from 'chess.js'
import {
  escalationPool,
  GRACE_PERIOD_MS,
  ADVERSARY_DROP_INTERVAL_MS,
  dropIntervalMs,
  INITIAL_DROP_SPEEDUP,
  CLASS_SPEEDUP,
} from './constants'
import { nextAdversaryDropType, adversaryDrop, penaltyPawn, penaltyMinor } from './economy'
import { gameReducer, initGameState, evaluateGameOver, type GameState } from './gameReducer'
import { computeAiMove } from './ai'

const GRACE = GRACE_PERIOD_MS / 1000
const DROP = ADVERSARY_DROP_INTERVAL_MS / 1000

function material(fen: string, side: 'w' | 'b'): number {
  const V: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }
  let sum = 0
  for (const ch of fen.split(' ')[0]) {
    const lower = ch.toLowerCase()
    if (!(lower in V)) continue
    const isWhite = ch === ch.toUpperCase()
    if ((side === 'w') === isWhite) sum += V[lower]
  }
  return sum
}

test('escalation boundaries (ticket 04)', () => {
  expect([...escalationPool(0)]).toEqual(['p'])
  expect([...escalationPool(29)]).toEqual(['p'])
  expect(escalationPool(30)).toContain('n')
  expect(escalationPool(74)).toContain('b')
  expect(escalationPool(74)).not.toContain('r')
  expect(escalationPool(75)).toContain('r')
  expect(escalationPool(200)).toContain('q')
})

test('nextAdversaryDropType picks from the pool', () => {
  expect(nextAdversaryDropType(0, () => 0)).toBe('p') // only pawns early
  expect(nextAdversaryDropType(80, () => 0.99)).toBe('r') // last of [p,n,b,r]
})

test('adversaryDrop & penaltyPawn place black material on the black half only', () => {
  const c = new Chess('4k3/8/8/8/8/8/8/4K3 w - - 0 1')
  expect(adversaryDrop(c, 80, () => 0)).toBe('p') // pool[0]='p' at 80s
  expect(material(c.fen(), 'b')).toBe(1)
  const placed = c
    .board()
    .flat()
    .find((x) => x && x.color === 'b' && x.type !== 'k')
  expect(placed && Number(placed.square[1]) >= 5).toBe(true) // ranks 5-8

  const c2 = new Chess('4k3/8/8/8/8/8/8/4K3 w - - 0 1')
  expect(penaltyPawn(c2, () => 0)).toBe(true)
  expect(material(c2.fen(), 'b')).toBe(1)
})

test('TICK: grace gates playing, then drops on cadence', () => {
  let s = initGameState()
  const tick = () => (s = gameReducer(s, { type: 'TICK', rng: () => 0 }))
  for (let i = 0; i < GRACE - 1; i++) tick()
  expect(s.phase).toBe('setup') // still setup within grace
  tick() // reaches GRACE
  expect(s.phase).toBe('playing')
  const before = material(s.fen, 'b')
  while (s.tickCount < GRACE + DROP) tick() // advance to the first drop tick
  expect(material(s.fen, 'b')).toBe(before + 1)
})

test('EARN_PIECE is place-then-earn (one pending at a time)', () => {
  let s = initGameState()
  s = gameReducer(s, { type: 'EARN_PIECE', piece: 'r', tier: 'rook' })
  expect(s.pending?.type).toBe('r')
  s = gameReducer(s, { type: 'EARN_PIECE', piece: 'q', tier: 'queen' })
  expect(s.pending?.type).toBe('r') // second earn ignored while pending
  expect(s.solved.rook).toBe(1) // the rook solve counted
  expect(s.solved.queen).toBe(0) // the ignored earn did not
})

test('PLACE_PIECE: legal square places & clears pending; illegal is a no-op', () => {
  let s = initGameState()
  s = gameReducer(s, { type: 'EARN_PIECE', piece: 'r', tier: 'rook' })
  const illegal = gameReducer(s, { type: 'PLACE_PIECE', square: 'e4' }) // rook e4 checks e8
  expect(illegal.pending?.type).toBe('r')
  expect(material(illegal.fen, 'w')).toBe(0)
  const ok = gameReducer(s, { type: 'PLACE_PIECE', square: 'a4' })
  expect(ok.pending).toBe(null)
  expect(material(ok.fen, 'w')).toBe(5)
})

test('WRONG_ANSWER hands the adversary a penalty pawn', () => {
  let s = initGameState()
  s = gameReducer(s, { type: 'WRONG_ANSWER', rng: () => 0 })
  expect(material(s.fen, 'b')).toBe(1)
})

test('WRONG_ANSWER penalty=minor hands the adversary a knight or bishop', () => {
  let s = initGameState()
  s = gameReducer(s, { type: 'WRONG_ANSWER', penalty: 'minor', rng: () => 0 })
  expect(material(s.fen, 'b')).toBe(3) // knight/bishop = 3, not a pawn
  const placed = new Chess(s.fen)
    .board()
    .flat()
    .find((x) => x && x.color === 'b' && x.type !== 'k')
  expect(placed && (placed.type === 'n' || placed.type === 'b')).toBe(true)
})

test('penaltyMinor drops a black knight (rng<0.5) or bishop (rng>=0.5)', () => {
  const c1 = new Chess('4k3/8/8/8/8/8/8/4K3 w - - 0 1')
  expect(penaltyMinor(c1, () => 0)).toBe('n')
  const c2 = new Chess('4k3/8/8/8/8/8/8/4K3 w - - 0 1')
  expect(penaltyMinor(c2, () => 0.9)).toBe('b')
})

test('dropIntervalMs: 25% faster to start, then ×1.5 per advanced class solved', () => {
  const base = ADVERSARY_DROP_INTERVAL_MS
  expect(dropIntervalMs(0)).toBeCloseTo(base / (1 + INITIAL_DROP_SPEEDUP))
  expect(dropIntervalMs(1)).toBeCloseTo(base / ((1 + INITIAL_DROP_SPEEDUP) * (1 + CLASS_SPEEDUP)))
  expect(dropIntervalMs(3)).toBeCloseTo(
    base / ((1 + INITIAL_DROP_SPEEDUP) * (1 + CLASS_SPEEDUP) ** 3)
  )
  // strictly monotonically faster
  expect(dropIntervalMs(1)).toBeLessThan(dropIntervalMs(0))
  expect(dropIntervalMs(2)).toBeLessThan(dropIntervalMs(1))
})

test('solving a new advanced class accelerates the adversary drop cadence', () => {
  const GRACE = GRACE_PERIOD_MS / 1000
  // baseline: no classes solved → first drop after ceil(dropIntervalMs(0)/1000) ticks
  const firstDropTick = (init: GameState) => {
    let s = init
    while (material(s.fen, 'b') === 0 && s.tickCount < GRACE + 60) {
      s = gameReducer(s, { type: 'TICK', rng: () => 0 })
    }
    return s.tickCount
  }
  const baseTick = firstDropTick(initGameState())

  // pre-solve a minor class, then run from the same starting point
  const primed = gameReducer(initGameState(), { type: 'EARN_PIECE', piece: 'n', tier: 'minor' })
  const fastTick = firstDropTick(primed)

  expect(fastTick).toBeLessThan(baseTick) // faster cadence → earlier first drop
})

test('APPLY_MOVE detects checkmate → result (player is white)', () => {
  const foolsMate = 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2'
  const s: GameState = {
    ...initGameState(),
    phase: 'playing',
    chess: new Chess(foolsMate),
    fen: foolsMate,
  }
  const after = gameReducer(s, { type: 'APPLY_MOVE', move: { from: 'd8', to: 'h4' } })
  expect(after.result).toBe('lose') // black mates white → player loses
  expect(after.phase).toBe('game-over')
})

test('evaluateGameOver: ongoing game → null', () => {
  expect(evaluateGameOver(new Chess('4k3/8/8/8/8/8/8/4K3 w - - 0 1'))).toBe(null)
})

// ---- engine wiring (ticket 12) ----

test('computeAiMove yields a chess.js-legal move, and null when mated', () => {
  const fen = '4k3/8/8/8/8/8/R7/4K3 w - - 0 1'
  const m = computeAiMove(fen)
  expect(m).not.toBe(null)
  expect(() => new Chess(fen).move(m!)).not.toThrow()
  // white is checkmated (fool's mate final position), white to move → no move
  expect(computeAiMove('rnbqkbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3')).toBe(null)
})

test('engine finds a mate-in-1 → reducer reports a win (ENGINE_LEVEL=2)', () => {
  const mateIn1 = 'k7/7R/1K6/8/8/8/8/8 w - - 0 1' // Rh8#
  const s: GameState = {
    ...initGameState(),
    phase: 'playing',
    chess: new Chess(mateIn1),
    fen: mateIn1,
  }
  const move = computeAiMove(mateIn1)
  expect(move).not.toBe(null)
  const after = gameReducer(s, { type: 'APPLY_MOVE', move: move! })
  expect(after.result).toBe('win')
})

test('auto-play loop produces only legal moves for 40 plies (loop mechanics)', () => {
  const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  let s: GameState = { ...initGameState(), phase: 'playing', chess: new Chess(START), fen: START }
  for (let ply = 0; ply < 40 && s.phase === 'playing'; ply++) {
    const move = computeAiMove(s.fen)
    if (!move) break // legitimate game-over
    const next = gameReducer(s, { type: 'APPLY_MOVE', move })
    expect(next.fen).not.toBe(s.fen) // the move was legal & applied
    s = next
  }
  expect(true).toBe(true)
})
