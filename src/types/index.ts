// ─── Package ──────────────────────────────────────────────────────────────────

export type PackageType = 'sessions' | 'time'

export interface SessionPackage {
  type: 'sessions'
  total: number
  remaining: number
  price: number
}

export interface TimePackage {
  type: 'time'
  months: number
  price: number
}

export type ClientPackage = SessionPackage | TimePackage

// ─── Session ─────────────────────────────────────────────────────────────────

export type SessionStatus = 'Upcoming' | 'Done' | 'Missed'

export interface Session {
  id: string
  date: string       // ISO format: YYYY-MM-DD
  time: string       // HH:mm
  status: SessionStatus
  notes: string
  confirmed: boolean
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface ProgressEntry {
  id: string
  week: number
  date: string
  weight: number
  bodyFat?: number
  notes: string
  photos: string[]   // mock: array of labels e.g. ['front', 'side']
}

// ─── Client ───────────────────────────────────────────────────────────────────

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  goals: string
  health: string
  avatar: string       // 2-letter initials
  contractSigned: boolean
  contractDate: string
  contractExpiry: string
  contractTerms: string
  package: ClientPackage
  sessions: Session[]
  progress: ProgressEntry[]
}

// ─── PT Profile ───────────────────────────────────────────────────────────────

export interface PTProfile {
  id: string
  name: string
  email: string
  password: string   // mock only — never do this in production!
  signature: string
  avatar: string
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  text: string
  read: boolean
}

// ─── App State ────────────────────────────────────────────────────────────────

export interface AppState {
  isLoggedIn: boolean
  pt: PTProfile
  clients: Client[]
  notifications: Notification[]
}

// ─── Context Actions ──────────────────────────────────────────────────────────

export type AppAction =
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PT'; payload: Partial<PTProfile> }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Partial<Client> & { id: string } }
  | { type: 'ADD_SESSION'; clientId: string; payload: Session }
  | { type: 'UPDATE_SESSION'; clientId: string; payload: Partial<Session> & { id: string } }
  | { type: 'ADD_PROGRESS'; clientId: string; payload: ProgressEntry }
  | { type: 'UPDATE_PROGRESS'; clientId: string; payload: Partial<ProgressEntry> & { id: string } }
  | { type: 'MARK_NOTIF_READ'; id: string }
  | { type: 'CONFIRM_SESSION'; clientId: string; sessionId: string }

// ─── Form types ───────────────────────────────────────────────────────────────

export interface CreateClientForm {
  name: string
  email: string
  phone: string
  goals: string
  health: string
  packageType: PackageType
  sessions: string
  months: string
  price: string
  terms: string
}
