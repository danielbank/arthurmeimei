---
id: '04'
title: Pacing, cadence & adversary escalation
map: frooktions
label: wayfinder:grilling
mode: HITL
status: closed
assignee: Daniel Bank
blocked-by: ['02', '03']
---

## Question

Fix the CONSTANTs that make the game tense-but-winnable. One base **`TICK`**
drives everything (Round 2, Q7).

1. **Cadences.** How long is `TICK`? Adversary drops every `TICK`; each army
   makes a half-move every `N×TICK` — what is `N`? The drop-rate vs move-rate
   ratio _is_ the difficulty: material must accumulate before it's spent in
   combat, or the game checkmates out before the player builds an army.
2. **Adversary drop escalation** (Round 2, Q9). The schedule by which adversary
   drop _quality_ rises over time (pawn-only early → heavier pieces later) so a
   passive player inevitably loses. Curve shape: step function by elapsed ticks?
   By adversary material count? Tie to placement zone from ticket 02. **Note the
   second adversary-material channel:** wrong answers each add a **penalty pawn**
   (ticket 03), so the escalation curve must be tuned against _timed drops +
   error pawns_ combined, not timed drops alone — and decide whether a flurry of
   wrong answers can outpace escalation (or if that's intended).
3. **Starting position.** Two kings — on which squares (`4k3/…/4K3`)? Any grace
   period before the first adversary drop / first move?
4. **Player ceiling.** Is there a cap on how fast the player can earn/place
   (pending-piece queue, cooldown), or is throughput bounded only by answering
   speed?

**Deliverable:** a named-constants table (TICK, N, escalation schedule, start
FEN, any caps) ready to drop into a `constants.ts`. Blocked by the reward ladder
(piece values) and the placement contract (where drops can go).

## Resolution

**Framing:** both armies run the same `js-chess-engine`, so equal skill → the
game is decided by **material**. The player wins by out-earning the adversary's
drop schedule; escalation guarantees a passive player loses. All values below are
**playtest starting points**, not final.

### Constants (initial values, for `constants.ts`)

| Constant                     | Value                           | Meaning                                                                                                                                                   |
| ---------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ADVERSARY_DROP_INTERVAL_MS` | `10_000`                        | Adversary auto-drops one piece every 10s                                                                                                                  |
| `ARMY_HALF_MOVE_INTERVAL_MS` | `4_000`                         | Each army makes a half-move every 4s (Q1: moves run **faster** than drops; the two-kings start already supplies buildup, so no slow-move phase is needed) |
| `GRACE_PERIOD_MS`            | `10_000`                        | No adversary drops or army moves for the first 10s — the player earns/places a first piece before pressure begins                                         |
| `MAX_PENDING_PIECES`         | `1`                             | **Place-then-earn** (Q4a): a correct answer's piece must be placed before the next question; no banking/hoarding                                          |
| `START_FEN`                  | `4k3/8/8/8/8/8/8/4K3 w - - 0 1` | Kings on e1 (player/white) and e8 (adversary/black)                                                                                                       |
| `WRONG_ANSWER_PENALTY_PAWNS` | `1`                             | Flat penalty pawn per wrong Submit (from ticket 03) — **stacks on top of** the escalation schedule                                                        |

### Adversary escalation schedule (Q2 — keyed to elapsed time)

| Elapsed | Adversary drop pool                  |
| ------- | ------------------------------------ |
| 0–30s   | pawns only                           |
| 30–75s  | pawns + minor pieces (knight/bishop) |
| 75–150s | + rooks                              |
| 150s+   | queens possible                      |

Keyed to **elapsed time** (simple, predictable), not adversary material count.
Note the **two material channels**: timed drops above **plus** error pawns —
tune difficulty against both combined. A flurry of wrong answers _can_ outpace the
schedule; that's intended (mistakes hurt).

### Generator tuning (deferred here from ticket 03)

| Tier  | Generator defaults                                                                   |
| ----- | ------------------------------------------------------------------------------------ |
| Pawn  | same-denominator fraction add, denominators ∈ {2,3,4,5,6,8}; or `a+b`, operands ≤ 10 |
| Minor | unlike-denominator fraction add, denominators ≤ 12; or `a×b`, operands ≤ 12          |
| Rook  | 3-blank equation / find-common-denominator two-stepper, operands ≤ 20                |
| Queen | GCD of two 2–3 digit numbers, Euclidean chain length 2–4 steps                       |

### Clock note (for ticket 06)

"One base clock" is honored by a single game loop; the drop and move intervals
above fire as independent events off that loop (they need not be integer multiples
of each other). No hard wall-clock cap — the material spiral ends the game via
checkmate.
