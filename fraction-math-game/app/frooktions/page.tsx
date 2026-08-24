'use client'

// Frooktions — wayfinder ticket 09 delivers the board column (board + placement
// UI + clock + tally). The right column is still a DEMO HARNESS: temporary "earn"
// controls to exercise placement. Tickets 10–12 replace the harness with the real
// math column, economy reducer, and AI game loop.

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Chess, type Square } from 'chess.js'
import { BoardColumn } from '@/components/frooktions/board-column'
import { START_FEN, type PieceType } from '@/lib/frooktions/constants'
import { legalDropSquares, tryDrop } from '@/lib/frooktions/legality'
import { nextAdversaryDropType } from '@/lib/frooktions/economy'

const EARN: { label: string; piece: PieceType }[] = [
  { label: 'Pawn', piece: 'p' },
  { label: 'Knight', piece: 'n' },
  { label: 'Bishop', piece: 'b' },
  { label: 'Rook', piece: 'r' },
  { label: 'Queen', piece: 'q' },
]

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
    if (!pending) return
    if (tryDrop(chess, 'w', pending, square as Square)) {
      setFen(chess.fen())
      setPending(null)
    }
  }

  function dropRobotPiece() {
    const type = nextAdversaryDropType(elapsedSec)
    const squares = legalDropSquares(chess, 'b', type)
    if (squares.length) {
      tryDrop(chess, 'b', type, squares[Math.floor(Math.random() * squares.length)])
      setFen(chess.fen())
    }
  }

  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 md:px-10 md:py-12">
        <header className="flex flex-col gap-3 border-b pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1.5 text-sm"
            >
              <ArrowLeft className="size-4" /> Math Lab
            </Link>
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

          {/* DEMO HARNESS — replaced by the real math column (ticket 10) + engine loop (12) */}
          <section className="bg-card flex flex-col gap-4 rounded-2xl border p-5 shadow-sm">
            <div>
              <p className="text-primary font-mono text-xs font-semibold tracking-[0.18em] uppercase">
                Demo harness
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Stand-in for the math column. Pick a piece to earn it, then click a glowing square
                on your half (ranks 1–4) to place it. Drops can’t give check.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {EARN.map((e) => (
                <button
                  key={e.piece}
                  onClick={() => setPending(e.piece)}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                    pending === e.piece
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'hover:border-primary'
                  }`}
                >
                  Earn {e.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <button
                onClick={dropRobotPiece}
                className="text-destructive border-destructive/40 hover:bg-destructive/10 rounded-xl border px-3 py-2 font-semibold transition"
              >
                Robots drop a piece
              </button>
              {pending && (
                <span className="text-muted-foreground">
                  Placing a <b className="text-foreground">{pending.toUpperCase()}</b> — click a
                  glowing square.
                </span>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
