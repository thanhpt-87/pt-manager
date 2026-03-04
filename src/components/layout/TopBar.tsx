import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Icon } from '@/components/ui/Icon'
import type { ReactNode } from 'react'

interface Props {
  title: string
  back?: string       // route to navigate back to
  actions?: ReactNode // extra buttons on the right
}

export default function TopBar({ title, back, actions }: Props) {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const unread = state.notifications.filter((n) => !n.read).length

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 max-w-md mx-auto">
      <div className="flex items-center px-4 py-3 gap-3">
        {back && (
          <button onClick={() => navigate(back)} className="text-gray-600 hover:text-gray-900 -ml-1">
            <Icon name="back" className="w-6 h-6" />
          </button>
        )}

        <h1 className="flex-1 text-base font-bold text-gray-900 truncate">{title}</h1>

        {actions}

        {!back && (
          <div className="relative">
            <button
              className="text-gray-600 p-1"
              onClick={() => dispatch({ type: 'MARK_NOTIF_READ', id: state.notifications[0]?.id })}
            >
              <Icon name="bell" className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                  {unread}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
