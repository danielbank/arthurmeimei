'use client'

// The active question — wayfinder ticket 10. Fraction tiers use an explicit
// Submit (wrong = penalty, ticket 03); the Queen tier is a guided, step-gated
// Euclidean ladder (quotient → remainder → divisor drops down → GCD), which has
// no wrong-submit and no penalty (ticket 05 amendment). Hint Mode (ticket 07)
// rewrites an unlike-denominator fraction as a/b × f/f on click.

import { useState } from 'react'
import { Fraction } from '@/components/math-primitives'
import { hintFactor, type Question } from '@/lib/frooktions/generator'
import { cn } from '@/lib/utils'

function Blank({
  value,
  onChange,
  onEnter,
  ariaLabel,
  bad,
}: {
  value: string
  onChange: (v: string) => void
  onEnter?: () => void
  ariaLabel: string
  bad?: boolean
}) {
  return (
    <input
      aria-label={ariaLabel}
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
      onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
      className={cn(
        'bg-background focus:border-primary h-11 w-14 rounded-xl border-2 text-center font-mono text-lg font-bold transition outline-none',
        bad && 'border-destructive bg-destructive/10'
      )}
    />
  )
}

function FractionQuestion({
  q,
  hintMode,
  onCorrect,
  onWrong,
}: {
  q: NonNullable<Question['fraction']>
  hintMode: boolean
  onCorrect: () => void
  onWrong: () => void
}) {
  const [num, setNum] = useState('')
  const [den, setDen] = useState('')
  const [bad, setBad] = useState(false)
  const [hinted, setHinted] = useState<{ left?: boolean; right?: boolean }>({})

  const clickable = hintMode && q.canHint

  function submit() {
    const n = parseInt(num, 10)
    const d = parseInt(den, 10)
    if (d && n * q.sumD === q.sumN * d) onCorrect()
    else {
      setBad(true)
      onWrong()
    }
  }

  const renderFraction = (a: number, b: number, side: 'left' | 'right', f?: number) =>
    hinted[side] && f !== undefined ? (
      <span className="border-primary bg-primary/10 inline-flex items-center gap-2 rounded-xl border-2 px-2 py-1">
        <Fraction numerator={a} denominator={b} />
        <span className="text-muted-foreground text-xl font-bold">×</span>
        <Fraction numerator={f} denominator={f} />
      </span>
    ) : (
      <button
        type="button"
        disabled={!clickable}
        onClick={() => setHinted((h) => ({ ...h, [side]: true }))}
        className={cn(
          'rounded-xl p-1',
          clickable && 'border-primary bg-primary/10 cursor-pointer border-2 hover:scale-105'
        )}
      >
        <Fraction numerator={a} denominator={b} />
      </button>
    )

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-muted/50 flex flex-wrap items-center justify-center gap-4 rounded-2xl p-6">
        {renderFraction(q.a, q.b, 'left', hintFactor(q.b, q.d))}
        <span className="text-muted-foreground text-2xl font-bold">{q.op}</span>
        {renderFraction(q.c, q.d, 'right', hintFactor(q.d, q.b))}
        <span className="text-muted-foreground text-2xl font-bold">=</span>
        <span className="flex flex-col items-center gap-1">
          <Blank
            value={num}
            onChange={setNum}
            onEnter={submit}
            ariaLabel="answer numerator"
            bad={bad}
          />
          <span className="bg-foreground h-0.5 w-14 rounded" />
          <Blank
            value={den}
            onChange={setDen}
            onEnter={submit}
            ariaLabel="answer denominator"
            bad={bad}
          />
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={submit}
          className="bg-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-bold shadow-sm transition hover:brightness-105"
        >
          Submit
        </button>
        {bad && <span className="text-destructive text-sm font-semibold">Not quite!</span>}
      </div>
    </div>
  )
}

function GcdQuestion({
  q,
  onCorrect,
  onWrong,
}: {
  q: NonNullable<Question['gcd']>
  onCorrect: () => void
  /** each wrong step hands the robots a random minor piece (ticket: queen penalty) */
  onWrong: () => void
}) {
  const [cur, setCur] = useState(0)
  const [phase, setPhase] = useState<'quotient' | 'remainder' | 'gcd'>('quotient')
  const [val, setVal] = useState('')
  const [bad, setBad] = useState(false)
  const [msg, setMsg] = useState('')

  const step = q.steps[cur]

  function check() {
    const v = parseInt(val, 10)
    if (Number.isNaN(v)) return
    if (phase === 'quotient') {
      if (v === step.C) {
        setPhase('remainder')
        setVal('')
        setBad(false)
        setMsg('Good — now the remainder.')
      } else {
        setBad(true)
        setMsg(`How many whole times does ${step.B} go into ${step.A}? (robots +1 minor)`)
        onWrong()
      }
    } else if (phase === 'remainder') {
      if (v === step.D) {
        setVal('')
        setBad(false)
        if (step.D === 0) {
          setPhase('gcd')
          setMsg("Remainder 0 — so what's the GCD?")
        } else {
          setCur((c) => c + 1)
          setPhase('quotient')
          setMsg('The divisor drops down — keep going!')
        }
      } else {
        setBad(true)
        setMsg(`Remainder = ${step.A} − ${step.B}×${step.C}. Try again. (robots +1 minor)`)
        onWrong()
      }
    } else {
      if (v === q.result) onCorrect()
      else {
        setBad(true)
        setMsg('The GCD is the last divisor in the ladder. (robots +1 minor)')
        onWrong()
      }
    }
  }

  const revealed = q.steps.slice(0, cur + 1)

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-muted/50 rounded-2xl p-6">
        <p className="mb-3 font-semibold">
          Find the GCD of {q.a0} and {q.b0} — one step at a time:
        </p>
        <div className="flex flex-col gap-2.5 font-mono text-lg font-bold tabular-nums">
          {revealed.map((s, i) => {
            const active = i === cur && phase !== 'gcd'
            return (
              <div key={i} className={cn('flex items-center gap-2', active && 'text-primary')}>
                <span>{s.A}</span>
                <span className="text-muted-foreground">=</span>
                <span>{s.B}</span>
                <span className="text-muted-foreground">×</span>
                {active && phase === 'quotient' ? (
                  <Blank
                    value={val}
                    onChange={setVal}
                    onEnter={check}
                    ariaLabel="quotient"
                    bad={bad}
                  />
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400">{s.C}</span>
                )}
                <span className="text-muted-foreground">+</span>
                {active && phase === 'remainder' ? (
                  <Blank
                    value={val}
                    onChange={setVal}
                    onEnter={check}
                    ariaLabel="remainder"
                    bad={bad}
                  />
                ) : i === cur && phase === 'quotient' ? (
                  <span className="text-muted-foreground opacity-40">?</span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400">{s.D}</span>
                )}
              </div>
            )
          })}
          {phase === 'gcd' && (
            <div className="text-primary mt-1 flex items-center gap-2 text-xl">
              <span>GCD =</span>
              <Blank
                value={val}
                onChange={setVal}
                onEnter={check}
                ariaLabel="final gcd"
                bad={bad}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={check}
          className="bg-primary text-primary-foreground rounded-xl px-5 py-2.5 text-sm font-bold shadow-sm transition hover:brightness-105"
        >
          Check
        </button>
        <span
          className={cn(
            'text-sm font-semibold',
            bad ? 'text-destructive' : 'text-muted-foreground'
          )}
        >
          {msg}
        </span>
      </div>
    </div>
  )
}

export function QuestionCard({
  question,
  hintMode,
  onCorrect,
  onWrong,
  onSkip,
}: {
  question: Question
  hintMode: boolean
  onCorrect: () => void
  onWrong: () => void
  onSkip: () => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {question.kind === 'fraction' && question.fraction ? (
        <FractionQuestion
          q={question.fraction}
          hintMode={hintMode}
          onCorrect={onCorrect}
          onWrong={onWrong}
        />
      ) : question.gcd ? (
        <GcdQuestion q={question.gcd} onCorrect={onCorrect} onWrong={onWrong} />
      ) : null}
      <button
        onClick={onSkip}
        className="text-muted-foreground self-start text-sm font-semibold hover:underline"
      >
        Skip (free)
      </button>
    </div>
  )
}
