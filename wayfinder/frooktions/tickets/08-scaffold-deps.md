---
id: '08'
title: Build — scaffold route, deps & lib skeleton
map: frooktions
label: wayfinder:task
mode: AFK
status: open
assignee: Daniel Bank
blocked-by: []
---

## Task

Foundation for the build phase (architecture: ticket 06).

- Install deps in `fraction-math-game`: `chess.js`, `react-chessboard`,
  `js-chess-engine`; add the **cburnett SVG** piece set (BSD-3) as inline
  assets/components.
- Create the route `app/frooktions/page.tsx` (client component shell) and a
  **top-level link/card** from `app/page.tsx` to it.
- Create the `lib/frooktions/` skeleton with typed stubs per the module map:
  `constants.ts`, `legality.ts`, `economy.ts`, `generator.ts`, `gameReducer.ts`,
  `engine.worker.ts`.
- Populate `constants.ts` from the ticket 04 table.

**Done when:** the route renders an empty two-column shell, the home link works,
and the lib modules exist as typed stubs. Unblocks the board, math, and economy
tickets.
