import { useState } from 'react'

interface NewStudentModalProps {
  onConfirm: (studentName: string) => void
  onCancel: () => void
}

export function NewStudentModal({ onConfirm, onCancel }: NewStudentModalProps) {
  const [studentName, setStudentName] = useState('')

  function handleConfirm() {
    const trimmed = studentName.trim()
    onConfirm(trimmed || 'New Student')
  }

  return (
    <div className="save-modal-overlay" role="dialog" aria-modal="true" aria-label="Create a new student">
      <div className="save-modal">
        <h2 className="save-modal-title">New Student</h2>
        <div className="save-modal-info">
          <span className="save-info-chapter">This student name becomes the save file.</span>
          <div className="save-info-ranks">
            <span className="stat-pill">Reading R1</span>
            <span className="stat-pill">Math M1</span>
          </div>
        </div>
        <p className="save-modal-label">Student name</p>
        <input
          className="save-name-input"
          type="text"
          placeholder="Enter student name"
          maxLength={30}
          value={studentName}
          onChange={event => setStudentName(event.target.value)}
          onKeyDown={event => event.key === 'Enter' && handleConfirm()}
          autoFocus
        />
        <div className="save-modal-buttons">
          <button className="action-button save-btn" onClick={handleConfirm} type="button">
            Start Adventure
          </button>
          <button className="action-button skip-btn" onClick={onCancel} type="button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
