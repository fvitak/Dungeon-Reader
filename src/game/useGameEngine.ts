import { useMemo, useState } from 'react'
import type {
  CombatEvent,
  GradeBand,
  RiddleEvent,
  StoryScene,
  RootwoodScene,
  GameEvent,
  GameState,
} from '../types/game'
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

interface UseGameEngineOptions {
  scenes: StoryScene[] | RootwoodScene[]
  initialSceneId: string
  initialGradeBand?: GradeBand
  /** If provided, restore this full state on mount (save/load) */
  initialState?: GameState
}

const defaultStats = {
  coins: 0,
  stars: 0,
  hearts: 3,
  xp: 0,
  xpThisEpisode: 0,
}

export function createInitialGameState(
  initialSceneId: string,
  initialGradeBand: GradeBand = '3-4',
): GameState {
  return {
    currentSceneId: initialSceneId,
    completedSceneIds: [],
    gradeBand: initialGradeBand,
    skillProfile: { math: 'M1', reading: 'R1' },
    consecutiveCorrect: 0,
    stats: { ...defaultStats },
    inventory: [],
    rewards: [],
    flags: {},
  }
}

export function useGameEngine({
  scenes,
  initialSceneId,
  initialGradeBand = '3-4',
  initialState,
}: UseGameEngineOptions) {
  const [gameState, setGameState] = useState<GameState>(
    initialState ?? createInitialGameState(initialSceneId, initialGradeBand)
  )

  const currentScene = useMemo(
    () => (scenes as Array<{ id: string }>).find((scene) => scene.id === gameState.currentSceneId),
    [gameState.currentSceneId, scenes],
  )

  function setGradeBand(gradeBand: GradeBand) {
    setGameState((prevState) => ({
      ...prevState,
      gradeBand,
    }))
  }

  function moveToScene(nextSceneId: string) {
    setGameState((prevState) => ({
      ...prevState,
      currentSceneId: nextSceneId,
      completedSceneIds: prevState.completedSceneIds.includes(prevState.currentSceneId)
        ? prevState.completedSceneIds
        : [...prevState.completedSceneIds, prevState.currentSceneId],
    }))
  }

  function moveToNextScene() {
    const scene = currentScene as { nextSceneId?: string } | undefined
    if (scene?.nextSceneId) {
      moveToScene(scene.nextSceneId)
    }
  }

  function chooseOption(nextSceneId: string, flagKey?: string) {
    setGameState((prevState) => ({
      ...prevState,
      currentSceneId: nextSceneId,
      completedSceneIds: prevState.completedSceneIds.includes(prevState.currentSceneId)
        ? prevState.completedSceneIds
        : [...prevState.completedSceneIds, prevState.currentSceneId],
      flags: flagKey
        ? { ...prevState.flags, [flagKey]: true }
        : prevState.flags,
      stats: {
        ...prevState.stats,
        xp: prevState.stats.xp + 5,
        xpThisEpisode: prevState.stats.xpThisEpisode + 5,
      },
    }))
  }

  function rewardChallengeSuccess(event: CombatEvent | RiddleEvent) {
    setGameState((prevState) => {
      const alreadyRewarded = event.reward
        ? prevState.rewards.includes(event.reward.label)
        : false

      return {
        ...prevState,
        stats: {
          ...prevState.stats,
          coins: prevState.stats.coins + 2,
          stars: prevState.stats.stars + 1,
        },
        rewards:
          event.reward && !alreadyRewarded
            ? [...prevState.rewards, event.reward.label]
            : prevState.rewards,
      }
    })
  }

  function resolveEvent(event: GameEvent, result: 'success' | 'fail') {
    setGameState((prevState) => {
      const nextState: GameState = {
        ...prevState,
        stats: { ...prevState.stats },
        inventory: [...prevState.inventory],
        rewards: [...prevState.rewards],
        flags: { ...prevState.flags },
      }

      if (event.type === 'reward') {
        nextState.rewards.push(event.reward.label)
        nextState.stats.coins += 2
      }

      if (
        (event.type === 'combat' || event.type === 'riddle') &&
        result === 'success' &&
        event.reward
      ) {
        nextState.rewards.push(event.reward.label)
        nextState.stats.coins += 1
        nextState.stats.stars += 1
      }

      // XP on success (challenge or old combat/riddle)
      if (result === 'success' && event.type !== 'reward') {
        const isFirstAttempt = nextState.consecutiveCorrect === 0
        const xpGain = isFirstAttempt ? 15 : 8
        nextState.stats.xp += xpGain
        nextState.stats.xpThisEpisode += xpGain
        nextState.consecutiveCorrect += 1
      }

      // Reset streak on wrong answer
      if (result === 'fail') {
        nextState.consecutiveCorrect = 0
      }

      // Auto-advance skill level after mastery threshold
      if (nextState.consecutiveCorrect >= MASTERY_THRESHOLD) {
        nextState.consecutiveCorrect = 0
        nextState.flags['__readyToAdvance'] = true
      }

      const nextSceneId =
        result === 'success'
          ? getSuccessSceneId(event)
          : getFailureSceneId(event) ?? prevState.currentSceneId

      if (nextSceneId !== prevState.currentSceneId) {
        nextState.completedSceneIds = prevState.completedSceneIds.includes(prevState.currentSceneId)
          ? prevState.completedSceneIds
          : [...prevState.completedSceneIds, prevState.currentSceneId]
      }

      nextState.currentSceneId = nextSceneId ?? prevState.currentSceneId

      return nextState
    })
  }

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
      return {
        ...prev,
        skillProfile: { ...prev.skillProfile, math: next },
        consecutiveCorrect: 0,
        flags: { ...prev.flags, __readyToAdvance: false },
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

  /** Restore a full saved GameState (used by the load system) */
  function loadState(state: GameState, sceneId: string) {
    setGameState({ ...state, currentSceneId: sceneId })
  }

  return {
    gameState,
    currentScene,
    setGradeBand,
    moveToScene,
    moveToNextScene,
    chooseOption,
    rewardChallengeSuccess,
    resolveEvent,
    setSkillProfile,
    getMathPrompt,
    getReadingPrompt,
    advanceMathLevel,
    advanceReadingLevel,
    loadState,
  }
}

function getSuccessSceneId(event: GameEvent) {
  if (event.type === 'choice') {
    return event.options[0]?.nextSceneId
  }

  if (event.type === 'reward') {
    return event.nextSceneId
  }

  return event.successSceneId
}

function getFailureSceneId(event: GameEvent) {
  if (event.type === 'combat' || event.type === 'riddle') {
    return event.failureSceneId
  }

  return undefined
}
