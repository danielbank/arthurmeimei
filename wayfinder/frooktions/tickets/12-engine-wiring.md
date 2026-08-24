---
id: '12'
title: Build — engine wiring & game loop
map: frooktions
label: wayfinder:task
mode: AFK
status: open
assignee:
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
