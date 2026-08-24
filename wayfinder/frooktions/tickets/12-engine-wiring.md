---
id: '12'
title: Build — engine wiring & game loop
map: frooktions
label: wayfinder:task
mode: AFK
status: closed
assignee: Daniel Bank
blocked-by: ['09', '11']
---

## Task

Make the two armies actually play (architecture: ticket 06).

- **`engine.worker.ts`**: wrap `js-chess-engine` in a Web Worker; given a FEN +
  level, post back the chosen move.
- **Game loop**: one interval dispatches `TICK`; on a **move-tick** request the
  side-to-move's move from the worker, apply it via `chess.js.move()`, re-render.
  Adversary **drop-ticks** and player earns run per the economy engine. Move-rate
  and drop-rate from `constants.ts` (moves faster than drops).
- **Win/lose/draw detection**: after each move, `chess.js` checkmate → win/lose,
  stalemate/insufficient-material/draw → draw; transition phase to `game-over`.

**Done when:** both armies move on cadence without blocking the UI, drops and moves
interleave correctly, and game-over is detected. Blocked by the board (09) and the
economy engine (11).

## Resolution

Done — **the game plays itself end to end.** Committed on branch `frooktions-build`.

- **`ai.ts`** — `computeAiMove(fen, level)`: asks `js-chess-engine` for the
  side-to-move's move, lowercases it for `chess.js`, and defaults a queen
  promotion when a pawn reaches the back rank. Returns null on game over.
- **`use-frooktions.ts`** — the loop hook: `useReducer(gameReducer)` + two
  intervals — the **1s tick clock** (`TICK`: time, grace, timed drops, escalation)
  and the **`ARMY_HALF_MOVE_INTERVAL_MS` move cadence** (`APPLY_MOVE` for whichever
  side is to move). Both armies use the same engine → material decides.
- **`game-over-overlay.tsx`** — functional win/lose/draw overlay + Play again
  (`RESTART`). Visual polish is ticket 13.
- **Page** — now fully reducer-driven (local harness removed): board placement,
  math earn/wrong, moving armies, drops, and game-over all wired.
- **Verified:** `tsc` clean; `next build` green; **12 vitest tests** (added
  `computeAiMove` legality + null-on-mate, mate-in-1 → win, 40-ply auto-play stays
  legal).

### Engine strength & the Worker decision

- **`ENGINE_LEVEL = 2`** matters: probing showed **level 1 misses a mate-in-1**
  while **level 2 finds it** (and level 0 returns no move at all). Kept at 2.
- Ran the engine **inline** (ticket 06 Q3's sanctioned v1 shortcut) rather than in
  a Web Worker — it's verifiable headlessly and level-2 compute is fast. The
  `engine.worker.ts` stub remains as the documented upgrade path if move
  computation ever janks the UI on full boards.
- `evaluateGameOver` (ticket 11) already handles the insufficient-material caveat,
  so this ticket's original "insufficient-material → draw" line is superseded.

**Deferred to ticket 13:** battle log, choose-your-minor at placement, overlay
polish, responsive + a11y pass, and lifting Hint Mode into the reducer if wanted.
