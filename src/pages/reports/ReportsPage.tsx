import { useClients } from '@/hooks/useClients'
import { Card } from '@/components/ui'
import TopBar from '@/components/layout/TopBar'
import PageWrapper from '@/components/layout/PageWrapper'

export default function ReportsPage() {
  const { clients, totalRevenue } = useClients()

  const doneSessions    = clients.flatMap((c) => c.sessions.filter((s) => s.status === 'Done')).length
  const missedSessions  = clients.flatMap((c) => c.sessions.filter((s) => s.status === 'Missed')).length
  const upcomingSessions = clients.flatMap((c) => c.sessions.filter((s) => s.status === 'Upcoming')).length
  const totalCompleted  = doneSessions + missedSessions
  const attendanceRate  = totalCompleted ? Math.round((doneSessions / totalCompleted) * 100) : 0
  const signedContracts = clients.filter((c) => c.contractSigned).length

  const monthlyData = [
    { m: 'Aug', rev: 8_500_000 },
    { m: 'Sep', rev: 12_000_000 },
    { m: 'Oct', rev: 15_000_000 },
    { m: 'Nov', rev: totalRevenue },
  ]
  const maxRev = Math.max(...monthlyData.map((m) => m.rev))

  return (
    <>
      <TopBar title="Reports" />
      <PageWrapper>
        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: 'Total Revenue',    value: `${(totalRevenue / 1_000_000).toFixed(1)}M VND`, icon: '💰' },
            { label: 'Attendance Rate',  value: `${attendanceRate}%`,                             icon: '📊' },
            { label: 'Active Clients',   value: clients.length,                                    icon: '👥' },
            { label: 'Contracts Signed', value: `${signedContracts}/${clients.length}`,            icon: '📄' },
          ].map((s) => (
            <Card key={s.label} className="p-4">
              <span className="text-2xl mb-1 block">{s.icon}</span>
              <p className="text-lg font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* Revenue bar chart */}
        <Card className="p-4 mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Monthly Revenue</p>
          <div className="flex items-end gap-2 h-32">
            {monthlyData.map((m) => {
              const h = (m.rev / maxRev) * 100
              return (
                <div key={m.m} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-gray-500">{(m.rev / 1_000_000).toFixed(1)}M</span>
                  <div className="w-full bg-indigo-500 rounded-t-lg" style={{ height: `${h}%` }} />
                  <span className="text-[10px] text-gray-500 font-semibold">{m.m}</span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Attendance donut */}
        <Card className="p-4 mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Session Outcomes</p>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3.8" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#6366f1" strokeWidth="3.8"
                  strokeDasharray={`${attendanceRate} ${100 - attendanceRate}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-black text-gray-900">{attendanceRate}%</span>
              </div>
            </div>
            <div className="space-y-1.5">
              {[
                { color: 'bg-emerald-400', label: 'Done',     count: doneSessions },
                { color: 'bg-red-400',     label: 'Missed',   count: missedSessions },
                { color: 'bg-amber-400',   label: 'Upcoming', count: upcomingSessions },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${item.color}`} />
                  <span className="text-sm text-gray-600">{item.label}: {item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Per-client attendance */}
        <Card className="p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Per Client Attendance</p>
          <div className="space-y-2">
            {clients.map((c) => {
              const done  = c.sessions.filter((s) => s.status === 'Done').length
              const total = c.sessions.filter((s) => s.status !== 'Upcoming').length
              const rate  = total ? Math.round((done / total) * 100) : 0
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 w-24 truncate">{c.name.split(' ')[0]}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${rate}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{rate}%</span>
                </div>
              )
            })}
          </div>
        </Card>
      </PageWrapper>
    </>
  )
}
