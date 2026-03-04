import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { useClients } from '@/hooks/useClients'
import { Card, Avatar, Badge, Btn, Icon } from '@/components/ui'
import TopBar from '@/components/layout/TopBar'
import PageWrapper from '@/components/layout/PageWrapper'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const { logout } = useAuth()
  const { todaySessions, upcomingSessions, lowSessionClients, totalRevenue, clients } = useClients()

  return (
    <>
      <TopBar
        title="PT Manager"
        actions={
          <button onClick={logout} className="text-gray-500 p-1">
            <Icon name="logout" className="w-5 h-5" />
          </button>
        }
      />

      <PageWrapper>
        {/* Greeting */}
        <div className="flex items-center gap-3 mb-5">
          <Avatar initials={state.pt.avatar} size="lg" color="bg-indigo-600" />
          <div>
            <h2 className="font-bold text-gray-900 text-lg">
              Hey, {state.pt.name.split(' ')[0]}! 👋
            </h2>
            <p className="text-gray-500 text-sm">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Clients', value: clients.length,                         grad: 'from-indigo-500 to-indigo-700' },
            { label: 'Today',   value: todaySessions.length,                    grad: 'from-amber-500 to-orange-600' },
            { label: 'Revenue', value: `${(totalRevenue / 1_000_000).toFixed(1)}M`, grad: 'from-emerald-500 to-teal-600' },
          ].map((s) => (
            <Card key={s.label} className="p-3 text-center">
              <div className={`text-xl font-black text-transparent bg-clip-text bg-gradient-to-br ${s.grad}`}>
                {s.value}
              </div>
              <div className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</div>
            </Card>
          ))}
        </div>

        {/* Notifications */}
        {state.notifications.filter((n) => !n.read).length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Alerts</h3>
            <div className="space-y-2">
              {state.notifications.filter((n) => !n.read).map((n) => (
                <div key={n.id} className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                  <span className="text-amber-500 mt-0.5">⚡</span>
                  <p className="text-sm text-amber-800 flex-1">{n.text}</p>
                  <button onClick={() => dispatch({ type: 'MARK_NOTIF_READ', id: n.id })} className="text-amber-400 hover:text-amber-600">
                    <Icon name="x" className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low sessions warning */}
        {lowSessionClients.length > 0 && (
          <div className="mb-5 bg-red-50 border border-red-100 rounded-2xl p-3">
            <p className="text-xs font-bold text-red-600 mb-1">⚠️ Low Sessions</p>
            {lowSessionClients.map((c) => (
              <p key={c.id} className="text-sm text-red-700">
                {c.name} — {c.package.type === 'sessions' ? c.package.remaining : '–'} sessions left
              </p>
            ))}
          </div>
        )}

        {/* Today */}
        {todaySessions.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Today's Sessions</h3>
            <div className="space-y-2">
              {todaySessions.map((s) => (
                <Card key={s.id} className="p-3 flex items-center gap-3" onClick={() => navigate(`/clients/${s.client.id}`)}>
                  <Avatar initials={s.client.avatar} color="bg-purple-500" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{s.client.name}</p>
                    <p className="text-xs text-gray-500">
                      {s.time} · {s.confirmed ? '✅ Confirmed' : 'Pending confirmation'}
                    </p>
                  </div>
                  <Badge status={s.status} />
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        <div className="mb-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Upcoming Sessions</h3>
          <div className="space-y-2">
            {upcomingSessions.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No upcoming sessions</p>
            )}
            {upcomingSessions.slice(0, 5).map((s) => (
              <Card key={s.id} className="p-3 flex items-center gap-3" onClick={() => navigate(`/clients/${s.client.id}`)}>
                <Avatar initials={s.client.avatar} color="bg-teal-500" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{s.client.name}</p>
                  <p className="text-xs text-gray-500">{s.date} · {s.time}</p>
                </div>
                <Icon name="chevron" className="w-4 h-4 text-gray-300" />
              </Card>
            ))}
          </div>
        </div>

        <Btn className="w-full flex items-center justify-center gap-2" onClick={() => navigate('/clients/new')}>
          <Icon name="plus" className="w-5 h-5" />
          Add New Client
        </Btn>
      </PageWrapper>
    </>
  )
}
