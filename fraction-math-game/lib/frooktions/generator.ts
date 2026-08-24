// Procedural question generator — wayfinder ticket 03 (tiers/ladder) + ticket 04
// (operand-range tuning). Renders through the existing math primitives.

import type { Tier } from './types'

/** One Euclidean step `A = B×C + D` for the guided GCD ladder (Queen tier). */
export interface EuclidStep {
  A: number
  B: number
  C: number
  D: number
}

/** A generated problem. */
export interface Question {
  tier: Tier
  kind: 'fraction' | 'gcd'
  /** fraction tiers: a/b + c/d; answer accepted as any fraction equal to sumN/sumD */
  fraction?: {
    a: number
    b: number
    c: number
    d: number
    sumN: number
    sumD: number
    /** hint only offered when denominators differ (no ×1/1 no-op) */
    canHint: boolean
  }
  /** queen tier: the Euclidean ladder + the GCD (last nonzero divisor) */
  gcd?: { a0: number; b0: number; steps: EuclidStep[]; result: number }
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}

function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b
}

function ri(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Hint Mode factor for a fraction against the other denominator (ticket 07):
 *  f = d / gcd(b, d). Only meaningful when b ≠ d. */
export function hintFactor(b: number, d: number): number {
  return d / gcd(b, d)
}

function fractionQuestion(tier: Tier, b: number, d: number): Question {
  const a = ri(1, b - 1)
  const c = ri(1, d - 1)
  const L = lcm(b, d)
  return {
    tier,
    kind: 'fraction',
    fraction: { a, b, c, d, sumN: a * (L / b) + c * (L / d), sumD: L, canHint: b !== d },
  }
}

function buildEuclid(a: number, b: number): EuclidStep[] {
  const steps: EuclidStep[] = []
  while (b !== 0) {
    steps.push({ A: a, B: b, C: Math.floor(a / b), D: a % b })
    ;[a, b] = [b, a % b]
  }
  return steps
}

/** Generate a fresh problem of the given tier (ranges are ticket 04 defaults). */
export function generateQuestion(tier: Tier): Question {
  switch (tier) {
    case 'pawn': {
      // same-denominator addition — the trivial common-denominator case
      const b = pick([2, 3, 4, 5, 6])
      return fractionQuestion('pawn', b, b)
    }
    case 'minor': {
      // unlike denominators, small
      let b = pick([3, 4, 5, 6])
      let d = pick([3, 4, 6, 8])
      while (b === d) d = pick([3, 4, 6, 8])
      return fractionQuestion('minor', b, d)
    }
    case 'rook': {
      // unlike denominators, larger (a harder common-denominator find)
      let b = pick([4, 6, 8, 9, 12])
      let d = pick([6, 8, 9, 10, 12])
      while (b === d) d = pick([6, 8, 9, 10, 12])
      return fractionQuestion('rook', b, d)
    }
    case 'queen': {
      // Euclidean chain of 2–4 steps with a GCD ≥ 2 (nicer problems)
      let a0: number, b0: number, steps: EuclidStep[]
      do {
        b0 = ri(12, 45)
        a0 = b0 + ri(6, 70)
        steps = buildEuclid(a0, b0)
      } while (steps.length < 2 || steps.length > 4 || steps[steps.length - 1].B < 2)
      return {
        tier: 'queen',
        kind: 'gcd',
        gcd: { a0, b0, steps, result: steps[steps.length - 1].B },
      }
    }
  }
}
