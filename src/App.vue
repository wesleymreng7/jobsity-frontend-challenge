<script setup lang="ts">
import { Calendar } from './components/Calendar'
import ModalHost from './components/modals/ModalHost.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <div class="mx-auto flex min-h-screen flex-col items-center justify-center gap-12 px-6 py-16">
      <div class="w-full space-y-6">
        <Calendar />
      </div>
    </div>

    <ModalHost />
  </div>
</template>
