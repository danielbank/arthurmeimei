---
id: '05'
title: Two-column layout & interaction loop (prototype)
map: frooktions
label: wayfinder:prototype
mode: HITL
status: closed
assignee: Daniel Bank
blocked-by: ['01', '03']
---

## Question

Make a cheap, concrete artifact of the screen and the moment-to-moment loop to
react to — "how should it look / how should it behave." Two columns confirmed:
**chessboard column** | **math column**.

Prototype (stub UI, no real engine wiring) enough to judge:

1. **Layout.** Board left, math right (Round 1). Where do the clock/tick
   indicator, the material tally (yours vs adversary), tier picker, and game
   log/status live? Desktop-first; how does it stack on mobile (Round 2 scope).
2. **The claim→place loop.** Pick a tier → question panel appears → answer
   correctly → board enters "placement mode" highlighting legal squares → click a
   square to drop the earned piece → back to picking. Show this flow concretely.
   Include the **magic-wand Hint Mode toggle** (ticket 07) in the math column and
   the clickable-fraction affordance when it's on.
3. **Feedback.** How adversary drops, army moves, check, and the escalating
   pressure are surfaced so the player _feels_ the clock without a per-question
   timer.
4. **Tone/visuals.** Reuse the existing app's shadcn/Tailwind look
   (`SectionCard`, mono accents). cburnett pieces vs Unicode for the prototype.

**Deliverable:** a linked rough prototype (code stub or outline) + the layout
decisions it settles. Blocked by the tech pick (board component) and the tier
list (what's shown/placed). Consult the prototype skill; link the artifact here.

## Asset

- Prototype source (throwaway, repo-local):
  `fraction-math-game/prototypes/frooktions-layout.prototype.html`
- Live artifact: https://claude.ai/code/artifact/3625952d-cb93-4a1c-bb77-4a3f97fe7705

Rough, Unicode pieces, in-memory only. (Prototype-skill capture: the file is the
throwaway primary source; move it to a `proto/frooktions-layout` branch when the
build phase starts rather than shipping it on the main line.)

## Resolution

Approved after three iterations. Decisions the prototype settles:

### Layout (confirmed)

Two columns. **Left:** the board, a header with the pulsing tick clock + escalation
label, and beneath it the **material tally** (two bars, You vs the adversary, with
captured-piece rows). **Right:** the **tier picker** (4 piece buttons), the
**question card** (with the wand toggle in its header), and the **battle log**.
Stacks to a single column under ~900px (desktop-first, graceful mobile — matches
the v1 scope fence).

### Interaction loop (confirmed)

Pick a tier → problem appears → solve → correct **earns** a piece and the board
enters **placement mode** highlighting empty squares on ranks 1–4 → click one to
**drop** it → back to the picker. Place-then-earn (one pending piece).

### Pressure cues (confirmed sufficient)

Pulsing clock + escalation label (`Enemy: pawns → + minors → + rooks → queens!`) +
adversary pieces appearing on the board + the battle log. No dedicated countdown
bar needed. Army **moves** are abstracted in the prototype; in the real build the
pieces visibly move.

### Tone & pieces

**Fun-but-minimalist elementary edutainment**: warm cream ground, rounded cards
and chunky buttons, grape accent; **your team = teal, the adversary = coral
"robots", kings glow gold**. Pieces are **Unicode glyphs** (large, team-coloured)
in the prototype — the **production build swaps in the cburnett SVG set** (ticket
01). "The robots" is the kid-facing name for the adversary.

### Guided GCD ladder (Queen tier) — NEW format, drives amendments below

The Euclidean problem is worked **one step at a time**: the first line shows the
**quotient** blank only; a correct quotient unlocks the **remainder** blank; a
correct remainder makes the **divisor drop down** as the next line's dividend, and
the next quotient opens — repeating until remainder 0, then a final **`GCD = ?`**
line. Divisors/dividends are carried automatically; the student supplies quotient
then remainder each line. Wrong entries prompt a retry with a nudge; the step-
gating means a single mistake can't tank you.

## Amendments this resolution triggers

- **Hint Mode (ticket 07):** narrow to **denominators-differ only** — no `×1/1`
  no-op on same-denominator problems.
- **Wrong-answer penalty (ticket 03):** the **Queen tier is exempt** from the
  flat-pawn penalty. Its guided step-gating admits no single "wrong Submit", so its
  cost is **time**, not material. Pawn/Minor/Rook keep single-Submit + penalty pawn.
