---
id: '03'
title: Question tiers, generator & reward ladder
map: frooktions
label: wayfinder:grilling
mode: HITL
status: closed
assignee: Daniel Bank
blocked-by: []
---

## Question

Fix the math↔material contract: the **tiers** the player chooses from, the
**procedural generator** behind each, and the **reward ladder** (tier → piece).

1. **Tier → piece ladder.** Confirm/refine the Round-1 sketch:
   pawn = easy `Fraction`/single-blank `Equation`; knight/bishop = two-blank or
   `×` equation; rook = three-blank equation; queen = multi-step Euclidean-GCD
   `EquationLine`. Exactly which piece for each tier? (Bishop _and_ knight both
   need a home — do we have 4 tiers or 5?)
2. **Generator per tier.** For each tier, what does the procedural generator
   produce? Operand ranges; guarantee integer/clean answers; for Euclidean,
   generate number pairs whose GCD chain has a tunable number of steps
   (difficulty = chain length / operand size). Reuse the existing primitive
   components (`Fraction`, `Equation`, `EquationLine`) for rendering.
3. **Answer semantics.** What counts as "correct" for a multi-blank question —
   all blanks right? The primitives validate per-blank; does the _piece_ unlock
   only when every blank is correct? What happens on a wrong answer? **Steer
   (user, this session): a wrong answer penalizes the player by adding a pawn to
   the adversary.** Open sub-decisions this raises: flat one-pawn penalty vs
   scaled to the tier gambled; does a wrong answer consume the question or allow
   retry; when exactly is "wrong" judged.
4. **Supply model.** Is one question shown per tier at a time, a queue, or
   generated on demand when a tier is picked? Can the player abandon a
   half-answered question to pick a different tier?

**Deliverable:** the tier list with per-tier generator spec and the exact
correct→piece rule. Update `CONTEXT.md` "Tier" / "Reward ladder" if refined.

## Resolution

The **math ↔ material contract**.

### Tiers & reward ladder (Q1) — 4 tiers, "correct" = _every_ blank right

| Tier | Reward                                                   | Problem (primitive)                                        | Difficulty knob (default; tuned in ticket 04) |
| ---- | -------------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------------- |
| 1    | **Pawn**                                                 | Same-denominator fraction add, or small `a+b` (`Equation`) | operands ≤ 10                                 |
| 2    | **Minor — player picks knight _or_ bishop at placement** | Unlike-denominator fraction add, or `a×b` (`Equation`)     | operands ≤ 12                                 |
| 3    | **Rook**                                                 | 3-blank equation / find-common-denominator two-stepper     | larger operands                               |
| 4    | **Queen**                                                | Euclidean-GCD (`EquationLine`, multi-step)                 | chain length 2–4                              |

The minor tier grants a generic _minor piece_; the knight-vs-bishop choice is made
at placement time (covers both minors without a 5th tier). Questions render with
the existing `Fraction` / `Equation` / `EquationLine` components.

### Wrong-answer penalty (Q2 → flat)

- Judgement is on an **explicit Submit**, not per-blank. All blanks correct →
  earn the tier's piece. Any blank wrong on Submit → **wrong answer**.
- A wrong answer **adds one pawn to the adversary** (a **flat** penalty — same
  whatever tier was attempted). Not scaled to the tier; the queen gamble's risk is
  the time sunk + the pawn, kept simple and forgiving.
- A wrong answer **consumes the question** — no retry; the player picks a new tier.
- **Amended after the layout prototype (ticket 05): the Queen tier is exempt.**
  Its Euclidean problem is a **guided, step-gated ladder** (quotient → remainder →
  divisor drops down → …) with retry-on-wrong per step, so there is no single
  "wrong Submit" to penalize; its cost is the **time** the steps take. The flat-
  pawn penalty applies only to Pawn / Minor / Rook (single-Submit) tiers.
- The penalty pawn is an **adversary drop** and obeys the placement legality
  contract mirrored to the adversary's half (empty square, no check); the
  adversary's placement logic (ticket 04/06) chooses its square. **Cross-ref:**
  this is a _second_ channel of adversary material growth (alongside the timed
  escalation drops), which ticket 04 must account for when tuning difficulty.

### Supply & abandon (Q3)

- **One active question at a time.** Picking a tier generates a fresh question of
  that tier; resolving (Submit or abandon) returns to the tier picker.
- **Free abandon** before Submit — switching tiers without submitting costs
  nothing. Only a wrong _Submit_ penalizes. This ties the penalty to commitment,
  not to merely opening a hard problem.

### Deferred to ticket 04 (tuning)

Exact operand ranges, Euclidean number-pair generation (pairs whose GCD chain has
2–4 steps), and any per-tier frequency limits are tuning constants, decided
alongside the pacing knobs.
