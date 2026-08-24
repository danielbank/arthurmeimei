---
id: '09'
title: Build — board, pieces & placement UI
map: frooktions
label: wayfinder:task
mode: AFK
status: open
assignee:
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
