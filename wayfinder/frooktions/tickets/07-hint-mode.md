---
id: '07'
title: Hint Mode (fraction-factoring scaffold)
map: frooktions
label: wayfinder:grilling
mode: HITL
status: closed
assignee: Daniel Bank
blocked-by: ['03']
---

## Question

A learning aid: a **magic-wand toggle button** enables **Hint Mode**. While on,
clicking a fraction in a problem replaces it in place with a **product of two
fractions** — the fraction times the `factor/factor` needed to reach the common
denominator with the _other_ fraction, where the factor derives from the GCD of
the two denominators (for `a/b` against other denom `d`: factor = `d / gcd(b,d)`,
so `a/b → a/b × f/f`). Exposes the equivalent-fraction step without giving the
sum.

Decisions to pin:

1. **Scope.** Which tiers/problem types does Hint Mode apply to? It only makes
   sense where there are two fractions with unlike denominators (the tier-2
   fraction-add path). Does it apply to same-denominator (factor = 1, no-op),
   arithmetic `Equation`s (no fractions), and the queen Euclidean-GCD tier (where
   showing the GCD would _give away_ the answer)?
2. **The exact rewrite rule.** Confirm `a/b → a/b × f/f`, `f = d / gcd(b,d)`.
   Show the factored product only (student still multiplies), or also the
   multiplied-out equivalent fraction? Can both fractions be hinted?
3. **Cost / economy.** Is using a hint free (pure scaffold, unlimited), or does it
   cost something — reduced/downgraded reward, no penalty relief, a usage cap? How
   does it interact with the wrong-answer penalty and the tick clock?
4. **Interaction & toggle.** Magic-wand button behavior (persists across
   questions? per-question?); the click affordance on fractions; in-place
   replacement rendering. Feeds the layout prototype (ticket 05) and architecture
   (ticket 06).

**Deliverable:** the Hint Mode rules — scope, rewrite formula, cost model, and
interaction — precise enough to build. Update `CONTEXT.md`.

## Resolution

**Hint Mode is a difficulty setting**, embodied by a **magic-wand toggle button**.
Wand **on** = the factoring scaffold is available (easier game); wand **off** =
no hints (harder). Free and unlimited — it is not a per-question cost.

### Scope (Q1)

Available on fraction-addition problems **where the denominators differ**
(unlike-denominator cases only).

- **Same-denominator excluded** _(amended after the layout prototype, ticket 05)_:
  the rewrite would be `a/b × 1/1`, a pointless no-op — so the wand simply does not
  light up same-denominator fractions.
- **Excluded from the Queen (Euclidean-GCD) tier** — the hint is _derived from_
  the GCD, so showing it would hand over that tier's answer.
- **Inapplicable** to pure-arithmetic `Equation`s (`a+b`, `a×b`) — no fractions to
  click; the wand simply finds nothing clickable.

### Rewrite rule (Q2)

Clicking fraction `a/b` replaces it **in place** with the product `a/b × f/f`,
where `f = d / gcd(b, d)` and `d` is the _other_ fraction's denominator. Show the
**factored product only** — the student still multiplies it out to the equivalent
fraction (that's the teaching). Both fractions are independently clickable;
clicking an already-factored fraction is a no-op.

### Cost / economy (Q3)

**Free and unlimited.** Hint Mode is purely a difficulty scaler; when off, hints
are unavailable. No reward downgrade, no cap, no penalty interaction. The natural
cost of fiddling is the **tick clock** — time spent hinting is time not spent
earning material. (No "hint to a free queen" exploit exists, since the Queen tier
is out of scope for hints.)

### Toggle & interaction (Q4)

A **global** toggle: the wand stays on across questions until clicked off (not
per-question). While on, fractions in the current problem gain a clickable / hover
affordance and rewrite on click. It is a single in-game button, not a settings
menu (which stays out of scope).

### Cross-references

Feeds **ticket 05** (layout prototype — must include the wand button + clickable-
fraction affordance) and **ticket 06** (architecture — Hint Mode is global state;
the rewrite logic and the "no clickable fractions when off / on non-fraction
problems" behavior live in the question-rendering layer).
