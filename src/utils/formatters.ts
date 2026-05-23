export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

export function formatDateShort(dateStr: string): string {
  const [, month, day] = dateStr.split('-')
  return `${day}/${month}`
}

export function formatDateTime(dateStr: string, timeStr: string): string {
  return `${formatDateShort(dateStr)} — ${timeStr}`
}

export function calcOccupancy(booked: number, total: number): number {
  if (total === 0) return 0
  return Math.round((booked / total) * 100)
}
