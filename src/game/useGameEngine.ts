import { useMemo, useState } from 'react'
import type {
  CombatEvent,
  GradeBand,
  RiddleEvent,
  StoryScene,
  GameEvent,
  GameState,
} from '../types/game'

interface UseGameEngineOptions {
  scenes: StoryScene[]
  initialSceneId: string
  initialGradeBand?: GradeBand
}

const defaultStats = {
  coins: 0,
  stars: 0,
  hearts: 3,
}

export function useGameEngine({
  scenes,
  initialSceneId,
  initialGradeBand = '3-4',
}: UseGameEngineOptions) {
  const [gameState, setGameState] = useState<GameState>({
    currentSceneId: initialSceneId,
    completedSceneIds: [],
    gradeBand: initialGradeBand,
    stats: defaultStats,
    inventory: [],
    rewards: [],
    flags: {},
  })

  const currentScene = useMemo(
    () => scenes.find((scene) => scene.id === gameState.currentSceneId),
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
      completedSceneIds: prevState.completedSceneIds.includes(
        prevState.currentSceneId,
      )
        ? prevState.completedSceneIds
        : [...prevState.completedSceneIds, prevState.currentSceneId],
    }))
  }

  function moveToNextScene() {
    if (currentScene?.nextSceneId) {
      moveToScene(currentScene.nextSceneId)
    }
  }

  function chooseOption(nextSceneId: string, flagKey?: string) {
    setGameState((prevState) => ({
      ...prevState,
      currentSceneId: nextSceneId,
      completedSceneIds: prevState.completedSceneIds.includes(
        prevState.currentSceneId,
      )
        ? prevState.completedSceneIds
        : [...prevState.completedSceneIds, prevState.currentSceneId],
      flags: flagKey
        ? {
            ...prevState.flags,
            [flagKey]: true,
          }
        : prevState.flags,
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

      if (
        (event.type === 'combat' || event.type === 'riddle') &&
        result === 'fail'
      ) {
        nextState.stats.hearts = Math.max(0, nextState.stats.hearts - 1)
      }

      const nextSceneId =
        result === 'success'
          ? getSuccessSceneId(event)
          : getFailureSceneId(event) ?? prevState.currentSceneId

      if (nextSceneId !== prevState.currentSceneId) {
        nextState.completedSceneIds = prevState.completedSceneIds.includes(
          prevState.currentSceneId,
        )
          ? prevState.completedSceneIds
          : [...prevState.completedSceneIds, prevState.currentSceneId]
      }

      nextState.currentSceneId = nextSceneId ?? prevState.currentSceneId

      return nextState
    })
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
