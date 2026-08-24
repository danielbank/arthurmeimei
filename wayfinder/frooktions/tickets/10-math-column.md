---
id: '10'
title: Build — math column (generator, tiers, Hint Mode, GCD ladder)
map: frooktions
label: wayfinder:task
mode: AFK
status: open
assignee:
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
