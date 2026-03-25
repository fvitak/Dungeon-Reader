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

export type MathLevelText    = Partial<Record<MathSkillLevel, string>>
export type ReadingLevelText = Partial<Record<ReadingSkillLevel, string>>
export type SkillLevelText   = MathLevelText | ReadingLevelText

// Exported so useGameEngine can import it
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
