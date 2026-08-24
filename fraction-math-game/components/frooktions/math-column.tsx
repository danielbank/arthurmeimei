'use client'

// The math column — wayfinder ticket 10. Tier picker + active question card +
// the Hint Mode wand (ticket 07). Exposes onEarn/onWrong so the parent (economy
// reducer, tickets 11/12) can grant material or apply the penalty pawn. While a
// piece is pending placement (`disabled`), drawing a new question is blocked
// (place-then-earn, ticket 04).

import { useState } from 'react'
import { Wand2 } from 'lucide-react'
import { TierPicker } from './tier-picker'
import { QuestionCard } from './question-card'
import { generateQuestion, type Question } from '@/lib/frooktions/generator'
import { TIER_PIECE, type PieceType } from '@/lib/frooktions/constants'
import type { Tier } from '@/lib/frooktions/types'
import { cn } from '@/lib/utils'

export function MathColumn({
  disabled = false,
  onEarn,
  onWrong,
}: {
  /** true while a piece is pending placement — blocks drawing a new question */
  disabled?: boolean
  onEarn: (piece: PieceType) => void
  onWrong: () => void
}) {
  const [tier, setTier] = useState<Tier | null>(null)
  const [question, setQuestion] = useState<Question | null>(null)
  const [qid, setQid] = useState(0)
  const [hintMode, setHintMode] = useState(false)

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
    if (tier) onEarn(TIER_PIECE[tier])
    clear()
  }
  function wrong() {
    onWrong()
    clear()
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
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border-2 border-transparent px-3 py-1.5 text-xs font-bold transition',
              hintMode
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:border-primary'
            )}
          >
            <Wand2 className="size-3.5" /> Hints: {hintMode ? 'on' : 'off'}
          </button>
        </div>
        <TierPicker selected={tier} disabled={disabled || !!question} onPick={draw} />
      </div>

      <div className="bg-card min-h-40 rounded-2xl border p-5 shadow-sm">
        {question ? (
          <QuestionCard
            key={qid}
            question={question}
            hintMode={hintMode}
            onCorrect={correct}
            onWrong={wrong}
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
