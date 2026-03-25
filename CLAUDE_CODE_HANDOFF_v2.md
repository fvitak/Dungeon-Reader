# Dungeon Reader — Claude Code Handoff v2
# From: Claude (claude.ai design session)
# Supersedes: CLAUDE_CODE_HANDOFF.md (v1)
# Key changes from v1:
#   - ALL challenges are multiple choice — no free text input anywhere
#   - 'combat' and 'riddle' event types merged into single 'challenge' type
#   - Episode 1 scenes fully updated to reflect this
#   - New rule: keyboard should never appear during story play

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
**Setting:** A school for young magic-makers hidden inside the world's oldest enchanted
tree. The tree is so vast its branches hold entire classrooms, its roots are corridors,
and its heartwood is the Grand Hall. Students travel between floors by riding Liftvines.

**Narrator:** Cobb — an ancient owl of truly unreasonable age. Dry, funny, trusts the
reader completely. Short declarative sentences. Dry wit lands in the second sentence,
never the first. Refers to himself in third person sparingly. Never mean. Never explains
things the reader can figure out themselves.

**Sample Cobb lines:**
- "You have been here one morning. Already something is wrong. Typical."
- "Cobb blinked once. Twice. 'Seven,' he said. 'The answer is seven. Also — run.'"
- "Interesting. Doors do not just appear. Except when they do."

**The shop:** "The Twig & Toadstool" — kids spend XP on collectibles (owl feathers,
spell scrolls, glowstones, seedling sprites, mooncloaks). Every item has a one-line
Cobb-voice description. The shop is part of the world, not a separate game layer.

**Tree floors:**
- Root level: The Underbranch — storage, Creature Cellar, Lost & Found
- Ground: The Grand Hall — meals, assemblies, fireflies for lights
- First branch: Classrooms — Spellcraft, Creature Care, Plant Magic, Numbers & Notions
- Second branch: The Library Canopy
- Third branch: Student rooms
- Top: Cobb's perch — one wide branch, open sky

---

## CURRICULUM ALIGNMENT

Maryland MCCR Standards (Common Core aligned).

### Math progression (17 levels, M1–M17)

| Level | Skill | Standard | Grade typical |
|-------|-------|----------|---------------|
| M1  | Count, add, subtract within 5 | 1.OA.A.1 (≤5) | G1 start |
| M2  | Add/subtract within 10, result unknown | 1.OA.A.1 (≤10) | G1 early |
| M3  | Add/subtract within 10, unknown all positions | 1.OA.D.8 | G1 early |
| M4  | Add/subtract within 20, result unknown | 1.OA.A.1 (≤20) | G1 mid |
| M5  | Make a ten; three addends ≤ 20 | 1.OA.A.2 | G1 mid |
| M6  | Place value: tens and ones, count to 120 | 1.NBT.B.2 | G1 mid |
| M7  | Compare two-digit numbers; add/sub multiples of 10 | 1.NBT.B.3 | G1 late |
| M8  | Tell time: hour and half-hour | 1.MD.B.3 | G1 late |
| M9  | Measure length by iterating units | 1.MD.A.2 | G1 late |
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
| R1  | CVC words + Dolch Pre-Primer sight words | RF.1.3b | G1 start |
| R2  | CVC + consonant blends (bl, cr, st, tr) | RF.1.3c | G1 early |
| R3  | Consonant digraphs (ch, sh, th, wh) | RF.1.3a | G1 early |
| R4  | Long vowel silent-e (CVCe) | RF.1.3c | G1 mid |
| R5  | Vowel teams (ai, ay, ee, ea, oa, ow) | RF.2.3b | G1 mid |
| R6  | Two-syllable words; -s, -ed, -ing suffixes | RF.1.3e-f | G1 late |
| R7  | R-controlled vowels; igh, ew | RF.2.3b | G2 early |
| R8  | Common prefixes un-, re-; suffixes -ful, -less | RF.2.3d | G2 mid |
| R9  | Diphthongs oi/oy, ou/ow; silent letters kn, wr | RF.2.3b | G2 mid |
| R10 | Multi-syllabic words; fluency at grade rate | RF.2.4 | G2 late |

---

## CORE DESIGN DECISIONS — DO NOT CHANGE THESE

1. **No free text input anywhere in the game. Ever.**
   A keyboard must never appear during story play. All challenges are multiple choice
   with tappable options. This is non-negotiable — typed answers are a friction and
   focus killer for early readers, ADHD, and dyslexic kids. Even math answers are
   selected from options, not typed.

2. **No hearts lost on wrong answers.**
   Wrong answer = hint shown + retry with no penalty. The heart system may be
   removed entirely from the Rootwood content or repurposed as a visual element only.

3. **Math and reading levels are tracked independently.**
   A kid can be M4 in math and R2 in reading. Stored as a SkillProfile object.

4. **Auto-advancement after 3 consecutive correct first-attempt answers.**
   Configurable via MASTERY_THRESHOLD = 3. Reset counter on wrong answer.

5. **Closest-level-at-or-below content matching.**
   Challenge authors write prompts for 2–3 levels. Engine picks the highest variant
   at or below the player's current level.

6. **XP values:**
   Easy challenge first try = +5 XP, big challenge first try = +15 XP,
   retry after hint = +8 XP, choice made = +5 XP. No XP lost ever.

7. **Episode structure (8–12 pages, 10–15 min):**
   Pages 1–2: Hook, no challenge
   Pages 3–4: Stakes, first easy challenge (3 options)
   Pages 5–6: Choice moment (2 paths, rejoin after 1 page)
   Pages 7–8: Big challenge (3 options)
   Page 9: Resolution + reward
   Page 10: Cliffhanger
   End screen: XP tally → shop

---

## IMPLEMENTATION TASKS

### TASK 1 — Add src/types/skillLevel.ts

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
  M1:  { level: 'M1',  label: 'Count & add within 5',       gradeTypical: 'Grade 1, start',  standard: '1.OA.A.1 (≤5)'  },
  M2:  { level: 'M2',  label: 'Add & subtract within 10',   gradeTypical: 'Grade 1, early',  standard: '1.OA.A.1 (≤10)' },
  M3:  { level: 'M3',  label: 'Missing number within 10',   gradeTypical: 'Grade 1, early',  standard: '1.OA.D.8'       },
  M4:  { level: 'M4',  label: 'Add & subtract within 20',   gradeTypical: 'Grade 1, mid',    standard: '1.OA.A.1 (≤20)' },
  M5:  { level: 'M5',  label: 'Make a ten; three addends',  gradeTypical: 'Grade 1, mid',    standard: '1.OA.A.2'       },
  M6:  { level: 'M6',  label: 'Tens and ones to 120',       gradeTypical: 'Grade 1, mid',    standard: '1.NBT.B.2'      },
  M7:  { level: 'M7',  label: 'Compare & add two-digit',    gradeTypical: 'Grade 1, late',   standard: '1.NBT.B.3'      },
  M8:  { level: 'M8',  label: 'Time: hour & half-hour',     gradeTypical: 'Grade 1, late',   standard: '1.MD.B.3'       },
  M9:  { level: 'M9',  label: 'Measure & compare lengths',  gradeTypical: 'Grade 1, late',   standard: '1.MD.A.2'       },
  M10: { level: 'M10', label: 'Fluency within 20',          gradeTypical: 'Grade 2, start',  standard: '2.OA.B.2'       },
  M11: { level: 'M11', label: 'Add & subtract within 100',  gradeTypical: 'Grade 2, early',  standard: '2.NBT.B.5'      },
  M12: { level: 'M12', label: 'Two-step problems to 100',   gradeTypical: 'Grade 2, mid',    standard: '2.OA.A.1'       },
  M13: { level: 'M13', label: 'Odd, even & arrays',         gradeTypical: 'Grade 2, mid',    standard: '2.OA.C.3'       },
  M14: { level: 'M14', label: 'Place value to 1000',        gradeTypical: 'Grade 2, mid',    standard: '2.NBT.A.1'      },
  M15: { level: 'M15', label: 'Add & subtract within 1000', gradeTypical: 'Grade 2, late',   standard: '2.NBT.B.7'      },
  M16: { level: 'M16', label: 'Time to 5 minutes',          gradeTypical: 'Grade 2, late',   standard: '2.MD.C.7'       },
  M17: { level: 'M17', label: 'Measure in inches & cm',     gradeTypical: 'Grade 2, late',   standard: '2.MD.A.1'       },
}

export const READING_LEVEL_META: Record<ReadingSkillLevel, SkillLevelMeta> = {
  R1:  { level: 'R1',  label: 'CVC + pre-primer words',      gradeTypical: 'Grade 1, start',  standard: 'RF.1.3b'   },
  R2:  { level: 'R2',  label: 'Blends + primer sight words', gradeTypical: 'Grade 1, early',  standard: 'RF.1.3c'   },
  R3:  { level: 'R3',  label: 'Digraphs (ch, sh, th)',       gradeTypical: 'Grade 1, early',  standard: 'RF.1.3a'   },
  R4:  { level: 'R4',  label: 'Silent-e long vowels',        gradeTypical: 'Grade 1, mid',    standard: 'RF.1.3c'   },
  R5:  { level: 'R5',  label: 'Vowel teams (ai, ee, oa)',    gradeTypical: 'Grade 1, mid',    standard: 'RF.2.3b'   },
  R6:  { level: 'R6',  label: 'Two-syllable + suffixes',     gradeTypical: 'Grade 1, late',   standard: 'RF.1.3e-f' },
  R7:  { level: 'R7',  label: 'R-controlled vowels + igh',   gradeTypical: 'Grade 2, early',  standard: 'RF.2.3b'   },
  R8:  { level: 'R8',  label: 'Prefixes & suffixes',         gradeTypical: 'Grade 2, mid',    standard: 'RF.2.3d'   },
  R9:  { level: 'R9',  label: 'Diphthongs + silent letters', gradeTypical: 'Grade 2, mid',    standard: 'RF.2.3b'   },
  R10: { level: 'R10', label: 'Multi-syllabic + fluency',    gradeTypical: 'Grade 2, late',   standard: 'RF.2.4'    },
}

export type MathLevelText    = Partial<Record<MathSkillLevel, string>>
export type ReadingLevelText = Partial<Record<ReadingSkillLevel, string>>
export type SkillLevelText   = MathLevelText | ReadingLevelText

export const MASTERY_THRESHOLD = 3

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

export function mathLevelAtLeast(
  player: MathSkillLevel,
  required: MathSkillLevel
): boolean {
  return MATH_ORDER.indexOf(player) >= MATH_ORDER.indexOf(required)
}

export function readingLevelAtLeast(
  player: ReadingSkillLevel,
  required: ReadingSkillLevel
): boolean {
  return READING_ORDER.indexOf(player) >= READING_ORDER.indexOf(required)
}

export function nextMathLevel(current: MathSkillLevel): MathSkillLevel | null {
  const idx = MATH_ORDER.indexOf(current)
  return idx < MATH_ORDER.length - 1 ? MATH_ORDER[idx + 1] : null
}

export function nextReadingLevel(
  current: ReadingSkillLevel
): ReadingSkillLevel | null {
  const idx = READING_ORDER.indexOf(current)
  return idx < READING_ORDER.length - 1 ? READING_ORDER[idx + 1] : null
}
```

---

### TASK 2 — Update src/types/game.ts

Add import at top:
```typescript
import type {
  SkillProfile,
  MathLevelText,
  ReadingLevelText,
  MathSkillLevel,
  ReadingSkillLevel,
} from './skillLevel'
```

Add these new types alongside the existing ones. Do NOT remove existing types —
crystalCave.ts and story.ts still use them.

```typescript
// ─── Rootwood scene and event types ───────────────────────────────────────
// All challenges are multiple choice. No free text input. Ever.

export interface RootwoodScene {
  id: string
  text: [string] | [string, string] | [string, string, string]
  image: { src: string; alt: string }
  event?: RootwoodEvent
  nextSceneId?: string
}

export type RootwoodEvent =
  | RootwoodChallengeEvent   // replaces both 'combat' and 'riddle' — always multiple choice
  | RootwoodChoiceEvent
  | RootwoodRewardEvent

// Single challenge type — no distinction between combat/riddle.
// ALL answer selection is done by tapping one of 2–4 options.
// The keyboard must never appear.
export interface RootwoodChallengeEvent {
  type: 'challenge'
  skillType: 'math' | 'reading'
  promptByLevel: MathLevelText | ReadingLevelText
  hintByLevel:   MathLevelText | ReadingLevelText
  options: RootwoodChallengeOption[]  // 3 options always — one isCorrect: true
  successSceneId: string
  failureSceneId: string              // always same scene = retry
  reward?: RootwoodReward
}

export interface RootwoodChallengeOption {
  id: string
  text: string        // always plain text — shown at all skill levels
  isCorrect: boolean
}

export interface RootwoodChoiceEvent {
  type: 'choice'
  prompt: string
  options: RootwoodChoiceOption[]   // 2 options — both valid, both earn XP
}

export interface RootwoodChoiceOption {
  id: string
  text: string
  nextSceneId: string
  flagKey?: string
}

export interface RootwoodRewardEvent {
  type: 'reward'
  prompt: string
  reward: RootwoodReward
  nextSceneId?: string
}

export interface RootwoodReward {
  id: string
  label: string
  description: string   // written in Cobb's voice
}

// ─── Updated GameState ────────────────────────────────────────────────────
// Add skillProfile, consecutiveCorrect, and xp fields.
// Keep gradeBand for backward compat with old scenes.

export interface GameState {
  currentSceneId: string
  completedSceneIds: string[]
  gradeBand: GradeBand                  // keep — used by crystalCave + story.ts
  skillProfile: SkillProfile            // NEW — used by all Rootwood content
  consecutiveCorrect: number            // NEW — mastery tracking
  stats: {
    coins: number
    stars: number
    hearts: number
    xp: number                          // NEW — total lifetime XP
    xpThisEpisode: number               // NEW — resets each episode
  }
  inventory: string[]
  rewards: string[]
  flags: Record<string, boolean>
}
```

---

### TASK 3 — Update src/game/useGameEngine.ts

**3a. Add imports:**
```typescript
import {
  MASTERY_THRESHOLD,
  nextMathLevel,
  nextReadingLevel,
  selectForMathLevel,
  selectForReadingLevel,
  type MathLevelText,
  type ReadingLevelText,
  type SkillProfile,
} from '../types/skillLevel'
import type { RootwoodChallengeEvent, RootwoodChoiceEvent } from '../types/game'
```

**3b. Update defaultStats:**
```typescript
const defaultStats = {
  coins: 0,
  stars: 0,
  hearts: 3,
  xp: 0,
  xpThisEpisode: 0,
}
```

**3c. Update initial state in useState:**
```typescript
{
  currentSceneId: initialSceneId,
  completedSceneIds: [],
  gradeBand: initialGradeBand,
  skillProfile: { math: 'M1', reading: 'R1' },  // NEW
  consecutiveCorrect: 0,                          // NEW
  stats: defaultStats,
  inventory: [],
  rewards: [],
  flags: {},
}
```

**3d. REMOVE heart penalty on wrong answers.**
Delete this block entirely from resolveEvent:
```typescript
// DELETE THIS BLOCK:
if (
  (event.type === 'combat' || event.type === 'riddle') &&
  result === 'fail'
) {
  nextState.stats.hearts = Math.max(0, nextState.stats.hearts - 1)
}
```

**3e. Add XP logic to resolveEvent.**
Add after existing reward logic:
```typescript
if (result === 'success' && event.type !== 'reward') {
  const isFirstAttempt = nextState.consecutiveCorrect === 0
  const xpGain = isFirstAttempt ? 15 : 8
  nextState.stats.xp += xpGain
  nextState.stats.xpThisEpisode += xpGain
  nextState.consecutiveCorrect += 1
}

if (event.type === 'choice') {
  nextState.stats.xp += 5
  nextState.stats.xpThisEpisode += 5
}

if (result === 'fail') {
  nextState.consecutiveCorrect = 0
}

// Auto-advance skill level after mastery threshold
if (nextState.consecutiveCorrect >= MASTERY_THRESHOLD) {
  nextState.consecutiveCorrect = 0
  nextState.flags['__readyToAdvance'] = true
}
```

**3f. Add new functions:**
```typescript
function setSkillProfile(profile: SkillProfile) {
  setGameState(prev => ({ ...prev, skillProfile: profile }))
}

function getMathPrompt(content: MathLevelText): string {
  return selectForMathLevel(content, gameState.skillProfile.math)
}

function getReadingPrompt(content: ReadingLevelText): string {
  return selectForReadingLevel(content, gameState.skillProfile.reading)
}

function advanceMathLevel() {
  setGameState(prev => {
    const next = nextMathLevel(prev.skillProfile.math)
    if (!next) return prev
    return { ...prev, skillProfile: { ...prev.skillProfile, math: next }, consecutiveCorrect: 0 }
  })
}

function advanceReadingLevel() {
  setGameState(prev => {
    const next = nextReadingLevel(prev.skillProfile.reading)
    if (!next) return prev
    return { ...prev, skillProfile: { ...prev.skillProfile, reading: next }, consecutiveCorrect: 0 }
  })
}
```

**3g. Add to return object:**
```typescript
return {
  // ...all existing returns...
  setSkillProfile,
  getMathPrompt,
  getReadingPrompt,
  advanceMathLevel,
  advanceReadingLevel,
}
```

---

### TASK 4 — Create src/data/rootwoodEpisode1.ts

Full file — all challenges are multiple choice with 3 tappable options.
No free text. No keyboard. Reading comprehension uses 'challenge' type just
like math does.

```typescript
// src/data/rootwoodEpisode1.ts
// Rootwood Academy — Episode 1: "The Door That Wasn't There"
// Narrator: Cobb
// Math standards: 1.OA.A.1 (add within 20), 1.OA.D.8 (missing number)
// Reading standards: RF.1.3b, RF.1.3a — story comprehension, multiple choice only

import type { RootwoodScene } from '../types/game'

const img = (name: string) => `/scenes/rootwood/${name}.png`

export const rootwoodEpisode1: RootwoodScene[] = [

  // PAGE 1 — hook, no challenge
  {
    id: 'rw1-arrival',
    text: [
      'Welcome to Rootwood Academy.',
      'It lives inside the biggest tree in the world.',
    ],
    image: {
      src: img('rootwood-gate'),
      alt: 'The grand entrance of Rootwood Academy carved into an enormous glowing tree',
    },
    nextSceneId: 'rw1-cobb-intro',
  },

  // PAGE 2 — Cobb intro, no challenge
  {
    id: 'rw1-cobb-intro',
    text: [
      'A small owl sits on a branch above the door.',
      '"Cobb," he says. "That is my name. Pay attention. Things happen fast here."',
    ],
    image: {
      src: img('cobb-perch'),
      alt: 'A small ancient owl perched on a branch looking directly at the reader',
    },
    nextSceneId: 'rw1-door-appears',
  },

  // PAGE 3 — mystery introduced, no challenge
  {
    id: 'rw1-door-appears',
    text: [
      'You walk down the hall. The roots glow under your feet.',
      'Then you stop. There is a door. It was not here yesterday.',
    ],
    image: {
      src: img('mystery-door'),
      alt: 'A dark wooden door with glowing cracks set into the living wood of the tree hallway',
    },
    nextSceneId: 'rw1-cobb-notices',
  },

  // PAGE 4 — first easy challenge (reading comprehension, multiple choice)
  // Skill: reading comprehension / recall  Standard: RL.1.1
  {
    id: 'rw1-cobb-notices',
    text: [
      'Cobb lands on your shoulder. He is heavier than he looks.',
      '"Interesting," he says. "Doors do not just appear. Except when they do."',
    ],
    image: {
      src: img('door-glow'),
      alt: 'The mysterious door pulsing with soft gold light, Cobb perched on a shoulder',
    },
    event: {
      type: 'challenge',
      skillType: 'reading',
      promptByLevel: {
        R1: 'Cobb said the door was NOT here before. What is strange about it?',
        R3: 'Cobb says doors do not just appear. What made this door show up?',
        R6: 'Cobb is not surprised. What does that tell you about Rootwood?',
      },
      hintByLevel: {
        R1: 'Think about what Cobb just told you — was this door always here?',
        R3: 'This is a magic school. What could make a door appear?',
        R6: 'If an owl who has lived here 400 years is not shocked, what kind of place must this be?',
      },
      options: [
        { id: 'opt-a', text: 'It appeared out of nowhere',  isCorrect: true  },
        { id: 'opt-b', text: 'It is very small',            isCorrect: false },
        { id: 'opt-c', text: 'It is the wrong color',       isCorrect: false },
      ],
      successSceneId: 'rw1-knot-puzzle',
      failureSceneId: 'rw1-cobb-notices',
      reward: {
        id: 'rw1-owl-feather',
        label: 'Owl Feather',
        description: 'Cobb dropped this. He says he did it on purpose. He did not.',
      },
    },
  },

  // PAGE 5 — big math challenge (addition, multiple choice)
  // Math standard: 1.OA.A.1 — add within 20
  {
    id: 'rw1-knot-puzzle',
    text: [
      'The door has a knotted vine across it.',
      'Cobb squints. "Seven knots on the left. Six on the right. How many in all?"',
    ],
    image: {
      src: img('knot-puzzle'),
      alt: 'A thick vine twisted across the door with visible knotted bumps on each side',
    },
    event: {
      type: 'challenge',
      skillType: 'math',
      promptByLevel: {
        M1: 'There are 3 knots on the left and 2 on the right. How many knots in all?',
        M2: 'There are 7 knots on the left and 6 on the right. How many knots in all?',
        M4: 'What is 7 + 6?',
        M5: 'There are 7 knots, then 6 more, then 2 fall off. How many are left?',
      },
      hintByLevel: {
        M1: 'Count all the knots together: 1, 2, 3 ... keep going!',
        M2: 'Start at 7 and count on 6 more fingers.',
        M4: 'Try making a ten first: 7 + 3 = 10, then add 3 more.',
        M5: 'First add 7 + 6. Then take away 2.',
      },
      options: [
        { id: 'knot-a', text: '11', isCorrect: false },
        { id: 'knot-b', text: '12', isCorrect: false },
        { id: 'knot-c', text: '13', isCorrect: true  },
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

  // PAGE 6 — choice moment (both paths valid, both earn XP)
  {
    id: 'rw1-the-choice',
    text: [
      'The knots fall away. The door hums.',
      '"Your move," says Cobb. "Knock, or listen first. I am not going to tell you which."',
    ],
    image: {
      src: img('door-glow'),
      alt: 'The door glowing brighter now with the vine knots gone',
    },
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

  // PAGE 7A — brave path (routes to rw1-door-lock)
  {
    id: 'rw1-brave-path',
    text: [
      'You knock. Three loud thumps. The hall goes quiet.',
      'Then — something knocks back. Once.',
    ],
    image: {
      src: img('brave-hall'),
      alt: 'A fist raised knocking on the glowing door with sound waves rippling outward',
    },
    nextSceneId: 'rw1-door-lock',
  },

  // PAGE 7B — clever path (routes to rw1-door-lock)
  {
    id: 'rw1-clever-path',
    text: [
      'You press your ear to the wood. Something is moving in there.',
      '"Footsteps," whispers Cobb. "Small ones. Interesting."',
    ],
    image: {
      src: img('clever-hall'),
      alt: 'An ear pressed against the glowing door with faint footprint shadows visible inside',
    },
    nextSceneId: 'rw1-door-lock',
  },

  // PAGE 8 — big challenge (subtraction / missing number, multiple choice)
  // Math standard: 1.OA.D.8 — find the unknown in an equation
  {
    id: 'rw1-door-lock',
    text: [
      'Numbers glow on the door. There is one missing.',
      '"Fill in the blank," says Cobb. "And the door opens."',
    ],
    image: {
      src: img('door-glow'),
      alt: 'The door showing a glowing number puzzle with a blank space pulsing with light',
    },
    event: {
      type: 'challenge',
      skillType: 'math',
      promptByLevel: {
        M1: '5 take away something equals 3. Pick the missing number.',
        M2: '10 take away something equals 3. What is the missing number?',
        M3: 'The door shows: 10 − ? = 3. What fills the blank?',
        M4: 'Solve: 10 − ? = 3',
      },
      hintByLevel: {
        M1: 'Start at 5. Count back until you reach 3. How many steps was that?',
        M2: 'Start at 10. Count back until you reach 3.',
        M3: 'Think: what number added to 3 makes 10?',
        M4: 'Rearrange it: 10 − 3 = ?',
      },
      options: [
        { id: 'lock-a', text: '5', isCorrect: false },
        { id: 'lock-b', text: '6', isCorrect: false },
        { id: 'lock-c', text: '7', isCorrect: true  },
      ],
      successSceneId: 'rw1-door-opens',
      failureSceneId: 'rw1-door-lock',
      reward: {
        id: 'rw1-glowstone',
        label: 'Glowstone',
        description: 'A stone pried from the door. It is warm. It fits perfectly in your pocket.',
      },
    },
  },

  // PAGE 9 — resolution + reward
  {
    id: 'rw1-door-opens',
    text: [
      'The door swings open. Inside is a small room full of floating lights.',
      'In the middle sits a tiny creature, no bigger than your hand, fast asleep.',
    ],
    image: {
      src: img('door-open'),
      alt: 'The door wide open revealing a cozy glowing room with a tiny sleeping creature inside',
    },
    event: {
      type: 'reward',
      prompt: 'You solved the mystery of the door. A Rootwood Star is yours!',
      reward: {
        id: 'rw1-rootwood-star',
        label: 'Rootwood Star',
        description: 'Awarded for finishing Episode 1. It glows faintly, like it is proud of you.',
      },
      nextSceneId: 'rw1-cliffhanger',
    },
  },

  // PAGE 10 — cliffhanger, episode end
  {
    id: 'rw1-cliffhanger',
    text: [
      'The creature opens one eye. It looks right at you.',
      '"You took long enough," it says.',
    ],
    image: {
      src: img('creature-wakes'),
      alt: 'The tiny creature sitting up with one eye open looking directly at the reader',
    },
    // No nextSceneId — end of episode. App shows XP tally + shop screen.
  },

]

export const rootwoodEpisode1Meta = {
  id: 'rootwood-ep1',
  title: "The Door That Wasn't There",
  narrator: 'Cobb',
  estimatedMinutes: 12,
  mathStandards: ['1.OA.A.1', '1.OA.D.8'],
  readingStandards: ['RF.1.3b', 'RF.1.3a', 'RL.1.1'],
  initialSceneId: 'rw1-arrival',
}
```

---

### TASK 5 — Placeholder SVGs

Create `public/scenes/rootwood/` and add one placeholder SVG per scene.
Use this template, changing the label for each:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#2d1b4e"/>
  <text x="400" y="250" text-anchor="middle" fill="#a78bfa"
    font-size="24" font-family="sans-serif">[SCENE NAME]</text>
</svg>
```

Files needed (all .png paths, but SVG content is fine for placeholders):
- rootwood-gate.png
- cobb-perch.png
- mystery-door.png
- door-glow.png       ← used for 4 scenes, one file
- knot-puzzle.png
- brave-hall.png
- clever-hall.png
- door-open.png
- creature-wakes.png

---

### TASK 6 — Wire into App.tsx

Load rootwoodEpisode1 using the same pattern as existing episodes.
Episode should be playable end-to-end with the existing AppShell.
Make minimum changes to AppShell to handle RootwoodScene / RootwoodEvent types.
A working episode matters more than a perfect refactor.

---

## WHAT NOT TO TOUCH

- src/data/story.ts — leave as-is
- src/data/crystalCave.ts — leave as-is
- src/assets/scenes/index.ts — only add, never remove
- Existing GradeBand, GradeText, StoryScene types — keep for backward compat

---

## VERIFICATION CHECKLIST

1. `tsc --noEmit` passes with zero errors
2. `npm run dev` starts with no console errors
3. All 10 scenes play through in order
4. Brave path (knock) and clever path (listen) both route to rw1-door-lock
5. Wrong answers show hint + allow retry — no hearts lost, no keyboard appears
6. Correct answers advance the scene and show XP gained
7. Reward fires at rw1-door-opens
8. rw1-cliffhanger has no next scene and is handled gracefully (episode end state)
9. At no point does a text input or keyboard appear on screen

---

## RETURN TO claude.ai WHEN DONE

Bring back:
- Confirmation tsc passes
- Any deviations from this spec and why
- Description or screenshot of Episode 1 running
