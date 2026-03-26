import { useEffect, useRef, useState } from 'react'
import { useGameEngine } from '../game/useGameEngine'
import { rootwoodEpisode1, rootwoodEpisode1Meta } from '../data/rootwoodEpisode1'
import {
  selectForMathLevel,
  selectForReadingLevel,
} from '../types/skillLevel'
import type {
  RootwoodScene,
  RootwoodEvent,
  RootwoodChallengeEvent,
  RootwoodChoiceEvent,
  RootwoodRewardEvent,
  RootwoodReward,
  GameEvent,
  GameState,
} from '../types/game'
import type { TrophyItem } from '../App'
import type { SaveSlot } from '../types/save'
import { createSave } from '../utils/saveSystem'
import { SaveModal } from './SaveModal'

interface RootwoodShellProps {
  onComplete: (episodeId: string, rewards: TrophyItem[]) => void
  onBack: () => void
  /** If provided, resume from this saved state instead of starting fresh */
  initialSave?: SaveSlot
}

export function RootwoodShell({ onComplete, onBack, initialSave }: RootwoodShellProps) {
  const {
    gameState,
    currentScene,
    moveToNextScene,
    chooseOption,
    resolveEvent,
    advanceMathLevel,
    getMathPrompt,
    getReadingPrompt,
    loadState,
  } = useGameEngine({
    scenes: rootwoodEpisode1,
    initialSceneId: initialSave?.sceneId ?? rootwoodEpisode1Meta.initialSceneId,
    initialState: initialSave?.gameState,
  })

  // Restore full game state when loading a save
  useEffect(() => {
    if (initialSave) {
      loadState(initialSave.gameState, initialSave.sceneId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (gameState.flags['__readyToAdvance']) {
      advanceMathLevel()
    }
  }, [gameState.flags['__readyToAdvance']])

  const [rewardPopup, setRewardPopup] = useState<{
    message: string
    xp: number
    buttonLabel: string
    continueAction: () => void
  } | null>(null)

  const [showSaveModal, setShowSaveModal] = useState(false)
  const pendingContinue = useRef<(() => void) | null>(null)

  // Collect rewards earned during this episode
  const earnedRewards = useRef<TrophyItem[]>([])
  function trackReward(reward: RootwoodReward) {
    if (!earnedRewards.current.some(r => r.id === reward.id)) {
      earnedRewards.current = [
        ...earnedRewards.current,
        { ...reward, episodeId: rootwoodEpisode1Meta.id },
      ]
    }
  }

  const scene = currentScene as RootwoodScene | undefined

  if (!scene) {
    return (
      <main className="app-shell">
        <section className="game-card scene-card-enter">
          <p className="scene-copy">Scene not found.</p>
        </section>
      </main>
    )
  }

  const pageNumber = rootwoodEpisode1.findIndex(s => s.id === scene.id) + 1
  const totalPages = rootwoodEpisode1.length

  function handleResolve(event: RootwoodEvent, result: 'success' | 'fail') {
    resolveEvent(event as unknown as GameEvent, result)
  }

  function handleEpisodeEnd() {
    onComplete(rootwoodEpisode1Meta.id, earnedRewards.current)
  }

  /** Called when the player taps Continue on any scene */
  function handleContinue() {
    if (scene?.savePoint) {
      // Intercept — offer to save before advancing
      pendingContinue.current = moveToNextScene
      setShowSaveModal(true)
    } else {
      moveToNextScene()
    }
  }

  function handleSaveAndContinue(saveName: string) {
    createSave({
      name: saveName,
      episodeId: rootwoodEpisode1Meta.id,
      episodeTitle: rootwoodEpisode1Meta.title,
      chapterName: scene!.savePoint!.chapterName,
      chapterNumber: scene!.savePoint!.chapterNumber,
      sceneId: scene!.nextSceneId!,
      mathRank: gameState.skillProfile.math,
      readingRank: gameState.skillProfile.reading,
      xp: gameState.stats.xp,
      gameState: gameState as GameState,
    })
    setShowSaveModal(false)
    pendingContinue.current?.()
    pendingContinue.current = null
  }

  function handleSkipSave() {
    setShowSaveModal(false)
    pendingContinue.current?.()
    pendingContinue.current = null
  }

  return (
    <main className="app-shell">
      <section className="game-card scene-card-enter">
        {rewardPopup ? (
          <div className="reward-overlay">
            <section className="reward-popup" aria-live="polite">
              <p className="reward-popup-title">{rewardPopup.message}</p>
              <p className="reward-popup-text">+{rewardPopup.xp} XP</p>
              <button
                className="action-button reward-popup-button"
                onClick={() => {
                  setRewardPopup(null)
                  rewardPopup.continueAction()
                }}
                type="button"
              >
                {rewardPopup.buttonLabel}
              </button>
            </section>
          </div>
        ) : null}

        {showSaveModal ? (
          <SaveModal
            chapterName={scene.savePoint!.chapterName}
            mathRank={gameState.skillProfile.math}
            readingRank={gameState.skillProfile.reading}
            onSave={handleSaveAndContinue}
            onSkip={handleSkipSave}
          />
        ) : null}

        <header className="top-bar">
          <div className="stat-group" aria-label="Player stats">
            <div className="stat-pill">⭐ {gameState.stats.xpThisEpisode} XP</div>
            <div className="stat-pill">📖 {gameState.skillProfile.reading}</div>
            <div className="stat-pill">🔢 {gameState.skillProfile.math}</div>
          </div>
          <button className="back-button" onClick={onBack} type="button">
            ← Menu
          </button>
        </header>

        <section className="scene-panel">
          <div className="scene-image-wrap">
            <img className="scene-image" src={scene.image.src} alt={scene.image.alt} />
            <span className="page-tag">p.{pageNumber} / {totalPages}</span>
          </div>

          <div className="scene-text">
            {scene.text.map((line) => (
              <p className="scene-copy" key={line}>{line}</p>
            ))}
          </div>
        </section>

        <footer className="action-panel">
          <RootwoodEventControls
            scene={scene}
            getMathPrompt={getMathPrompt}
            getReadingPrompt={getReadingPrompt}
            onContinue={handleContinue}
            onChoose={chooseOption}
            onResolve={handleResolve}
            onShowReward={setRewardPopup}
            onTrackReward={trackReward}
            onEpisodeEnd={handleEpisodeEnd}
          />
        </footer>
      </section>
    </main>
  )
}

interface RewardPopupData {
  message: string
  xp: number
  buttonLabel: string
  continueAction: () => void
}

function RootwoodEventControls({
  scene,
  getMathPrompt,
  getReadingPrompt,
  onContinue,
  onChoose,
  onResolve,
  onShowReward,
  onTrackReward,
  onEpisodeEnd,
}: {
  scene: RootwoodScene
  getMathPrompt: (c: Parameters<typeof selectForMathLevel>[0]) => string
  getReadingPrompt: (c: Parameters<typeof selectForReadingLevel>[0]) => string
  onContinue: () => void
  onChoose: (nextSceneId: string, flagKey?: string) => void
  onResolve: (event: RootwoodEvent, result: 'success' | 'fail') => void
  onShowReward: (popup: RewardPopupData) => void
  onTrackReward: (reward: RootwoodReward) => void
  onEpisodeEnd: () => void
}) {
  const event = scene.event

  if (!event) {
    // Chapter-end save point: show both Continue and Save label
    if (scene.savePoint && scene.nextSceneId) {
      return (
        <div className="save-point-actions">
          <p className="save-point-label">⚔️ End of {scene.savePoint.chapterName}</p>
          <button className="action-button continue-button" onClick={onContinue} type="button">
            Continue to Chapter {scene.savePoint.chapterNumber + 1} →
          </button>
        </div>
      )
    }

    return scene.nextSceneId ? (
      <button className="action-button continue-button" onClick={onContinue} type="button">
        Continue
      </button>
    ) : (
      <>
        <p className="action-note feedback-panel feedback-panel-success">
          To be continued...
        </p>
        <button
          className="action-button continue-button"
          onClick={onEpisodeEnd}
          type="button"
        >
          Finish Episode
        </button>
      </>
    )
  }

  if (event.type === 'choice') {
    return <ChoiceControls event={event} onChoose={onChoose} />
  }

  if (event.type === 'reward') {
    return (
      <RewardControls
        event={event}
        onResolve={onResolve}
        onShowReward={onShowReward}
        onTrackReward={onTrackReward}
      />
    )
  }

  return (
    <ChallengeControls
      key={scene.id}
      event={event}
      getMathPrompt={getMathPrompt}
      getReadingPrompt={getReadingPrompt}
      onResolve={onResolve}
      onShowReward={onShowReward}
      onTrackReward={onTrackReward}
    />
  )
}

function ChoiceControls({
  event,
  onChoose,
}: {
  event: RootwoodChoiceEvent
  onChoose: (nextSceneId: string, flagKey?: string) => void
}) {
  return (
    <>
      <p className="choice-label">{event.prompt}</p>
      <div className="choice-grid">
        {event.options.map((option) => (
          <button
            key={option.id}
            className="action-button choice-button"
            onClick={() => onChoose(option.nextSceneId, option.flagKey)}
            type="button"
          >
            {option.text}
          </button>
        ))}
      </div>
    </>
  )
}

function RewardControls({
  event,
  onResolve,
  onShowReward,
  onTrackReward,
}: {
  event: RootwoodRewardEvent
  onResolve: (event: RootwoodEvent, result: 'success' | 'fail') => void
  onShowReward: (popup: RewardPopupData) => void
  onTrackReward: (reward: RootwoodReward) => void
}) {
  const [collected, setCollected] = useState(false)

  if (collected) return null

  return (
    <>
      <p className="event-prompt">{event.prompt}</p>
      <p className="action-note feedback-panel feedback-panel-success">
        Reward: {event.reward.label} — {event.reward.description}
      </p>
      <div className="button-row">
        <button
          className="action-button"
          onClick={() => {
            setCollected(true)
            onTrackReward(event.reward)
            onResolve(event, 'success')
            onShowReward({
              message: `You found the ${event.reward.label}!`,
              xp: 5,
              buttonLabel: event.nextSceneId ? 'Continue' : 'Finish Episode',
              continueAction: () => {},
            })
          }}
          type="button"
        >
          Collect Reward
        </button>
      </div>
    </>
  )
}

function ChallengeControls({
  event,
  getMathPrompt,
  getReadingPrompt,
  onResolve,
  onShowReward,
  onTrackReward,
}: {
  event: RootwoodChallengeEvent
  getMathPrompt: (c: Parameters<typeof selectForMathLevel>[0]) => string
  getReadingPrompt: (c: Parameters<typeof selectForReadingLevel>[0]) => string
  onResolve: (event: RootwoodEvent, result: 'success' | 'fail') => void
  onShowReward: (popup: RewardPopupData) => void
  onTrackReward: (reward: RootwoodReward) => void
}) {
  const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectLevel = event.skillType === 'math' ? getMathPrompt : getReadingPrompt
  const prompt = selectLevel(event.promptByLevel as Parameters<typeof selectForMathLevel>[0])
  const hint   = selectLevel(event.hintByLevel   as Parameters<typeof selectForMathLevel>[0])

  function handleTap(optionId: string, isCorrect: boolean) {
    if (status === 'success') return
    setSelectedId(optionId)

    if (isCorrect) {
      setStatus('success')
      onResolve(event, 'success')
      if (event.reward) onTrackReward(event.reward)
      onShowReward({
        message: 'Well done!',
        xp: 15,
        buttonLabel: 'Continue',
        continueAction: () => {},
      })
    } else {
      setStatus('fail')
      onResolve(event, 'fail')
    }
  }

  return (
    <>
      <p className="event-prompt">{prompt}</p>

      {status === 'fail' && hint ? (
        <p className="action-note feedback-panel feedback-panel-fail">
          Hint: {hint}
        </p>
      ) : null}

      <div className="button-row">
        {event.options.map((option) => {
          const isSelected = selectedId === option.id
          const showCorrect = status !== 'idle' && option.isCorrect
          const showWrong   = status === 'fail' && isSelected && !option.isCorrect

          return (
            <button
              key={option.id}
              className={
                showCorrect ? 'action-button answer-button answer-button-correct'
                : showWrong  ? 'action-button answer-button answer-button-wrong'
                             : 'action-button answer-button'
              }
              onClick={() => handleTap(option.id, option.isCorrect)}
              type="button"
            >
              {option.text}
            </button>
          )
        })}
      </div>
    </>
  )
}
