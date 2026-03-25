import type { SkillProfile, MathSkillLevel, ReadingSkillLevel, MathLevelText, ReadingLevelText } from './skillLevel'

export type GradeBand = '1-2' | '3-4' | '5'

export type GradeText = Record<GradeBand, string>

export type GameEvent =
  | CombatEvent
  | RiddleEvent
  | ChoiceEvent
  | RewardEvent

export interface StoryScene {
  id: string
  gradeBand: GradeBand
  text: [string] | [string, string] | [string, string, string]
  image: {
    src: string
    alt: string
  }
  event?: GameEvent
  nextSceneId?: string
}

export interface GameState {
  currentSceneId: string
  completedSceneIds: string[]
  gradeBand: GradeBand
  skillProfile: SkillProfile
  consecutiveCorrect: number
  stats: {
    coins: number
    stars: number
    hearts: number
    xp: number
    xpThisEpisode: number
  }
  inventory: string[]
  rewards: string[]
  flags: Record<string, boolean>
}

export interface CombatEvent {
  type: 'combat'
  enemyName: string
  promptByGrade: GradeText
  correctAnswerByGrade: GradeText
  options: EventOption[]
  successSceneId: string
  failureSceneId?: string
  reward?: RewardEvent['reward']
}

export interface RiddleEvent {
  type: 'riddle'
  promptByGrade: GradeText
  correctAnswerByGrade: GradeText
  hintByGrade?: GradeText
  successSceneId: string
  failureSceneId?: string
  reward?: RewardEvent['reward']
}

export interface ChoiceEvent {
  type: 'choice'
  promptByGrade: GradeText
  options: ChoiceOption[]
}

export interface RewardEvent {
  type: 'reward'
  promptByGrade: GradeText
  reward: {
    id: string
    label: string
    description?: string
  }
  nextSceneId?: string
}

export interface EventOption {
  id: string
  textByGrade: GradeText
  value: string
  isCorrect: boolean
}

export interface ChoiceOption {
  id: string
  textByGrade: GradeText
  nextSceneId: string
  flagKey?: string
}

// ---------------------------------------------------------------------------
// Rootwood scene and event types — skill-level-aware content
// Existing StoryScene stays intact for backward compatibility with story.ts
// ---------------------------------------------------------------------------

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
