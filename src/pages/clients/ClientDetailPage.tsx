import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useClients } from '@/hooks/useClients'
import { useApp } from '@/context/AppContext'
import { Card, Avatar, Badge, Btn, Input, Textarea, Icon } from '@/components/ui'
import TopBar from '@/components/layout/TopBar'
import type { Session, ProgressEntry } from '@/types'
import { fmtDate } from '@/lib/dateUtils'

const AVATAR_COLORS = ['bg-indigo-500', 'bg-purple-500', 'bg-teal-500', 'bg-rose-500', 'bg-amber-500']
type Tab = 'info' | 'contract' | 'schedule' | 'progress'

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { clients } = useClients()
  const [tab, setTab] = useState<Tab>('info')

  const client = clients.find((c) => c.id === id)
  const colorIdx = clients.findIndex((c) => c.id === id) % AVATAR_COLORS.length

  if (!client) return (
    <>
      <TopBar title="Client" back="/clients" />
      <div className="pt-16 pb-24 flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Client not found.</p>
      </div>
    </>
  )

  const shareLink = () => {
    const url = `${window.location.origin}/client/${client.id}`
    navigator.clipboard?.writeText(url).catch(() => {})
    alert(`Link copied!\n${url}`)
  }

  const TABS: Tab[] = ['info', 'contract', 'schedule', 'progress']

  return (
    <>
      <TopBar
        title={client.name}
        back="/clients"
        actions={
          <button onClick={shareLink} className="text-gray-500 p-1">
            <Icon name="share" className="w-5 h-5" />
          </button>
        }
      />
      <div className="pt-16 pb-24 min-h-screen bg-gray-50">
        {/* Hero */}
        <div className={`${AVATAR_COLORS[colorIdx]} px-4 pt-4 pb-6`}>
          <div className="max-w-md mx-auto flex items-center gap-3">
            <Avatar initials={client.avatar} size="lg" color="bg-white/20" />
            <div>
              <h2 className="text-white font-bold text-lg">{client.name}</h2>
              <p className="text-white/80 text-sm">{client.email}</p>
              <p className="text-white/70 text-xs mt-0.5">
                {client.package.type === 'sessions'
                  ? `${client.package.remaining}/${client.package.total} sessions remaining`
                  : `${client.package.months}-month package`}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-14 z-30 bg-white border-b border-gray-200">
          <div className="flex max-w-md mx-auto">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors border-b-2
                  ${tab === t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-4 max-w-md mx-auto">
          {tab === 'info'     && <InfoTab     clientId={client.id} />}
          {tab === 'contract' && <ContractTab clientId={client.id} />}
          {tab === 'schedule' && <ScheduleTab clientId={client.id} />}
          {tab === 'progress' && <ProgressTab clientId={client.id} />}
        </div>
      </div>
    </>
  )
}

// ─── Info Tab ─────────────────────────────────────────────────────────────────

function InfoTab({ clientId }: { clientId: string }) {
  const { getClient, updateClient } = useClients()
  const client = getClient(clientId)!
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ email: client.email, phone: client.phone, goals: client.goals, health: client.health })

  const save = () => { updateClient(clientId, form); setEditing(false) }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Client Information</h3>
        <button onClick={() => setEditing(!editing)} className="text-indigo-600 text-sm font-semibold flex items-center gap-1">
          <Icon name="edit" className="w-4 h-4" />
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      {editing ? (
        <div className="space-y-3">
          <Input label="Email"        value={form.email}  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          <Input label="Phone"        value={form.phone}  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          <Textarea label="Goals"     value={form.goals}  onChange={(e) => setForm((f) => ({ ...f, goals: e.target.value }))} />
          <Textarea label="Health Notes" value={form.health} onChange={(e) => setForm((f) => ({ ...f, health: e.target.value }))} />
          <Btn onClick={save} className="w-full">Save Changes</Btn>
        </div>
      ) : (
        <div className="space-y-3">
          {[
            { label: 'Email',        value: client.email  },
            { label: 'Phone',        value: client.phone  },
            { label: 'Goals',        value: client.goals  },
            { label: 'Health Notes', value: client.health },
          ].map((f) => (
            <Card key={f.label} className="p-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{f.label}</p>
              <p className="text-sm text-gray-800">{f.value || '—'}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Contract Tab ─────────────────────────────────────────────────────────────

function ContractTab({ clientId }: { clientId: string }) {
  const { getClient, signContract } = useClients()
  const client = getClient(clientId)!

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-gray-900">Contract</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${client.contractSigned ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
          {client.contractSigned ? '✓ Signed' : 'Unsigned'}
        </span>
      </div>
      <Card className="p-4 space-y-3">
        {[
          { label: 'Package',    value: client.package.type === 'sessions' ? `${client.package.total} Sessions` : `${client.package.months} Months` },
          { label: 'Price',      value: `${client.package.price.toLocaleString()} VND` },
          { label: 'Start Date', value: client.contractDate },
          { label: 'Expiry',     value: client.contractExpiry },
        ].map((r) => (
          <div key={r.label} className="flex justify-between text-sm">
            <span className="text-gray-500">{r.label}</span>
            <span className="font-semibold">{r.value}</span>
          </div>
        ))}
      </Card>
      <Card className="p-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Terms & Conditions</p>
        <p className="text-sm text-gray-700 leading-relaxed">{client.contractTerms}</p>
      </Card>
      {!client.contractSigned ? (
        <div className="space-y-2">
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-400">Client signature area</p>
          </div>
          <Btn className="w-full" onClick={() => signContract(clientId)}>Mark as Signed ✓</Btn>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-sm text-emerald-800">
          ✅ Contract signed and active.
        </div>
      )}
    </div>
  )
}

// ─── Schedule Tab ─────────────────────────────────────────────────────────────

function ScheduleTab({ clientId }: { clientId: string }) {
  const { getClient, addSession, markSessionDone, markSessionMissed } = useClients()
  const client = getClient(clientId)!
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ date: fmtDate(new Date()), time: '07:00', notes: '' })

  const handleAdd = () => {
    const session: Omit<Session, 'id'> = { ...form, status: 'Upcoming', confirmed: false }
    addSession(clientId, session)
    setForm({ date: fmtDate(new Date()), time: '07:00', notes: '' })
    setShowAdd(false)
  }

  const sorted = [...client.sessions].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Sessions ({client.sessions.length})</h3>
        <Btn variant="outline" className="text-xs py-1.5 px-3" onClick={() => setShowAdd(!showAdd)}>
          + Add Session
        </Btn>
      </div>

      {showAdd && (
        <Card className="p-4 space-y-3 border-indigo-100 border-2">
          <h4 className="font-semibold text-sm text-gray-800">New Session</h4>
          <Input label="Date" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          <Input label="Time" type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
          <Textarea label="Notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
          <div className="flex gap-2">
            <Btn variant="secondary" className="flex-1 text-xs" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn className="flex-1 text-xs" onClick={handleAdd}>Add Session</Btn>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {sorted.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">No sessions yet. Add the first one!</p>
        )}
        {sorted.map((s) => (
          <Card key={s.id} className="p-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex flex-col items-center justify-center text-center flex-shrink-0">
                <span className="text-xs font-bold text-gray-700">
                  {new Date(s.date + 'T12:00:00').toLocaleDateString('en', { month: 'short' })}
                </span>
                <span className="text-sm font-black text-gray-900">
                  {new Date(s.date + 'T12:00:00').getDate()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-800">{s.time}</span>
                  <Badge status={s.status} />
                  {s.confirmed && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">✓ Confirmed</span>
                  )}
                </div>
                {s.notes && <p className="text-xs text-gray-500 truncate">{s.notes}</p>}
                {s.status === 'Upcoming' && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => markSessionDone(clientId, s.id)}
                      className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg font-semibold hover:bg-emerald-100 transition-colors">
                      ✓ Done
                    </button>
                    <button onClick={() => markSessionMissed(clientId, s.id)}
                      className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-lg font-semibold hover:bg-red-100 transition-colors">
                      ✕ Missed
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Progress Tab ─────────────────────────────────────────────────────────────

function ProgressTab({ clientId }: { clientId: string }) {
  const { getClient, addProgress, addPhoto } = useClients()
  const client = getClient(clientId)!
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ weight: '', bodyFat: '', notes: '' })

  const handleAdd = () => {
    const entry: Omit<ProgressEntry, 'id'> = {
      week: client.progress.length + 1,
      date: fmtDate(new Date()),
      weight: +form.weight,
      bodyFat: form.bodyFat ? +form.bodyFat : undefined,
      notes: form.notes,
      photos: [],
    }
    addProgress(clientId, entry)
    setForm({ weight: '', bodyFat: '', notes: '' })
    setShowAdd(false)
  }

  const handleAddPhoto = (entryId: string) => {
    const label = prompt('Photo label (e.g. front, side, back):')
    if (label) addPhoto(clientId, entryId, label)
  }

  const sorted = [...client.progress].sort((a, b) => b.week - a.week)
  const allWeights = client.progress.map((p) => p.weight)
  const minW = Math.min(...allWeights)
  const maxW = Math.max(...allWeights)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Progress ({client.progress.length} entries)</h3>
        <Btn variant="outline" className="text-xs py-1.5 px-3" onClick={() => setShowAdd(!showAdd)}>
          + Add Entry
        </Btn>
      </div>

      {showAdd && (
        <Card className="p-4 space-y-3 border-indigo-100 border-2">
          <h4 className="font-semibold text-sm text-gray-800">Week {client.progress.length + 1}</h4>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Weight (kg)"  type="number" value={form.weight}  onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}  placeholder="70.5" />
            <Input label="Body Fat %"   type="number" value={form.bodyFat} onChange={(e) => setForm((f) => ({ ...f, bodyFat: e.target.value }))} placeholder="22.0" />
          </div>
          <Textarea label="Notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} />
          <div className="flex gap-2">
            <Btn variant="secondary" className="flex-1 text-xs" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn className="flex-1 text-xs" onClick={handleAdd} disabled={!form.weight}>Save Entry</Btn>
          </div>
        </Card>
      )}

      {/* Mini chart */}
      {client.progress.length > 1 && (
        <Card className="p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Weight Trend</p>
          <div className="flex items-end gap-1 h-16">
            {client.progress.map((p, i) => {
              const h = maxW === minW ? 50 : ((p.weight - minW) / (maxW - minW)) * 60 + 10
              return (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-[9px] text-gray-500">{p.weight}</span>
                  <div className="bg-indigo-400 w-full rounded-t" style={{ height: `${h}%` }} />
                </div>
              )
            })}
          </div>
          <div className="flex gap-1 mt-1">
            {client.progress.map((p, i) => (
              <div key={i} className="flex-1 text-center text-[9px] text-gray-400">W{p.week}</div>
            ))}
          </div>
        </Card>
      )}

      <div className="space-y-3">
        {sorted.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No progress entries yet.</p>}
        {sorted.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase">Week {p.week}</span>
                <p className="text-xs text-gray-400">{p.date}</p>
                {p.notes && <p className="text-sm text-gray-600 mt-1">{p.notes}</p>}
              </div>
              <div className="text-right">
                <p className="font-black text-lg text-gray-900">{p.weight}<span className="text-xs text-gray-400 font-normal">kg</span></p>
                {p.bodyFat && <p className="text-xs text-gray-500">{p.bodyFat}% body fat</p>}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {p.photos.map((ph, i) => (
                <div key={i} className="bg-gray-100 rounded-lg px-2 py-1 flex items-center gap-1">
                  <Icon name="camera" className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{ph}</span>
                </div>
              ))}
              <button onClick={() => handleAddPhoto(p.id)}
                className="bg-indigo-50 hover:bg-indigo-100 rounded-lg px-2 py-1 flex items-center gap-1 transition-colors">
                <Icon name="plus" className="w-3 h-3 text-indigo-400" />
                <span className="text-xs text-indigo-600">Photo</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
