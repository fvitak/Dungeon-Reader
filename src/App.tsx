import { useState } from 'react'
import './styles/app.css'
import { RootwoodShell } from './components/RootwoodShell'
import { LoadMenu } from './components/LoadMenu'
import { NewStudentModal } from './components/NewStudentModal'
import { rootwoodEpisode1Meta } from './data/rootwoodEpisode1'
import { createInitialGameState } from './game/useGameEngine'
import { createSave, hasSaves } from './utils/saveSystem'
import type { SaveSlot } from './types/save'

export interface TrophyItem {
  id: string
  label: string
  description: string
  episodeId: string
}

type Screen = 'intro' | 'menu' | 'playing' | 'trophy' | 'load'

const EPISODES = [
  {
    id: rootwoodEpisode1Meta.id,
    title: rootwoodEpisode1Meta.title,
    subtitle: 'Episode 1',
    minutes: rootwoodEpisode1Meta.estimatedMinutes,
  },
  {
    id: 'rootwood-ep2',
    title: 'The Creature That Wouldn\'t Leave',
    subtitle: 'Episode 2',
    minutes: 12,
    comingSoon: true,
  },
  {
    id: 'rootwood-ep3',
    title: 'The Library That Bit Back',
    subtitle: 'Episode 3',
    minutes: 13,
    comingSoon: true,
  },
]

function App() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [completedEpisodes, setCompletedEpisodes] = useState<string[]>([])
  const [trophies, setTrophies] = useState<TrophyItem[]>([])
  const [activeSave, setActiveSave] = useState<SaveSlot | undefined>(undefined)
  const [showNewStudentModal, setShowNewStudentModal] = useState(false)

  function handleEpisodeComplete(episodeId: string, rewards: TrophyItem[]) {
    setCompletedEpisodes(prev => Array.from(new Set([...prev, episodeId])))
    setTrophies(prev => {
      const existingIds = new Set(prev.map(t => t.id))
      return [...prev, ...rewards.filter(r => !existingIds.has(r.id))]
    })
    setScreen('menu')
  }

  function handleLoadSave(save: SaveSlot) {
    setActiveSave(save)
    setScreen('playing')
  }

  function handleCreateStudent(studentName: string) {
    const initialState = createInitialGameState(rootwoodEpisode1Meta.initialSceneId)
    const save = createSave({
      name: studentName,
      episodeId: rootwoodEpisode1Meta.id,
      episodeTitle: rootwoodEpisode1Meta.title,
      chapterName: 'Chapter 1: The Door',
      chapterNumber: 1,
      sceneId: rootwoodEpisode1Meta.initialSceneId,
      mathRank: initialState.skillProfile.math,
      readingRank: initialState.skillProfile.reading,
      xp: initialState.stats.xp,
      gameState: initialState,
    })

    setActiveSave(save)
    setShowNewStudentModal(false)
    setScreen('playing')
  }

  function handleSaveChange(save: SaveSlot) {
    setActiveSave(save)
  }

  function isUnlocked(_episodeId: string, index: number) {
    if (index === 0) return true
    return completedEpisodes.includes(EPISODES[index - 1].id)
  }

  const savesExist = hasSaves()

  if (screen === 'intro') {
    return (
      <main className="intro-shell">
        <div className="intro-card scene-card-enter">
          <p className="intro-eyebrow">Rootwood Academy</p>
          <h1 className="intro-title">Dungeon Reader</h1>
          <p className="intro-tagline">
            A school lives inside the world&apos;s oldest tree.
            <br />
            Something is already wrong.
          </p>
          <div className="intro-buttons">
            <button
              className="action-button intro-start-btn"
              onClick={() => setShowNewStudentModal(true)}
              type="button"
            >
              New Student
            </button>
            <button
              className="action-button intro-load-btn"
              onClick={() => setScreen('load')}
              type="button"
            >
              Returning Student
            </button>
          </div>
          {showNewStudentModal ? (
            <NewStudentModal
              onConfirm={handleCreateStudent}
              onCancel={() => setShowNewStudentModal(false)}
            />
          ) : null}
        </div>
      </main>
    )
  }

  if (screen === 'load') {
    return (
      <LoadMenu
        onLoad={handleLoadSave}
        onBack={() => setScreen(activeSave ? 'menu' : 'intro')}
      />
    )
  }

  if (screen === 'menu') {
    return (
      <main className="app-shell">
        <section className="game-card scene-card-enter menu-card">
          <header className="menu-header">
            <h1 className="menu-title">Dungeon Reader</h1>
            <p className="menu-subtitle">Rootwood Academy</p>
            {activeSave ? (
              <p className="menu-student-name">Student: {activeSave.name}</p>
            ) : null}
          </header>

          <div className="episode-list">
            {EPISODES.map((episode, index) => {
              const completed = completedEpisodes.includes(episode.id)
              const locked = episode.comingSoon || !isUnlocked(episode.id, index)

              return (
                <button
                  key={episode.id}
                  className={`episode-card ${locked ? 'episode-card-locked' : ''} ${completed ? 'episode-card-done' : ''}`}
                  onClick={() => !locked && setScreen('playing')}
                  disabled={locked}
                  type="button"
                >
                  <span className="episode-label">{episode.subtitle}</span>
                  <span className="episode-title">{episode.title}</span>
                  <span className="episode-meta">
                    {episode.comingSoon
                      ? 'Locked: Coming Soon'
                      : completed
                        ? 'Completed'
                        : `~${episode.minutes} min`}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="menu-actions">
            {savesExist ? (
              <button
                className="action-button load-button"
                onClick={() => setScreen('load')}
                type="button"
              >
                Switch Student
              </button>
            ) : null}
            <button
              className="action-button trophy-button"
              onClick={() => setScreen('trophy')}
              type="button"
            >
              Trophy Case
            </button>
          </div>
        </section>
      </main>
    )
  }

  if (screen === 'trophy') {
    return (
      <main className="app-shell">
        <section className="game-card scene-card-enter">
          <header className="trophy-header">
            <h2 className="trophy-title">Trophy Case</h2>
            <button
              className="back-button"
              onClick={() => setScreen('menu')}
              type="button"
            >
              Back
            </button>
          </header>

          {trophies.length === 0 ? (
            <p className="trophy-empty">
              Nothing here yet. Complete an episode to earn your first trophy.
            </p>
          ) : (
            <ul className="trophy-list">
              {trophies.map(trophy => (
                <li key={trophy.id} className="trophy-item">
                  <span className="trophy-item-label">{trophy.label}</span>
                  <span className="trophy-item-desc">{trophy.description}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    )
  }

  return (
    <RootwoodShell
      onComplete={handleEpisodeComplete}
      onBack={() => setScreen('menu')}
      initialSave={activeSave}
      onSaveChange={handleSaveChange}
    />
  )
}

export default App
