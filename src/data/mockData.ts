import type { PTProfile, Client, Notification } from '@/types'
import { fmtDate, addDays } from '@/lib/dateUtils'

// ─── PT Profile ───────────────────────────────────────────────────────────────

export const MOCK_PT: PTProfile = {
  id: 'pt1',
  name: 'Alex Rivera',
  email: 'pt@example.com',
  password: '123', // mock only
  signature: 'Alex Rivera, CPT',
  avatar: 'AR',
}

// ─── Mock Clients ─────────────────────────────────────────────────────────────

const today = new Date()

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Nguyễn Văn A',
    email: 'vana@email.com',
    phone: '0912345678',
    goals: 'Lose 5kg, improve cardiovascular fitness',
    health: 'No known conditions',
    avatar: 'NA',
    contractSigned: true,
    package: { type: 'sessions', total: 20, remaining: 12, price: 4_000_000 },
    contractDate: '2024-09-01',
    contractExpiry: '2024-12-01',
    contractTerms: 'No make-up sessions beyond expiration. 24h cancellation notice required.',
    sessions: [
      { id: 's1', date: fmtDate(addDays(today, -7)), time: '07:00', status: 'Done',     notes: 'Great energy today', confirmed: false },
      { id: 's2', date: fmtDate(addDays(today, -3)), time: '07:00', status: 'Missed',   notes: '',                   confirmed: false },
      { id: 's3', date: fmtDate(today),               time: '07:00', status: 'Upcoming', notes: '',                   confirmed: false },
      { id: 's4', date: fmtDate(addDays(today, 3)),   time: '07:00', status: 'Upcoming', notes: '',                   confirmed: false },
    ],
    progress: [
      { id: 'p1', week: 1, date: '2024-09-07', weight: 82,   bodyFat: 24,   notes: 'Starting measurements', photos: ['front', 'side'] },
      { id: 'p2', week: 2, date: '2024-09-14', weight: 81.2, bodyFat: 23.5, notes: 'Good progress',          photos: ['front'] },
      { id: 'p3', week: 3, date: '2024-09-21', weight: 80.5, bodyFat: 23.1, notes: 'Consistent',             photos: ['front', 'side'] },
    ],
  },
  {
    id: 'c2',
    name: 'Trần Thị B',
    email: 'thib@email.com',
    phone: '0987654321',
    goals: 'Build muscle, gain strength',
    health: 'Mild lower back pain',
    avatar: 'TB',
    contractSigned: true,
    package: { type: 'sessions', total: 12, remaining: 6, price: 2_800_000 },
    contractDate: '2024-10-01',
    contractExpiry: '2024-12-31',
    contractTerms: 'No make-up sessions beyond expiration. 24h cancellation notice required.',
    sessions: [
      { id: 's5', date: fmtDate(addDays(today, -5)), time: '09:00', status: 'Done',     notes: '',  confirmed: false },
      { id: 's6', date: fmtDate(addDays(today, 1)),  time: '09:00', status: 'Upcoming', notes: '',  confirmed: true },
    ],
    progress: [
      { id: 'p4', week: 1, date: '2024-10-05', weight: 55,   bodyFat: 28,   notes: 'Baseline',          photos: ['front'] },
      { id: 'p5', week: 2, date: '2024-10-12', weight: 55.3, bodyFat: 27.8, notes: 'Slight muscle gain', photos: [] },
    ],
  },
  {
    id: 'c3',
    name: 'Lê Minh C',
    email: 'minhc@email.com',
    phone: '0901234567',
    goals: 'Marathon preparation',
    health: 'Healthy',
    avatar: 'LC',
    contractSigned: false,
    package: { type: 'time', months: 3, price: 6_000_000 },
    contractDate: '2024-10-15',
    contractExpiry: '2025-01-15',
    contractTerms: 'No make-up sessions beyond expiration. 24h cancellation notice required.',
    sessions: [
      { id: 's7', date: fmtDate(addDays(today, 2)), time: '06:00', status: 'Upcoming', notes: '', confirmed: false },
      { id: 's8', date: fmtDate(addDays(today, 5)), time: '06:00', status: 'Upcoming', notes: '', confirmed: false },
    ],
    progress: [],
  },
  {
    id: 'c4',
    name: 'Phạm Hương D',
    email: 'huongd@email.com',
    phone: '0932109876',
    goals: 'Post-pregnancy recovery, core strength',
    health: 'C-section 8 months ago',
    avatar: 'HD',
    contractSigned: true,
    package: { type: 'sessions', total: 8, remaining: 2, price: 2_000_000 },
    contractDate: '2024-09-15',
    contractExpiry: '2024-11-15',
    contractTerms: 'No make-up sessions beyond expiration. 24h cancellation notice required.',
    sessions: [
      { id: 's9',  date: fmtDate(addDays(today, -10)), time: '10:00', status: 'Done',     notes: 'Focus on core', confirmed: false },
      { id: 's10', date: fmtDate(addDays(today, 4)),   time: '10:00', status: 'Upcoming', notes: '',              confirmed: false },
    ],
    progress: [
      { id: 'p6', week: 1, date: '2024-09-20', weight: 62, bodyFat: 30, notes: 'Gentle start', photos: [] },
    ],
  },
]

// ─── Mock Notifications ───────────────────────────────────────────────────────

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', text: 'Nguyễn Văn A has a session today at 07:00', read: false },
  { id: 'n2', text: 'Phạm Hương D — only 2 sessions remaining!',  read: false },
]
