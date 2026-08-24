'use client'

// Frooktions — the full game (wayfinder tickets 09/10/11/12). The reducer + loop
// (useFrooktions) drive everything: earn → place, timed adversary drops +
// escalation, both AI armies moving, and win/lose. Polish/battle-log = ticket 13.

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BoardColumn } from '@/components/frooktions/board-column'
import { MathColumn } from '@/components/frooktions/math-column'
import { GameOverOverlay } from '@/components/frooktions/game-over-overlay'
import { useFrooktions } from '@/components/frooktions/use-frooktions'
import { legalDropSquares } from '@/lib/frooktions/legality'

export default function FrooktionsPage() {
  const { state, dispatch } = useFrooktions()
  const placeSquares = state.pending ? legalDropSquares(state.chess, 'w', state.pending.type) : []

  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 md:px-10 md:py-12">
        <header className="flex flex-col gap-3 border-b pb-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm"
          >
            <ArrowLeft className="size-4" /> Math Lab
          </Link>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Fr<span className="text-primary">oo</span>ktions
            </h1>
            <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
              Solve fractions to build your chess army. Two AIs fight — your math decides who wins.
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <BoardColumn
            fen={state.fen}
            elapsedSec={state.tickCount}
            phase={state.phase}
            placeSquares={placeSquares}
            onPlace={(square) => dispatch({ type: 'PLACE_PIECE', square })}
          />
          <MathColumn
            disabled={state.pending !== null || state.phase === 'game-over'}
            onEarn={(piece) => dispatch({ type: 'EARN_PIECE', piece })}
            onWrong={() => dispatch({ type: 'WRONG_ANSWER' })}
          />
        </div>
      </div>

      {state.result && (
        <GameOverOverlay result={state.result} onRestart={() => dispatch({ type: 'RESTART' })} />
      )}
    </main>
  )
}
