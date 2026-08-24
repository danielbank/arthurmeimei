---
id: '10'
title: Build — math column (generator, tiers, Hint Mode, GCD ladder)
map: frooktions
label: wayfinder:task
mode: AFK
status: closed
assignee: Daniel Bank
blocked-by: ['08']
---

## Task

The math column (tiers/generator: ticket 03 + 04 tuning; Hint Mode: ticket 07;
GCD ladder + layout: ticket 05).

- **Generator** (`generator.ts`): 4 tiers per the ladder — Pawn (same-denom add),
  Minor (unlike-denom add), Rook (2-step common-denom), Queen (Euclidean chain,
  2–4 steps). Reuse `Fraction` / `Equation` / `EquationLine` primitives to render.
- **Tier picker** + **question card**: pick a tier → problem → explicit **Submit**
  (single-Submit tiers); correct earns the piece, wrong = penalty pawn + consumed;
  free abandon/skip before Submit; one active question at a time.
- **Hint Mode** (wand toggle): global; on unlike-denominator fractions, click a
  fraction → rewrite `a/b → a/b × f/f`, `f = d/gcd(b,d)`. Not offered on
  same-denominator or Queen problems.
- **Guided GCD ladder** (Queen): step-gated — quotient → remainder → divisor drops
  down → … → final `GCD = ?`. Retry-on-wrong per step; **no penalty pawn** (cost is
  time). Auto-earns the queen on completion.

**Done when:** all four tiers generate & validate, Hint Mode rewrites correctly,
and the guided GCD ladder plays step by step.

## Resolution

Done. Committed on branch `frooktions-build`.

- **`generator.ts`** — implemented all 4 tiers: Pawn (same-denom), Minor (unlike,
  small), Rook (unlike, larger), Queen (Euclidean chain of 2–4 steps, GCD ≥ 2).
  `canHint = b ≠ d`. Ships `gcd` + `hintFactor` helpers.
- **Components** (`components/frooktions/`): `tier-picker.tsx` (4 tiers, disabled
  while a piece is pending or a question is active), `question-card.tsx` (fraction
  tiers = explicit **Submit**, wrong ⇒ `onWrong`/consumed; Queen = **guided
  step-gated ladder** quotient→remainder→drop-down→GCD with retry-on-wrong and no
  penalty), `math-column.tsx` (composes them + the **wand Hint Mode toggle**).
  Fraction display reuses the `Fraction` primitive.
- **Page** — the demo harness is replaced by the real `MathColumn`; the earn →
  place → penalty-pawn loop is now live (pick tier → solve → earn → place on the
  board; wrong ⇒ robots +1 pawn). Missing only AI moves + timed drops (tickets
  11/12).
- **Verified:** `tsc` clean; `next build` green; headless generator test (700+
  samples) confirms every fraction `sumN/sumD == a/b + c/d`, `canHint` correct,
  and every Queen ladder is arithmetically consistent (`A=B×C+D`, correct
  chaining, `result = gcd`, last remainder 0).

### Deferred / noted

- **Choose-your-minor at placement** (ticket 03): the Minor tier currently earns a
  **knight** (`TIER_PIECE.minor = 'n'`). Letting the player pick knight-or-bishop
  when placing is a small follow-up — fold into ticket 13 (polish) or the engine
  wiring.
- **Battle log**: not in the math column yet; belongs with ticket 13.
- **Hint Mode** is component-local state here; the reducer's `hintMode`/`TOGGLE_HINT`
  can adopt it when the loop is wired (ticket 12).
