import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useClients } from '@/hooks/useClients'
import { Card, Badge, Icon } from '@/components/ui'
import { fmtDate } from '@/lib/dateUtils'

type PortalTab = 'schedule' | 'contract' | 'progress'

export default function ClientPortalPage() {
  const { id } = useParams<{ id: string }>()
  const { getClient, confirmSession } = useClients()
  const client = getClient(id ?? '')
  const [tab, setTab] = useState<PortalTab>('schedule')

  if (!client) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-gray-500">Client not found</p>
      </div>
    </div>
  )

  const todayStr = fmtDate(new Date())
  const todaySession = client.sessions.find((s) => s.date === todayStr && s.status === 'Upcoming')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-4 pt-8 pb-12">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-white">
            {client.avatar}
          </div>
          <h1 className="text-white text-xl font-bold">{client.name}</h1>
          <p className="text-indigo-200 text-sm mt-1">My Training Portal</p>
          {client.package.type === 'sessions' && (
            <div className="mt-3 inline-flex bg-white/20 rounded-full px-4 py-1.5 text-white text-sm font-semibold">
              {client.package.remaining} sessions remaining
            </div>
          )}
        </div>
      </div>

      {/* Today's session banner */}
      {todaySession && (
        <div className="max-w-md mx-auto px-4 -mt-6">
          <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 font-bold text-lg">
              📅
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">Session Today!</p>
              <p className="text-xs text-gray-500">{todaySession.time}</p>
            </div>
            {todaySession.confirmed ? (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-semibold">
                ✓ Confirmed
              </span>
            ) : (
              <button
                onClick={() => confirmSession(client.id, todaySession.id)}
                className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 mt-4">
        <div className="flex max-w-md mx-auto">
          {(['schedule', 'contract', 'progress'] as PortalTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs font-semibold capitalize transition-colors border-b-2
                ${tab === t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 max-w-md mx-auto">

        {/* Schedule */}
        {tab === 'schedule' && (
          <div className="space-y-2">
            {client.sessions.length === 0 && (
              <p className="text-center text-gray-400 py-8">No sessions scheduled</p>
            )}
            {[...client.sessions].sort((a, b) => b.date.localeCompare(a.date)).map((s) => (
              <Card key={s.id} className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex flex-col items-center justify-center text-center flex-shrink-0">
                  <span className="text-xs font-bold text-gray-600">
                    {new Date(s.date + 'T12:00:00').toLocaleDateString('en', { month: 'short' })}
                  </span>
                  <span className="text-sm font-black text-gray-900">
                    {new Date(s.date + 'T12:00:00').getDate()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{s.time}</p>
                  {s.confirmed && <p className="text-xs text-blue-500">✓ Attendance confirmed</p>}
                </div>
                <Badge status={s.status} />
              </Card>
            ))}
          </div>
        )}

        {/* Contract */}
        {tab === 'contract' && (
          <div className="space-y-4">
            <Card className="p-4 space-y-3">
              <p className="font-bold text-gray-900">Your Package</p>
              {[
                { label: 'Type',    value: client.package.type === 'sessions' ? `${client.package.total} Sessions` : `${client.package.months} Months` },
                { label: 'Price',   value: `${client.package.price.toLocaleString()} VND` },
                { label: 'Expires', value: client.contractExpiry },
                { label: 'Status',  value: client.contractSigned ? '✓ Signed' : 'Pending signature',
                  className: client.contractSigned ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold' },
              ].map((r) => (
                <div key={r.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{r.label}</span>
                  <span className={r.className ?? 'font-semibold'}>{r.value}</span>
                </div>
              ))}
            </Card>
            <Card className="p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Terms</p>
              <p className="text-sm text-gray-700 leading-relaxed">{client.contractTerms}</p>
            </Card>
          </div>
        )}

        {/* Progress */}
        {tab === 'progress' && (
          <div className="space-y-3">
            {client.progress.length === 0 && (
              <p className="text-center text-gray-400 py-8">No progress data yet</p>
            )}
            {[...client.progress].sort((a, b) => b.week - a.week).map((p) => (
              <Card key={p.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-indigo-600">Week {p.week}</span>
                    <p className="text-xs text-gray-400">{p.date}</p>
                    {p.notes && <p className="text-sm text-gray-600 mt-1">{p.notes}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-black text-xl text-gray-900">
                      {p.weight}<span className="text-xs text-gray-400 font-normal">kg</span>
                    </p>
                    {p.bodyFat && <p className="text-xs text-gray-500">{p.bodyFat}% fat</p>}
                  </div>
                </div>
                {p.photos.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {p.photos.map((ph, i) => (
                      <div key={i} className="bg-gray-100 rounded-lg w-16 h-16 flex flex-col items-center justify-center gap-1">
                        <Icon name="camera" className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] text-gray-500">{ph}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="text-center pb-8 pt-4">
        <p className="text-xs text-gray-300">Powered by PT Manager</p>
      </div>
    </div>
  )
}
