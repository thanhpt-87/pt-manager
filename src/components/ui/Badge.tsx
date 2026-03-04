import type { SessionStatus } from '@/types'

const STATUS_STYLES: Record<SessionStatus, string> = {
  Done:     'bg-emerald-100 text-emerald-700',
  Missed:   'bg-red-100 text-red-700',
  Upcoming: 'bg-amber-100 text-amber-700',
}

interface Props {
  status: SessionStatus
}

export default function Badge({ status }: Props) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  )
}
