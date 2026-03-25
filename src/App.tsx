import { useState } from 'react'
import './styles/app.css'
import { AppShell } from './components/AppShell'
import { RootwoodShell } from './components/RootwoodShell'

type Mode = 'classic' | 'rootwood' | null

function App() {
  const [mode, setMode] = useState<Mode>(null)

  if (!mode) {
    return (
      <main className="app-shell">
        <section className="game-card scene-card-enter">
          <section className="start-screen">
            <h1 className="start-title">Dungeon Reader</h1>
            <p className="start-copy">Choose your adventure!</p>
            <div className="choice-grid">
              <button
                className="action-button choice-button grade-start-button"
                onClick={() => setMode('rootwood')}
                type="button"
              >
                Rootwood Academy
              </button>
              <button
                className="action-button choice-button grade-start-button"
                onClick={() => setMode('classic')}
                type="button"
              >
                Classic Dungeon
              </button>
            </div>
          </section>
        </section>
      </main>
    )
  }

  if (mode === 'rootwood') return <RootwoodShell />
  return <AppShell />
}

export default App
