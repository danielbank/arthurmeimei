---
id: '08'
title: Build — scaffold route, deps & lib skeleton
map: frooktions
label: wayfinder:task
mode: AFK
status: closed
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

## Resolution

Done. Committed on branch `frooktions-build`.

- **Deps installed** (pnpm): `chess.js@1.4.0`, `react-chessboard@5.12.1`,
  `js-chess-engine@2.4.6` — all React-19 native.
- **Route**: `app/frooktions/page.tsx` — a client two-column shell (board / math
  placeholders) with a back-link to the app home.
- **Top-level link**: a gradient CTA card in `app/page.tsx` → `/frooktions`.
- **`lib/frooktions/` skeleton**: `types.ts`, `constants.ts` (**fully populated**
  from the ticket 04 table — cadences, grace, escalation pools, START_FEN, reward
  ladder, engine level), and typed stubs `legality.ts`, `economy.ts`,
  `generator.ts`, `gameReducer.ts`, `engine.worker.ts`, each pointing at its build
  ticket. `generator.ts` already ships the real `gcd`/`hintFactor` helpers.
- **Verified**: `tsc --noEmit` clean; `next build` green with `/frooktions` in the
  route table (prerendered static).

**Note:** cburnett SVG pieces were deferred to ticket 09 — `react-chessboard` v5
ships an SVG default set out of the box, so the custom set is dropped in with the
board rather than as loose scaffold assets. Build emits a harmless multi-lockfile
workspace-root warning (root + game `pnpm-lock.yaml`); silence later via
`turbopack.root` if desired.
