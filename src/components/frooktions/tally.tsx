'use client'

// Material tally — wayfinder ticket 09. Both armies run the same engine, so
// material is what decides the game; this bar is the at-a-glance scoreboard.
// Computes from the FEN's piece-placement field.

const VALUE: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }
// filled glyphs, indexed by lowercase type
const GLYPH: Record<string, string> = { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚' }
const ORDER = ['q', 'r', 'b', 'n', 'p'] as const

type Counts = { value: number; pieces: string[] }

function tallyFromFen(fen: string): { white: Counts; black: Counts } {
  const placement = fen.split(' ')[0]
  const white: Counts = { value: 0, pieces: [] }
  const black: Counts = { value: 0, pieces: [] }
  for (const ch of placement) {
    const lower = ch.toLowerCase()
    if (!(lower in VALUE)) continue // digit or '/'
    const side = ch === lower ? black : white
    side.value += VALUE[lower]
    if (lower !== 'k') side.pieces.push(lower)
  }
  const sortPieces = (c: Counts) =>
    c.pieces.sort((a, b) => ORDER.indexOf(a as never) - ORDER.indexOf(b as never))
  sortPieces(white)
  sortPieces(black)
  return { white, black }
}

function Row({
  label,
  counts,
  max,
  tone,
}: {
  label: string
  counts: Counts
  max: number
  tone: 'you' | 'foe'
}) {
  const color = tone === 'you' ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
  const bar = tone === 'you' ? 'bg-emerald-500' : 'bg-destructive'
  return (
    <div className="grid gap-1">
      <div className="flex items-center gap-3">
        <span className={`w-20 text-sm font-bold ${color}`}>{label}</span>
        <span className="bg-muted h-3 flex-1 overflow-hidden rounded-full">
          <span
            className={`block h-full rounded-full transition-[width] duration-500 ${bar}`}
            style={{ width: `${Math.max(4, (counts.value / max) * 100)}%` }}
          />
        </span>
        <span className="w-7 text-right font-mono text-sm font-bold tabular-nums">
          {counts.value}
        </span>
      </div>
      <div className={`min-h-5 pl-[92px] text-lg leading-none ${color}`} aria-hidden>
        {counts.pieces.map((p) => GLYPH[p]).join('')}
      </div>
    </div>
  )
}

export function Tally({ fen }: { fen: string }) {
  const { white, black } = tallyFromFen(fen)
  const max = Math.max(12, white.value, black.value)
  return (
    <div className="grid gap-2">
      <Row label="Your team" counts={white} max={max} tone="you" />
      <Row label="Robots" counts={black} max={max} tone="foe" />
    </div>
  )
}
