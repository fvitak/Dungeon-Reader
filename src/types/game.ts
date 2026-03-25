import type {
  SkillProfile,
  MathLevelText,
  ReadingLevelText,
} from './skillLevel'

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

// ─── Rootwood scene and event types ───────────────────────────────────────
// All challenges are multiple choice. No free text input. Ever.
// Existing StoryScene and event types stay intact for backward compat.

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
// ALL answer selection is done by tapping one of 3 options.
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
  text: string        // plain text — shown at all skill levels
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
