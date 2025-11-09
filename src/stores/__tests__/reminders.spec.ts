import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRemindersStore } from '../reminders'

vi.mock('../../services/weather', () => ({
  fetchWeatherSummary: vi.fn().mockResolvedValue('Cloudy • 18°C'),
}))

describe('useRemindersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('stores a new reminder with weather data', async () => {
    const store = useRemindersStore()

    const reminder = await store.addReminder({
      title: 'Doctor visit',
      date: '2025-11-10',
      time: '14:30',
      city: 'Boston',
      color: '#2563eb',
    })

    expect(store.reminders).toHaveLength(1)
    expect(reminder.title).toBe('Doctor visit')
    expect(reminder.weather).toBe('Cloudy • 18°C')
  })

  it('enforces 30 character reminder title limit', async () => {
    const store = useRemindersStore()
    await expect(
      store.addReminder({
        title: 'This reminder title is definitely longer than thirty characters',
        date: '2025-11-10',
        time: '09:00',
        city: 'Madrid',
        color: '#f97316',
      })
    ).rejects.toThrow(/30 characters or fewer/i)
  })

  it('enforces required fields for title', async () => {
    const store = useRemindersStore()
    await expect(
      store.addReminder({
        title: '',
        date: '2025-11-10',
        time: '09:00',
        city: 'Madrid',
        color: '#f97316',
      })
    ).rejects.toThrow(/Title is required/i)
  })

  it('enforces required fields for date', async () => {
    const store = useRemindersStore()
    await expect(
      store.addReminder({
        title: 'Doctor visit',
        date: '',
        time: '09:00',
        city: 'Madrid',
        color: '#f97316',
      })
    ).rejects.toThrow(/Date is required/i)
  })

  it('enforces required fields for time', async () => {
    const store = useRemindersStore()
    await expect(
      store.addReminder({
        title: 'Doctor visit',
        date: '2025-11-10',
        time: '',
        city: 'Madrid',
        color: '#f97316',
      })
    ).rejects.toThrow(/Time is required/i)
  })

  it('enforces required fields for city', async () => {
    const store = useRemindersStore()
    await expect(
      store.addReminder({
        title: 'Doctor visit',
        date: '2025-11-10',
        time: '09:00',
        city: '',
        color: '#f97316',
      })
    ).rejects.toThrow(/City is required/i)
  })

  it('enforces required fields for color', async () => {
    const store = useRemindersStore()
    await expect(
      store.addReminder({
        title: 'Doctor visit',
        date: '2025-11-10',
        time: '09:00',
        city: 'Madrid',
        color: '',
      })
    ).rejects.toThrow(/Color is required/i)
  })

  it('updates a reminder', async () => {
    const store = useRemindersStore()
    const reminder = await store.addReminder({
      title: 'Doctor visit',
      date: '2025-11-10',
      time: '09:00',
      city: 'Madrid',
      color: '#f97316',
    })

    const updated = await store.updateReminder(reminder.id, {
      title: 'Doctor appointment',
      date: '2025-11-10',
      time: '10:00',
      city: 'Barcelona',
      color: '#0ea5e9',
    })

    expect(updated.title).toBe('Doctor appointment')
    expect(updated.date).toBe('2025-11-10')
    expect(updated.time).toBe('10:00')
    expect(updated.city).toBe('Barcelona')
    expect(updated.color).toBe('#0ea5e9')
    expect(updated.weather).toBe('Cloudy • 18°C')
  })

  it('deletes a reminder', async () => {
    const store = useRemindersStore()
    const reminder = await store.addReminder({
      title: 'Doctor visit',
      date: '2025-11-10',
      time: '09:00',
      city: 'Madrid',
      color: '#f97316',
    })

    await store.deleteReminder(reminder.id)

    expect(store.reminders).toHaveLength(0)
  })

  it('deletes all reminders for a given date', async () => {
    const store = useRemindersStore()

    await store.addReminder({
      title: 'Morning standup',
      date: '2025-11-10',
      time: '09:00',
      city: 'Lisbon',
      color: '#0ea5e9',
    })

    await store.addReminder({
      title: 'Dinner',
      date: '2025-11-10',
      time: '19:30',
      city: 'Lisbon',
      color: '#f97316',
    })

    await store.addReminder({
      title: 'Gym',
      date: '2025-11-11',
      time: '07:00',
      city: 'Lisbon',
      color: '#a855f7',
    })

    store.deleteRemindersByDate('2025-11-10')

    expect(store.reminders).toHaveLength(1)
    expect(store.reminders[0].title).toBe('Gym')
  })

  it('Should not allow reminders in the past', async () => {
    const store = useRemindersStore()
    await expect(
      store.addReminder({
        title: 'Doctor visit',
        date: '2025-11-09',
        time: '09:00',
        city: 'Madrid',
        color: '#f97316',
      })
    ).rejects.toThrow(/Reminders must be scheduled in the future./i)
  })
})

