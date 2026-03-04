import { useNavigate } from 'react-router-dom'
import { useClients } from '@/hooks/useClients'
import { Card } from '@/components/ui'
import TopBar from '@/components/layout/TopBar'
import PageWrapper from '@/components/layout/PageWrapper'

export default function ContractsPage() {
  const navigate = useNavigate()
  const { clients } = useClients()

  return (
    <>
      <TopBar title="Contracts" />
      <PageWrapper>
        <div className="space-y-3">
          {clients.map((c) => (
            <Card key={c.id} className="p-4" onClick={() => navigate(`/clients/${c.id}`)}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500">
                    Signed: {c.contractDate} · Expires: {c.contractExpiry}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0
                  ${c.contractSigned ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                  {c.contractSigned ? 'Signed' : 'Unsigned'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {c.package.type === 'sessions'
                    ? `${c.package.remaining}/${c.package.total} sessions`
                    : `${c.package.months}mo`}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {c.package.price.toLocaleString()} VND
                </span>
              </div>
            </Card>
          ))}
        </div>
      </PageWrapper>
    </>
  )
}
