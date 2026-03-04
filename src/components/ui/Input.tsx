import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function Input({ label, className = '', ...props }: Props) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 ${className}`}
        {...props}
      />
    </div>
  )
}
