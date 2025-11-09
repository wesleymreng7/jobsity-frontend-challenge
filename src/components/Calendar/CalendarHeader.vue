<script setup lang="ts">
const props = defineProps<{
  monthLabel: string
  daysOfWeek: string[]
}>()

const emit = defineEmits<{
  previous: []
  next: []
}>()

const handlePrevious = () => emit('previous')
const handleNext = () => emit('next')
</script>

<template>
  <header class="mb-6 flex flex-col gap-4">
    <div class="flex items-center justify-between gap-3 rounded-xl border border-slate-800/60 bg-slate-900/80 px-3 py-2">
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
        @click="handlePrevious"
        aria-label="Go to previous month"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M15 6 9 12l6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <h2 class="text-2xl font-semibold text-slate-50">
        {{ props.monthLabel }}
      </h2>

      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
        @click="handleNext"
        aria-label="Go to next month"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="m9 6 6 6-6 6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <div class="grid grid-cols-7 gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
      <span v-for="day in daysOfWeek" :key="day" class="text-center">{{ day }}</span>
    </div>
  </header>
</template>
