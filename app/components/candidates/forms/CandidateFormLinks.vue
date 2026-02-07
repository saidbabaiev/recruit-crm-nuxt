<script setup lang="ts">
import { Field as VeeField } from 'vee-validate'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
</script>

<template>
  <FieldGroup>
    <!-- TODO: Resume -->

    <!-- LinkedIn URL -->
    <VeeField
      v-slot="{ field, errors }"
      name="linkedin_url"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-linkedin-url">
          LinkedIn URL
        </FieldLabel>
        <Input
          id="candidate-linkedin-url"
          v-bind="field"
          placeholder="https://www.linkedin.com/in/john-doe"
          :aria-invalid="!!errors.length"
        />
        <FieldError
          v-if="errors.length"
          :errors="errors"
        />
      </Field>
    </VeeField>

    <!-- GitHub URL -->
    <VeeField
      v-slot="{ field, errors }"
      name="github_url"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-github-url">
          GitHub URL
        </FieldLabel>
        <Input
          id="candidate-github-url"
          v-bind="field"
          placeholder="https://github.com/john-doe"
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
