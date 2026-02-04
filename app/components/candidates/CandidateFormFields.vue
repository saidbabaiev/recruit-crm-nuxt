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

  <FieldGroup class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

  <FieldGroup>
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
</template>
