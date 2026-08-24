'use client'

// Frooktions — the full game (wayfinder tickets 09/10/11/12). The reducer + loop
// (useFrooktions) drive everything: earn → place, timed adversary drops +
// escalation, both AI armies moving, and win/lose. Polish/battle-log = ticket 13.

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BoardColumn } from '@/components/frooktions/board-column'
import { MathColumn } from '@/components/frooktions/math-column'
import { BattleLog } from '@/components/frooktions/battle-log'
import { GameOverOverlay } from '@/components/frooktions/game-over-overlay'
import { useFrooktions } from '@/components/frooktions/use-frooktions'
import { legalDropSquares } from '@/lib/frooktions/legality'

export default function FrooktionsPage() {
  const { state, dispatch } = useFrooktions()
  const placeSquares = state.pending ? legalDropSquares(state.chess, 'w', state.pending.type) : []

  return (
    <div className="text-foreground">
      <div className="mx-auto flex flex-col gap-8 py-8">
        <header className="flex flex-col gap-3 border-b pb-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1.5 text-sm"
          >
            <ArrowLeft className="size-4" /> Home
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
          <div className="flex flex-col gap-4">
            <MathColumn
              disabled={state.pending !== null || state.phase === 'game-over'}
              solved={state.solved}
              onEarn={(piece, tier) => dispatch({ type: 'EARN_PIECE', piece, tier })}
              onWrong={(penalty) => dispatch({ type: 'WRONG_ANSWER', penalty })}
            />
            <BattleLog log={state.log} />
          </div>
        </div>
      </div>

      {state.result && (
        <GameOverOverlay
          result={state.result}
          fen={state.fen}
          onRestart={() => dispatch({ type: 'RESTART' })}
        />
      )}
    </div>
  )
}
