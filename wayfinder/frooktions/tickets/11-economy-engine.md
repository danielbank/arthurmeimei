---
id: '11'
title: Build — economy & tick engine (reducer)
map: frooktions
label: wayfinder:task
mode: AFK
status: closed
assignee: Daniel Bank
blocked-by: ['08']
---

## Task

The pure game engine (constants/pacing: ticket 04; legality: ticket 02).

- **`gameReducer.ts`**: single reducer over `{ chess, pending, tickCount, phase,
hintMode, material }`; actions for `TICK`, `EARN_PIECE`, `PLACE_PIECE`,
  `WRONG_ANSWER`, `TOGGLE_HINT`, `RESTART`.
- **`economy.ts`** (pure): adversary timed drops + **escalation** schedule
  (elapsed-time pools), **penalty pawn** on wrong answer (single-Submit tiers
  only), **place-then-earn** (1 pending), **grace period** gating `setup → playing`.
- All adversary drops route through `legality.ts` (mirror contract, no check).
- Keep it framework-free and **unit-tested** (drop cadence, escalation boundaries,
  penalty stacking, place-then-earn invariant).

**Done when:** the reducer + pure economy pass unit tests for the ticket 04
constants and the two material channels. (Engine moves are wired in ticket 12.)

## Resolution

Done. Committed on branch `frooktions-build`.

- **`economy.ts`** — `adversaryDrop` (timed, escalation-pooled) and `penaltyPawn`,
  both routing through `legality` (black-half mirror, no check) and taking an
  injectable `rng` for deterministic tests.
- **`gameReducer.ts`** — the single reducer. `TICK` (time, grace→playing at
  `GRACE_SEC`, adversary drop every `DROP_INTERVAL_SEC`), `EARN_PIECE`
  (place-then-earn: ignored while a piece is pending), `PLACE_PIECE` (legal drop or
  no-op), `WRONG_ANSWER` (penalty pawn), `APPLY_MOVE` (applies an AI move + detects
  game-over — added here so ticket 12 only wires the worker), `TOGGLE_HINT`,
  `RESTART`. Each board-changing action works on a **fresh Chess cloned from the
  FEN**, so state is immutable/testable.
- **Tests** — added **vitest** (dev dep; `pnpm test`). 9 tests green: escalation
  boundaries, drop-type pooling, drop/penalty placement on the black half, grace
  gating + drop cadence, place-then-earn, illegal-drop no-op, checkmate detection
  (fool's mate → player loses).
- **Verified:** `pnpm test` 9/9, `tsc` clean, `next build` green.

### Important catch → amends ticket 06

`chess.js` reports the **two-king start as an insufficient-material draw**
(`isGameOver()` is true immediately). So game-over evaluation counts **only
checkmate (win/lose) and stalemate (draw)** — _not_ insufficient-material,
fifty-move, or threefold draws, which would otherwise end the game at kickoff and
in thin endgames. Continuous escalation keeps material flowing, so no time cap is
needed. This refines ticket 06's win/lose spec (which had listed insufficient
material as a draw).

**Note:** the page still uses the ticket-10 local harness; swapping it to
`useReducer(gameReducer)` + the engine loop is ticket 12.
