'use client'

// Frooktions — scaffold shell (wayfinder ticket 08). The two-column layout is
// stubbed here; the board (ticket 09), math column (ticket 10), economy engine
// (ticket 11), engine wiring (ticket 12), and game-over/polish (ticket 13) fill
// it in. Approved design: wayfinder/frooktions/tickets/05 + the live prototype.

import Link from 'next/link'
import { ArrowLeft, Swords } from 'lucide-react'

export default function FrooktionsPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 md:px-10 md:py-12">
        <header className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between">
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
          <div className="bg-card flex items-center gap-3 rounded-xl border px-4 py-3 text-sm">
            <Swords className="text-primary size-5" />
            <div>
              <p className="font-medium">Scaffold</p>
              <p className="text-muted-foreground">Build tickets 09–13 fill this in</p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          {/* Board column — ticket 09 */}
          <section className="bg-card flex min-h-96 flex-col items-center justify-center gap-2 rounded-2xl border p-6 text-center shadow-sm">
            <p className="text-primary font-mono text-xs font-semibold tracking-[0.18em] uppercase">
              Board
            </p>
            <p className="text-muted-foreground max-w-xs text-sm">
              react-chessboard + cburnett pieces, two kings on e1/e8, placement-mode highlighting.
            </p>
          </section>

          {/* Math column — tickets 10 / 07 */}
          <section className="bg-card flex min-h-96 flex-col items-center justify-center gap-2 rounded-2xl border p-6 text-center shadow-sm">
            <p className="text-primary font-mono text-xs font-semibold tracking-[0.18em] uppercase">
              Math
            </p>
            <p className="text-muted-foreground max-w-xs text-sm">
              Tier picker, question card (Fraction / Equation / EquationLine), wand Hint Mode,
              guided GCD ladder, battle log.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
