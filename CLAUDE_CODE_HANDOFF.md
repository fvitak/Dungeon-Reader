# Dungeon Reader — Claude Code Handoff
# From: Claude (claude.ai design session)
# To: Claude Code (implementation)
# Date: 2026-03-24

---

## WHAT THIS PROJECT IS

An educational reading game for 1st and 2nd graders — specifically targeting kids with
ADHD, dyslexia, and autism. Built in React + TypeScript + Vite.

The game is a page-by-page story with embedded math and reading challenges. Kids earn
XP for correct answers, spend it in an in-game shop on collectibles, and get hooked on
reading through dopamine-loop design (short page → small reward → choice → bigger
reward → cliffhanger).

Repo: https://github.com/fvitak/Dungeon-Reader

---

## THE WORLD

**Series name:** Rootwood Academy
**Setting:** A school for young magic-makers hidden inside the world's oldest enchanted tree.
The tree is so vast its branches hold entire classrooms, its roots are corridors,
and its heartwood is the Grand Hall. Students travel between floors by riding Liftvines.

**Narrator:** Cobb — an ancient owl of truly unreasonable age. Dry, funny, trusts the
reader completely. Short declarative sentences. Dry wit lands in the second sentence,
never the first. Refers to himself in third person sparingly. Never mean. Never explains
things the reader can figure out themselves.

**Sample Cobb lines:**
- "You have been here one morning. Already something is wrong. Typical."
- "Cobb blinked once. Twice. 'Seven,' he said. 'The answer is seven. Also — run.'"
- "Interesting. Doors do not just appear. Except when they do."

**The shop:** "The Twig & Toadstool" — kids spend XP earned in episodes on collectibles
(owl feathers, spell scrolls, glowstones, seedling sprites, mooncloaks). Every shop item
has a one-line Cobb-voice description. The shop is part of the world, not a separate game
layer.

**Tree floors:**
- Root level: The Underbranch — storage, Creature Cellar, Lost & Found
- Ground: The Grand Hall — meals, assemblies, fireflies for lights
- First branch: Classrooms — Spellcraft, Creature Care, Plant Magic, Numbers & Notions
- Second branch: The Library Canopy
- Third branch: Student rooms
- Top: Cobb's perch — one wide branch, open sky

---

## CURRICULUM ALIGNMENT

Maryland MCCR Standards (Common Core aligned). Content must stay within these bounds.

### Math progression (17 levels, M1–M17)
Each level = a specific point in the Grade 1–2 Maryland math sequence.

| Level | Skill | Standard | Grade typical |
|-------|-------|----------|---------------|
| M1 | Count, add, subtract within 5 | 1.OA.A.1 (≤5) | G1 start |
| M2 | Add/subtract within 10, result unknown | 1.OA.A.1 (≤10) | G1 early |
| M3 | Add/subtract within 10, unknown all positions | 1.OA.D.8 | G1 early |
| M4 | Add/subtract within 20, result unknown | 1.OA.A.1 (≤20) | G1 mid |
| M5 | Make a ten; three addends ≤ 20 | 1.OA.A.2 | G1 mid |
| M6 | Place value: tens and ones, count to 120 | 1.NBT.B.2 | G1 mid |
| M7 | Compare two-digit numbers; add/sub multiples of 10 | 1.NBT.B.3 | G1 late |
| M8 | Tell time: hour and half-hour | 1.MD.B.3 | G1 late |
| M9 | Measure length by iterating units | 1.MD.A.2 | G1 late |
| M10 | Fluency: add/subtract within 20 from memory | 2.OA.B.2 | G2 start |
| M11 | Add/subtract within 100, one step | 2.NBT.B.5 | G2 early |
| M12 | Add/subtract within 100, two-step word problems | 2.OA.A.1 | G2 mid |
| M13 | Odd/even numbers; rectangular arrays | 2.OA.C.3 | G2 mid |
| M14 | Place value to 1000 | 2.NBT.A.1 | G2 mid |
| M15 | Add/subtract within 1000 | 2.NBT.B.7 | G2 late |
| M16 | Tell time to nearest 5 minutes | 2.MD.C.7 | G2 late |
| M17 | Measure in inches and centimeters | 2.MD.A.1 | G2 late |

### Reading progression (10 levels, R1–R10)

| Level | Skill | Standard | Grade typical |
|-------|-------|----------|---------------|
| R1 | CVC words + Dolch Pre-Primer sight words | RF.1.3b | G1 start |
| R2 | CVC + consonant blends (bl, cr, st, tr) | RF.1.3c | G1 early |
| R3 | Consonant digraphs (ch, sh, th, wh) | RF.1.3a | G1 early |
| R4 | Long vowel silent-e (CVCe) | RF.1.3c | G1 mid |
| R5 | Vowel teams (ai, ay, ee, ea, oa, ow) | RF.2.3b | G1 mid |
| R6 | Two-syllable words; -s, -ed, -ing suffixes | RF.1.3e-f | G1 late |
| R7 | R-controlled vowels; igh, ew | RF.2.3b | G2 early |
| R8 | Common prefixes un-, re-; suffixes -ful, -less | RF.2.3d | G2 mid |
| R9 | Diphthongs oi/oy, ou/ow; silent letters kn, wr | RF.2.3b | G2 mid |
| R10 | Multi-syllabic words; fluency at grade rate | RF.2.4 | G2 late |

---

## DECISIONS MADE (do not re-litigate these)

1. **No hearts lost on wrong answers for any skill level.** Wrong answer = hint shown +
   retry. No penalty. This is non-negotiable for the ADHD/dyslexic/autistic target audience.
   The current `useGameEngine.ts` decrements hearts on fail — this must be removed entirely
   or gated behind a non-educational mode if one ever exists.

2. **Math and reading levels are tracked independently.** A kid can be M4 in math and R2
   in reading. They are NOT the same number. Both are stored in a `SkillProfile` object.

3. **Auto-advancement:** After 3 consecutive correct first-attempt answers at the current
   level, the engine advances the player one level in that skill. Reset counter on wrong
   answer. This should be configurable via a constant `MASTERY_THRESHOLD = 3`.

4. **GradeBand is replaced by SkillProfile.** The old `'1-2' | '3-4' | '5'` system is
   being retired. Existing stories (crystalCave, story.ts) can stay as-is for now but
   should be migrated eventually. All new Rootwood content uses the new system.

5. **Challenge content uses closest-level-at-or-below matching.** A challenge author
   writes prompts for 2–3 levels (e.g. M2, M4, M7). The engine picks the highest variant
   at or below the player's current level. An M3 player gets the M2 prompt. An M6 player
   gets the M4 prompt.

6. **XP system:** Correct first attempt = full XP. Retry after hint = reduced XP.
   No XP lost for wrong answers. Choices always award XP regardless of which path chosen.
   Specific values: easy challenge first try = +5 XP, big challenge first try = +15 XP,
   retry = +8 XP, choice made = +5 XP.

7. **Episode structure (8–12 pages, 10–15 minutes):**
   - Pages 1–2: Hook, narrator introduction, no challenge
   - Pages 3–4: Stakes introduced, first easy challenge
   - Page 5–6: Choice moment (two paths, story adapts tone, paths rejoin)
   - Pages 7–8: Big challenge (main math or reading puzzle)
   - Page 9: Resolution
   - Page 10: Cliffhanger tease for next episode
   - End screen: XP tally → shop opens

---

## IMPLEMENTATION TASKS (in priority order)

### TASK 1 — Add skillLevel.ts to src/types/

Create `src/types/skillLevel.ts` with the full content below. Do not modify anything
else yet — just add the file.

```typescript
// src/types/skillLevel.ts

export type MathSkillLevel =
  | 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6' | 'M7' | 'M8' | 'M9'
  | 'M10' | 'M11' | 'M12' | 'M13' | 'M14' | 'M15' | 'M16' | 'M17'

export type ReadingSkillLevel =
  | 'R1' | 'R2' | 'R3' | 'R4' | 'R5'
  | 'R6' | 'R7' | 'R8' | 'R9' | 'R10'

export interface SkillProfile {
  math: MathSkillLevel
  reading: ReadingSkillLevel
}

export interface SkillLevelMeta {
  level: MathSkillLevel | ReadingSkillLevel
  label: string
  gradeTypical: string
  standard: string
}

export const MATH_ORDER: MathSkillLevel[] = [
  'M1','M2','M3','M4','M5','M6','M7','M8','M9',
  'M10','M11','M12','M13','M14','M15','M16','M17'
]

export const READING_ORDER: ReadingSkillLevel[] = [
  'R1','R2','R3','R4','R5','R6','R7','R8','R9','R10'
]

export const MATH_LEVEL_META: Record<MathSkillLevel, SkillLevelMeta> = {
  M1:  { level: 'M1',  label: 'Count & add within 5',        gradeTypical: 'Grade 1, start',  standard: '1.OA.A.1 (≤5)'  },
  M2:  { level: 'M2',  label: 'Add & subtract within 10',    gradeTypical: 'Grade 1, early',  standard: '1.OA.A.1 (≤10)' },
  M3:  { level: 'M3',  label: 'Missing number within 10',    gradeTypical: 'Grade 1, early',  standard: '1.OA.D.8'       },
  M4:  { level: 'M4',  label: 'Add & subtract within 20',    gradeTypical: 'Grade 1, mid',    standard: '1.OA.A.1 (≤20)' },
  M5:  { level: 'M5',  label: 'Make a ten; three addends',   gradeTypical: 'Grade 1, mid',    standard: '1.OA.A.2'       },
  M6:  { level: 'M6',  label: 'Tens and ones to 120',        gradeTypical: 'Grade 1, mid',    standard: '1.NBT.B.2'      },
  M7:  { level: 'M7',  label: 'Compare & add two-digit',     gradeTypical: 'Grade 1, late',   standard: '1.NBT.B.3'      },
  M8:  { level: 'M8',  label: 'Time: hour & half-hour',      gradeTypical: 'Grade 1, late',   standard: '1.MD.B.3'       },
  M9:  { level: 'M9',  label: 'Measure & compare lengths',   gradeTypical: 'Grade 1, late',   standard: '1.MD.A.2'       },
  M10: { level: 'M10', label: 'Fluency within 20',           gradeTypical: 'Grade 2, start',  standard: '2.OA.B.2'       },
  M11: { level: 'M11', label: 'Add & subtract within 100',   gradeTypical: 'Grade 2, early',  standard: '2.NBT.B.5'      },
  M12: { level: 'M12', label: 'Two-step problems to 100',    gradeTypical: 'Grade 2, mid',    standard: '2.OA.A.1'       },
  M13: { level: 'M13', label: 'Odd, even & arrays',          gradeTypical: 'Grade 2, mid',    standard: '2.OA.C.3'       },
  M14: { level: 'M14', label: 'Place value to 1000',         gradeTypical: 'Grade 2, mid',    standard: '2.NBT.A.1'      },
  M15: { level: 'M15', label: 'Add & subtract within 1000',  gradeTypical: 'Grade 2, late',   standard: '2.NBT.B.7'      },
  M16: { level: 'M16', label: 'Time to 5 minutes',           gradeTypical: 'Grade 2, late',   standard: '2.MD.C.7'       },
  M17: { level: 'M17', label: 'Measure in inches & cm',      gradeTypical: 'Grade 2, late',   standard: '2.MD.A.1'       },
}

export const READING_LEVEL_META: Record<ReadingSkillLevel, SkillLevelMeta> = {
  R1:  { level: 'R1',  label: 'CVC + pre-primer words',      gradeTypical: 'Grade 1, start',  standard: 'RF.1.3b'  },
  R2:  { level: 'R2',  label: 'Blends + primer sight words', gradeTypical: 'Grade 1, early',  standard: 'RF.1.3c'  },
  R3:  { level: 'R3',  label: 'Digraphs (ch, sh, th)',       gradeTypical: 'Grade 1, early',  standard: 'RF.1.3a'  },
  R4:  { level: 'R4',  label: 'Silent-e long vowels',        gradeTypical: 'Grade 1, mid',    standard: 'RF.1.3c'  },
  R5:  { level: 'R5',  label: 'Vowel teams (ai, ee, oa)',    gradeTypical: 'Grade 1, mid',    standard: 'RF.2.3b'  },
  R6:  { level: 'R6',  label: 'Two-syllable + suffixes',     gradeTypical: 'Grade 1, late',   standard: 'RF.1.3e-f'},
  R7:  { level: 'R7',  label: 'R-controlled vowels + igh',   gradeTypical: 'Grade 2, early',  standard: 'RF.2.3b'  },
  R8:  { level: 'R8',  label: 'Prefixes & suffixes',         gradeTypical: 'Grade 2, mid',    standard: 'RF.2.3d'  },
  R9:  { level: 'R9',  label: 'Diphthongs + silent letters', gradeTypical: 'Grade 2, mid',    standard: 'RF.2.3b'  },
  R10: { level: 'R10', label: 'Multi-syllabic + fluency',    gradeTypical: 'Grade 2, late',   standard: 'RF.2.4'   },
}

export type MathLevelText = Partial<Record<MathSkillLevel, string>>
export type ReadingLevelText = Partial<Record<ReadingSkillLevel, string>>

export function selectForMathLevel(
  content: MathLevelText,
  playerLevel: MathSkillLevel
): string {
  const playerIdx = MATH_ORDER.indexOf(playerLevel)
  for (let i = playerIdx; i >= 0; i--) {
    const text = content[MATH_ORDER[i]]
    if (text) return text
  }
  for (const level of MATH_ORDER) {
    if (content[level]) return content[level]!
  }
  return ''
}

export function selectForReadingLevel(
  content: ReadingLevelText,
  playerLevel: ReadingSkillLevel
): string {
  const playerIdx = READING_ORDER.indexOf(playerLevel)
  for (let i = playerIdx; i >= 0; i--) {
    const text = content[READING_ORDER[i]]
    if (text) return text
  }
  for (const level of READING_ORDER) {
    if (content[level]) return content[level]!
  }
  return ''
}

export function mathLevelAtLeast(player: MathSkillLevel, required: MathSkillLevel): boolean {
  return MATH_ORDER.indexOf(player) >= MATH_ORDER.indexOf(required)
}

export function readingLevelAtLeast(player: ReadingSkillLevel, required: ReadingSkillLevel): boolean {
  return READING_ORDER.indexOf(player) >= READING_ORDER.indexOf(required)
}

export function nextMathLevel(current: MathSkillLevel): MathSkillLevel | null {
  const idx = MATH_ORDER.indexOf(current)
  return idx < MATH_ORDER.length - 1 ? MATH_ORDER[idx + 1] : null
}

export function nextReadingLevel(current: ReadingSkillLevel): ReadingSkillLevel | null {
  const idx = READING_ORDER.indexOf(current)
  return idx < READING_ORDER.length - 1 ? READING_ORDER[idx + 1] : null
}
```

---

### TASK 2 — Update src/types/game.ts

Make these targeted changes to `game.ts`. Keep everything that exists. Add and modify
only what is listed here.

**2a. Add import at top of file:**
```typescript
import type { SkillProfile, MathLevelText, ReadingLevelText } from './skillLevel'
```

**2b. Add new scene type for Rootwood content (add alongside existing StoryScene):**
```typescript
// New scene type for Rootwood episodes — uses skill-level-aware text
// Existing StoryScene stays intact for backward compatibility with crystalCave/story.ts
export interface RootwoodScene {
  id: string
  text: string | [string] | [string, string] | [string, string, string]
  image: {
    src: string
    alt: string
  }
  event?: RootwoodEvent
  nextSceneId?: string
  minMathLevel?: MathSkillLevel
  minReadingLevel?: ReadingSkillLevel
}

export type RootwoodEvent =
  | RootwoodCombatEvent
  | RootwoodRiddleEvent
  | RootwoodChoiceEvent
  | RootwoodRewardEvent

export interface RootwoodCombatEvent {
  type: 'combat'
  enemyName: string
  promptByLevel: MathLevelText
  correctAnswerByLevel: MathLevelText
  options: RootwoodEventOption[]
  successSceneId: string
  failureSceneId?: string
  hintByLevel?: MathLevelText
  reward?: {
    id: string
    label: string
    description?: string
  }
}

export interface RootwoodRiddleEvent {
  type: 'riddle'
  promptByLevel: MathLevelText | ReadingLevelText
  correctAnswerByLevel: MathLevelText | ReadingLevelText
  hintByLevel?: MathLevelText | ReadingLevelText
  successSceneId: string
  failureSceneId?: string
  reward?: {
    id: string
    label: string
    description?: string
  }
}

export interface RootwoodChoiceEvent {
  type: 'choice'
  prompt: string
  options: RootwoodChoiceOption[]
}

export interface RootwoodRewardEvent {
  type: 'reward'
  prompt: string
  reward: {
    id: string
    label: string
    description?: string
  }
  nextSceneId?: string
}

export interface RootwoodEventOption {
  id: string
  text: string
  value: string
  isCorrect: boolean
}

export interface RootwoodChoiceOption {
  id: string
  text: string
  nextSceneId: string
  flagKey?: string
}
```

**2c. Update GameState — add skillProfile and XP fields alongside existing fields:**
```typescript
export interface GameState {
  currentSceneId: string
  completedSceneIds: string[]
  gradeBand: GradeBand                  // keep for backward compat with old scenes
  skillProfile: SkillProfile            // NEW — used for all Rootwood content
  consecutiveCorrect: number            // NEW — tracks mastery advancement
  stats: {
    coins: number
    stars: number
    hearts: number
    xp: number                          // NEW — total XP for shop spending
    xpThisEpisode: number               // NEW — resets each episode
  }
  inventory: string[]
  rewards: string[]
  flags: Record<string, boolean>
}
```

---

### TASK 3 — Update src/game/useGameEngine.ts

**3a. Add import:**
```typescript
import {
  type MathSkillLevel,
  type ReadingSkillLevel,
  selectForMathLevel,
  selectForReadingLevel,
  nextMathLevel,
  nextReadingLevel,
  MASTERY_THRESHOLD,
} from '../types/skillLevel'
```

**3b. Add constant near top of file:**
```typescript
const MASTERY_THRESHOLD = 3
```

**3c. Update defaultStats:**
```typescript
const defaultStats = {
  coins: 0,
  stars: 0,
  hearts: 3,
  xp: 0,
  xpThisEpisode: 0,
}
```

**3d. Update initial GameState in useState:**
```typescript
const [gameState, setGameState] = useState<GameState>({
  currentSceneId: initialSceneId,
  completedSceneIds: [],
  gradeBand: initialGradeBand,
  skillProfile: {               // NEW
    math: 'M1',                 // default starting level
    reading: 'R1',
  },
  consecutiveCorrect: 0,        // NEW
  stats: defaultStats,
  inventory: [],
  rewards: [],
  flags: {},
})
```

**3e. CRITICAL — Remove heart penalty on wrong answers.**
In `resolveEvent`, find and DELETE this block entirely:
```typescript
// DELETE THIS:
if (
  (event.type === 'combat' || event.type === 'riddle') &&
  result === 'fail'
) {
  nextState.stats.hearts = Math.max(0, nextState.stats.hearts - 1)
}
```

**3f. Add XP reward logic to resolveEvent.**
After the existing reward logic, add:
```typescript
// XP on success
if (result === 'success' && (event.type === 'combat' || event.type === 'riddle')) {
  const xpGain = nextState.consecutiveCorrect === 0 ? 15 : 8
  nextState.stats.xp += xpGain
  nextState.stats.xpThisEpisode += xpGain
  nextState.consecutiveCorrect += 1
}

// XP on choice (always awarded, any path)
if (event.type === 'choice') {
  nextState.stats.xp += 5
  nextState.stats.xpThisEpisode += 5
}

// Reset streak on wrong answer (no XP penalty, just reset)
if (result === 'fail') {
  nextState.consecutiveCorrect = 0
}
```

**3g. Add mastery advancement functions:**
```typescript
function advanceMathLevel() {
  setGameState(prev => {
    const next = nextMathLevel(prev.skillProfile.math)
    if (!next) return prev
    return {
      ...prev,
      skillProfile: { ...prev.skillProfile, math: next },
      consecutiveCorrect: 0,
    }
  })
}

function advanceReadingLevel() {
  setGameState(prev => {
    const next = nextReadingLevel(prev.skillProfile.reading)
    if (!next) return prev
    return {
      ...prev,
      skillProfile: { ...prev.skillProfile, reading: next },
      consecutiveCorrect: 0,
    }
  })
}

function setSkillProfile(profile: SkillProfile) {
  setGameState(prev => ({ ...prev, skillProfile: profile }))
}
```

**3h. Add helper to select challenge text at the right level:**
```typescript
function getMathPrompt(content: MathLevelText): string {
  return selectForMathLevel(content, gameState.skillProfile.math)
}

function getReadingPrompt(content: ReadingLevelText): string {
  return selectForReadingLevel(content, gameState.skillProfile.reading)
}
```

**3i. Add new functions to the return object:**
```typescript
return {
  // ...existing returns...
  advanceMathLevel,
  advanceReadingLevel,
  setSkillProfile,
  getMathPrompt,
  getReadingPrompt,
}
```

**3j. Call advancement check after correct answers.**
Inside `resolveEvent`, after incrementing `consecutiveCorrect`, add:
```typescript
if (nextState.consecutiveCorrect >= MASTERY_THRESHOLD) {
  // Will be picked up by the component via a useEffect watching consecutiveCorrect
  // OR call advanceMathLevel/advanceReadingLevel directly here
  // Simplest approach: set a flag
  nextState.flags['__readyToAdvanceMath'] = true
  nextState.consecutiveCorrect = 0
}
```

---

### TASK 4 — Add Episode 1 story file

Create `src/data/rootwoodEpisode1.ts`:

```typescript
// src/data/rootwoodEpisode1.ts
// Rootwood Academy — Episode 1: "The Door That Wasn't There"
// Narrator: Cobb
// Math standards: 1.OA.A.1 (add within 20), 1.OA.D.8 (missing number within 10)
// Reading standards: RF.1.3b (CVC), RF.1.3a (digraphs), RF.1.3c (blends)

import type { RootwoodScene } from '../types/game'

const img = (name: string) => `/scenes/rootwood/${name}.svg`

export const rootwoodEpisode1: RootwoodScene[] = [
  {
    id: 'rw1-arrival',
    text: [
      'Welcome to Rootwood Academy.',
      'It lives inside the biggest tree in the world.',
    ],
    image: { src: img('rootwood-gate'), alt: 'The great entrance of Rootwood Academy carved into an enormous glowing tree trunk' },
    nextSceneId: 'rw1-cobb-intro',
  },
  {
    id: 'rw1-cobb-intro',
    text: [
      'A small owl sits on a branch above the door.',
      '"Cobb," he says. "That is my name. Pay attention. Things happen fast here."',
    ],
    image: { src: img('cobb-perch'), alt: 'A small brown owl perched on a branch, one eye open, looking directly at the reader' },
    nextSceneId: 'rw1-door-appears',
  },
  {
    id: 'rw1-door-appears',
    text: [
      'You walk down the hall. The roots glow under your feet.',
      'Then you stop. There is a door. It was not here yesterday.',
    ],
    image: { src: img('mystery-door'), alt: 'A dark wooden door with glowing cracks around its edges set into the living wood of the tree hallway' },
    nextSceneId: 'rw1-cobb-notices',
  },
  {
    id: 'rw1-cobb-notices',
    text: [
      'Cobb lands on your shoulder. He is heavier than he looks.',
      '"Interesting," he says. "Doors do not just appear. Except when they do."',
    ],
    image: { src: img('door-glow'), alt: 'The mysterious door pulsing with soft gold light, Cobb perched on a shoulder in the foreground' },
    event: {
      type: 'riddle',
      promptByLevel: {
        R1: 'Cobb says the door was NOT here. What is odd about it?',
        R3: 'Cobb says doors do not just appear. What does he mean?',
        R6: 'Cobb says something unexpected. What does his reaction tell you?',
      },
      correctAnswerByLevel: {
        R1: 'It appeared out of nowhere',
        R3: 'Magic made it appear',
        R6: 'Strange things happen at Rootwood',
      },
      hintByLevel: {
        R1: 'Think about what Cobb said — the door was not here before.',
        R3: 'What kind of school makes doors appear from nowhere?',
        R6: 'What does it say about a school when its owl is not surprised?',
      },
      successSceneId: 'rw1-knot-puzzle',
      failureSceneId: 'rw1-cobb-notices',
      reward: {
        id: 'rw1-owl-feather',
        label: 'Owl Feather',
        description: 'Cobb dropped this. He says he did it on purpose. He did not.',
      },
    },
  },
  {
    id: 'rw1-knot-puzzle',
    text: [
      'The door has a knotted vine across it.',
      'Cobb squints. "Seven knots on the left. Six on the right. How many in all?"',
    ],
    image: { src: img('knot-puzzle'), alt: 'A thick vine twisted across the door with visible knotted bumps on each side' },
    event: {
      type: 'combat',
      enemyName: 'Knotted Door',
      promptByLevel: {
        M1: 'There are 3 knots on the left and 2 on the right. How many in all?',
        M2: 'There are 7 knots on the left and 6 on the right. How many in all?',
        M4: 'There are 7 knots on the left and 6 on the right. What is 7 + 6?',
        M5: 'There are 7 knots, then 6 more, then 2 fell off. How many knots are there now?',
      },
      correctAnswerByLevel: {
        M1: '5',
        M2: '13',
        M4: '13',
        M5: '11',
      },
      hintByLevel: {
        M1: 'Count 3, then count on 2 more.',
        M2: 'Start at 7 and count on 6 more.',
        M4: 'Try making a ten first: 7 + 3 = 10, then add 3 more.',
        M5: 'Add 7 + 6 first, then take away 2.',
      },
      options: [
        { id: 'knot-a', text: '11', value: '11', isCorrect: false },
        { id: 'knot-b', text: '12', value: '12', isCorrect: false },
        { id: 'knot-c', text: '13', value: '13', isCorrect: true },
      ],
      successSceneId: 'rw1-the-choice',
      failureSceneId: 'rw1-knot-puzzle',
      reward: {
        id: 'rw1-vine-knot',
        label: 'Vine Knot',
        description: 'A tiny knot from the door vine. It untied itself to say thank you.',
      },
    },
  },
  {
    id: 'rw1-the-choice',
    text: [
      'The knots fall away. The door hums.',
      '"Your move," says Cobb. "Knock, or listen first. I am not going to tell you which."',
    ],
    image: { src: img('door-glow'), alt: 'The door glowing brighter now with the vine gone' },
    event: {
      type: 'choice',
      prompt: 'What will you do?',
      options: [
        {
          id: 'choice-brave',
          text: 'Knock on the door',
          nextSceneId: 'rw1-brave-path',
          flagKey: 'choseBrave',
        },
        {
          id: 'choice-clever',
          text: 'Listen at the door first',
          nextSceneId: 'rw1-clever-path',
          flagKey: 'choseClever',
        },
      ],
    },
  },
  {
    id: 'rw1-brave-path',
    text: [
      'You knock. Three loud thumps. The hall goes quiet.',
      'Then — something knocks back. Once.',
    ],
    image: { src: img('brave-hall'), alt: 'A fist raised to knock on the glowing door' },
    nextSceneId: 'rw1-door-lock',
  },
  {
    id: 'rw1-clever-path',
    text: [
      'You press your ear to the wood. Something is moving in there.',
      '"Footsteps," whispers Cobb. "Small ones. Interesting."',
    ],
    image: { src: img('clever-hall'), alt: 'An ear pressed against the glowing door with small footprint shadows visible' },
    nextSceneId: 'rw1-door-lock',
  },
  {
    id: 'rw1-door-lock',
    text: [
      'Numbers glow on the door. There is one missing.',
      '"Fill in the blank," says Cobb. "And the door opens."',
    ],
    image: { src: img('door-glow'), alt: 'The door showing a glowing number puzzle with a blank space' },
    event: {
      type: 'riddle',
      promptByLevel: {
        M1: '5 take away something equals 3. What is missing?',
        M2: '10 take away something equals 3. What is the missing number?',
        M3: 'The door shows: 10 − ? = 3. What fills the blank?',
        M4: 'Solve: 10 − ? = 3',
      },
      correctAnswerByLevel: {
        M1: '2',
        M2: '7',
        M3: '7',
        M4: '7',
      },
      hintByLevel: {
        M1: 'Start at 5. Count back until you reach 3.',
        M2: 'Start at 10. Count back until you reach 3. How many steps?',
        M3: 'Think: what number plus 3 equals 10?',
        M4: 'Rearrange: 10 − 3 = ?',
      },
      successSceneId: 'rw1-door-opens',
      failureSceneId: 'rw1-door-lock',
      reward: {
        id: 'rw1-glowstone',
        label: 'Glowstone',
        description: 'A stone pried from the door. It is warm. It fits perfectly in your pocket.',
      },
    },
  },
  {
    id: 'rw1-door-opens',
    text: [
      'The door swings open. Inside is a small room full of floating lights.',
      'In the middle sits a tiny creature, no bigger than your hand, fast asleep.',
    ],
    image: { src: img('door-open'), alt: 'The door wide open revealing a cozy room with floating lights and a small sleeping creature' },
    event: {
      type: 'reward',
      prompt: 'You solved the mystery! You earn a Rootwood Star!',
      reward: {
        id: 'rw1-rootwood-star',
        label: 'Rootwood Star',
        description: 'Awarded for finishing Episode 1. It glows faintly, like it is proud of you.',
      },
      nextSceneId: 'rw1-cliffhanger',
    },
  },
  {
    id: 'rw1-cliffhanger',
    text: [
      'The creature opens one eye. It looks right at you.',
      '"You took long enough," it says.',
    ],
    image: { src: img('creature-wakes'), alt: 'The tiny creature sitting up with one eye open looking directly at the reader' },
    // No nextSceneId — episode end. Show XP tally + shop screen.
  },
]

export const rootwoodEpisode1Meta = {
  id: 'rootwood-ep1',
  title: 'The Door That Wasn\'t There',
  narrator: 'Cobb',
  estimatedMinutes: 12,
  mathStandards: ['1.OA.A.1', '1.OA.D.8'],
  readingStandards: ['RF.1.3b', 'RF.1.3a'],
  initialSceneId: 'rw1-arrival',
}
```

---

### TASK 5 — Add placeholder SVG scene images

Create the directory `public/scenes/rootwood/` and add a placeholder SVG for each
image referenced in Episode 1. Each placeholder should be a simple colored rectangle
with the scene name as text — just enough to see the game running.

Files needed:
- `rootwood-gate.svg`
- `cobb-perch.svg`
- `mystery-door.svg`
- `door-glow.svg`
- `knot-puzzle.svg`
- `brave-hall.svg`
- `clever-hall.svg`
- `door-open.svg`
- `creature-wakes.svg`

Simple placeholder template:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#2d1b4e"/>
  <text x="400" y="250" text-anchor="middle" fill="#a78bfa" font-size="24" font-family="sans-serif">
    [SCENE NAME]
  </text>
</svg>
```

---

### TASK 6 — Wire Episode 1 into App.tsx

In `src/App.tsx`, add the ability to load the Rootwood episode. Look at how the
existing stories are loaded and follow the same pattern. The episode should be
accessible and playable end-to-end with the existing AppShell component.

If AppShell needs updates to handle `RootwoodScene` vs `StoryScene`, make the minimum
changes needed — the goal is a working episode, not a full refactor.

---

## TYPE NOTES FOR CLAUDE CODE

The existing `StoryScene` uses `GradeText` (a Record of 3 grade bands) for challenge
prompts. The new `RootwoodScene` uses `MathLevelText` and `ReadingLevelText` (Partial
Records of 17 and 10 levels respectively). Both types should coexist.

The `selectForMathLevel` and `selectForReadingLevel` functions handle the
"pick closest level at or below" logic — do not reimplement this inline.

The existing combat event options in old stories use `textByGrade` (per option).
New Rootwood combat options use a single `text` string — simpler, since difficulty
is handled at the prompt level, not the option level.

---

## WHAT NOT TO CHANGE

- `src/data/story.ts` — leave as-is
- `src/data/crystalCave.ts` — leave as-is  
- `src/assets/scenes/index.ts` — only add to it, don't remove existing entries
- The existing `GradeBand` and `GradeText` types — keep for backward compat
- The existing `StoryScene` interface — keep it, just add `RootwoodScene` alongside it

---

## AFTER IMPLEMENTATION — VERIFY THESE

1. `tsc --noEmit` passes with no errors
2. `npm run dev` starts without console errors
3. Episode 1 plays through all 10 scenes in order
4. The brave path (knock) and clever path (listen) both route correctly to `rw1-door-lock`
5. Wrong answers on challenges show a hint and allow retry — no heart loss
6. Correct answers advance the scene and award XP
7. The reward scene fires correctly at `rw1-door-opens`
8. `rw1-cliffhanger` has no next scene (episode end state handled gracefully)

---

## FUTURE EPISODES (not in scope for this handoff — just for context)

Episode 2: "The Creature That Wouldn't Leave" — the sleeping creature needs help
getting home. Introduces odd/even numbers (M13) and two-syllable words (R6).

Episode 3: "The Library That Bit Back" — something in the restricted library section
is loose. Introduces place value (M6) and vowel teams (R5).

The shop UI component does not exist yet and is not in scope for this handoff.
It will be built in a future session once the episode engine is working.

---

## CONTACT / CONTINUATION

If anything is ambiguous, prioritize making the TypeScript compile cleanly and
Episode 1 playable over implementing every detail perfectly. A working foundation
is more valuable than a perfect incomplete one.

When this handoff is complete, return to claude.ai with:
- Confirmation that `tsc --noEmit` passes
- Any architectural decisions you had to make that deviated from this spec
- Screenshot or description of Episode 1 running in the browser
