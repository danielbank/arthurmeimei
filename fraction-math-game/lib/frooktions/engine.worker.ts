// js-chess-engine wrapper running off the main thread — wayfinder ticket 06 (Q3)
// + ticket 12. chess.js is the source of truth; this only PICKS a move for the
// side to play, given a FEN. The main thread applies the returned move via chess.js.
//
// TODO(build ticket 12): wire the actual Worker message loop.
//   Protocol:  postMessage({ fen, level })  ->  onmessage({ from, to })
//
// Sketch (uncomment when implemented):
//   import { Game } from 'js-chess-engine'
//   self.onmessage = (e: MessageEvent<EngineRequest>) => {
//     const game = new Game(e.data.fen)
//     const move = game.aiMove(e.data.level) // { [from]: to }
//     const [from, to] = Object.entries(move)[0]
//     ;(self as unknown as Worker).postMessage({ from, to } satisfies EngineReply)
//   }

export interface EngineRequest {
  fen: string
  level: number
}

export interface EngineReply {
  from: string
  to: string
}

export {}
