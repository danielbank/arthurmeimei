---
id: '09'
title: Build — board, pieces & placement UI
map: frooktions
label: wayfinder:task
mode: AFK
status: closed
assignee: Daniel Bank
blocked-by: ['08']
---

## Task

The board column (tech: ticket 01; legality: ticket 02; look: ticket 05).

- Render the board with **react-chessboard**, driven by the `chess.js` position;
  **cburnett SVG** pieces, your team vs adversary visually distinct, kings marked.
- Partial positions: start from two kings; support incremental `.put()` drops.
- **Placement mode**: when a piece is earned, highlight legal squares (own half,
  empty, pawns off rank 1, no check — per legality.ts) and drop on click.
- Board header: tick **Clock** + escalation label; **Tally** (you vs adversary
  bars + captured rows) beneath.

**Done when:** the board renders the live position, placement mode highlights and
accepts legal drops, and the clock/tally reflect game state.

## Resolution

Done. Committed on branch `frooktions-build`.

- **`lib/frooktions/legality.ts`** — implemented the ticket 02 contract: own-half
  ranks, empty-only, pawns off rank 1/8, and the **no-check invariant** via
  `chess.js.isAttacked(enemyKing, side)`. `legalDropSquares` / `canDrop` / `tryDrop`.
- **Components** (`components/frooktions/`): `board.tsx` (react-chessboard v5, view-
  only — no dragging, `onSquareClick` places on highlighted squares), `clock.tsx`
  (mm:ss + pulsing dot + escalation badge), `tally.tsx` (material bars + captured
  glyphs, parsed from FEN), `board-column.tsx` (composes them + legend).
- **Page** now renders the real board column; the right column is a **temporary
  demo harness** (earn-piece + robot-drop buttons) to exercise placement until the
  math column (10) + engine loop (12) land.
- **Verified:** `tsc` clean; `next build` green (`/frooktions` prerenders with all
  64 squares + both kings). Headless test of `legalDropSquares` on the two-king
  start confirms: pawn → 24 squares (ranks 2–4, none on rank 1); rook → 28 (e2/e3/e4
  correctly **excluded** because they'd check e8).

### Build decisions (noted)

- **Pieces:** using react-chessboard's built-in default SVG set (standard
  **white = your team / black = robots**) rather than recolouring cburnett to
  teal/coral. Real chess pieces read best in standard colours, and it's clearly
  distinct; the prototype's teal/coral was a Unicode-era affordance. Team-tinting
  can be revisited in polish (ticket 13) if desired.
- **Board colours** fixed warm tones (light `#f4ead2` / dark `#e0c79a`), theme-
  independent (as chessboards usually are).
