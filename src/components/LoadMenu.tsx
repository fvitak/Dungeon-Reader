import { useState } from 'react'
import type { SaveSlot } from '../types/save'
import { getSaves, deleteSave, formatSaveDate } from '../utils/saveSystem'

interface LoadMenuProps {
  onLoad: (save: SaveSlot) => void
  onBack: () => void
}

export function LoadMenu({ onLoad, onBack }: LoadMenuProps) {
  const [saves, setSaves] = useState<SaveSlot[]>(() => getSaves())
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  function handleDelete(id: string) {
    deleteSave(id)
    setSaves(getSaves())
    setConfirmDelete(null)
  }

  return (
    <main className="app-shell">
      <section className="game-card scene-card-enter load-menu">
        <header className="menu-header">
          <h1 className="menu-title">Load Game</h1>
          <button className="back-button" onClick={onBack} type="button">
            ← Back
          </button>
        </header>

        {saves.length === 0 ? (
          <p className="trophy-empty">No saved games yet.</p>
        ) : (
          <ul className="save-list">
            {saves.map(save => (
              <li key={save.id} className="save-slot">
                {confirmDelete === save.id ? (
                  <div className="save-slot-confirm">
                    <p className="save-slot-confirm-text">Delete "{save.name}"?</p>
                    <div className="save-slot-confirm-buttons">
                      <button
                        className="action-button delete-confirm-btn"
                        onClick={() => handleDelete(save.id)}
                        type="button"
                      >
                        Delete
                      </button>
                      <button
                        className="action-button skip-btn"
                        onClick={() => setConfirmDelete(null)}
                        type="button"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      className="save-slot-load"
                      onClick={() => onLoad(save)}
                      type="button"
                    >
                      <span className="save-slot-name">{save.name}</span>
                      <span className="save-slot-chapter">{save.chapterName}</span>
                      <div className="save-slot-meta">
                        <span className="stat-pill">📖 {save.readingRank}</span>
                        <span className="stat-pill">🔢 {save.mathRank}</span>
                        <span className="save-slot-xp">⭐ {save.xp} XP</span>
                        <span className="save-slot-date">{formatSaveDate(save.timestamp)}</span>
                      </div>
                      <span className="save-slot-episode">{save.episodeTitle}</span>
                    </button>
                    <button
                      className="save-slot-delete"
                      onClick={() => setConfirmDelete(save.id)}
                      type="button"
                      aria-label={`Delete save: ${save.name}`}
                    >
                      ✕
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
