<script setup lang="ts">
import { computed, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRemindersStore } from '../../stores/reminders'
import type { Reminder } from '../../stores/reminders'
import type { CalendarCell } from '../../types/calendar'
import CalendarContextMenu from './CalendarContextMenu.vue'
import CalendarWeekRow from './CalendarWeekRow.vue'
import CalendarHeader from './CalendarHeader.vue'
import CalendarReminderModal from '@/components/modals/CalendarReminderModal.vue'
import CalendarWeatherModal from '@/components/modals/CalendarWeatherModal.vue'
import { useModal } from '@/composables/useModal'
import { formatDateLabel, getWeekdayLabels, buildCalendarMatrix } from '@/utils/calendar'

const today = new Date()
const state = reactive({
  currentMonth: new Date(today.getFullYear(), today.getMonth(), 1),
})

const remindersStore = useRemindersStore()
const { openModal } = useModal()

const monthLabel = computed(() =>
  new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
  }).format(state.currentMonth)
)

const daysOfWeek = computed(() => getWeekdayLabels(undefined, 'short'))

const calendarWeeks = computed(() => buildCalendarMatrix(state.currentMonth))

const goToPreviousMonth = () => {
  state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() - 1, 1)
}

const goToNextMonth = () => {
  state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() + 1, 1)
}

const contextMenu = reactive({
  open: false,
  x: 0,
  y: 0,
  type: null as 'day' | 'reminder' | null,
  date: null as string | null,
  reminderId: null as string | null,
})

const closeContextMenu = () => {
  contextMenu.open = false
}

const positionContextMenu = (event: MouseEvent, type: 'day' | 'reminder') => {
  const menuWidth = 220
  const menuHeight = type === 'reminder' ? 240 : 176
  const padding = 8
  let x = event.clientX
  let y = event.clientY

  if (x + menuWidth + padding > window.innerWidth) {
    x = window.innerWidth - menuWidth - padding
  }

  if (y + menuHeight + padding > window.innerHeight) {
    y = window.innerHeight - menuHeight - padding
  }

  contextMenu.x = Math.max(padding, x)
  contextMenu.y = Math.max(padding, y)
}

const openContextMenuForDay = (event: MouseEvent, cell: CalendarCell) => {
  if (cell.isPlaceholder || !cell.isoDate) return
  event.preventDefault()
  positionContextMenu(event, 'day')
  contextMenu.open = true
  contextMenu.type = 'day'
  contextMenu.date = cell.isoDate
  contextMenu.reminderId = null
}

const openContextMenuForReminder = (event: MouseEvent, reminder: Reminder, isoDate: string) => {
  event.preventDefault()
  positionContextMenu(event, 'reminder')
  contextMenu.open = true
  contextMenu.type = 'reminder'
  contextMenu.date = isoDate
  contextMenu.reminderId = reminder.id
}

const openCreateDialog = (cell: CalendarCell) => {
  if (cell.monthContext !== 'current' || !cell.isoDate) return
  openModal({
    component: CalendarReminderModal,
    props: {
      mode: 'create',
      initialDate: cell.isoDate,
    },
  })
}

const openEditDialog = (reminderId: string) => {
  const reminder = remindersStore.reminders.find((item) => item.id === reminderId)
  if (!reminder) return
  openModal({
    component: CalendarReminderModal,
    props: {
      mode: 'edit',
      initialDate: reminder.date,
      reminder,
    },
  })
}

const handleAddReminderContextAction = () => {
  if (!contextMenu.date) return
  closeContextMenu()
  openModal({
    component: CalendarReminderModal,
    props: {
      mode: 'create',
      initialDate: contextMenu.date,
    },
  })
}

const handleDeleteReminderContextAction = () => {
  if (!contextMenu.reminderId) return
  remindersStore.deleteReminder(contextMenu.reminderId)
  closeContextMenu()
}

const handleEditReminderContextAction = () => {
  if (!contextMenu.reminderId) return
  const reminder = remindersStore.reminders.find((item) => item.id === contextMenu.reminderId)
  if (!reminder) return
  closeContextMenu()
  openModal({
    component: CalendarReminderModal,
    props: {
      mode: 'edit',
      initialDate: reminder.date,
      reminder,
    },
  })
}

const handleDeleteDayContextAction = () => {
  if (!contextMenu.date) return
  remindersStore.deleteRemindersByDate(contextMenu.date)
  closeContextMenu()
}

const handleWeatherInfoContextAction = () => {
  if (!contextMenu.reminderId) return
  const reminder = remindersStore.reminders.find((item) => item.id === contextMenu.reminderId)
  if (!reminder) return

  closeContextMenu()

  openModal({
    component: CalendarWeatherModal,
    props: {
      city: reminder.city,
      date: reminder.date,
      time: reminder.time,
      initialSummary: reminder.weather,
    },
    options: {
      closeOnOverlay: true,
    },
  })
}

const handleGlobalClick = () => {
  if (contextMenu.open) {
    closeContextMenu()
  }
}

const handleGlobalKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && contextMenu.open) {
    closeContextMenu()
  }
}

onMounted(() => {
  window.addEventListener('click', handleGlobalClick)
  window.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleGlobalClick)
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <section class="w-full rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 shadow-2xl shadow-emerald-500/10 backdrop-blur">
    <CalendarHeader :month-label="monthLabel" :days-of-week="daysOfWeek" @previous="goToPreviousMonth" @next="goToNextMonth" />

    <div class="mt-3 flex flex-col gap-2">
      <CalendarWeekRow
        v-for="(week, weekIndex) in calendarWeeks"
        :key="weekIndex"
        :week="week"
        @day-select="openCreateDialog"
        @day-context="openContextMenuForDay"
        @reminder-edit="openEditDialog"
        @reminder-context="openContextMenuForReminder"
      />
    </div>
  </section>

  <CalendarContextMenu
    :visible="contextMenu.open"
    :x="contextMenu.x"
    :y="contextMenu.y"
    :date-label="contextMenu.date ? formatDateLabel(contextMenu.date) : null"
    :context-type="contextMenu.type"
    @close="closeContextMenu"
    @add="handleAddReminderContextAction"
    @edit="handleEditReminderContextAction"
    @delete-one="handleDeleteReminderContextAction"
    @delete-day="handleDeleteDayContextAction"
    @weather="handleWeatherInfoContextAction"
  />
</template>
