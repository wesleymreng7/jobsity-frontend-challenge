export type CalendarCell = {
  label: string
  isWeekend: boolean
  isToday: boolean
  isPlaceholder: boolean
  date: Date | null
  isoDate: string | null
}

