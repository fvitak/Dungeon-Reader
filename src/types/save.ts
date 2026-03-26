import type { GameState } from './game'

export interface SaveSlot {
  id: string
  name: string           // user-defined save name
  timestamp: number      // Date.now() when saved
  episodeId: string      // e.g. 'rootwood-ep1'
  episodeTitle: string   // e.g. 'Rootwood Academy – Episode 1'
  chapterName: string    // e.g. 'Chapter 1: The Door'
  chapterNumber: number  // 1 | 2 | …
  sceneId: string        // scene to resume from (next scene after save point)
  mathRank: string       // e.g. 'M3'
  readingRank: string    // e.g. 'R2'
  xp: number
  gameState: GameState   // full snapshot for seamless resume
}
