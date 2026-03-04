import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline'

const VARIANT_STYLES: Record<Variant, string> = {
  primary:   'bg-indigo-600 hover:bg-indigo-700 text-white',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  danger:    'bg-red-500 hover:bg-red-600 text-white',
  success:   'bg-emerald-500 hover:bg-emerald-600 text-white',
  outline:   'border border-indigo-600 text-indigo-600 hover:bg-indigo-50',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
}

export default function Btn({ children, variant = 'primary', className = '', ...props }: Props) {
  return (
    <button
      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANT_STYLES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
