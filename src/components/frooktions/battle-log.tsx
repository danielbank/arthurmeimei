'use client'

// Battle log — wayfinder ticket 13. A running feed of drops, earns, placements,
// penalties, moves, and the result. Newest first; `aria-live` so it's announced.

import type { LogEntry } from '@/lib/frooktions/gameReducer'
import { cn } from '@/lib/utils'

const TONE: Record<LogEntry['kind'], string> = {
  you: 'text-emerald-600 dark:text-emerald-400',
  foe: 'text-destructive',
  move: 'text-muted-foreground',
  sys: 'text-foreground',
}

export function BattleLog({ log }: { log: LogEntry[] }) {
  return (
    <div className="bg-card rounded-2xl border p-5 shadow-sm">
      <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
        Battle log
      </p>
      <ol
        aria-live="polite"
        aria-label="Battle log"
        className="flex max-h-40 flex-col gap-1.5 overflow-y-auto"
      >
        {log.map((e, i) => (
          <li key={`${e.t}-${i}`} className={cn('text-sm font-medium', TONE[e.kind])}>
            <span className="text-muted-foreground mr-2 font-mono text-[11px] tabular-nums">
              {Math.floor(e.t / 60)}:{String(e.t % 60).padStart(2, '0')}
            </span>
            {e.text}
          </li>
        ))}
      </ol>
    </div>
  )
}
