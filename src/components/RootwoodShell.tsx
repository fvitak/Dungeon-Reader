import { useEffect, useState } from 'react'
import { useGameEngine } from '../game/useGameEngine'
import { rootwoodEpisode1, rootwoodEpisode1Meta } from '../data/rootwoodEpisode1'
import {
  selectForMathLevel,
  selectForReadingLevel,
} from '../types/skillLevel'
import type {
  RootwoodScene,
  RootwoodCombatEvent,
  RootwoodRiddleEvent,
  RootwoodChoiceEvent,
  RootwoodRewardEvent,
  RootwoodEvent,
  GameEvent,
} from '../types/game'

export function RootwoodShell() {
  const {
    gameState,
    currentScene,
    moveToNextScene,
    moveToScene,
    chooseOption,
    resolveEvent,
    advanceMathLevel,
    getMathPrompt,
    getReadingPrompt,
  } = useGameEngine({
    scenes: rootwoodEpisode1,
    initialSceneId: rootwoodEpisode1Meta.initialSceneId,
  })

  // Mastery advancement: watch for the flag set inside resolveEvent
  useEffect(() => {
    if (gameState.flags['__readyToAdvanceMath']) {
      advanceMathLevel()
    }
  }, [gameState.flags['__readyToAdvanceMath']])

  const scene = currentScene as RootwoodScene | undefined

  const [rewardPopup, setRewardPopup] = useState<{
    message: string
    xp: number
    buttonLabel: string
    continueAction: () => void
  } | null>(null)

  if (!scene) {
    return (
      <main className="app-shell">
        <section className="game-card scene-card-enter">
          <p className="scene-copy">Scene not found.</p>
        </section>
      </main>
    )
  }

  const sceneText = Array.isArray(scene.text) ? scene.text : [scene.text]
  const pageNumber = rootwoodEpisode1.findIndex(s => s.id === scene.id) + 1
  const totalPages = rootwoodEpisode1.length

  function handleResolve(event: RootwoodEvent, result: 'success' | 'fail') {
    resolveEvent(event as unknown as GameEvent, result)
  }

  return (
    <main className="app-shell">
      <section className="game-card scene-card-enter">
        {rewardPopup ? (
          <div className="reward-overlay">
            <section className="reward-popup" aria-live="polite">
              <p className="reward-popup-title">{rewardPopup.message}</p>
              <p className="reward-popup-text">XP earned: {rewardPopup.xp}</p>
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
            <div className="stat-pill">❤️ {gameState.stats.hearts}</div>
            <div className="stat-pill">⭐ {gameState.stats.xpThisEpisode} XP</div>
            <div className="stat-pill">📚 {gameState.skillProfile.reading}</div>
            <div className="stat-pill">🔢 {gameState.skillProfile.math}</div>
          </div>
        </header>

        <section className="scene-panel">
          <div className="scene-image-wrap">
            <img className="scene-image" src={scene.image.src} alt={scene.image.alt} />
            <span className="page-tag">p.{pageNumber} / {totalPages}</span>
          </div>

          <div className="scene-text">
            {sceneText.map((line) => (
              <p className="scene-copy" key={line}>{line}</p>
            ))}
          </div>
        </section>

        <footer className="action-panel">
          <RootwoodEventControls
            scene={scene}
            gameState={gameState}
            getMathPrompt={getMathPrompt}
            getReadingPrompt={getReadingPrompt}
            onContinue={moveToNextScene}
            onChoose={(nextSceneId, flagKey) => {
              chooseOption(nextSceneId, flagKey)
            }}
            onResolve={handleResolve}
            onShowReward={(popup) => setRewardPopup(popup)}
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

interface EventControlsProps {
  scene: RootwoodScene
  gameState: ReturnType<typeof useGameEngine>['gameState']
  getMathPrompt: (content: Parameters<typeof selectForMathLevel>[0]) => string
  getReadingPrompt: (content: Parameters<typeof selectForReadingLevel>[0]) => string
  onContinue: () => void
  onChoose: (nextSceneId: string, flagKey?: string) => void
  onResolve: (event: RootwoodEvent, result: 'success' | 'fail') => void
  onShowReward: (popup: RewardPopupData) => void
}

function RootwoodEventControls({
  scene,
  gameState,
  getMathPrompt,
  getReadingPrompt,
  onContinue,
  onChoose,
  onResolve,
  onShowReward,
}: EventControlsProps) {
  const event = scene.event

  if (!event) {
    return scene.nextSceneId ? (
      <button className="action-button continue-button" onClick={onContinue} type="button">
        Continue
      </button>
    ) : (
      <div>
        <p className="action-note">The End. More episodes coming soon!</p>
        <button
          className="action-button continue-button"
          onClick={() => window.location.reload()}
          type="button"
        >
          Return to Start
        </button>
      </div>
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
        sceneNextId={scene.nextSceneId}
        onContinue={onContinue}
      />
    )
  }

  if (event.type === 'combat') {
    return (
      <CombatControls
        event={event}
        gameState={gameState}
        getMathPrompt={getMathPrompt}
        onResolve={onResolve}
        onShowReward={onShowReward}
      />
    )
  }

  if (event.type === 'riddle') {
    return (
      <RiddleControls
        event={event}
        gameState={gameState}
        getMathPrompt={getMathPrompt}
        getReadingPrompt={getReadingPrompt}
        onResolve={onResolve}
        onShowReward={onShowReward}
      />
    )
  }

  return null
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
  sceneNextId,
  onContinue,
}: {
  event: RootwoodRewardEvent
  onResolve: (event: RootwoodEvent, result: 'success' | 'fail') => void
  onShowReward: (popup: RewardPopupData) => void
  sceneNextId?: string
  onContinue: () => void
}) {
  return (
    <>
      <p className="event-prompt">{event.prompt}</p>
      <p className="action-note feedback-panel feedback-panel-success">
        Reward found: {event.reward.label}
        {event.reward.description ? ` — ${event.reward.description}` : ''}
      </p>
      <div className="button-row">
        <button
          className="action-button"
          onClick={() => {
            onResolve(event, 'success')
            onShowReward({
              message: 'You earned a reward!',
              xp: 5,
              buttonLabel: event.nextSceneId ? 'Continue' : 'Return to Start',
              continueAction: event.nextSceneId
                ? () => {} // resolveEvent already navigated
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

function CombatControls({
  event,
  gameState,
  getMathPrompt,
  onResolve,
  onShowReward,
}: {
  event: RootwoodCombatEvent
  gameState: ReturnType<typeof useGameEngine>['gameState']
  getMathPrompt: (content: Parameters<typeof selectForMathLevel>[0]) => string
  onResolve: (event: RootwoodEvent, result: 'success' | 'fail') => void
  onShowReward: (popup: RewardPopupData) => void
}) {
  const [answerState, setAnswerState] = useState<{
    status: 'idle' | 'success' | 'fail'
    message: string
    selectedValue: string | null
  }>({ status: 'idle', message: '', selectedValue: null })

  const prompt = getMathPrompt(event.promptByLevel)
  const correctAnswer = getMathPrompt(event.correctAnswerByLevel).trim().toLowerCase()
  const hint = event.hintByLevel ? getMathPrompt(event.hintByLevel) : null

  // Determine if the correct answer is among the option values
  const hasMatchingOption = event.options.some(
    (o) => o.value.trim().toLowerCase() === correctAnswer
  )

  function handleAnswer(value: string) {
    const normalized = value.trim().toLowerCase()
    if (normalized === correctAnswer) {
      setAnswerState({ status: 'success', message: 'Correct!', selectedValue: normalized })
      onShowReward({
        message: 'Well done!',
        xp: 15,
        buttonLabel: 'Continue',
        continueAction: () => onResolve(event, 'success'),
      })
    } else {
      setAnswerState({
        status: 'fail',
        message: 'Not quite — look at the hint and try again.',
        selectedValue: normalized,
      })
      onResolve(event, 'fail')
    }
  }

  return (
    <>
      <p className="monster-name">You face: {event.enemyName}</p>
      <p className="event-prompt">{prompt}</p>
      {hint && answerState.status === 'fail' ? (
        <p className="action-note">Hint: {hint}</p>
      ) : null}
      {answerState.message ? (
        <p
          className={
            answerState.status === 'success'
              ? 'result-text result-text-success feedback-panel feedback-panel-success'
              : 'result-text result-text-fail feedback-panel feedback-panel-fail'
          }
        >
          {answerState.message}
        </p>
      ) : null}
      {answerState.status !== 'success' && (
        <div className="button-row">
          {hasMatchingOption ? (
            event.options.map((option) => {
              const isCorrectOption = option.value.trim().toLowerCase() === correctAnswer
              const isSelectedWrong =
                answerState.status === 'fail' &&
                answerState.selectedValue === option.value.trim().toLowerCase()
              const className = answerState.status !== 'idle' && isCorrectOption
                ? 'action-button answer-button answer-button-correct'
                : isSelectedWrong
                  ? 'action-button answer-button answer-button-wrong'
                  : 'action-button answer-button'
              return (
                <button
                  key={option.id}
                  className={className}
                  onClick={() => handleAnswer(option.value)}
                  type="button"
                >
                  {option.text}
                </button>
              )
            })
          ) : (
            // No matching option for current level — show text input fallback
            <RiddleFallbackInput
              correctAnswer={correctAnswer}
              isNumeric={true}
              onAnswer={handleAnswer}
              failed={answerState.status === 'fail'}
            />
          )}
        </div>
      )}
    </>
  )
}

function RiddleControls({
  event,
  gameState,
  getMathPrompt,
  getReadingPrompt,
  onResolve,
  onShowReward,
}: {
  event: RootwoodRiddleEvent
  gameState: ReturnType<typeof useGameEngine>['gameState']
  getMathPrompt: (content: Parameters<typeof selectForMathLevel>[0]) => string
  getReadingPrompt: (content: Parameters<typeof selectForReadingLevel>[0]) => string
  onResolve: (event: RootwoodEvent, result: 'success' | 'fail') => void
  onShowReward: (popup: RewardPopupData) => void
}) {
  const [answerState, setAnswerState] = useState<{
    status: 'idle' | 'success' | 'fail'
    message: string
  }>({ status: 'idle', message: '' })

  // Detect math vs reading riddle by checking key prefixes
  const isMathRiddle = Object.keys(event.promptByLevel).some(k => /^M/.test(k))

  const prompt = isMathRiddle
    ? getMathPrompt(event.promptByLevel as Parameters<typeof selectForMathLevel>[0])
    : getReadingPrompt(event.promptByLevel as Parameters<typeof selectForReadingLevel>[0])

  const correctAnswer = (isMathRiddle
    ? getMathPrompt(event.correctAnswerByLevel as Parameters<typeof selectForMathLevel>[0])
    : getReadingPrompt(event.correctAnswerByLevel as Parameters<typeof selectForReadingLevel>[0])
  ).trim().toLowerCase()

  const hint = event.hintByLevel
    ? isMathRiddle
      ? getMathPrompt(event.hintByLevel as Parameters<typeof selectForMathLevel>[0])
      : getReadingPrompt(event.hintByLevel as Parameters<typeof selectForReadingLevel>[0])
    : null

  function handleAnswer(value: string) {
    const normalized = value.trim().toLowerCase()
    if (normalized === correctAnswer) {
      setAnswerState({ status: 'success', message: 'Correct! The path opens before you.' })
      onShowReward({
        message: 'Well done, adventurer!',
        xp: 15,
        buttonLabel: 'Continue',
        continueAction: () => onResolve(event, 'success'),
      })
    } else {
      setAnswerState({
        status: 'fail',
        message: 'That is not quite right. Try again.',
      })
      onResolve(event, 'fail')
    }
  }

  return (
    <>
      <p className="event-prompt">{prompt}</p>
      {hint && answerState.status === 'fail' ? (
        <p className="action-note">Hint: {hint}</p>
      ) : null}
      {answerState.message ? (
        <p
          className={
            answerState.status === 'success'
              ? 'result-text result-text-success feedback-panel feedback-panel-success'
              : 'result-text result-text-fail feedback-panel feedback-panel-fail'
          }
        >
          {answerState.message}
        </p>
      ) : null}
      {answerState.status !== 'success' && (
        <RiddleFallbackInput
          correctAnswer={correctAnswer}
          isNumeric={isMathRiddle}
          onAnswer={handleAnswer}
          failed={answerState.status === 'fail'}
        />
      )}
    </>
  )
}

function RiddleFallbackInput({
  correctAnswer: _correctAnswer,
  isNumeric,
  onAnswer,
  failed,
}: {
  correctAnswer: string
  isNumeric: boolean
  onAnswer: (value: string) => void
  failed: boolean
}) {
  const [value, setValue] = useState('')

  return (
    <div className="button-row">
      <input
        className={failed ? 'answer-input answer-input-fail' : 'answer-input'}
        inputMode={isNumeric ? 'numeric' : 'text'}
        pattern={isNumeric ? '[0-9]*' : undefined}
        value={value}
        onChange={(e) =>
          setValue(isNumeric ? e.target.value.replace(/\D/g, '') : e.target.value)
        }
        placeholder={isNumeric ? 'Type a number' : 'Type your answer'}
        aria-label="Type your answer"
      />
      <button
        className="action-button"
        onClick={() => {
          if (!value.trim()) return
          onAnswer(value)
          setValue('')
        }}
        type="button"
      >
        Check Answer
      </button>
    </div>
  )
}
