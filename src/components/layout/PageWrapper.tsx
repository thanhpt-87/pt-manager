import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

/** Standard page container: accounts for fixed TopBar + BottomNav */
export default function PageWrapper({ children, className = '' }: Props) {
  return (
    <main className={`pt-16 pb-24 min-h-screen bg-gray-50 ${className}`}>
      <div className="px-4 py-4 max-w-md mx-auto">{children}</div>
    </main>
  )
}
