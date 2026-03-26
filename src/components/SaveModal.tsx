import { useState } from 'react'

interface SaveModalProps {
  chapterName: string
  mathRank: string
  readingRank: string
  onSave: (name: string) => void
  onSkip: () => void
}

export function SaveModal({ chapterName, mathRank, readingRank, onSave, onSkip }: SaveModalProps) {
  const [name, setName] = useState('')

  function handleSave() {
    const trimmed = name.trim()
    onSave(trimmed || 'My Adventure')
  }

  return (
    <div className="save-modal-overlay" role="dialog" aria-modal="true" aria-label="Save your game">
      <div className="save-modal">
        <h2 className="save-modal-title">💾 Save Your Adventure?</h2>

        <div className="save-modal-info">
          <span className="save-info-chapter">{chapterName} complete!</span>
          <div className="save-info-ranks">
            <span className="stat-pill">📖 {readingRank}</span>
            <span className="stat-pill">🔢 {mathRank}</span>
          </div>
        </div>

        <p className="save-modal-label">Name this save:</p>
        <input
          className="save-name-input"
          type="text"
          placeholder="My Adventure"
          maxLength={30}
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
        />

        <div className="save-modal-buttons">
          <button
            className="action-button save-btn"
            onClick={handleSave}
            type="button"
          >
            💾 Save &amp; Continue
          </button>
          <button
            className="action-button skip-btn"
            onClick={onSkip}
            type="button"
          >
            Continue without saving
          </button>
        </div>
      </div>
    </div>
  )
}
