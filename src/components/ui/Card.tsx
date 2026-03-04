import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({ children, className = '', onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100
        ${onClick ? 'cursor-pointer active:scale-98 transition-transform' : ''}
        ${className}`}
    >
      {children}
    </div>
  )
}
