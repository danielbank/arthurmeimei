# Wayfinder local-markdown tracker

This repo has no external issue tracker, so wayfinder maps live here as markdown.
This doc is the **Wayfinding operations** reference: how maps, tickets, claims,
blocking, and the frontier are expressed on disk.

## Layout

```
wayfinder/
  TRACKER.md                 <- this file
  <map-slug>/
    MAP.md                   <- the map (label: wayfinder:map)
    tickets/
      NN-<ticket-slug>.md    <- one child ticket per file
```

Each map is a directory. Its `MAP.md` is the canonical index; each file in
`tickets/` is one child ticket. The ticket's identity is its two-digit `id`
(`01`, `02`, …), unique within the map.

## Ticket frontmatter

```yaml
---
id: '02'
title: Placement legality contract
map: frooktions
label: wayfinder:grilling # research | prototype | grilling | task
mode: HITL # HITL | AFK
status: open # open | closed
assignee: # empty = unclaimed; a name = claimed
blocked-by: ['01'] # ids that must be closed first ([] = none)
---
## Question

<the decision this ticket resolves>
```

On resolution, append a `## Resolution` section to the ticket body, set
`status: closed`, and add a one-line pointer to `MAP.md` under Decisions so far.

## Operations

- **Create map** — make `wayfinder/<slug>/MAP.md` from the map-body template,
  labelled `wayfinder:map`.
- **Create ticket** — add `wayfinder/<slug>/tickets/NN-<slug>.md`. Two-pass when
  wiring dependencies: create all files first (so ids exist), then fill
  `blocked-by`.
- **Claim** — set `assignee:` to the driving dev, _before_ any work. An open
  ticket with empty `assignee` is unclaimed.
- **Blocking** — the `blocked-by` list. A ticket is _unblocked_ when every id in
  its `blocked-by` is a ticket whose `status: closed`.
- **Frontier query** — open tickets that are unblocked and unclaimed:
  ```sh
  # from the map dir: list open, unassigned, all-blockers-closed tickets
  grep -L 'status: closed' tickets/*.md   # open tickets, then filter by hand:
  #   assignee empty AND every blocked-by id is closed
  ```
  (Small maps: just read the frontmatter. The map's own structure makes the
  frontier obvious.)
