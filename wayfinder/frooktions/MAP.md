---
label: wayfinder:map
slug: frooktions
---

# Frooktions — map

## Destination

A **playable Frooktions page**: a meta-chess game where two AI armies fight and
the player is the **quartermaster** — the only way to earn material is to solve
fraction / arithmetic / Euclidean-GCD problems, while an adversary auto-drops
escalating material on a `TICK` clock. The map is done when a player can open the
page and play a full win/lose match.

## Notes

- **Domain:** educational chess+fractions game. Glossary:
  [`fraction-math-game/CONTEXT.md`](../../fraction-math-game/CONTEXT.md) — Tick,
  Drop, Quartermaster, Reward ladder, Tier, Placement zone, Escalation.
- **Execution override:** this map **carries into execution** (Round 1: "build").
  The decision tickets below plan the game; once they close — the architecture
  ticket last — the build phase graduates from _Not yet specified_ into
  execution tickets, and this map's sessions may write code.
- **Host:** lives in the `fraction-math-game/` Next.js 16 / React 19 app, reusing
  its `math-primitives` components; surfaced as a top-level link to its own page.
- **Locked spine** (charting Rounds 1–2): economy = adversary auto-drops, player
  earns by answering; real chess; player is quartermaster (never moves pieces);
  difficulty→piece reward ladder; procedural question generator; one base `TICK`,
  no per-question timer; user picks the difficulty tier; win = adversary mated /
  lose = player mated, with adversary drop-quality escalation forcing action.
- **Tracker:** local-markdown — see [`../TRACKER.md`](../TRACKER.md) for
  operations. **Skills:** grilling + domain-modeling by default; prototype for
  ticket 05; research for external facts.
- Never resolve more than one ticket per session (except research).

## Decisions so far

- [Chess tech stack](tickets/01-chess-tech-stack.md): use **chess.js** (rules) +
  **react-chessboard v5** (React-19-native, renders partial two-king positions) +
  **cburnett SVG pieces** + **js-chess-engine** as the opponent AI — no WASM, no
  COOP/COEP headers, no GPL. Stockfish is MB-scale (not ~50k) and lucide has no
  chess pieces; both assumptions overturned.
- [Placement legality contract](tickets/02-placement-legality.md): drops land on
  the dropper's own half (empty squares; pawns off rank 1), **never give check**
  (so checkmate-by-placement is impossible and every position stays a legal FEN),
  commit final-on-click, and are allowed while your own king is in check. Enforced
  via `chess.js` `.put()`; a drop never changes side-to-move. Adversary drops
  mirror the same rules.
- [Question tiers, generator & reward ladder](tickets/03-question-tiers-ladder.md):
  4 tiers (pawn / choose-your-minor / rook / queen) over the 3 primitives, correct
  = all blanks right. **Wrong answer (on explicit Submit) = flat one pawn to the
  adversary + question consumed**; free abandon before Submit; one question at a
  time. Exact operand ranges deferred to Pacing tuning.
- [Hint Mode (fraction-factoring scaffold)](tickets/07-hint-mode.md): a magic-wand
  **global difficulty toggle** (on = easier). On fraction-addition problems (not
  Queen), clicking a fraction `a/b` rewrites it in place as `a/b × f/f`,
  `f = d/gcd(b,d)` — exposing the equivalent-fraction step. Free, unlimited; the
  tick clock is the only cost. Feeds the layout prototype and architecture tickets.
- [Pacing, cadence & adversary escalation](tickets/04-pacing-escalation.md):
  initial constants — adversary drop every **10s**, army half-move every **4s**
  (moves run faster than drops), **10s grace**, **place-then-earn** (1 pending),
  kings on e1/e8. Escalation by elapsed time (pawns→minors→rooks→queens over
  0/30/75/150s), stacking with error pawns. Both armies = same engine, so material
  decides. All values are playtest starting points.
- [Two-column layout & interaction loop](tickets/05-layout-interaction-proto.md):
  **approved via [live prototype](https://claude.ai/code/artifact/3625952d-cb93-4a1c-bb77-4a3f97fe7705)**.
  Board + clock + tally left; tier picker + question(+wand) + battle-log right;
  place-then-drop loop; fun-minimalist kid tone (teal "team" vs coral "robots",
  cburnett SVG pieces in prod). **Queen tier = guided step-gated GCD ladder**
  (quotient→remainder→drop-down), which amended: Hint Mode → denominators-differ
  only; wrong-answer penalty → **Queen tier exempt** (cost is time, not a pawn).
- [Architecture, route & game state machine](tickets/06-architecture-state-machine.md):
  `/frooktions` route in the game app + home link; `chess.js` = source of truth,
  `js-chess-engine` = move-picker (Web Worker); pure logic in `lib/frooktions/` + a
  single `useReducer`; phases `setup(grace)→playing→game-over`; checkmate/draw
  detection + Play-again. Module map defined; the build phase is now live tickets.

## Not yet specified

_(empty — the way is fully charted; all remaining work is the live build tickets
08–13 below.)_

## Build phase (execution tickets — the map carries into execution)

All decisions are made; these are the ordered build backlog. Frontier starts at
**Scaffold**, which unblocks the board / math / economy trio.

- [Scaffold route, deps & lib skeleton](tickets/08-scaffold-deps.md) — foundation.
- [Board, pieces & placement UI](tickets/09-board-pieces.md) — after scaffold.
- [Math column (generator, tiers, Hint Mode, GCD ladder)](tickets/10-math-column.md) — after scaffold.
- [Economy & tick engine (reducer)](tickets/11-economy-engine.md) — after scaffold.
- [Engine wiring & game loop](tickets/12-engine-wiring.md) — after board + economy.
- [Game-over UX, polish, responsive & a11y](tickets/13-gameover-polish.md) — final.

## Out of scope (v1)

- Accounts / login.
- Cross-session persistence or high-scores.
- Sound / music.
- Human-vs-human play.
- A settings menu.
