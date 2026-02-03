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

    country: z
      .string()
      .max(50, 'Country must not exceed 50 characters')
      .optional()
      .or(z.literal('')),

    city: z
      .string()
      .max(50, 'City must not exceed 50 characters')
      .optional()
      .or(z.literal('')),

    current_position: z
      .string()
      .max(50, 'Current position must not exceed 50 characters')
      .optional()
      .or(z.literal('')),

    current_company: z
      .string()
      .max(50, 'Current company must not exceed 50 characters')
      .optional()
      .or(z.literal('')),

    experience_years: z.preprocess(
      val => val === '' || val === null || val === undefined ? null : Number(val),
      z.number()
        .min(0, 'Experience years must be at least 0')
        .max(50, 'Experience years must not exceed 50')
        .nullable().optional(),
    ),

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
    country: '',
    city: '',
    current_position: '',
    current_company: '',
    experience_years: null,
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
  <Sheet
    v-model:open="open"
    class="max-w-2xl"
  >
    <SheetContent class="sm:max-w-xl flex flex-col">
      <SheetHeader class="shrink-0 border-b">
        <SheetTitle>Are you absolutely sure?</SheetTitle>
        <SheetDescription>
          This action cannot be undone. This will permanently delete your account
          and remove your data from our servers.
        </SheetDescription>
      </SheetHeader>
      <div class="flex-1 min-h-0 overflow-y-auto p-4">
        <form
          id="candidate-form"
          class="space-y-4"
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

          <!-- Location -->
          <FieldGroup>
            <!-- Country -->
            <VeeField
              v-slot="{ field, errors }"
              name="country"
            >
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="candidate-country">
                  Country
                </FieldLabel>
                <Input
                  id="candidate-country"
                  v-bind="field"
                  placeholder="United States"
                  :aria-invalid="!!errors.length"
                />
                <FieldError
                  v-if="errors.length"
                  :errors="errors"
                />
              </Field>
            </VeeField>

            <!-- City -->
            <VeeField
              v-slot="{ field, errors }"
              name="city"
            >
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="candidate-city">
                  City
                </FieldLabel>
                <Input
                  id="candidate-city"
                  v-bind="field"
                  placeholder="New York"
                  :aria-invalid="!!errors.length"
                />
                <FieldError
                  v-if="errors.length"
                  :errors="errors"
                />
              </Field>
            </VeeField>
          </FieldGroup>

          <!-- Professional Information -->
          <FieldGroup>
            <!-- Current Position -->
            <VeeField
              v-slot="{ field, errors }"
              name="current_position"
            >
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="candidate-current-position">
                  Current Position
                </FieldLabel>
                <Input
                  id="candidate-current-position"
                  v-bind="field"
                  placeholder="Software Engineer"
                  :aria-invalid="!!errors.length"
                />
                <FieldError
                  v-if="errors.length"
                  :errors="errors"
                />
              </Field>
            </VeeField>

            <!-- Current Company -->
            <VeeField
              v-slot="{ field, errors }"
              name="current_company"
            >
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="candidate-current-company">
                  Current Company
                </FieldLabel>
                <Input
                  id="candidate-current-company"
                  v-bind="field"
                  placeholder="Google"
                  :aria-invalid="!!errors.length"
                />
                <FieldError
                  v-if="errors.length"
                  :errors="errors"
                />
              </Field>
            </VeeField>

            <!-- Experience Years -->
            <VeeField
              v-slot="{ field, errors }"
              name="experience_years"
            >
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="candidate-experience-years">
                  Experience Years
                </FieldLabel>
                <Input
                  id="candidate-experience-years"
                  type="number"
                  v-bind="field"
                  placeholder="10"
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
      </div>
      <SheetFooter class="border-t">
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
