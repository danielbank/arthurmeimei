---
id: '13'
title: Build — game-over UX, polish, responsive & a11y
map: frooktions
label: wayfinder:task
mode: AFK
status: open
assignee:
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
