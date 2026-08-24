'use client'

// Frooktions — wayfinder tickets 09 (board) + 10 (math column). The earn → place
// → penalty loop is live here with local state. The AI game loop (moves, timed
// adversary drops, escalation, win/lose) is wired by the economy reducer (11) and
// engine loop (12), which replace this harness's local state.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Chess, type Square } from 'chess.js'
import { BoardColumn } from '@/components/frooktions/board-column'
import { MathColumn } from '@/components/frooktions/math-column'
import { START_FEN, type PieceType } from '@/lib/frooktions/constants'
import { legalDropSquares, tryDrop } from '@/lib/frooktions/legality'

export default function FrooktionsPage() {
  const [chess] = useState(() => new Chess(START_FEN))
  const [fen, setFen] = useState(chess.fen())
  const [pending, setPending] = useState<PieceType | null>(null)
  const [elapsedSec, setElapsedSec] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setElapsedSec((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const phase = elapsedSec < 10 ? 'setup' : 'playing'
  const placeSquares = pending ? legalDropSquares(chess, 'w', pending) : []

  function place(square: string) {
    if (pending && tryDrop(chess, 'w', pending, square as Square)) {
      setFen(chess.fen())
      setPending(null)
    }
  }

  // Wrong answer → the robots gain a penalty pawn (ticket 03). Timed escalation
  // drops arrive with the engine loop (ticket 12).
  function penaltyPawn() {
    const squares = legalDropSquares(chess, 'b', 'p')
    if (squares.length) {
      tryDrop(chess, 'b', 'p', squares[Math.floor(Math.random() * squares.length)])
      setFen(chess.fen())
    }
  }

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
            fen={fen}
            elapsedSec={elapsedSec}
            phase={phase}
            placeSquares={placeSquares}
            onPlace={place}
          />
          <MathColumn disabled={pending !== null} onEarn={setPending} onWrong={penaltyPawn} />
        </div>
      </div>
    </main>
  )
}
