'use client'

// Tick clock + adversary escalation badge — wayfinder ticket 09 (pacing: ticket 04).

import { cn } from '@/lib/utils'

function mmss(totalSec: number): string {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

/** Adversary drop-quality label, keyed to elapsed seconds (ticket 04 escalation). */
export function escalationLabel(elapsedSec: number): string {
  if (elapsedSec < 30) return 'pawns'
  if (elapsedSec < 75) return '+ minors'
  if (elapsedSec < 150) return '+ rooks'
  return 'queens!'
}

export function Clock({
  elapsedSec,
  phase,
}: {
  elapsedSec: number
  phase: 'setup' | 'playing' | 'game-over'
}) {
  const note =
    phase === 'setup'
      ? 'Get ready — build before the robots attack!'
      : phase === 'game-over'
        ? 'Game over'
        : 'Attack! Keep solving to keep up.'

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'bg-destructive size-2.5 rounded-full',
            phase === 'playing' && 'motion-safe:animate-pulse'
          )}
          aria-hidden
        />
        <div>
          <p className="font-mono text-2xl font-bold tabular-nums">{mmss(elapsedSec)}</p>
          <p className="text-muted-foreground -mt-0.5 text-xs font-medium">{note}</p>
        </div>
      </div>
      <span className="bg-primary/10 text-primary rounded-full px-3 py-1.5 text-xs font-semibold">
        Enemy: {escalationLabel(elapsedSec)}
      </span>
    </div>
  )
}
