<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { fetchWeatherSummary } from '../../services/weather'
import { formatDateLabel, formatTimeLabel } from '../../utils/calendar'
import BaseModal from './BaseModal.vue'

const props = defineProps<{
  city: string
  date: string
  time: string
  initialSummary?: string | null
  close: () => void
}>()

const heading = ref('')
const summary = ref(props.initialSummary ?? '')
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const computeHeading = () => {
  heading.value = `${props.city} • ${formatTimeLabel(props.time)} (${formatDateLabel(props.date)})`
}

const loadSummary = async () => {
  loading.value = true
  errorMessage.value = null
  try {
    const result = await fetchWeatherSummary(props.city, props.date, props.time)
    summary.value = result ?? 'No forecast available for this time.'
  } catch (error: any) {
    errorMessage.value = error?.message ?? 'Unable to retrieve weather information.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  computeHeading()
  if (!props.initialSummary) {
    await loadSummary()
  }
})

watch(
  () => [props.city, props.date, props.time] as const,
  async () => {
    computeHeading()
    await loadSummary()
  }
)
</script>

<template>
  <BaseModal :title="heading" subtitle="Weather" size="sm" @close="close">
    <div class="space-y-3 text-sm leading-relaxed text-slate-200">
      <p v-if="loading">Fetching forecast…</p>
      <p v-else-if="errorMessage" class="text-rose-300">
        {{ errorMessage }}
      </p>
      <p v-else>
        {{ summary }}
      </p>
    </div>

    <div class="mt-6 flex justify-end">
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-slate-50"
        @click="close"
      >
        Close
      </button>
    </div>
  </BaseModal>
</template>
