---
id: '01'
title: Chess tech stack
map: frooktions
label: wayfinder:research
mode: AFK
status: closed
assignee: wayfinder-charting
blocked-by: []
---

## Question

What install-ready JS/TS libraries should Frooktions use for (a) chess rules, (b)
an opponent AI, (c) board rendering with partial positions, (d) piece icons — in
a Next.js 16 / React 19 app, without exotic hosting constraints? "Don't reinvent
the wheel."

## Resolution

Resolved by background research during charting. **Recommended stack:**

| Concern               | Pick                                                                   | Notes                                                                                                                                                                                                                                                               |
| --------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rules engine          | **chess.js 1.4.0** (BSD-2, zero-dep, TS)                               | Legal moves, check/checkmate/stalemate, FEN/PGN. `load()` **rejects illegal/in-progress positions** — drive the board object form during the "add pieces" phase, hand to chess.js FEN only once legal.                                                              |
| Board                 | **react-chessboard 5.10.0** (MIT)                                      | Native React 19 peer deps; rewritten onto `@dnd-kit` (no react-dnd). Drag + **click-to-move** + square highlighting + custom pieces. `position` accepts a FEN **or** a square→piece object → renders **partial two-king positions** and illegal in-progress setups. |
| Pieces                | **cburnett SVG set under BSD-3** (or Unicode ♔♕♖♗♘♙ for a quick start) | Real, free, embeddable as inline SVG/data-URIs. **Lucide has NO chess pieces** (only Crown/Castle/Church stand-ins, no knight/pawn).                                                                                                                                |
| AI (default)          | **js-chess-engine 2.4.6** (MIT, zero-dep)                              | Minimax+alpha-beta, 5 levels, tiny. No worker/WASM/headers/GPL. Weak-to-medium — plenty when the AI is theater for the math.                                                                                                                                        |
| AI (strong, optional) | stockfish.js (nmrugg) lite single-threaded ~7 MB (**GPLv3**)           | Only if a genuinely strong opponent is wanted. GPLv3 obligations; run in Web Worker over UCI. Avoid multi-threaded (needs COOP/COEP cross-origin isolation, which breaks third-party images/fonts).                                                                 |

**Key facts that overturned assumptions:** Stockfish is **MB-scale, not ~50k**;
lucide has no chess pieces; multi-threaded WASM needs COOP/COEP headers →
**avoid** by defaulting to js-chess-engine (no headers, no GPL, no WASM).
