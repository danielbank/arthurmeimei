import Link from 'next/link'
import { BookOpen, CheckCircle2, FunctionSquare, Lightbulb, Sigma, Swords } from 'lucide-react'
import {
  FractionDemo,
  SectionCard,
  ShowcaseEquation,
  ShowcaseEuclid,
  ShowcaseMultiply,
} from '@/components/math-primitives'

export default function Home() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 md:px-10 md:py-16">
        <header className="flex flex-col gap-6 border-b pb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="text-primary mb-5 flex items-center gap-2 font-mono text-sm font-semibold">
              <span className="bg-primary/10 flex size-8 items-center justify-center rounded-lg">
                <Sigma className="size-4" />
              </span>{' '}
              MATH LAB / PRIMITIVES
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">
              Make the work
              <br />
              <span className="text-primary">visible.</span>
            </h1>
            <p className="text-muted-foreground mt-5 max-w-lg text-base leading-7 text-pretty">
              A small, flexible toolkit for learning fractions, arithmetic, and the Euclidean
              Algorithm one step at a time.
            </p>
          </div>
          <div className="bg-card flex items-center gap-3 rounded-xl border px-4 py-3 text-sm">
            <CheckCircle2 className="size-5 text-emerald-500" />
            <div>
              <p className="font-medium">Practice mode</p>
              <p className="text-muted-foreground">Fill a blank to validate</p>
            </div>
          </div>
        </header>
        <Link
          href="/frooktions"
          className="group border-primary/30 from-primary/10 hover:border-primary/60 flex items-center justify-between gap-4 rounded-2xl border bg-gradient-to-r to-transparent px-6 py-5 transition"
        >
          <div className="flex items-center gap-4">
            <span className="bg-primary/15 text-primary flex size-11 items-center justify-center rounded-xl">
              <Swords className="size-5" />
            </span>
            <div>
              <p className="text-primary font-mono text-xs font-semibold tracking-[0.18em] uppercase">
                New · Game
              </p>
              <h2 className="mt-0.5 text-lg font-semibold tracking-tight">
                Play Frooktions — solve fractions to build a chess army
              </h2>
            </div>
          </div>
          <span className="text-primary text-sm font-medium opacity-0 transition group-hover:opacity-100">
            Play →
          </span>
        </Link>
        <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <SectionCard
            eyebrow="01 / Fraction"
            title="Stacked fractions"
            description="Fractions stay readable at every size, making the numerator and denominator easy to compare."
          >
            <div className="bg-muted/50 flex min-h-40 items-center justify-center rounded-xl">
              <FractionDemo />
            </div>
            <div className="text-muted-foreground mt-5 flex items-center gap-2 text-sm">
              <BookOpen className="size-4" /> Keep each step on the page. It is easier than doing it
              all in your head.
            </div>
          </SectionCard>
          <SectionCard
            eyebrow="02 / Arithmetic"
            title="Simple equations"
            description="Every number can become a typed blank. Press Enter or leave the field to check it."
          >
            <div className="bg-muted/50 flex min-h-40 flex-col items-center justify-center gap-8 rounded-xl">
              <ShowcaseEquation />
              <ShowcaseMultiply />
            </div>
            <div className="text-muted-foreground mt-5 flex items-center gap-2 text-sm">
              <FunctionSquare className="size-4" /> Focus, type, validate.
            </div>
          </SectionCard>
        </div>
        <SectionCard
          eyebrow="03 / Euclidean Algorithm"
          title="Equation lines"
          description="Solve A = B × C + D line by line to find the greatest common divisor. The remainder tells you when to stop."
        >
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div className="bg-muted/50 flex flex-col gap-3 rounded-xl p-5">
              <ShowcaseEuclid />
            </div>
            <div className="border-primary/20 bg-primary/5 flex max-w-xs gap-3 rounded-xl border p-4 text-sm leading-6">
              <Lightbulb className="text-primary mt-0.5 size-5 shrink-0" />
              <p>
                <span className="font-semibold">Hint:</span> divide the first number by the second.
                The remainder becomes the next number to work with.
              </p>
            </div>
          </div>
        </SectionCard>
        <footer className="text-muted-foreground flex flex-col gap-2 pt-2 text-sm md:flex-row md:items-center md:justify-between">
          <span>Built for showing work, not hiding it.</span>
          <span className="font-mono text-xs tracking-widest uppercase">
            Fraction · Equation · EquationLine
          </span>
        </footer>
      </div>
    </main>
  )
}
