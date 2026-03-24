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
  stats: {
    coins: number
    stars: number
    hearts: number
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
