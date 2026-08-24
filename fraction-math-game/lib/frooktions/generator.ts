// Procedural question generator — wayfinder ticket 03 (tiers/ladder) + ticket 04
// (operand-range tuning). Renders through the existing math primitives
// (Fraction / Equation / EquationLine).
//
// TODO(build ticket 10): implement the four tiers and the Euclidean chain builder.

import type { Tier } from './types'

/** One Euclidean step `A = B×C + D` for the guided GCD ladder (Queen tier). */
export interface EuclidStep {
  A: number
  B: number
  C: number
  D: number
}

/** A generated problem. Fraction tiers carry operands; Queen carries the chain. */
export interface Question {
  tier: Tier
  kind: 'fraction' | 'gcd'
  /** fraction tiers: a/b + c/d, answer over the common denominator */
  fraction?: { a: number; b: number; c: number; d: number }
  /** queen tier: the Euclidean ladder + the GCD (last nonzero divisor) */
  gcd?: { a0: number; b0: number; steps: EuclidStep[]; result: number }
}

/** Generate a fresh problem of the given tier. */
export function generateQuestion(tier: Tier): Question {
  // TODO(ticket 10): Pawn=same-denom add, Minor=unlike-denom add, Rook=2-step,
  // Queen=Euclidean chain of 2–4 steps. Operand ranges per ticket 04.
  return { tier, kind: tier === 'queen' ? 'gcd' : 'fraction' }
}

/** Hint Mode factor for a fraction against the other denominator (ticket 07):
 *  f = d / gcd(b, d). Only meaningful when b ≠ d. */
export function hintFactor(b: number, d: number): number {
  const g = gcd(b, d)
  return d / g
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}
