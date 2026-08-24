'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Validation = 'idle' | 'correct' | 'incorrect'
type BlankValue = { value: string; answer: number; state: Validation }

export function Fraction({
  numerator,
  denominator,
  size = 'md',
  className,
}: {
  numerator: number | string
  denominator: number | string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex flex-col items-center align-middle font-mono leading-none font-semibold',
        size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-3xl' : 'text-xl',
        className
      )}
    >
      <span className="border-foreground border-b-2 px-2 pb-1">{numerator}</span>
      <span className="px-2 pt-1">{denominator}</span>
    </span>
  )
}

function Blank({
  item,
  onChange,
  onValidate,
  label,
}: {
  item: BlankValue
  onChange: (v: string) => void
  onValidate: () => void
  label: string
}) {
  return (
    <span className="relative inline-flex items-center">
      <input
        aria-label={label}
        inputMode="numeric"
        value={item.value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9-]/g, ''))}
        onBlur={onValidate}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onValidate()
        }}
        aria-invalid={item.state === 'incorrect'}
        className={cn(
          'bg-background focus:border-primary h-9 w-12 rounded-md border-2 text-center font-mono text-lg font-semibold transition outline-none',
          item.state === 'correct' && 'border-emerald-500 bg-emerald-500/10',
          item.state === 'incorrect' && 'border-destructive bg-destructive/10'
        )}
      />
      {item.state !== 'idle' &&
        (item.state === 'correct' ? (
          <Check className="ml-1 size-4 text-emerald-500" aria-label="Correct" />
        ) : (
          <X className="text-destructive ml-1 size-4" aria-label="Incorrect" />
        ))}
    </span>
  )
}

export function Equation({
  operator,
  values,
  answers,
}: {
  operator: '+' | '×'
  values: [number | string, number | string, number | string]
  answers?: [number, number, number]
}) {
  const [items, setItems] = useState<BlankValue[]>(
    values.map((v, i) => ({
      value: typeof v === 'number' ? String(v) : '',
      answer: answers?.[i] ?? Number(v),
      state: typeof v === 'number' ? 'idle' : 'idle',
    }))
  )
  const render = (i: number, label: string) =>
    typeof values[i] === 'number' ? (
      values[i]
    ) : (
      <Blank
        item={items[i]}
        label={label}
        onChange={(value) =>
          setItems((old) => old.map((x, n) => (n === i ? { ...x, value, state: 'idle' } : x)))
        }
        onValidate={() =>
          setItems((old) =>
            old.map((x, n) =>
              n === i ? { ...x, state: Number(x.value) === x.answer ? 'correct' : 'incorrect' } : x
            )
          )
        }
      />
    )
  return (
    <div className="flex items-center gap-3 font-mono text-2xl">
      <span>{render(0, 'First number')}</span>
      <span className="text-muted-foreground">{operator}</span>
      <span>{render(1, 'Second number')}</span>
      <span className="text-muted-foreground">=</span>
      <span>{render(2, 'Answer')}</span>
    </div>
  )
}

export function EquationLine({
  a,
  b,
  c,
  d,
  answers,
}: {
  a: number | string
  b: number | string
  c: number | string
  d: number | string
  answers?: number[]
}) {
  const vals = [a, b, c, d]
  const [items, setItems] = useState<BlankValue[]>(
    vals.map((v, i) => ({
      value: typeof v === 'number' ? String(v) : '',
      answer: answers?.[i] ?? Number(v),
      state: 'idle',
    }))
  )
  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-lg">
      <span>
        {typeof a === 'number' ? (
          a
        ) : (
          <Blank
            item={items[0]}
            label="Euclidean A"
            onChange={(value) =>
              setItems((o) => o.map((x, n) => (n === 0 ? { ...x, value, state: 'idle' } : x)))
            }
            onValidate={() =>
              setItems((o) =>
                o.map((x, n) =>
                  n === 0
                    ? { ...x, state: Number(x.value) === x.answer ? 'correct' : 'incorrect' }
                    : x
                )
              )
            }
          />
        )}
      </span>
      <span>=</span>
      <span>
        {typeof b === 'number' ? (
          b
        ) : (
          <Blank
            item={items[1]}
            label="Euclidean B"
            onChange={(value) =>
              setItems((o) => o.map((x, n) => (n === 1 ? { ...x, value, state: 'idle' } : x)))
            }
            onValidate={() =>
              setItems((o) =>
                o.map((x, n) =>
                  n === 1
                    ? { ...x, state: Number(x.value) === x.answer ? 'correct' : 'incorrect' }
                    : x
                )
              )
            }
          />
        )}
      </span>
      <span>×</span>
      <span>
        {typeof c === 'number' ? (
          c
        ) : (
          <Blank
            item={items[2]}
            label="Euclidean C"
            onChange={(value) =>
              setItems((o) => o.map((x, n) => (n === 2 ? { ...x, value, state: 'idle' } : x)))
            }
            onValidate={() =>
              setItems((o) =>
                o.map((x, n) =>
                  n === 2
                    ? { ...x, state: Number(x.value) === x.answer ? 'correct' : 'incorrect' }
                    : x
                )
              )
            }
          />
        )}
      </span>
      <span>+</span>
      <span>
        {typeof d === 'number' ? (
          d
        ) : (
          <Blank
            item={items[3]}
            label="Euclidean remainder"
            onChange={(value) =>
              setItems((o) => o.map((x, n) => (n === 3 ? { ...x, value, state: 'idle' } : x)))
            }
            onValidate={() =>
              setItems((o) =>
                o.map((x, n) =>
                  n === 3
                    ? { ...x, state: Number(x.value) === x.answer ? 'correct' : 'incorrect' }
                    : x
                )
              )
            }
          />
        )}
      </span>
    </div>
  )
}

export function SectionCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-card rounded-2xl border p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-primary font-mono text-xs font-semibold tracking-[0.18em] uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-muted-foreground mt-1 max-w-xl text-sm leading-6">{description}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

export function ShowcaseEquation() {
  return <Equation operator="+" values={['', 3, '']} answers={[5, 3, 8]} />
}
export function ShowcaseMultiply() {
  return <Equation operator="×" values={[2, '', '']} answers={[2, 4, 8]} />
}
export function ShowcaseEuclid() {
  return (
    <div className="flex flex-col gap-3">
      <EquationLine a={84} b={30} c="" d="" answers={[84, 30, 2, 24]} />
      <EquationLine a={30} b="" c="" d={0} answers={[30, 24, 1, 6]} />
      <EquationLine a={24} b={6} c={4} d={0} />
    </div>
  )
}

export function FractionDemo() {
  return (
    <div className="flex items-center gap-4">
      <Fraction numerator={3} denominator={4} size="lg" />
      <span className="text-muted-foreground text-2xl">+</span>
      <Fraction numerator={1} denominator={8} size="lg" />
      <span className="text-muted-foreground text-2xl">=</span>
      <Fraction numerator="?" denominator="?" size="lg" />
    </div>
  )
}
