---
id: '02'
title: Placement legality contract
map: frooktions
label: wayfinder:grilling
mode: HITL
status: closed
assignee: Daniel Bank
blocked-by: ['01']
---

## Question

A **drop** (earned or adversary) puts a piece on the board _outside_ the normal
chess move loop, so real chess has no rule governing it — we must define one. Pin
the **placement legality contract**:

1. **Legal zone.** The player picks file _and_ rank (Round 2). Which squares are
   actually allowed? Any empty square on the player's half? Restricted to back
   ranks? May you drop onto a square that gives the adversary check, or that
   leaves your _own_ king in check (self-check — normally illegal)?
2. **Check side-effects** (the flagged edge case). If a drop delivers **check**
   to the adversary, is that allowed (and the adversary must respond on its
   move), forbidden, or does the placement UI simply refuse it? If a drop would
   deliver **checkmate**, the game would be won by a placement rather than a move
   — is that an allowed win, or a forbidden/impossible state we must prevent?
3. **chess.js reconciliation.** `chess.js.load()` rejects illegal positions
   (no-king, side-to-move-in-check, etc.). During the incremental "pieces get
   added" phase we drive `react-chessboard`'s object form directly; define the
   exact moment/condition a position is handed back to chess.js as a valid FEN,
   and what makes a drop "committed."
4. **Corner cases.** Pawn dropped on rank 1/8 (promotion square)? Dropping onto
   an occupied square? A drop that resolves an existing check?

**Deliverable:** a precise, enumerated set of placement rules the economy engine
and board UI can both enforce. Consult grilling + domain-modeling; update
`fraction-math-game/CONTEXT.md` "Placement zone" when fixed.

## Resolution

The **placement legality contract**. A drop is enforced by us, not chess.js:
mechanically it's `chess.js` `.put({type, color}, square)` (with `.remove` for the
inverse), and we validate the result against these rules. A drop **never changes
the side-to-move** — it's on the player's answering tempo, not the chess turn
clock.

1. **Legal zone (Q1a).** A drop may only land on the dropper's own **half** — the
   player owns their 4 ranks (ranks 1–4 for the white side), the adversary owns
   ranks 5–8. **Empty squares only**; occupied squares are always refused.
   **Pawns** are further restricted to ranks 2–4 (player) — never rank 1, never a
   promotion square. The player chooses both file and rank within the zone.

2. **No check by placement (Q2a).** A drop may **never** leave the opposing king
   in check — candidate squares that would give check are greyed out / refused.
   **Consequences:** (i) **checkmate-by-placement is impossible by construction**
   (the "impossible state" the player flagged); (ii) every post-drop position is
   _always_ a legal FEN with the correct side to move, since the side-not-to-move
   can never be placed into check. **Attacks (check, mate) are only ever produced
   by moves, never by drops.**

3. **Commit is final (Q3).** A piece commits the instant its square is clicked —
   no undo, no repositioning. A drop is a spent resource. (An optional confirm-on-
   hover is polish, not part of the contract.)

4. **Drops while your own king is in check (Q4a).** Allowed as a defensive
   resource. If your king is in check (from the adversary's move) you may still
   answer a question and drop — a blocker that removes the check saves you; a drop
   that doesn't still leaves a legal "you-are-in-check, to-move" position and your
   AI must still move to escape. **Self-check by your own drop is impossible** —
   adding a friendly piece can never attack your own king — so no rule is needed
   for it.

5. **Symmetry.** The adversary's auto-drops obey this same contract mirrored to
   its half (ranks 5–8, empty-only, no check-giving, pawns off rank 8).

6. **chess.js reconciliation.** Because rules 1–2 keep every position legal, the
   board can be a live `chess.js` instance throughout — no object-form escape
   hatch is needed. `.put()` can create illegal positions but _we_ are the
   validator that prevents it; `.fen()` always exports a loadable position.

**Corner cases:** pawn on rank 1/8 → excluded by the zone + pawn restriction;
occupied square → refused; a drop that blocks an existing check on your own king →
allowed (rule 4); dropped pawns promote normally later via a move (chess.js).
