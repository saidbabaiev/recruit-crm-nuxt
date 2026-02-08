<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useForm } from 'vee-validate'
import { useQueryClient } from '@tanstack/vue-query'

import { useCandidates } from '@/composables/useCandidates'
import { candidateFormInitialValues, candidateFormSchema, candidateToFormValues } from '@/components/candidates/forms/candidateForm'
import CandidateForm from '@/components/candidates/forms/CandidateForm.vue'
import type { Candidate, CandidateUpdate } from '@/types/candidates'

interface Props {
  open: boolean
  candidate: Candidate
}

const props = defineProps<Props>()

const initialValues = computed(() => props.candidate ? candidateToFormValues(props.candidate) : candidateFormInitialValues)

const { $toast } = useNuxtApp()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const open = computed({
  get: () => props.open,
  set: value => emit('update:open', value),
})

const { handleSubmit, resetForm } = useForm({
  validationSchema: candidateFormSchema,
  initialValues: initialValues.value,
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.candidate) {
      resetForm({ values: candidateToFormValues(props.candidate) })
    }
  },
  { immediate: true },
)

const { useUpdateCandidate } = useCandidates()
const queryClient = useQueryClient()

const { mutate: updateCandidate, isPending } = useUpdateCandidate({
  onSuccess: async () => {
    $toast.success('Candidate updated successfully')

    await queryClient.invalidateQueries({
      queryKey: ['candidates', 'detail', props.candidate.id],
    })

    await queryClient.invalidateQueries({
      queryKey: ['candidates', 'list'],
    })

    resetForm()
    open.value = false
  },
  onError: (error) => {
    $toast.error('Failed to update candidate')
    // eslint-disable-next-line no-console
    console.error('Error updating candidate', error)
  },
})

const onSubmit = handleSubmit((values) => {
  updateCandidate({
    ...values,
    id: props.candidate.id,
  } as CandidateUpdate)
})
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent class="sm:max-w-2xl flex flex-col gap-0">
      <SheetHeader class="shrink-0 border-b px-6">
        <SheetTitle>Add Candidate</SheetTitle>
      </SheetHeader>
      <div class="flex-1 min-h-0 overflow-y-auto">
        <form
          id="candidate-form"
          @submit="onSubmit"
        >
          <CandidateForm />
        </form>
      </div>
      <SheetFooter class="border-t px-6">
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            class="flex-1"
            @click="resetForm"
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="candidate-form"
            class="flex-1"
            :disabled="isPending"
          >
            {{ isPending ? 'Saving...' : 'Save' }}
          </Button>
        </Field>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
