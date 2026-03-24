import { useState } from 'react'
import { useGameEngine } from '../game/useGameEngine'
import { storyScenes } from '../data/story'
import type { CombatEvent, GameEvent, GradeBand, StoryScene } from '../types/game'

const gradeBands: GradeBand[] = ['1-2', '3-4', '5']

export function AppShell() {
  const {
    gameState,
    currentScene,
    setGradeBand,
    moveToNextScene,
    moveToScene,
    chooseOption,
    rewardChallengeSuccess,
    resolveEvent,
  } = useGameEngine({
    scenes: storyScenes,
    initialSceneId: 'forest-gate',
    initialGradeBand: '3-4',
  })
  const [hasSelectedGrade, setHasSelectedGrade] = useState(false)
  const selectedGrade = gameState.gradeBand

  function handleGradeSelection(grade: GradeBand) {
    setGradeBand(grade)
    setHasSelectedGrade(true)
  }

  if (!currentScene) {
    return (
      <main className="app-shell">
        <section className="game-card scene-card-enter">
          <p className="scene-copy">The current scene could not be found.</p>
        </section>
      </main>
    )
  }

  const visibleScene = getSceneForGrade(currentScene, gameState.gradeBand)
  const pageNumber = storyScenes.findIndex((s) => s.id === currentScene.id) + 1
  const totalPages = storyScenes.length

  return (
    <main className="app-shell">
      {!hasSelectedGrade ? (
        <section className="game-card scene-card-enter">
          <section className="start-screen">
            <h1 className="start-title">Dungeon Reader</h1>
            <p className="start-copy">
              Choose your grade and enter the dungeon!
            </p>
            <div className="choice-grid">
              {gradeBands.map((grade) => (
                <button
                  key={grade}
                  className="action-button choice-button grade-start-button"
                  onClick={() => handleGradeSelection(grade)}
                  type="button"
                >
                  {grade === '5' ? 'Grade 5' : `Grades ${grade}`}
                </button>
              ))}
            </div>
          </section>
        </section>
      ) : (
        <GamePlayView
          key={`${visibleScene.id}-${selectedGrade}`}
          gameState={gameState}
          gradeBands={gradeBands}
          scene={visibleScene}
          selectedGrade={selectedGrade}
          pageNumber={pageNumber}
          totalPages={totalPages}
          onGradeSelect={handleGradeSelection}
          onContinue={moveToNextScene}
          onMoveToScene={moveToScene}
          onChoose={chooseOption}
          onRewardChallengeSuccess={rewardChallengeSuccess}
          onResolve={resolveEvent}
        />
      )}
    </main>
  )
}

interface GamePlayViewProps {
  gameState: ReturnType<typeof useGameEngine>['gameState']
  gradeBands: GradeBand[]
  scene: StoryScene
  selectedGrade: GradeBand
  pageNumber: number
  totalPages: number
  onGradeSelect: (grade: GradeBand) => void
  onContinue: () => void
  onMoveToScene: (nextSceneId: string) => void
  onChoose: (nextSceneId: string, flagKey?: string) => void
  onRewardChallengeSuccess: (event: CombatEvent | Extract<GameEvent, { type: 'riddle' }>) => void
  onResolve: (event: GameEvent, result: 'success' | 'fail') => void
}

function GamePlayView({
  gameState,
  gradeBands,
  scene,
  selectedGrade,
  pageNumber,
  totalPages,
  onGradeSelect,
  onContinue,
  onMoveToScene,
  onChoose,
  onRewardChallengeSuccess,
  onResolve,
}: GamePlayViewProps) {
  const [combatState, setCombatState] = useState<{
    status: 'idle' | 'success' | 'fail'
    message: string
    selectedAnswer: string | null
  }>({
    status: 'idle',
    message: '',
    selectedAnswer: null,
  })
  const [riddleAnswer, setRiddleAnswer] = useState('')
  const [riddleState, setRiddleState] = useState<{
    status: 'idle' | 'success' | 'fail'
    message: string
  }>({
    status: 'idle',
    message: '',
  })
  const [rewardPopup, setRewardPopup] = useState<{
    message: string
    coins: number
    stars: number
    buttonLabel: string
    continueAction: () => void
  } | null>(null)

  return (
    <section className="game-card scene-card-enter">
      {rewardPopup ? (
        <div className="reward-overlay">
          <section className="reward-popup" aria-live="polite">
            <p className="reward-popup-title">{rewardPopup.message}</p>
            <p className="reward-popup-text">Coins earned: {rewardPopup.coins}</p>
            <p className="reward-popup-text">Stars earned: {rewardPopup.stars}</p>
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
          <div className="stat-pill">🪙 {gameState.stats.coins}</div>
          <div className="stat-pill">⭐ {gameState.stats.stars}</div>
          <div className="stat-pill">⚔️ {selectedGrade}</div>
        </div>

        <div className="grade-picker" aria-label="Select grade level">
          {gradeBands.map((grade) => (
            <button
              key={grade}
              className={
                grade === gameState.gradeBand
                  ? 'grade-button grade-button-active'
                  : 'grade-button'
              }
              onClick={() => onGradeSelect(grade)}
              type="button"
            >
              Grade {grade}
            </button>
          ))}
        </div>
      </header>

      <section className="scene-panel">
        <div className="scene-image-wrap">
          <img className="scene-image" src={scene.image.src} alt={scene.image.alt} />
          <span className="page-tag">p.{pageNumber} / {totalPages}</span>
        </div>

        <div className="scene-text">
          {scene.text.map((line) => (
            <p className="scene-copy" key={line}>
              {line}
            </p>
          ))}
        </div>
      </section>

      <footer className="action-panel">
        {renderEventControls({
          scene,
          gradeBand: selectedGrade,
          combatState,
          riddleAnswer,
          riddleState,
          onContinue,
          onChoose,
          onCombatAnswer: (event, answer) => {
            const expectedAnswer = normalizeAnswer(
              event.correctAnswerByGrade[selectedGrade],
            )
            const selectedAnswer = normalizeAnswer(answer)

            if (selectedAnswer === expectedAnswer) {
              onRewardChallengeSuccess(event)
              setCombatState({
                status: 'success',
                message: 'The sentinel steps aside. You earned 2 coins and a star.',
                selectedAnswer,
              })
              setRewardPopup({
                message: 'Well done!',
                coins: 2,
                stars: 1,
                buttonLabel: 'Continue',
                continueAction: () => onMoveToScene(event.successSceneId),
              })
              return
            }

            setCombatState({
              status: 'fail',
              message: 'The sentinel does not move. Look closer — one of those answers holds the key.',
              selectedAnswer,
            })
          },
          onRiddleAnswerChange: setRiddleAnswer,
          onRiddleSubmit: (event) => {
            const expectedAnswer = normalizeAnswer(
              event.correctAnswerByGrade[selectedGrade],
            )
            const typedAnswer = normalizeAnswer(riddleAnswer)

            if (!typedAnswer) {
              setRiddleState({
                status: 'fail',
                message: 'Type a number first, then check your answer.',
              })
              return
            }

            if (typedAnswer === expectedAnswer) {
              onRewardChallengeSuccess(event)
              setRiddleState({
                status: 'success',
                message: 'Correct! The path opens before you.',
              })
              setRewardPopup({
                message: 'Well done, adventurer!',
                coins: 2,
                stars: 1,
                buttonLabel: 'Continue',
                continueAction: () => onMoveToScene(event.successSceneId),
              })
              return
            }

            setRiddleState({
              status: 'fail',
              message: 'That number is not correct. Try again.',
            })
          },
          onResolve: (event, result) => {
            onResolve(event, result)

            if (event.type === 'reward' && result === 'success') {
              setRewardPopup({
                message: 'Well done, adventurer!',
                coins: 2,
                stars: 0,
                buttonLabel: scene.nextSceneId ? 'Continue' : 'Return to Start',
                continueAction: scene.nextSceneId ? onContinue : () => window.location.reload(),
              })
            }
          },
        })}
      </footer>
    </section>
  )
}

function renderEventControls({
  scene,
  gradeBand,
  combatState,
  riddleAnswer,
  riddleState,
  onContinue,
  onChoose,
  onCombatAnswer,
  onRiddleAnswerChange,
  onRiddleSubmit,
  onResolve,
}: {
  scene: StoryScene
  gradeBand: GradeBand
  combatState: {
    status: 'idle' | 'success' | 'fail'
    message: string
    selectedAnswer: string | null
  }
  riddleAnswer: string
  riddleState: {
    status: 'idle' | 'success' | 'fail'
    message: string
  }
  onContinue: () => void
  onChoose: (nextSceneId: string, flagKey?: string) => void
  onCombatAnswer: (event: CombatEvent, answer: string) => void
  onRiddleAnswerChange: (value: string) => void
  onRiddleSubmit: (event: Extract<GameEvent, { type: 'riddle' }>) => void
  onResolve: (event: GameEvent, result: 'success' | 'fail') => void
}) {
  const event = scene.event

  if (!event) {
    return scene.nextSceneId ? (
      <button className="action-button continue-button" onClick={onContinue}>
        Continue
      </button>
    ) : (
      <p className="action-note">The path fades into shadow... more to come.</p>
    )
  }

  if (event.type === 'choice') {
    return (
      <>
        <p className="choice-label">Your path awaits</p>
        <p className="event-prompt">{event.promptByGrade[gradeBand]}</p>
        <div className="choice-grid">
          {event.options.map((option) => (
            <button
              key={option.id}
              className="action-button choice-button"
              onClick={() => onChoose(option.nextSceneId, option.flagKey)}
              type="button"
            >
              {option.textByGrade[gradeBand]}
            </button>
          ))}
        </div>
      </>
    )
  }

  if (event.type === 'combat') {
    return (
      <>
        <p className="monster-name">You face: {event.enemyName}</p>
        <p className="event-prompt">{event.promptByGrade[gradeBand]}</p>
        {combatState.message ? (
          <p
            className={
              combatState.status === 'success'
                ? 'result-text result-text-success feedback-panel feedback-panel-success'
                : 'result-text result-text-fail feedback-panel feedback-panel-fail'
            }
          >
            {combatState.message}
          </p>
        ) : null}
        <div className="button-row">
          {combatState.status !== 'success' && (
            <>
              {event.options.map((option) => (
                <button
                  key={option.id}
                  className={getCombatOptionClassName(
                    option.textByGrade[gradeBand],
                    event.correctAnswerByGrade[gradeBand],
                    combatState,
                  )}
                  onClick={() => onCombatAnswer(event, option.textByGrade[gradeBand])}
                  type="button"
                >
                  {option.textByGrade[gradeBand]}
                </button>
              ))}
              {combatState.status === 'fail' ? (
                <button
                  className="action-button continue-button"
                  onClick={() =>
                    onCombatAnswer(event, event.correctAnswerByGrade[gradeBand])
                  }
                  type="button"
                >
                  Use the highlighted answer
                </button>
              ) : null}
            </>
          )}
        </div>
      </>
    )
  }

  if (event.type === 'riddle') {
    return (
      <>
        <p className="event-prompt">{event.promptByGrade[gradeBand]}</p>
        {event.hintByGrade ? (
          <p className="action-note">Hint: {event.hintByGrade[gradeBand]}</p>
        ) : null}
        {riddleState.message ? (
          <p
            className={
              riddleState.status === 'success'
                ? 'result-text result-text-success feedback-panel feedback-panel-success'
                : 'result-text result-text-fail feedback-panel feedback-panel-fail'
            }
          >
            {riddleState.message}
          </p>
        ) : null}
        <div className="button-row">
          {riddleState.status !== 'success' && (
            <>
              <input
                className={
                  riddleState.status === 'fail'
                    ? 'answer-input answer-input-fail'
                    : 'answer-input'
                }
                inputMode="numeric"
                pattern="[0-9]*"
                value={riddleAnswer}
                onChange={(e) => onRiddleAnswerChange(e.target.value.replace(/\D/g, ''))}
                placeholder="Type a number"
                aria-label="Type your answer"
              />
              <button
                className="action-button"
                onClick={() => onRiddleSubmit(event)}
                type="button"
              >
                Check Answer
              </button>
            </>
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <p className="event-prompt">{event.promptByGrade[gradeBand]}</p>
      <p className="action-note feedback-panel feedback-panel-success">
        Reward found: {event.reward.label}
        {event.reward.description ? ` — ${event.reward.description}` : ''}
      </p>
      <div className="button-row">
        <button
          className="action-button"
          onClick={() => onResolve(event, 'success')}
          type="button"
        >
          Collect Reward
        </button>
      </div>
    </>
  )
}

function getSceneForGrade(scene: StoryScene, gradeBand: GradeBand) {
  if (scene.gradeBand === gradeBand) {
    return scene
  }

  return {
    ...scene,
    text: scene.text.map((line) =>
      gradeBand === '1-2' ? simplifyLine(line) : line,
    ) as StoryScene['text'],
  }
}

function simplifyLine(line: string) {
  return line
    .replace('carefully', 'slowly')
    .replace('whispers', 'says')
}

function normalizeAnswer(answer: string) {
  return answer.trim().toLowerCase()
}

function getCombatOptionClassName(
  optionText: string,
  correctAnswer: string,
  combatState: {
    status: 'idle' | 'success' | 'fail'
    message: string
    selectedAnswer: string | null
  },
) {
  const normalizedOption = normalizeAnswer(optionText)
  const normalizedCorrect = normalizeAnswer(correctAnswer)

  if (combatState.status !== 'idle' && normalizedOption === normalizedCorrect) {
    return 'action-button answer-button answer-button-correct'
  }

  if (
    combatState.selectedAnswer &&
    normalizedOption === combatState.selectedAnswer &&
    combatState.status === 'fail'
  ) {
    return 'action-button answer-button answer-button-wrong'
  }

  return 'action-button answer-button'
}
