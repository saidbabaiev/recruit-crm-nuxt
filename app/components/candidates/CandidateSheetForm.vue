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
import { candidateFormInitialValues, candidateFormSchema } from '@/components/candidates/candidateForm'
import CandidateFormFields from '@/components/candidates/CandidateFormFields.vue'

interface Props {
  open: boolean
}

const props = defineProps<Props>()

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
  initialValues: candidateFormInitialValues,
})

const { useCreateCandidate } = useCandidates()
const queryClient = useQueryClient()

const { mutate: createCandidate, isPending } = useCreateCandidate({
  onSuccess: async () => {
    $toast.success('Candidate created successfully')
    await queryClient.invalidateQueries({ queryKey: ['candidates', 'list'] })
    resetForm()
    open.value = false
  },
  onError: (error) => {
    $toast.error('Failed to create candidate')
    console.error(error)
  },
})

const onSubmit = handleSubmit((values) => {
  createCandidate(values)
})
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent class="sm:max-w-2xl flex flex-col">
      <SheetHeader class="shrink-0 border-b px-6">
        <SheetTitle>Add Candidate</SheetTitle>
      </SheetHeader>
      <div class="flex-1 min-h-0 overflow-y-auto px-6 py-4">
        <form
          id="candidate-form"
          class="space-y-4"
          @submit="onSubmit"
        >
          <CandidateFormFields />
        </form>
      </div>
      <SheetFooter class="border-t px-6">
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            @click="resetForm"
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="candidate-form"
            :disabled="isPending"
          >
            {{ isPending ? 'Creating...' : 'Create' }}
          </Button>
        </Field>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
