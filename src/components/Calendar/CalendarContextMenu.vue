<script setup lang="ts">
const props = defineProps<{
  visible: boolean
  x: number
  y: number
  dateLabel: string | null
  contextType: 'day' | 'reminder' | null
}>()

const emit = defineEmits<{
  add: []
  edit: []
  deleteOne: []
  deleteDay: []
  weather: []
  close: []
}>()

const handleOverlayClick = () => emit('close')
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-[60]" @click="handleOverlayClick">
      <div
        class="absolute w-60 rounded-xl border border-slate-700/70 bg-slate-900/95 p-2 text-sm text-slate-100 shadow-xl shadow-slate-950/40"
        :style="{ top: `${y}px`, left: `${x}px` }"
        @click.stop
      >
        <p class="px-2 pb-2 text-xs uppercase tracking-wide text-slate-400">
          {{ dateLabel ?? 'Actions' }}
        </p>

        <button
          type="button"
          class="flex w-full items-center rounded-lg px-2 py-2 text-left transition hover:bg-slate-800/80"
          @click="$emit('add')"
        >
          Add new reminder
        </button>

        <button
          v-if="contextType === 'reminder'"
          type="button"
          class="flex w-full items-center rounded-lg px-2 py-2 text-left transition hover:bg-slate-800/80"
          @click="$emit('edit')"
        >
          Edit this reminder
        </button>

        <button
          v-if="contextType === 'reminder'"
          type="button"
          class="flex w-full items-center rounded-lg px-2 py-2 text-left transition hover:bg-rose-500/15"
          @click="$emit('deleteOne')"
        >
          Delete this reminder
        </button>

        <button
          type="button"
          class="flex w-full items-center rounded-lg px-2 py-2 text-left transition hover:bg-rose-500/10"
          @click="$emit('deleteDay')"
        >
          Delete all reminders for this day
        </button>

        <button
          v-if="contextType === 'reminder'"
          type="button"
          class="mt-1 flex w-full items-center rounded-lg px-2 py-2 text-left transition hover:bg-slate-800/80"
          @click="$emit('weather')"
        >
          Weather details for this reminder
        </button>
      </div>
    </div>
  </Teleport>
</template>
