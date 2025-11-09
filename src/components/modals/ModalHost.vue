<script setup lang="ts">
import { computed } from 'vue'
import { useModal } from '../../composables/useModal'

const { modals, closeModal } = useModal()

const stackedModals = computed(() => modals.value.map((modal, index) => ({ modal, index })))

const baseZIndex = 1000

const handleOverlayClick = (modalId: number, closeOnOverlay: boolean) => {
  if (!closeOnOverlay) return
  closeModal(modalId)
}
</script>

<template>
  <Teleport to="body">
    <div v-for="{ modal, index } in stackedModals" :key="modal.id">
      <div
        class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        :style="{ zIndex: baseZIndex + index * 2 }"
        @click="handleOverlayClick(modal.id, modal.options.closeOnOverlay)"
      />

      <div
        class="fixed inset-0 flex items-center justify-center px-4 py-10"
        :style="{ zIndex: baseZIndex + index * 2 + 1 }"
      >
        <component :is="modal.component" v-bind="modal.props" v-on="modal.listeners" />
      </div>
    </div>
  </Teleport>
</template>
