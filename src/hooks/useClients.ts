import { useApp } from '@/context/AppContext'
import type { Client, Session, ProgressEntry } from '@/types'
import { fmtDate } from '@/lib/dateUtils'

/**
 * Convenience hook encapsulating all client-related operations.
 * Components import this instead of calling dispatch directly.
 */
export function useClients() {
  const { state, dispatch } = useApp()

  const getClient = (id: string): Client | undefined =>
    state.clients.find((c) => c.id === id)

  const addClient = (client: Client) =>
    dispatch({ type: 'ADD_CLIENT', payload: client })

  const updateClient = (id: string, patch: Partial<Client>) =>
    dispatch({ type: 'UPDATE_CLIENT', payload: { id, ...patch } })

  const signContract = (clientId: string) =>
    updateClient(clientId, { contractSigned: true })

  // ─── Sessions ───────────────────────────────────────────────────────────────

  const addSession = (clientId: string, session: Omit<Session, 'id'>) => {
    const client = getClient(clientId)
    if (!client) return

    const newSession: Session = { ...session, id: 's' + Date.now() }
    dispatch({ type: 'ADD_SESSION', clientId, payload: newSession })

    // Decrement remaining sessions for session-based packages
    if (client.package.type === 'sessions') {
      updateClient(clientId, {
        package: {
          ...client.package,
          remaining: Math.max(0, client.package.remaining - 1),
        },
      })
    }
  }

  const markSessionDone = (clientId: string, sessionId: string) =>
    dispatch({
      type: 'UPDATE_SESSION',
      clientId,
      payload: { id: sessionId, status: 'Done' },
    })

  const markSessionMissed = (clientId: string, sessionId: string) =>
    dispatch({
      type: 'UPDATE_SESSION',
      clientId,
      payload: { id: sessionId, status: 'Missed' },
    })

  const confirmSession = (clientId: string, sessionId: string) =>
    dispatch({ type: 'CONFIRM_SESSION', clientId, sessionId })

  // ─── Progress ───────────────────────────────────────────────────────────────

  const addProgress = (clientId: string, entry: Omit<ProgressEntry, 'id'>) => {
    const newEntry: ProgressEntry = { ...entry, id: 'p' + Date.now() }
    dispatch({ type: 'ADD_PROGRESS', clientId, payload: newEntry })
  }

  const addPhoto = (clientId: string, entryId: string, label: string) => {
    const client = getClient(clientId)
    if (!client) return
    const updatedProgress = client.progress.map((p) =>
      p.id === entryId ? { ...p, photos: [...p.photos, label] } : p
    )
    updateClient(clientId, { progress: updatedProgress })
  }

  // ─── Derived data ────────────────────────────────────────────────────────────

  const todaySessions = state.clients.flatMap((c) =>
    c.sessions
      .filter((s) => s.date === fmtDate(new Date()))
      .map((s) => ({ ...s, client: c }))
  )

  const upcomingSessions = state.clients
    .flatMap((c) =>
      c.sessions
        .filter((s) => s.date > fmtDate(new Date()) && s.status === 'Upcoming')
        .map((s) => ({ ...s, client: c }))
    )
    .sort((a, b) => a.date.localeCompare(b.date))

  const lowSessionClients = state.clients.filter(
    (c) => c.package.type === 'sessions' && c.package.remaining <= 3
  )

  const totalRevenue = state.clients.reduce((sum, c) => sum + c.package.price, 0)

  return {
    clients: state.clients,
    getClient,
    addClient,
    updateClient,
    signContract,
    addSession,
    markSessionDone,
    markSessionMissed,
    confirmSession,
    addProgress,
    addPhoto,
    // derived
    todaySessions,
    upcomingSessions,
    lowSessionClients,
    totalRevenue,
  }
}
