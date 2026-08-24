---
id: '06'
title: Architecture, route & game state machine
map: frooktions
label: wayfinder:grilling
mode: HITL
status: closed
assignee: Daniel Bank
blocked-by: ['01', '02', '04', '05']
---

## Question

The capstone decision that makes Frooktions buildable — after this closes, the
map graduates into execution/build tickets. Fix:

1. **Where it lives & the top-level link.** A new route (`/frooktions`) in the
   fraction-math-game app? How is the "top-level link to its own page" surfaced
   (nav on the app home, a card on `page.tsx`)? Confirm the primitives are
   imported from `components/math-primitives`, not duplicated.
2. **State machine.** The phases (`setup → playing → game-over`) and their
   transitions. What is the single source of truth for game state (board FEN +
   pending pieces + tick count + material + phase)? Client-only (no server)?
3. **The driving loop.** How `TICK` advances (setInterval / rAF), and how each
   tick fans out to: adversary drop, maybe an army half-move (`N×TICK`), check
   detection, escalation, and win/lose evaluation. How js-chess-engine is asked
   for _both_ armies' moves without blocking the UI.
4. **Win / lose / end states** (folded from Round 2, Q9). Win = adversary
   checkmated; lose = player checkmated. How each is detected (chess.js) and
   presented; restart; the "checkmate-by-placement — impossible state" guard from
   ticket 02 honored here.
5. **Module boundaries.** The seams: rules (chess.js), opponent (js-chess-engine),
   board (react-chessboard), question generator (ticket 03), economy/tick engine
   (ticket 04), UI (ticket 05), **Hint Mode** (ticket 07 — global on/off state +
   the `a/b → a/b × f/f` rewrite in the question-rendering layer). Enough of a design that build tickets are
   mechanical.

**Deliverable:** an architecture sketch + component/module list precise enough to
scaffold from. Blocked by tech, placement legality, pacing, and the layout
prototype.

## Resolution

### Spine

`chess.js` is the **source of truth** for rules, legality, turn, and game-over.
`js-chess-engine` is a **move-picker only**: each move-tick it is handed the
current FEN, returns a move, which is applied via `chess.js`. **Drops** (earned +
adversary) use `chess.js.put()` and **never change side-to-move** (ticket 02).

### Q1 — Route & top-level link

New route **`/frooktions`** in the `fraction-math-game` Next app, reusing
`components/math-primitives`. A **card/link on the app home** (`app/page.tsx`) is
the top-level entry. The parent `arthurmeimei` site is untouched.

### Q2 — State & logic location

All rules are **pure functions in `lib/frooktions/`** (economy/ticks, placement
legality, escalation, question generator, win/lose). A single **`useReducer`**
holds game state — `{ chess (FEN), pending piece, tickCount, phase, hintMode,
material }` — and React is a pure view. One source of truth; logic is unit-testable
without React.

### Q3 — Engine & loop

One game loop (single interval) dispatches tick actions. On a **move-tick**, the
side-to-move's move is computed by **`js-chess-engine` running in a Web Worker**
(fed the FEN) and applied via `chess.js`. Inline-at-low-level is an acceptable v1
shortcut if worker plumbing slips.

### Q4 — Win / lose / draw & restart

After each move, `chess.js` checks game over: **checkmate** → win (adversary mated)
/ lose (player mated); **stalemate / insufficient material / draw** → draw. A
**game-over overlay** shows the result + **Play again** (reseeds to two kings). No
wall-clock cap.

**Amended by ticket 11:** only **checkmate** (win/lose) and **stalemate** (draw)
end the game — NOT insufficient-material / fifty-move / threefold draws. The
two-king start _is_ an insufficient-material draw to `chess.js`, so those draw
rules must be ignored or the game ends at kickoff.

### Phases

`setup(grace) → playing → game-over`. The loop only drops/moves during `playing`;
`GRACE_PERIOD_MS` gates the transition from `setup`.

### Module map (seams to scaffold)

- `lib/frooktions/constants.ts` — the ticket 04 constants table.
- `lib/frooktions/legality.ts` — placement contract (ticket 02).
- `lib/frooktions/economy.ts` — drops, escalation, penalty pawn, place-then-earn.
- `lib/frooktions/generator.ts` — 4-tier question generator + Euclidean chains.
- `lib/frooktions/engine.worker.ts` — js-chess-engine wrapper.
- `lib/frooktions/gameReducer.ts` — the single reducer + tick action.
- `app/frooktions/page.tsx` + components: `Board`, `MathColumn` (tier picker,
  question card, wand), `Tally`, `Clock`, `BattleLog`, `GameOverOverlay`.

The build phase (tickets 08–13) graduates from the map's fog on this resolution.
