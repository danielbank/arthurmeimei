'use client'

// The math column — wayfinder ticket 10. Tier picker + active question card +
// the Hint Mode wand (ticket 07). Exposes onEarn/onWrong so the parent (economy
// reducer, tickets 11/12) can grant material or apply the penalty. While a piece
// is pending placement (`disabled`), drawing a new question is blocked
// (place-then-earn, ticket 04). Each tier also has an attempt cap: once a tier is
// solved its limit of times it's spent, forcing the player onto a harder set.

import { useState } from 'react'
import { Wand2 } from 'lucide-react'
import { TierPicker } from './tier-picker'
import { QuestionCard } from './question-card'
import { generateQuestion, type Question } from '@/lib/frooktions/generator'
import { TIER_ATTEMPT_CAP, TIER_PIECE, type PieceType } from '@/lib/frooktions/constants'
import type { SolvedByTier } from '@/lib/frooktions/gameReducer'
import type { Tier } from '@/lib/frooktions/types'
import { cn } from '@/lib/utils'

export function MathColumn({
  disabled = false,
  solved,
  onEarn,
  onWrong,
}: {
  /** true while a piece is pending placement — blocks drawing a new question */
  disabled?: boolean
  /** correct-solve count per tier — drives which tiers have hit their cap */
  solved: SolvedByTier
  onEarn: (piece: PieceType, tier: Tier) => void
  /** wrong Submit: 'pawn' for fraction tiers, 'minor' for the Queen ladder */
  onWrong: (penalty: 'pawn' | 'minor') => void
}) {
  const [tier, setTier] = useState<Tier | null>(null)
  const [question, setQuestion] = useState<Question | null>(null)
  const [qid, setQid] = useState(0)
  const [hintMode, setHintMode] = useState(false)

  const cappedTiers = (Object.keys(TIER_ATTEMPT_CAP) as Tier[]).filter((t) => {
    const cap = TIER_ATTEMPT_CAP[t]
    return cap !== null && solved[t] >= cap
  })

  function draw(t: Tier) {
    if (disabled) return
    setTier(t)
    setQuestion(generateQuestion(t))
    setQid((n) => n + 1)
  }
  function clear() {
    setQuestion(null)
    setTier(null)
  }
  function correct() {
    if (!tier) return
    // Minor tier drops a random knight or bishop; other tiers grant their piece.
    const piece: PieceType = tier === 'minor' ? (Math.random() < 0.5 ? 'n' : 'b') : TIER_PIECE[tier]
    onEarn(piece, tier)
    clear()
  }
  // Fraction tiers: wrong Submit costs a pawn and ends the question.
  function fractionWrong() {
    onWrong('pawn')
    clear()
  }
  // Queen ladder: each wrong step hands the robots a minor piece; the ladder
  // stays open so the player can recover and finish.
  function queenWrong() {
    onWrong('minor')
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="bg-card rounded-2xl border p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Pick a problem — harder math wins a stronger piece
          </p>
          <button
            onClick={() => setHintMode((h) => !h)}
            aria-pressed={hintMode}
            className={cn(
              'focus-visible:ring-primary inline-flex items-center gap-1.5 rounded-full border-2 border-transparent px-3 py-1.5 text-xs font-bold transition focus-visible:ring-2 focus-visible:outline-none',
              hintMode
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:border-primary'
            )}
          >
            <Wand2 className="size-3.5" /> Hints: {hintMode ? 'on' : 'off'}
          </button>
        </div>
        <TierPicker
          selected={tier}
          disabled={disabled || !!question}
          cappedTiers={cappedTiers}
          onPick={draw}
        />
      </div>

      <div className="bg-card min-h-40 rounded-2xl border p-5 shadow-sm">
        {question ? (
          <QuestionCard
            key={qid}
            question={question}
            hintMode={hintMode}
            onCorrect={correct}
            onWrong={tier === 'queen' ? queenWrong : fractionWrong}
            onSkip={clear}
          />
        ) : (
          <p className="text-muted-foreground flex h-full min-h-28 items-center justify-center text-center text-sm font-medium">
            {disabled
              ? 'Place your earned piece on the board first →'
              : 'Pick a piece above to get a problem.'}
          </p>
        )}
      </div>
    </section>
  )
}
