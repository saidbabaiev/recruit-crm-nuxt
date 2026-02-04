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
  <FieldGroup class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

  <!-- TODO: relocation_willingness, remote_work_preference -->
</template>
