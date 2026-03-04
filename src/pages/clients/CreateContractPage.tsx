import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClients } from '@/hooks/useClients'
import { Card, Btn, Input, Textarea, Select } from '@/components/ui'
import TopBar from '@/components/layout/TopBar'
import PageWrapper from '@/components/layout/PageWrapper'
import type { Client, CreateClientForm } from '@/types'
import { fmtDate, addDays } from '@/lib/dateUtils'

const DEFAULT_TERMS = 'No make-up sessions beyond expiration. 24h cancellation notice required.'

const INITIAL_FORM: CreateClientForm = {
  name: '', email: '', phone: '', goals: '', health: '',
  packageType: 'sessions', sessions: '12', months: '3',
  price: '3000000', terms: DEFAULT_TERMS,
}

export default function CreateContractPage() {
  const navigate = useNavigate()
  const { addClient } = useClients()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<CreateClientForm>(INITIAL_FORM)

  const set = <K extends keyof CreateClientForm>(k: K, v: CreateClientForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const handleCreate = () => {
    const today = new Date()
    const id = 'c' + Date.now()
    const initials = form.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

    const newClient: Client = {
      id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      goals: form.goals,
      health: form.health,
      avatar: initials || 'CL',
      contractSigned: false,
      contractDate: fmtDate(today),
      contractExpiry:
        form.packageType === 'time'
          ? fmtDate(addDays(today, +form.months * 30))
          : fmtDate(addDays(today, 90)),
      contractTerms: form.terms,
      package:
        form.packageType === 'sessions'
          ? { type: 'sessions', total: +form.sessions, remaining: +form.sessions, price: +form.price }
          : { type: 'time', months: +form.months, price: +form.price },
      sessions: [],
      progress: [],
    }

    addClient(newClient)
    navigate(`/clients/${id}`)
  }

  return (
    <>
      <TopBar title="New Client" back="/clients" />
      <PageWrapper>
        {/* Progress bar */}
        <div className="flex gap-1 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-colors ${s <= step ? 'bg-indigo-600' : 'bg-gray-200'}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Client Info</h2>
            <Input label="Full Name"    value={form.name}   onChange={(e) => set('name', e.target.value)}   placeholder="Nguyễn Văn A" />
            <Input label="Email"        value={form.email}  onChange={(e) => set('email', e.target.value)}  placeholder="client@email.com" type="email" />
            <Input label="Phone"        value={form.phone}  onChange={(e) => set('phone', e.target.value)}  placeholder="09xxxxxxxx" />
            <Textarea label="Goals"     value={form.goals}  onChange={(e) => set('goals', e.target.value)}  placeholder="What does the client want to achieve?" />
            <Textarea label="Health Notes" value={form.health} onChange={(e) => set('health', e.target.value)} placeholder="Any injuries, conditions, medications?" />
            <Btn className="w-full" onClick={() => setStep(2)} disabled={!form.name}>Next →</Btn>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Package</h2>
            <Select label="Package Type" value={form.packageType} onChange={(e) => set('packageType', e.target.value as 'sessions' | 'time')}>
              <option value="sessions">Session-based</option>
              <option value="time">Time-based</option>
            </Select>
            {form.packageType === 'sessions'
              ? <Input label="Number of Sessions" type="number" value={form.sessions} onChange={(e) => set('sessions', e.target.value)} min="1" />
              : <Input label="Duration (months)"  type="number" value={form.months}   onChange={(e) => set('months', e.target.value)}   min="1" />
            }
            <Input label="Price (VND)" type="number" value={form.price} onChange={(e) => set('price', e.target.value)} />
            <Textarea label="Contract Terms" value={form.terms} onChange={(e) => set('terms', e.target.value)} rows={4} />
            <div className="flex gap-2">
              <Btn variant="secondary" className="flex-1" onClick={() => setStep(1)}>← Back</Btn>
              <Btn className="flex-1" onClick={() => setStep(3)}>Next →</Btn>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Review & Create</h2>
            <Card className="p-4 space-y-2">
              {[
                { label: 'Name',    value: form.name },
                { label: 'Email',   value: form.email },
                { label: 'Package', value: form.packageType === 'sessions' ? `${form.sessions} sessions` : `${form.months} months` },
                { label: 'Price',   value: `${(+form.price).toLocaleString()} VND` },
              ].map((f) => (
                <p key={f.label} className="text-sm">
                  <span className="font-semibold text-gray-600">{f.label}:</span> {f.value}
                </p>
              ))}
              <p className="text-sm text-gray-500">{form.terms}</p>
            </Card>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-amber-800">
              📋 Contract will be created as <strong>unsigned</strong>. Collect signature in the Contract tab.
            </div>
            <div className="flex gap-2">
              <Btn variant="secondary" className="flex-1" onClick={() => setStep(2)}>← Back</Btn>
              <Btn className="flex-1" onClick={handleCreate}>Create Client</Btn>
            </div>
          </div>
        )}
      </PageWrapper>
    </>
  )
}
