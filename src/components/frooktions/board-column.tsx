'use client'

// The left column — wayfinder ticket 09. Board with a clock/escalation header,
// a legend, and the material tally beneath.

import { Board } from './board'
import { Clock } from './clock'
import { Tally } from './tally'

export function BoardColumn({
  fen,
  elapsedSec,
  phase,
  placeSquares = [],
  onPlace,
}: {
  fen: string
  elapsedSec: number
  phase: 'setup' | 'playing' | 'game-over'
  placeSquares?: string[]
  onPlace?: (square: string) => void
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="bg-card rounded-2xl border p-4 shadow-sm">
        <div className="mb-3">
          <Clock elapsedSec={elapsedSec} phase={phase} />
        </div>
        <Board fen={fen} placeSquares={placeSquares} onPlace={onPlace} />
        <div className="text-muted-foreground mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
          <span>
            <b className="text-emerald-600 dark:text-emerald-400">Your team</b> — ranks 1–4
          </span>
          <span>
            <b className="text-destructive">Robots</b> — ranks 5–8
          </span>
          <span>Same engine both sides → material decides</span>
        </div>
      </div>
      <div className="bg-card rounded-2xl border p-4 shadow-sm">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
          Army strength
        </p>
        <Tally fen={fen} />
      </div>
    </section>
  )
}
