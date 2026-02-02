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

import { useForm, Field as VeeField } from 'vee-validate'
import { z } from 'zod'

interface Props {
  open: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const open = computed({
  get: () => props.open,
  set: value => emit('update:open', value),
})

const onSubmit = (values: unknown) => {
  console.log(values)
}
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
      <div class="p-4">
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
                  First Name
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
                  Email
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
      </div>
      <SheetFooter>
        <Button type="submit">
          Create
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
