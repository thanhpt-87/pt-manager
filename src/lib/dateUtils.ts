/**
 * Format a Date to YYYY-MM-DD string
 */
export function fmtDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

/**
 * Return a new Date with n days added (negative = subtract)
 */
export function addDays(date: Date, n: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

/**
 * Check if a date string equals today
 */
export function isToday(dateStr: string): boolean {
  return dateStr === fmtDate(new Date())
}

/**
 * Return a human-readable date (e.g. "Mon, 4 Nov")
 */
export function formatDisplay(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Get month calendar data for a given year/month (0-indexed)
 */
export function getMonthCells(year: number, month: number): (string | null)[] {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const blanks: null[] = Array(firstDay).fill(null)
  const days = Array.from({ length: daysInMonth }, (_, i) =>
    fmtDate(new Date(year, month, i + 1))
  )
  return [...blanks, ...days]
}
