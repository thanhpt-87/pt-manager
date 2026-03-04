import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClients } from '@/hooks/useClients'
import { Card, Avatar, Badge } from '@/components/ui'
import TopBar from '@/components/layout/TopBar'
import PageWrapper from '@/components/layout/PageWrapper'
import { fmtDate, getMonthCells } from '@/lib/dateUtils'

export default function CalendarPage() {
  const navigate = useNavigate()
  const { clients } = useClients()
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(fmtDate(today))

  const allSessions = clients.flatMap((c) =>
    c.sessions.map((s) => ({ ...s, client: c }))
  )

  const sessionByDate: Record<string, typeof allSessions> = {}
  allSessions.forEach((s) => {
    sessionByDate[s.date] = [...(sessionByDate[s.date] ?? []), s]
  })

  const cells = getMonthCells(today.getFullYear(), today.getMonth())
  const todayStr = fmtDate(today)
  const selectedSessions = allSessions.filter((s) => s.date === selectedDate)

  return (
    <>
      <TopBar title="Calendar" />
      <PageWrapper>
        {/* Month header */}
        <p className="text-sm font-bold text-gray-500 text-center mb-3">
          {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d} className="text-xs font-bold text-gray-400">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 mb-6">
          {cells.map((date, i) => {
            if (!date) return <div key={i} />
            const dayNum = new Date(date + 'T12:00:00').getDate()
            const hasSessions = !!sessionByDate[date]
            const isToday    = date === todayStr
            const isSelected = date === selectedDate
            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-semibold transition-all
                  ${isSelected ? 'bg-indigo-600 text-white'
                    : isToday   ? 'bg-indigo-100 text-indigo-700'
                    : 'hover:bg-gray-100 text-gray-700'}`}
              >
                {dayNum}
                {hasSessions && !isSelected && (
                  <div className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />
                )}
              </button>
            )
          })}
        </div>

        {/* Selected day sessions */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            {selectedDate === todayStr ? 'Today' : selectedDate} — {selectedSessions.length} session{selectedSessions.length !== 1 ? 's' : ''}
          </p>
          {selectedSessions.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No sessions on this date</p>
          ) : (
            <div className="space-y-2">
              {selectedSessions.map((s) => (
                <Card key={s.id} className="p-3 flex items-center gap-3" onClick={() => navigate(`/clients/${s.client.id}`)}>
                  <Avatar initials={s.client.avatar} color="bg-indigo-500" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">{s.client.name}</p>
                    <p className="text-xs text-gray-500">{s.time}</p>
                  </div>
                  <Badge status={s.status} />
                </Card>
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  )
}
