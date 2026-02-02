<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

import { useCandidates } from '@/composables/useCandidates'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/vue-query'

const formSchema = toTypedSchema(
  z.object({
    first_name: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name must not exceed 50 characters')
      .transform(val => val.trim()),

    last_name: z
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must not exceed 50 characters')
      .optional()
      .or(z.literal('')),

    email: z
      .string()
      .email('Please enter a valid email address')
      .toLowerCase()
      .trim(),

    phone: z
      .string()
      .min(10, 'Phone must be at least 10 characters')
      .max(20, 'Phone must not exceed 20 characters')
      .regex(/^[\d\s+()-]+$/, 'Phone can only contain digits and symbols +()-')
      .optional()
      .or(z.literal('')),
  }),
)

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
  validationSchema: formSchema,
  initialValues: {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  },
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
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Are you absolutely sure?</SheetTitle>
        <SheetDescription>
          This action cannot be undone. This will permanently delete your account
          and remove your data from our servers.
        </SheetDescription>
      </SheetHeader>
      <form
        id="candidate-form"
        class="space-y-4 p-4"
        @submit="onSubmit"
      >
        <FieldGroup class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- First Name -->
          <VeeField
            v-slot="{ field, errors }"
            name="first_name"
          >
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="candidate-first-name">
                First Name *
              </FieldLabel>
              <Input
                id="candidate-first-name"
                v-bind="field"
                placeholder="John"
                :aria-invalid="!!errors.length"
              />
              <FieldError
                v-if="errors.length"
                :errors="errors"
              />
            </Field>
          </VeeField>

          <!-- Last Name -->
          <VeeField
            v-slot="{ field, errors }"
            name="last_name"
          >
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="candidate-last-name">
                Last Name
              </FieldLabel>
              <Input
                id="candidate-last-name"
                v-bind="field"
                placeholder="Doe"
                :aria-invalid="!!errors.length"
              />
              <FieldError
                v-if="errors.length"
                :errors="errors"
              />
            </Field>
          </VeeField>
        </FieldGroup>

        <FieldGroup>
          <!-- Email -->
          <VeeField
            v-slot="{ field, errors }"
            name="email"
          >
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="candidate-email">
                Email *
              </FieldLabel>
              <Input
                id="candidate-email"
                v-bind="field"
                placeholder="john.doe@example.com"
                :aria-invalid="!!errors.length"
              />
              <FieldError
                v-if="errors.length"
                :errors="errors"
              />
            </Field>
          </VeeField>

          <!-- Phone -->
          <VeeField
            v-slot="{ field, errors }"
            name="phone"
          >
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="candidate-phone">
                Phone
              </FieldLabel>
              <Input
                id="candidate-phone"
                v-bind="field"
                placeholder="1234567890"
                :aria-invalid="!!errors.length"
              />
              <FieldError
                v-if="errors.length"
                :errors="errors"
              />
            </Field>
          </VeeField>
        </FieldGroup>
      </form>
      <SheetFooter>
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
