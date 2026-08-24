// Unit tests for the pure economy + reducer — wayfinder ticket 11. Run: pnpm test

import { test, expect } from 'vitest'
import { Chess } from 'chess.js'
import { escalationPool, GRACE_PERIOD_MS, ADVERSARY_DROP_INTERVAL_MS } from './constants'
import { nextAdversaryDropType, adversaryDrop, penaltyPawn } from './economy'
import { gameReducer, initGameState, evaluateGameOver, type GameState } from './gameReducer'

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
  s = gameReducer(s, { type: 'EARN_PIECE', piece: 'r' })
  expect(s.pending?.type).toBe('r')
  s = gameReducer(s, { type: 'EARN_PIECE', piece: 'q' })
  expect(s.pending?.type).toBe('r') // second earn ignored while pending
})

test('PLACE_PIECE: legal square places & clears pending; illegal is a no-op', () => {
  let s = initGameState()
  s = gameReducer(s, { type: 'EARN_PIECE', piece: 'r' })
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
