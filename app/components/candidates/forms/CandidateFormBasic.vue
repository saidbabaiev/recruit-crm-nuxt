<script setup lang="ts">
import { Field as VeeField } from 'vee-validate'

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
</script>

<template>
  <FieldGroup class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- First Name -->
    <VeeField
      v-slot="{ componentField, errors }"
      name="first_name"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-first-name">
          First Name *
        </FieldLabel>
        <Input
          id="candidate-first-name"
          v-bind="componentField"
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
      v-slot="{ componentField, errors }"
      name="last_name"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-last-name">
          Last Name
        </FieldLabel>
        <Input
          id="candidate-last-name"
          v-bind="componentField"
          placeholder="Doe"
          :aria-invalid="!!errors.length"
        />
        <FieldError
          v-if="errors.length"
          :errors="errors"
        />
      </Field>
    </VeeField>

    <!-- Email -->
    <VeeField
      v-slot="{ componentField, errors }"
      name="email"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-email">
          Email *
        </FieldLabel>
        <Input
          id="candidate-email"
          v-bind="componentField"
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
      v-slot="{ componentField, errors }"
      name="phone"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-phone">
          Phone
        </FieldLabel>
        <Input
          id="candidate-phone"
          v-bind="componentField"
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
</template>
