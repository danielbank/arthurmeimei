'use client'

// Game-over overlay — wayfinder ticket 12 (functional). Visual polish is ticket 13.

import type { GameResult } from '@/lib/frooktions/types'

export function GameOverOverlay({
  result,
  onRestart,
}: {
  result: GameResult
  onRestart: () => void
}) {
  const title = result === 'win' ? 'You win! 🎉' : result === 'lose' ? 'The robots win 🤖' : 'Draw'
  const sub =
    result === 'win'
      ? 'Your army checkmated the robots.'
      : result === 'lose'
        ? 'Your king was checkmated.'
        : 'Neither side can force a win.'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
      <div className="bg-card w-full max-w-sm rounded-2xl border p-8 text-center shadow-xl">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground mt-2 text-sm">{sub}</p>
        <button
          onClick={onRestart}
          className="bg-primary text-primary-foreground mt-6 rounded-xl px-6 py-3 font-bold shadow-sm transition hover:brightness-105"
        >
          Play again
        </button>
      </div>
    </div>
  )
}
