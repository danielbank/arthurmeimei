'use client'

// Tier picker — wayfinder ticket 10. Choosing a tier is the game's core
// risk/reward decision (ticket 03): harder math earns a stronger piece.

import { cn } from '@/lib/utils'
import type { Tier } from '@/lib/frooktions/types'

const TIERS: { tier: Tier; name: string; glyph: string; dsc: string }[] = [
  { tier: 'pawn', name: 'Pawn', glyph: '♟', dsc: 'same denominator' },
  { tier: 'minor', name: 'Minor', glyph: '♞', dsc: 'different denoms' },
  { tier: 'rook', name: 'Rook', glyph: '♜', dsc: 'harder add' },
  { tier: 'queen', name: 'Queen', glyph: '♛', dsc: 'GCD ladder' },
]

export function TierPicker({
  selected,
  disabled,
  onPick,
}: {
  selected: Tier | null
  disabled?: boolean
  onPick: (tier: Tier) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {TIERS.map((t) => (
        <button
          key={t.tier}
          disabled={disabled}
          onClick={() => onPick(t.tier)}
          aria-label={`${t.name} tier — ${t.dsc}`}
          className={cn(
            'bg-muted/50 focus-visible:ring-primary flex flex-col items-center gap-0.5 rounded-2xl border-2 border-transparent p-3 text-center transition focus-visible:ring-2 focus-visible:outline-none',
            !disabled && 'hover:border-primary active:translate-y-0.5',
            disabled && 'cursor-not-allowed opacity-40',
            selected === t.tier && 'border-primary bg-primary/10'
          )}
        >
          <span className="text-primary text-3xl leading-none">{t.glyph}</span>
          <span className="text-sm font-bold">{t.name}</span>
          <span className="text-muted-foreground text-xs font-medium">{t.dsc}</span>
        </button>
      ))}
    </div>
  )
}
