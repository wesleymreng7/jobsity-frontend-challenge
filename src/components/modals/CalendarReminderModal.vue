<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { useRemindersStore } from '../../stores/reminders'
import type { Reminder } from '../../stores/reminders'
import BaseModal from './BaseModal.vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

type ReminderForm = {
  title: string
  time: string
  city: string
  color: string
  date: string
}

const props = defineProps<{
  mode: 'create' | 'edit'
  initialDate: string
  reminder?: Reminder
  close: () => void
}>()

const emit = defineEmits<{
  saved: [Reminder]
  deleted: [string]
}>()

const remindersStore = useRemindersStore()

const form = reactive<ReminderForm>({
  title: props.reminder?.title ?? '',
  time: props.reminder?.time ?? '09:00',
  city: props.reminder?.city ?? '',
  color: props.reminder?.color ?? '#10b981',
  date: props.reminder?.date ?? props.initialDate,
})

watch(
  () => props.reminder,
  (nextReminder) => {
    if (!nextReminder) return
    form.title = nextReminder.title
    form.time = nextReminder.time
    form.city = nextReminder.city
    form.color = nextReminder.color
    form.date = nextReminder.date
  }
)

const isEditMode = computed(() => props.mode === 'edit' && !!props.reminder)

const errorMessage = ref<string | null>(null)
const isSaving = ref(false)
const isDeleting = ref(false)

const titleLabel = computed(() => (isEditMode.value ? 'Edit Reminder' : 'New Reminder'))

const formattedDate = computed(() =>
  new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${form.date}T00:00:00`))
)

const schema = yup.object({
  title: yup.string().trim().required('Title is required').max(30, 'Maximum length is 30 characters'),
  date: yup.string().required('Date is required'),
  time: yup.string().required('Time is required'),
  city: yup.string().trim().required('City is required'),
  color: yup.string().required('Color is required'),
})

const { handleSubmit, setValues, errors, values } = useForm<ReminderForm>({
  validationSchema: schema,
  initialValues: form,
})

watch(
  () => ({ ...form }),
  (newValues) => {
    setValues({ ...newValues })
  },
  { deep: true }
)

const handleClose = () => {
  props.close()
}

const submitForm = handleSubmit(async (validated) => {
  errorMessage.value = null
  isSaving.value = true

  try {
    if (isEditMode.value && props.reminder) {
      const updated = await remindersStore.updateReminder(props.reminder.id, validated)
      emit('saved', updated)
    } else {
      const created = await remindersStore.addReminder(validated)
      emit('saved', created)
    }

    handleClose()
  } catch (error: any) {
    errorMessage.value = error?.message ?? 'Unable to save reminder.'
  } finally {
    isSaving.value = false
  }
})

const handleDelete = async () => {
  if (!isEditMode.value || !props.reminder) return
  errorMessage.value = null
  isDeleting.value = true

  try {
    remindersStore.deleteReminder(props.reminder.id)
    emit('deleted', props.reminder.id)
    handleClose()
  } catch (error: any) {
    errorMessage.value = error?.message ?? 'Unable to delete reminder.'
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <BaseModal :title="formattedDate" :subtitle="titleLabel" size="md" @close="handleClose">
    <form class="space-y-5" @submit.prevent="submitForm">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-200" for="reminder-title-modal">Reminder</label>
        <input
          id="reminder-title-modal"
          v-model="form.title"
          type="text"
          maxlength="30"
          required
          placeholder="Enter reminder (max 30 chars)"
          class="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        />
        <p v-if="errors.title" class="text-xs text-rose-300">{{ errors.title }}</p>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-200" for="reminder-date-modal">Date</label>
          <input
            id="reminder-date-modal"
            v-model="form.date"
            type="date"
            required
            class="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
          />
          <p v-if="errors.date" class="text-xs text-rose-300">{{ errors.date }}</p>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-200" for="reminder-time-modal">Time</label>
          <input
            id="reminder-time-modal"
            v-model="form.time"
            type="time"
            required
            class="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
          />
          <p v-if="errors.time" class="text-xs text-rose-300">{{ errors.time }}</p>
        </div>

        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm font-medium text-slate-200" for="reminder-city-modal">City</label>
          <input
            id="reminder-city-modal"
            v-model="form.city"
            type="text"
            required
            placeholder="City"
            class="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
          />
          <p v-if="errors.city" class="text-xs text-rose-300">{{ errors.city }}</p>
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-200" for="reminder-color-modal">Color</label>
        <div class="flex items-center gap-3">
          <input
            id="reminder-color-modal"
            v-model="form.color"
            type="color"
            class="h-10 w-16 cursor-pointer rounded border border-slate-700 bg-slate-950"
          />
          <span class="text-xs uppercase tracking-wide text-slate-400">{{ form.color }}</span>
        </div>
        <p v-if="errors.color" class="text-xs text-rose-300">{{ errors.color }}</p>
      </div>

      <p v-if="errorMessage" class="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
        {{ errorMessage }}
      </p>

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex gap-2">
          <button
            type="submit"
            :disabled="isSaving"
            class="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ isSaving ? 'Saving...' : isEditMode ? 'Save changes' : 'Add reminder' }}
          </button>

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-slate-50"
            @click="handleClose"
          >
            Cancel
          </button>
        </div>

        <button
          v-if="isEditMode"
          type="button"
          :disabled="isDeleting"
          class="inline-flex items-center justify-center rounded-lg border border-rose-500 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
          @click="handleDelete"
        >
          {{ isDeleting ? 'Deleting...' : 'Delete reminder' }}
        </button>
      </div>
    </form>
  </BaseModal>
</template>
