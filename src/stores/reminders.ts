import { defineStore } from 'pinia'
import { fetchWeatherSummary } from '../services/weather'
import { isPastDateTime } from '@/utils/calendar'

export type Reminder = {
  id: string
  title: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  city: string
  color: string
  weather: string | null
  createdAt: string
  updatedAt: string
}

export type ReminderInput = {
  title: string
  date: string
  time: string
  city: string
  color: string
}

const MAX_REMINDER_LENGTH = 30

const generateReminderId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `reminder-${Math.random().toString(36).slice(2)}`
}

function sortReminders(reminders: Reminder[]) {
  reminders.sort((a, b) => {
    if (a.date === b.date) {
      return a.time.localeCompare(b.time)
    }
    return a.date.localeCompare(b.date)
  })
}

export const useRemindersStore = defineStore('reminders', {
  state: () => ({
    reminders: [] as Reminder[],
  }),
  getters: {
    remindersByDate: (state) => (date: string) => {
      return state.reminders.filter((reminder) => reminder.date === date)
    },
  },
  actions: {
    async addReminder(input: ReminderInput) {
      const trimmed = input.title.trim()
      if (!trimmed) {
        throw new Error('Reminder title is required.')
      }

      if (!input.date) {
        throw new Error('Reminder date is required.')
      }

      if (!input.time) {
        throw new Error('Reminder time is required.')
      }

      if (!input.city) {
        throw new Error('Reminder city is required.')
      }

      if (!input.color) {
        throw new Error('Reminder color is required.')
      }

      if (isPastDateTime(input.date, input.time)) {
        throw new Error('Reminders must be scheduled in the future.')
      }

      if (trimmed.length > MAX_REMINDER_LENGTH) {
        throw new Error(`Reminder title must be ${MAX_REMINDER_LENGTH} characters or fewer.`)
      }

      const timestamp = new Date().toISOString()
      const id = generateReminderId()

      let weather: string | null = null
      try {
        weather = await fetchWeatherSummary(input.city, input.date, input.time)
      } catch (error) {
        console.warn('Failed to fetch weather for reminder:', error)
      }

      const reminder: Reminder = {
        id,
        title: trimmed,
        date: input.date,
        time: input.time,
        city: input.city.trim(),
        color: input.color,
        weather,
        createdAt: timestamp,
        updatedAt: timestamp,
      }

      this.reminders.push(reminder)
      sortReminders(this.reminders)

      return reminder
    },

    async updateReminder(id: string, updates: Partial<ReminderInput>) {
      const reminder = this.reminders.find((item) => item.id === id)
      if (!reminder) {
        throw new Error('Reminder not found.')
      }

      const nextTitle = updates.title?.trim() ?? reminder.title

      if (!nextTitle) {
        throw new Error('Reminder title is required.')
      }

      if (nextTitle.length > MAX_REMINDER_LENGTH) {
        throw new Error(`Reminder title must be ${MAX_REMINDER_LENGTH} characters or fewer.`)
      }

      const nextDate = updates.date ?? reminder.date
      const nextTime = updates.time ?? reminder.time
      const nextCity = updates.city?.trim() ?? reminder.city
      const nextColor = updates.color ?? reminder.color

      let weather: string | null = reminder.weather
      const dateChanged = nextDate !== reminder.date || nextTime !== reminder.time || nextCity !== reminder.city

      if (dateChanged) {
        try {
          weather = await fetchWeatherSummary(nextCity, nextDate, nextTime)
        } catch (error) {
          console.warn('Failed to refresh weather for reminder:', error)
        }
      }

      reminder.title = nextTitle
      reminder.date = nextDate
      reminder.time = nextTime
      reminder.city = nextCity
      reminder.color = nextColor
      reminder.weather = weather
      reminder.updatedAt = new Date().toISOString()

      sortReminders(this.reminders)

      return reminder
    },

    deleteReminder(id: string) {
      const index = this.reminders.findIndex((item) => item.id === id)
      if (index >= 0) {
        this.reminders.splice(index, 1)
      }
    },

    deleteRemindersByDate(date: string) {
      this.reminders = this.reminders.filter((item) => item.date !== date)
    },
  },
})

