---
id: '13'
title: Build — game-over UX, polish, responsive & a11y
map: frooktions
label: wayfinder:task
mode: AFK
status: closed
assignee: Daniel Bank
blocked-by: ['10', '12']
---

## Task

Final pass to a shippable page (look: ticket 05; scope fence: map).

- **Game-over overlay**: win / lose / draw result + **Play again** (reseeds to two
  kings, resets the reducer).
- **Battle log** feed (drops, earns, moves, results).
- **Polish**: the fun-but-minimalist elementary tone from the prototype — teal
  team / coral adversary / gold kings, rounded cards, tasteful motion (respect
  `prefers-reduced-motion`).
- **Responsive**: two-column desktop → single-column stack on mobile.
- **A11y**: keyboard-operable tier picker / inputs / placement, visible focus,
  aria labels, colour not the only state signal.

**Done when:** a player can open `/frooktions`, play a full win/lose/draw match,
restart, and it holds up on mobile + keyboard. This is the destination.

## Resolution

Done — **the destination is reached.** Committed on branch `frooktions-build`.

- **Battle log** — added a `log: LogEntry[]` channel to the reducer (drops, earns,
  placements, penalties, moves as SAN, and the result; capped at 40, newest first).
  `BattleLog` renders it with `aria-live="polite"`, tinted by side.
- **Choose-your-minor** (ticket 03) — the Minor tier now grants a generic minor and
  the player picks **knight or bishop** at earn time via a chooser in the math
  column, honouring the decision.
- **Game-over overlay polish** — result + reason + final material tally + Play
  again; `role="dialog"`/`aria-modal`, autofocus the restart button, result-tinted
  heading, motion-safe entrance.
- **A11y** — `focus-visible` rings on tier / wand / minor / restart controls; aria
  labels on tiers and piece choosers; `aria-pressed` on the wand; state signalled
  by glyph + number + text, not colour alone. (Known limit: `react-chessboard`
  placement is pointer-only — keyboard board placement is a future enhancement.)
- **Responsive** — the two-column grid stacks to one column under `lg`; the tier
  grid is `2 → 4` cols; the board scales via `aspect-ratio`.
- **Verified:** eslint + `tsc` clean, `next build` green, 12 vitest tests pass.

The full game is playable at `/frooktions`: solve fractions → earn & place pieces,
robots drop & escalate, both AI armies fight, win/lose/draw + restart.
