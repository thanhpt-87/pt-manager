import { useLocation } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import BottomNav from './BottomNav'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

/** Wraps all pages. Shows BottomNav only for authenticated PT views. */
export default function AppShell({ children }: Props) {
  const { state } = useApp()
  const { pathname } = useLocation()

  // Hide bottom nav on login page and client portal
  const hideNav = !state.isLoggedIn
    || pathname === '/login'
    || pathname.startsWith('/client/')

  return (
    <div className="max-w-md mx-auto min-h-screen relative">
      {children}
      {!hideNav && <BottomNav />}
    </div>
  )
}
