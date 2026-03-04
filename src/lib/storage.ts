import type { AppState } from '@/types'

const LS_KEY = 'pt_manager_v1'

export function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? (JSON.parse(raw) as AppState) : null
  } catch {
    return null
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state))
  } catch {
    console.warn('Could not persist state to localStorage')
  }
}

export function clearState(): void {
  localStorage.removeItem(LS_KEY)
}
