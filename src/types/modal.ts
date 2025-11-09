import type { Component } from 'vue'

export type ModalListeners = Record<string, (...args: any[]) => void>

export type ModalOptions = {
  closeOnOverlay?: boolean
}

export type ModalInstance = {
  id: number
  component: Component
  props: Record<string, any>
  listeners: ModalListeners
  options: Required<ModalOptions>
}

