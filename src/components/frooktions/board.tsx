'use client'

// Frooktions board — wayfinder ticket 09. Wraps react-chessboard v5 (driven by a
// chess.js FEN). The player never drags pieces (quartermaster) — the board is
// view-only for the AI armies, except PLACEMENT MODE: when pieces are earnable,
// legal drop squares glow and a click places the pending piece.

import { Chessboard } from 'react-chessboard'
import type { CSSProperties } from 'react'

const LIGHT = '#f4ead2'
const DARK = '#e0c79a'

const PLACE_SQUARE_STYLE: CSSProperties = {
  cursor: 'pointer',
  background:
    'radial-gradient(circle, color-mix(in srgb, var(--primary) 55%, transparent) 21%, transparent 24%)',
}

export function Board({
  fen,
  orientation = 'white',
  placeSquares = [],
  onPlace,
}: {
  fen: string
  orientation?: 'white' | 'black'
  /** squares (e.g. 'e2') that are currently legal drops; they glow + accept clicks */
  placeSquares?: string[]
  onPlace?: (square: string) => void
}) {
  const squareStyles = Object.fromEntries(placeSquares.map((sq) => [sq, PLACE_SQUARE_STYLE]))

  return (
    <div className="overflow-hidden rounded-2xl border shadow-sm">
      <Chessboard
        options={{
          position: fen,
          boardOrientation: orientation,
          allowDragging: false,
          showAnimations: true,
          animationDurationInMs: 250,
          showNotation: true,
          lightSquareStyle: { backgroundColor: LIGHT },
          darkSquareStyle: { backgroundColor: DARK },
          squareStyles,
          onSquareClick: ({ square }) => {
            if (placeSquares.includes(square)) onPlace?.(square)
          },
        }}
      />
    </div>
  )
}
