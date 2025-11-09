import type { CalendarCell } from '@/types/calendar'

type MatrixOptions = {
  today?: Date
  includeAdjacentDays?: boolean
}

type MonthContext = {
  month: 'prev' | 'current' | 'next'
}

const MS_IN_DAY = 24 * 60 * 60 * 1000

export const hexToRgba = (hex: string, alpha: number) => {
  const sanitized = hex.replace('#', '')
  if (sanitized.length !== 6) return hex
  const bigint = parseInt(sanitized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const formatTimeLabel = (time: string) => {
  const [hours, minutes] = time.split(':')
  const date = new Date()
  date.setHours(Number(hours), Number(minutes), 0)
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export const formatDateLabel = (dateISO: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${dateISO}T00:00:00`))

export const getWeekdayLabels = (locale?: string, width: 'short' | 'long' = 'short'): string[] => {
  const referenceSunday = Date.UTC(2021, 5, 6) // Sunday, June 6, 2021
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(referenceSunday + index * MS_IN_DAY)
    return new Intl.DateTimeFormat(locale, { weekday: width }).format(date)
  })
}

const isWeekend = (date: Date) => {
  const day = date.getDay()
  return day === 0 || day === 6
}

const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate()

export const isPastCalendarCell = (cell: CalendarCell, reference: Date = new Date()) => {
  if (!cell.isoDate) return false
  const cellDate = new Date(`${cell.isoDate}T00:00:00`)
  const ref = new Date(reference)
  ref.setHours(0, 0, 0, 0)
  return cellDate.getTime() < ref.getTime()
}

export const isDisabledCalendarCell = (cell: CalendarCell, reference: Date = new Date()) =>
  cell.monthContext !== 'current' || isPastCalendarCell(cell, reference)

export const buildDateFromParts = (dateISO: string, time: string) => {
  const [hours, minutes] = time.split(':')
  const date = new Date(`${dateISO}T00:00:00`)
  date.setHours(Number(hours), Number(minutes), 0, 0)
  return date
}

export const isPastDateTime = (dateISO: string, time: string, reference: Date = new Date()) => {
  const parsed = buildDateFromParts(dateISO, time)
  return parsed.getTime() < reference.getTime()
}

const createCell = (date: Date | null, context: MonthContext, today: Date): CalendarCell => {
  if (!date) {
    return {
      label: '',
      isWeekend: false,
      isToday: false,
      isPlaceholder: true,
      date: null,
      isoDate: null,
      monthContext: context.month,
    }
  }

  return {
    label: String(date.getDate()),
    isWeekend: isWeekend(date),
    isToday: isSameDay(date, today),
    isPlaceholder: context.month !== 'current',
    date,
    isoDate: date.toISOString().slice(0, 10),
    monthContext: context.month,
  }
}

export const buildCalendarMatrix = (monthDate: Date, options?: MatrixOptions): CalendarCell[][] => {
  const today = options?.today ?? new Date()
  const includeAdjacent = options?.includeAdjacentDays ?? true

  const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const totalDays = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate()
  const firstWeekday = monthStart.getDay()

  const prevMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 0)
  const prevMonthDays = prevMonth.getDate()

  const cells: CalendarCell[] = []

  for (let index = firstWeekday - 1; index >= 0; index -= 1) {
    const date = includeAdjacent
      ? new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, prevMonthDays - index)
      : null
    cells.push(createCell(date, { month: 'prev' }, today))
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const cellDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day)
    cells.push(createCell(cellDate, { month: 'current' }, today))
  }

  const remainder = cells.length % 7
  if (remainder !== 0) {
    const nextDaysToAdd = 7 - remainder
    for (let index = 1; index <= nextDaysToAdd; index += 1) {
      const date = includeAdjacent
        ? new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, index)
        : null
      cells.push(createCell(date, { month: 'next' }, today))
    }
  }

  const weeks: CalendarCell[][] = []
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7))
  }

  return weeks
}

