import type { Meta, StoryObj } from '@storybook/vue3'
import { createPinia, setActivePinia } from 'pinia'
import { Calendar } from '@/components/Calendar'
import ModalHost from '@/components/modals/ModalHost.vue'
import { useRemindersStore } from '@/stores/reminders'
import type { Reminder } from '@/stores/reminders'

const current = new Date()
const currentMonth = current.getMonth()
const currentYear = current.getFullYear()

const makeDate = (day: number) => {
  const date = new Date(currentYear, currentMonth, day)
  return date.toISOString().slice(0, 10)
}

const sampleReminders: Reminder[] = [
  {
    id: 'sample-1',
    title: 'Design review',
    date: makeDate(5),
    time: '10:30',
    city: 'Lisbon',
    color: '#38bdf8',
    weather: 'Sunny spells • 23°C',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Lunch with Ana',
    date: makeDate(12),
    time: '13:00',
    city: 'Madrid',
    color: '#f97316',
    weather: 'Clear skies • 28°C',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Release retrospective',
    date: makeDate(21),
    time: '16:00',
    city: 'London',
    color: '#a855f7',
    weather: 'Light showers • 14°C',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Hands-on monthly calendar that ships with reminder scheduling, contextual actions, and weather integration.

### Key behaviours
- **Inline editing**: right-click a day or reminder for add/edit/delete shortcuts.
- **Weekend emphasis**: weekend cells adapt a teal palette to distinguish work weeks from off days.
- **Weather snapshots**: the reminder modal fetches mocked forecasts so users see climate context per event.

### Story usage
- **Default**: month seeded with sample data to explore flows.
- **EmptyState**: render of a quiet calendar, ideal for new users.
- **ContextMenuFocused**: pre-populated view calling attention to right-click affordances.
`,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Calendar>

const buildStory = (seedReminders: Reminder[] = []) => ({
  components: { Calendar, ModalHost },
  setup() {
    setActivePinia(createPinia())
    const store = useRemindersStore()
    store.reminders = [...seedReminders]
    return {}
  },
  template: `
    <div class="space-y-6">
      <Calendar />
      <ModalHost />
    </div>
  `,
})

export const Default: Story = {
  name: 'Calendar with sample agenda',
  render: () => buildStory(sampleReminders),
  parameters: {
    docs: {
      description: {
        story:
          'Starter state showcasing a realistic schedule. Try right-clicking a reminder or day cell to inspect contextual operations.',
      },
    },
  },
}

export const EmptyState: Story = {
  name: 'Empty month',
  render: () => buildStory(),
  parameters: {
    docs: {
      description: {
        story:
          'Fresh calendar with no reminders. Use this variant to demonstrate onboarding flows or empty-state messaging elsewhere in the app.',
      },
    },
  },
}

export const ContextMenuFocused: Story = {
  name: 'Context menu demo',
  render: () => buildStory([
    {
      id: 'context-1',
      title: 'Happy hour',
      date: makeDate(8),
      time: '18:00',
      city: 'New York',
      color: '#fbbf24',
      weather: 'Partly cloudy • 19°C',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]),
  parameters: {
    docs: {
      description: {
        story:
          'Single reminder configured to highlight contextual interactions. In the preview, right-click the event to explore the actions rendered by the calendar.',
      },
    },
  },
}
