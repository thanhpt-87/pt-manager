import { NavLink } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'

const TABS = [
  { label: 'Home',      icon: 'home'     as const, to: '/dashboard'  },
  { label: 'Clients',   icon: 'users'    as const, to: '/clients'    },
  { label: 'Calendar',  icon: 'calendar' as const, to: '/calendar'   },
  { label: 'Contracts', icon: 'doc'      as const, to: '/contracts'  },
  { label: 'Reports',   icon: 'chart'    as const, to: '/reports'    },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 max-w-md mx-auto safe-bottom">
      <div className="flex">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors text-[10px] font-medium
               ${isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`
            }
          >
            <Icon name={tab.icon} className="w-5 h-5" />
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
