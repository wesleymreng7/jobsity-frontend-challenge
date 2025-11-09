import { computed, readonly, shallowRef } from 'vue'
import type { Component } from 'vue'
import type { ModalInstance, ModalListeners, ModalOptions } from '../types/modal'

type OpenModalConfig = {
  component: Component
  props?: Record<string, any>
  listeners?: ModalListeners
  options?: ModalOptions
}

const DEFAULT_OPTIONS: Required<ModalOptions> = {
  closeOnOverlay: true,
}

const modalStack = shallowRef<ModalInstance[]>([])

let seed = 0

const mergedListeners = (id: number, listeners: ModalListeners | undefined, close: () => void): ModalListeners => {
  const base: ModalListeners = {
    close() {
      listeners?.close?.()
      close()
    },
  }

  if (!listeners) {
    return base
  }

  return Object.keys(listeners).reduce<ModalListeners>((accumulator, key) => {
    if (key === 'close') {
      accumulator[key] = (...args: any[]) => {
        listeners[key]?.(...args)
        close()
      }
    } else {
      accumulator[key] = listeners[key]
    }

    return accumulator
  }, base)
}

export function useModal() {
  const closeModal = (id: number) => {
    modalStack.value = modalStack.value.filter((modal) => modal.id !== id)
  }

  const closeTopModal = () => {
    const last = modalStack.value.at(-1)
    if (last) {
      closeModal(last.id)
    }
  }

  const closeAllModals = () => {
    modalStack.value = []
  }

  const openModal = ({ component, props, listeners, options }: OpenModalConfig) => {
    const id = ++seed

    const close = () => closeModal(id)

    const instance: ModalInstance = {
      id,
      component,
      props: {
        ...(props ?? {}),
        close,
      },
      listeners: mergedListeners(id, listeners, close),
      options: {
        ...DEFAULT_OPTIONS,
        ...(options ?? {}),
      },
    }

    modalStack.value = [...modalStack.value, instance]

    return {
      id,
      close,
    }
  }

  const modals = computed(() => modalStack.value)

  return {
    modals: readonly(modals),
    openModal,
    closeModal,
    closeTopModal,
    closeAllModals,
  }
}

