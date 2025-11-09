<script setup lang="ts">
import { computed } from 'vue'
import { useRemindersStore } from '../../stores/reminders'
import type { Reminder } from '../../stores/reminders'
import type { CalendarCell } from '../../types/calendar'
import { formatTimeLabel, hexToRgba } from '../../utils/calendar'

const props = defineProps<{
  week: CalendarCell[]
}>()

const emit = defineEmits<{
  'day-select': [CalendarCell]
  'day-context': [MouseEvent, CalendarCell]
  'reminder-edit': [string]
  'reminder-context': [MouseEvent, Reminder, string]
}>()

const remindersStore = useRemindersStore()

const remindersForWeek = computed(() =>
  props.week.map((day) => ({
    isoDate: day.isoDate,
    reminders: day.isoDate ? remindersStore.remindersByDate(day.isoDate) : [],
  }))
)

const handleDayClick = (day: CalendarCell) => {
  if (day.isPlaceholder) return
  emit('day-select', day)
}

const handleDayContext = (event: MouseEvent, day: CalendarCell) => {
  if (day.isPlaceholder) return
  emit('day-context', event, day)
}

const handleReminderClick = (reminderId: string) => {
  emit('reminder-edit', reminderId)
}

const handleReminderContext = (event: MouseEvent, reminder: Reminder, isoDate: string) => {
  emit('reminder-context', event, reminder, isoDate)
}
</script>

<template>
  <div class="grid grid-cols-7 gap-2">
    <button
      v-for="(day, index) in week"
      :key="`${day.isoDate ?? 'placeholder'}-${index}`"
      type="button"
      :disabled="day.isPlaceholder"
      :class="[
        'relative flex h-56 flex-col overflow-hidden rounded-xl border p-3 text-right transition duration-150',
        day.isPlaceholder
          ? 'cursor-default border-transparent bg-transparent'
          : day.isWeekend
            ? 'cursor-pointer border-emerald-500/30 bg-emerald-500/10 text-emerald-100 hover:border-emerald-400 hover:bg-emerald-500/20'
            : 'cursor-pointer border-slate-800 bg-slate-900/70 text-slate-100 hover:border-emerald-400 hover:bg-slate-900',
          day.isToday && !day.isPlaceholder
            ? 'border-emerald-400 bg-emerald-500/15 text-emerald-50 shadow-[0_0_25px_rgba(16,185,129,0.35)]'
            : '',
        ]"
      @click="handleDayClick(day)"
      @contextmenu.prevent.stop="handleDayContext($event, day)"
    >
      <span class="self-end text-lg font-semibold">{{ day.label }}</span>

      <div
        v-if="remindersForWeek[index]?.isoDate"
        class="mt-2 flex flex-col gap-1 overflow-y-auto pr-1 text-left"
      >
        <div
          v-for="reminder in remindersForWeek[index].reminders"
          :key="reminder.id"
          class="group flex flex-col gap-1 rounded-lg border px-2 py-1 text-xs text-slate-100 shadow-sm transition"
          :style="{
            backgroundColor: hexToRgba(reminder.color, 0.18),
            borderColor: reminder.color,
          }"
          @click.stop="handleReminderClick(reminder.id)"
          @contextmenu.prevent.stop="handleReminderContext($event, reminder, remindersForWeek[index].isoDate!)"
        >
          <span class="font-semibold text-slate-100/90 group-hover:text-slate-50">
            {{ formatTimeLabel(reminder.time) }}
          </span>
          <span class="truncate text-slate-100/80 group-hover:text-slate-50">{{ reminder.title }}</span>
          <span v-if="reminder.weather" class="text-[10px] uppercase tracking-wide text-slate-100/60">
            {{ reminder.weather }}
          </span>
        </div>
      </div>
    </button>
  </div>
</template>
