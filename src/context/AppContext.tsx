import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react'
import type { AppState, AppAction } from '@/types'
import { MOCK_PT, MOCK_CLIENTS, MOCK_NOTIFICATIONS } from '@/data/mockData'
import { loadState, saveState } from '@/lib/storage'

// ─── Initial State ────────────────────────────────────────────────────────────

const defaultState: AppState = {
  isLoggedIn: false,
  pt: MOCK_PT,
  clients: MOCK_CLIENTS,
  notifications: MOCK_NOTIFICATIONS,
}

const initialState: AppState = loadState() ?? defaultState

// ─── Reducer ──────────────────────────────────────────────────────────────────

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isLoggedIn: true }

    case 'LOGOUT':
      return { ...state, isLoggedIn: false }

    case 'UPDATE_PT':
      return { ...state, pt: { ...state.pt, ...action.payload } }

    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] }

    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        ),
      }

    case 'ADD_SESSION':
      return {
        ...state,
        clients: state.clients.map((c) =>
          c.id === action.clientId
            ? { ...c, sessions: [...c.sessions, action.payload] }
            : c
        ),
      }

    case 'UPDATE_SESSION':
      return {
        ...state,
        clients: state.clients.map((c) =>
          c.id === action.clientId
            ? {
                ...c,
                sessions: c.sessions.map((s) =>
                  s.id === action.payload.id ? { ...s, ...action.payload } : s
                ),
              }
            : c
        ),
      }

    case 'ADD_PROGRESS':
      return {
        ...state,
        clients: state.clients.map((c) =>
          c.id === action.clientId
            ? { ...c, progress: [...c.progress, action.payload] }
            : c
        ),
      }

    case 'UPDATE_PROGRESS':
      return {
        ...state,
        clients: state.clients.map((c) =>
          c.id === action.clientId
            ? {
                ...c,
                progress: c.progress.map((p) =>
                  p.id === action.payload.id ? { ...p, ...action.payload } : p
                ),
              }
            : c
        ),
      }

    case 'MARK_NOTIF_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.id ? { ...n, read: true } : n
        ),
      }

    case 'CONFIRM_SESSION':
      return {
        ...state,
        clients: state.clients.map((c) =>
          c.id === action.clientId
            ? {
                ...c,
                sessions: c.sessions.map((s) =>
                  s.id === action.sessionId ? { ...s, confirmed: true } : s
                ),
              }
            : c
        ),
      }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const AppContext = createContext<AppContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Persist state to localStorage on every change
  useEffect(() => {
    saveState(state)
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
