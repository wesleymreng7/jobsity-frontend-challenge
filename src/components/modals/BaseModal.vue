<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    size?: 'sm' | 'md' | 'lg'
    showClose?: boolean
  }>(),
  {
    title: '',
    subtitle: '',
    size: 'md',
    showClose: true,
  }
)

const emit = defineEmits<{
  close: []
}>()

const sizeClass = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}[props.size]

const handleClose = () => emit('close')
</script>

<template>
  <div :class="['w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl', sizeClass]">
    <header v-if="title || subtitle || showClose" class="mb-4 flex items-start justify-between gap-4">
      <div>
        <p v-if="subtitle" class="text-sm font-medium uppercase tracking-[0.3em] text-emerald-300/80">
          {{ subtitle }}
        </p>
        <h3 v-if="title" class="text-xl font-semibold text-slate-100">
          {{ title }}
        </h3>
      </div>

      <button
        v-if="showClose"
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:border-slate-500 hover:text-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
        @click="handleClose"
        aria-label="Close modal"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </header>

    <div>
      <slot />
    </div>
  </div>
</template>
