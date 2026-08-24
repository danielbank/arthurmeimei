'use client'

// Game-over overlay — wayfinder ticket 13. Result + final material + restart.

import { useEffect, useRef } from 'react'
import type { GameResult } from '@/lib/frooktions/types'

const V: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }
function material(fen: string, side: 'w' | 'b'): number {
  let sum = 0
  for (const ch of fen.split(' ')[0]) {
    const lower = ch.toLowerCase()
    if (!(lower in V)) continue
    if ((side === 'w') === (ch === ch.toUpperCase())) sum += V[lower]
  }
  return sum
}

export function GameOverOverlay({
  result,
  fen,
  onRestart,
}: {
  result: GameResult
  fen: string
  onRestart: () => void
}) {
  const btnRef = useRef<HTMLButtonElement>(null)
  useEffect(() => btnRef.current?.focus(), [])

  const title = result === 'win' ? 'You win! 🎉' : result === 'lose' ? 'The robots win 🤖' : 'Draw'
  const sub =
    result === 'win'
      ? 'Your army checkmated the robots.'
      : result === 'lose'
        ? 'Your king was checkmated.'
        : 'Neither side can force a win.'
  const accent =
    result === 'win'
      ? 'text-emerald-600 dark:text-emerald-400'
      : result === 'lose'
        ? 'text-destructive'
        : 'text-foreground'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="motion-safe:animate-in motion-safe:fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm"
    >
      <div className="bg-card w-full max-w-sm rounded-2xl border p-8 text-center shadow-xl">
        <h2 className={`text-3xl font-bold tracking-tight ${accent}`}>{title}</h2>
        <p className="text-muted-foreground mt-2 text-sm">{sub}</p>
        <div className="text-muted-foreground mt-5 flex items-center justify-center gap-6 text-sm font-semibold">
          <span>
            <span className="text-emerald-600 dark:text-emerald-400">You</span> {material(fen, 'w')}
          </span>
          <span>
            <span className="text-destructive">Robots</span> {material(fen, 'b')}
          </span>
        </div>
        <button
          ref={btnRef}
          onClick={onRestart}
          className="bg-primary text-primary-foreground focus-visible:ring-primary mt-6 rounded-xl px-6 py-3 font-bold shadow-sm transition hover:brightness-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Play again
        </button>
      </div>
    </div>
  )
}
