import type { TextareaHTMLAttributes } from 'react'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export default function Textarea({ label, className = '', ...props }: Props) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
          {label}
        </label>
      )}
      <textarea
        rows={3}
        className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 resize-none ${className}`}
        {...props}
      />
    </div>
  )
}
