import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClients } from '@/hooks/useClients'
import { Card, Avatar, Btn, Icon } from '@/components/ui'
import TopBar from '@/components/layout/TopBar'
import PageWrapper from '@/components/layout/PageWrapper'

const AVATAR_COLORS = ['bg-indigo-500', 'bg-purple-500', 'bg-teal-500', 'bg-rose-500', 'bg-amber-500']

export default function ClientsListPage() {
  const navigate = useNavigate()
  const { clients } = useClients()
  const [search, setSearch] = useState('')

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <TopBar title="Clients" />
      <PageWrapper>
        <div className="mb-4">
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-3 mb-4">
          {filtered.map((c, i) => (
            <Card key={c.id} className="p-4" onClick={() => navigate(`/clients/${c.id}`)}>
              <div className="flex items-center gap-3">
                <Avatar initials={c.avatar} color={AVATAR_COLORS[i % AVATAR_COLORS.length]} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                    {!c.contractSigned && (
                      <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                        Unsigned
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{c.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {c.package.type === 'sessions' ? (
                      <>
                        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                          {c.package.remaining}/{c.package.total} sessions
                        </span>
                        {c.package.remaining <= 3 && (
                          <span className="text-xs text-red-500 font-semibold">Low!</span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                        {c.package.months}mo package
                      </span>
                    )}
                  </div>
                </div>
                <Icon name="chevron" className="w-4 h-4 text-gray-300" />
              </div>
            </Card>
          ))}

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No clients found</p>
          )}
        </div>

        <Btn className="w-full flex items-center justify-center gap-2" onClick={() => navigate('/clients/new')}>
          <Icon name="plus" className="w-5 h-5" />
          Add New Client
        </Btn>
      </PageWrapper>
    </>
  )
}
