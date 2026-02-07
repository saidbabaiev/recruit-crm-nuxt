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

    <!-- Education -->
    <VeeField
      v-slot="{ field, errors }"
      name="education"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-education">
          Education
        </FieldLabel>
        <Input
          id="candidate-education"
          v-bind="field"
          placeholder="University of California, Los Angeles"
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
