import { useEffect, useState } from 'react'
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
  GameEvent,
} from '../types/game'

export function RootwoodShell() {
  const {
    gameState,
    currentScene,
    moveToNextScene,
    chooseOption,
    resolveEvent,
    advanceMathLevel,
    advanceReadingLevel,
    getMathPrompt,
    getReadingPrompt,
  } = useGameEngine({
    scenes: rootwoodEpisode1,
    initialSceneId: rootwoodEpisode1Meta.initialSceneId,
  })

  // Watch mastery flag and advance the appropriate skill
  useEffect(() => {
    if (gameState.flags['__readyToAdvance']) {
      // Advance whichever skill type was most recently challenged
      // (simple heuristic: advance math; reading advancement triggered by component)
      advanceMathLevel()
    }
  }, [gameState.flags['__readyToAdvance']])

  const [rewardPopup, setRewardPopup] = useState<{
    message: string
    xp: number
    buttonLabel: string
    continueAction: () => void
  } | null>(null)

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
    // RootwoodChallengeEvent casts safely — success/fail nav falls through
    // to successSceneId/failureSceneId which both event shapes have
    resolveEvent(event as unknown as GameEvent, result)
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

        <header className="top-bar">
          <div className="stat-group" aria-label="Player stats">
            <div className="stat-pill">⭐ {gameState.stats.xpThisEpisode} XP</div>
            <div className="stat-pill">📖 {gameState.skillProfile.reading}</div>
            <div className="stat-pill">🔢 {gameState.skillProfile.math}</div>
          </div>
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
            onContinue={moveToNextScene}
            onChoose={chooseOption}
            onResolve={handleResolve}
            onShowReward={setRewardPopup}
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
}: {
  scene: RootwoodScene
  getMathPrompt: (c: Parameters<typeof selectForMathLevel>[0]) => string
  getReadingPrompt: (c: Parameters<typeof selectForReadingLevel>[0]) => string
  onContinue: () => void
  onChoose: (nextSceneId: string, flagKey?: string) => void
  onResolve: (event: RootwoodEvent, result: 'success' | 'fail') => void
  onShowReward: (popup: RewardPopupData) => void
}) {
  const event = scene.event

  if (!event) {
    return scene.nextSceneId ? (
      <button className="action-button continue-button" onClick={onContinue} type="button">
        Continue
      </button>
    ) : (
      <>
        <p className="action-note">Episode complete! More coming soon.</p>
        <button
          className="action-button continue-button"
          onClick={() => window.location.reload()}
          type="button"
        >
          Return to Start
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
      />
    )
  }

  // event.type === 'challenge'
  return (
    <ChallengeControls
      key={scene.id}
      event={event}
      getMathPrompt={getMathPrompt}
      getReadingPrompt={getReadingPrompt}
      onResolve={onResolve}
      onShowReward={onShowReward}
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
}: {
  event: RootwoodRewardEvent
  onResolve: (event: RootwoodEvent, result: 'success' | 'fail') => void
  onShowReward: (popup: RewardPopupData) => void
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
            onResolve(event, 'success')
            onShowReward({
              message: `You found the ${event.reward.label}!`,
              xp: 5,
              buttonLabel: event.nextSceneId ? 'Continue' : 'Return to Start',
              continueAction: event.nextSceneId
                ? () => {}  // resolveEvent already navigated
                : () => window.location.reload(),
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
}: {
  event: RootwoodChallengeEvent
  getMathPrompt: (c: Parameters<typeof selectForMathLevel>[0]) => string
  getReadingPrompt: (c: Parameters<typeof selectForReadingLevel>[0]) => string
  onResolve: (event: RootwoodEvent, result: 'success' | 'fail') => void
  onShowReward: (popup: RewardPopupData) => void
}) {
  const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectLevel = event.skillType === 'math' ? getMathPrompt : getReadingPrompt
  const prompt = selectLevel(event.promptByLevel as Parameters<typeof selectForMathLevel>[0])
  const hint   = selectLevel(event.hintByLevel   as Parameters<typeof selectForMathLevel>[0])

  function handleTap(optionId: string, isCorrect: boolean) {
    if (status === 'success') return  // already solved

    setSelectedId(optionId)

    if (isCorrect) {
      setStatus('success')
      onResolve(event, 'success')
      onShowReward({
        message: 'Well done!',
        xp: 15,
        buttonLabel: 'Continue',
        continueAction: () => {},  // resolveEvent already navigated
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

          const className = showCorrect
            ? 'action-button answer-button answer-button-correct'
            : showWrong
              ? 'action-button answer-button answer-button-wrong'
              : 'action-button answer-button'

          return (
            <button
              key={option.id}
              className={className}
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
