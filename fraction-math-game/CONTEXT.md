# Context: Frooktions

Glossary for the Frooktions meta-chess game. Pure vocabulary — no implementation.

## Terms

- **Frooktions** — the game. A meta-chess match between two AI-controlled armies
  ("our team" and "the adversary") that the player influences _only_ by solving
  fraction/arithmetic problems. Lives as a page in the fraction-math-game app.

- **Quartermaster** — the player's role. The player never moves a chess piece.
  Their sole agency is converting math skill into **material**: correct answers
  earn pieces they place on their own side. Both armies' _tactics_ are AI-driven.

- **Material** — chess pieces on the board. The currency the whole game turns on:
  the player grows their material by answering; the adversary grows its material
  automatically over time.

- **Tick** — the base time unit, a `CONSTANT`. The clock that creates pressure.
  On each tick the adversary drops material; the armies make chess moves on a
  slower multiple of the tick.

- **Drop** — a piece appearing on a side _outside_ the normal chess move loop.
  Player drops are _earned_ (answer a question); adversary drops are _automatic_
  (every tick, on a schedule). Distinct from a chess **move**.

- **Reward ladder** — the mapping from question difficulty to the piece earned:
  harder problem → stronger piece. Easy fraction/arithmetic → pawn; the
  multi-step Euclidean-Algorithm GCD problem → queen.

- **Tier** — a difficulty band the player _chooses_ to attempt. Four tiers:
  pawn / minor (knight-or-bishop, chosen at placement) / rook / queen. Choosing a
  tier is the game's core risk/reward decision.

- **Penalty pawn** — the adversary pawn granted when the player **submits a wrong
  answer** on a Pawn / Minor / Rook tier (single-Submit tiers). Flat one-pawn cost
  regardless of tier; an adversary **drop** obeying the placement contract; a
  second channel of adversary material growth alongside timed **escalation**. The
  **Queen tier is exempt** — its [[GCD ladder]] is step-gated, so it has no wrong
  submission to penalize.

- **Placement zone** — the squares where a dropped piece may legally land: the
  dropper's own **half** (their 4 ranks), empty squares only, pawns off rank 1.
  A drop may **never give check** to the opposing king — so attacks come only from
  **moves**, and checkmate-by-placement is impossible. Drops are final on click.

- **Escalation** — the schedule by which adversary **drop** quality rises over
  elapsed time (pawns → minors → rooks → queens across 0/30/75/150s), so a passive
  player inevitably loses. Stacks with **penalty pawns** as a second material
  channel. Because both armies run the same engine, combined adversary material is
  what actually decides the game.

- **Move** — a normal, legal chess move made by an army's AI. Contrast with a
  **drop**. Governed by `chess.js` legality.

- **Hint Mode** — a difficulty setting toggled by a magic-wand button (on =
  easier). While on, clicking a fraction `a/b` in an **unlike-denominator**
  fraction-addition problem rewrites it in place as the product `a/b × f/f`, where
  `f = d / gcd(b, d)` and `d` is the other fraction's denominator — surfacing the
  equivalent-fraction step needed for a common denominator. Free and unlimited;
  unavailable when off, **not offered on same-denominator problems** (the `×1/1`
  no-op), and excluded from the Queen (Euclidean-GCD) tier so it can't leak that
  answer.

- **GCD ladder** — the Queen tier's problem: the Euclidean algorithm worked as a
  **guided, step-gated** sequence. Each line, the student supplies the **quotient**
  then the **remainder**; a correct remainder makes the divisor **drop down** as
  the next line's dividend, until remainder 0, then a final `GCD = ?` line. Wrong
  entries retry with a nudge. Because it is step-gated it has no single wrong
  submission, so it is **exempt from the penalty pawn** — its cost is time.
