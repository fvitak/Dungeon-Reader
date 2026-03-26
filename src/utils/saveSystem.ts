import type { SaveSlot } from '../types/save'

const STORAGE_KEY = 'dungeon-reader-saves'
const MAX_SAVES = 10

function loadAll(): SaveSlot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persistAll(saves: SaveSlot[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves))
  } catch {
    // storage quota exceeded — silently fail
  }
}

export function getSaves(): SaveSlot[] {
  return loadAll().sort((a, b) => b.timestamp - a.timestamp)
}

export function createSave(slot: Omit<SaveSlot, 'id' | 'timestamp'>): SaveSlot {
  const saves = loadAll()

  const newSave: SaveSlot = {
    ...slot,
    id: `save-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
  }

  // Prepend, trim to max
  const updated = [newSave, ...saves].slice(0, MAX_SAVES)
  persistAll(updated)
  return newSave
}

export function updateSave(
  id: string,
  updates: Partial<Omit<SaveSlot, 'id'>>,
): SaveSlot | undefined {
  const saves = loadAll()
  const index = saves.findIndex(save => save.id === id)

  if (index === -1) {
    return undefined
  }

  const updatedSave: SaveSlot = {
    ...saves[index],
    ...updates,
    id,
    timestamp: Date.now(),
  }

  saves[index] = updatedSave
  persistAll(saves)
  return updatedSave
}

export function deleteSave(id: string): void {
  const saves = loadAll().filter(s => s.id !== id)
  persistAll(saves)
}

export function hasSaves(): boolean {
  return loadAll().length > 0
}

export function formatSaveDate(timestamp: number): string {
  const d = new Date(timestamp)
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
