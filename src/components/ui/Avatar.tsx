type Size = 'sm' | 'md' | 'lg'

const SIZE_STYLES: Record<Size, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
}

interface Props {
  initials: string
  size?: Size
  color?: string
}

export default function Avatar({ initials, size = 'md', color = 'bg-indigo-500' }: Props) {
  return (
    <div className={`${SIZE_STYLES[size]} ${color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  )
}
