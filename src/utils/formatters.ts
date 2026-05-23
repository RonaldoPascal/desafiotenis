function parseDate(dateStr: string): { year: string; month: string; day: string } {
  const clean = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr
  const [year, month, day] = clean.split('-')
  return { year, month, day }
}

export function formatDate(dateStr: string): string {
  const { year, month, day } = parseDate(dateStr)
  return `${day}/${month}/${year}`
}

export function formatDateShort(dateStr: string): string {
  const { month, day } = parseDate(dateStr)
  return `${day}/${month}`
}

export function formatTime(timeStr: string): string {
  return timeStr.substring(0, 5)
}

export function formatDateTime(dateStr: string, timeStr: string): string {
  return `${formatDateShort(dateStr)} — ${formatTime(timeStr)}`
}

export function calcOccupancy(booked: number, total: number): number {
  if (total === 0) return 0
  return Math.round((booked / total) * 100)
}
