import { useState } from 'react'
import './styles/app.css'
import { RootwoodShell } from './components/RootwoodShell'
import { rootwoodEpisode1Meta } from './data/rootwoodEpisode1'

export interface TrophyItem {
  id: string
  label: string
  description: string
  episodeId: string
}

type Screen = 'intro' | 'menu' | 'playing' | 'trophy'

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

  function handleEpisodeComplete(episodeId: string, rewards: TrophyItem[]) {
    setCompletedEpisodes(prev => Array.from(new Set([...prev, episodeId])))
    setTrophies(prev => {
      const existingIds = new Set(prev.map(t => t.id))
      return [...prev, ...rewards.filter(r => !existingIds.has(r.id))]
    })
    setScreen('menu')
  }

  function isUnlocked(_episodeId: string, index: number) {
    if (index === 0) return true
    return completedEpisodes.includes(EPISODES[index - 1].id)
  }

  if (screen === 'intro') {
    return (
      <main className="intro-shell">
        <div className="intro-card scene-card-enter">
          <p className="intro-eyebrow">Rootwood Academy</p>
          <h1 className="intro-title">Dungeon Reader</h1>
          <p className="intro-tagline">
            A school lives inside the world's oldest tree.<br />
            Something is already wrong.
          </p>
          <button
            className="action-button intro-start-btn"
            onClick={() => setScreen('menu')}
            type="button"
          >
            Start
          </button>
        </div>
      </main>
    )
  }

  if (screen === 'menu') {
    return (
      <main className="app-shell">
        <section className="game-card scene-card-enter menu-card">
          <header className="menu-header">
            <h1 className="menu-title">Dungeon Reader</h1>
            <p className="menu-subtitle">Rootwood Academy</p>
          </header>

          <div className="episode-list">
            {EPISODES.map((ep, i) => {
              const completed = completedEpisodes.includes(ep.id)
              const locked = ep.comingSoon || !isUnlocked(ep.id, i)

              return (
                <button
                  key={ep.id}
                  className={`episode-card ${locked ? 'episode-card-locked' : ''} ${completed ? 'episode-card-done' : ''}`}
                  onClick={() => !locked && setScreen('playing')}
                  disabled={locked}
                  type="button"
                >
                  <span className="episode-label">{ep.subtitle}</span>
                  <span className="episode-title">{ep.title}</span>
                  <span className="episode-meta">
                    {ep.comingSoon
                      ? '🔒 Coming Soon'
                      : completed
                        ? '✓ Completed'
                        : `~${ep.minutes} min`}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="menu-actions">
            <button
              className="action-button trophy-button"
              onClick={() => setScreen('trophy')}
              type="button"
            >
              🏆 Trophy Case
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
              ← Back
            </button>
          </header>

          {trophies.length === 0 ? (
            <p className="trophy-empty">
              Nothing here yet. Complete an episode to earn your first trophy.
            </p>
          ) : (
            <ul className="trophy-list">
              {trophies.map(t => (
                <li key={t.id} className="trophy-item">
                  <span className="trophy-item-label">{t.label}</span>
                  <span className="trophy-item-desc">{t.description}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    )
  }

  // screen === 'playing'
  return (
    <RootwoodShell
      onComplete={handleEpisodeComplete}
      onBack={() => setScreen('menu')}
    />
  )
}

export default App
