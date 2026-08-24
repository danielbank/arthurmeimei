---
id: '11'
title: Build — economy & tick engine (reducer)
map: frooktions
label: wayfinder:task
mode: AFK
status: open
assignee:
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
