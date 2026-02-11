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
    <!-- TODO: Notice Period, Availability Date -->

    <!-- Current Position -->
    <VeeField
      v-slot="{ componentField, errors }"
      name="current_position"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-current-position">
          Current Position
        </FieldLabel>
        <Input
          id="candidate-current-position"
          v-bind="componentField"
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
      v-slot="{ componentField, errors }"
      name="experience_years"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-experience-years">
          Experience Years
        </FieldLabel>
        <Input
          id="candidate-experience-years"
          type="number"
          v-bind="componentField"
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
      v-slot="{ componentField, errors }"
      name="current_company"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-current-company">
          Current Company
        </FieldLabel>
        <Input
          id="candidate-current-company"
          v-bind="componentField"
          placeholder="Google"
          :aria-invalid="!!errors.length"
        />
        <FieldError
          v-if="errors.length"
          :errors="errors"
        />
      </Field>
    </VeeField>

    <!-- Notice Period -->
    <VeeField
      v-slot="{ componentField, errors }"
      name="notice_period"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-notice-period">
          Notice Period
        </FieldLabel>
        <Select
          id="candidate-notice-period"
          v-bind="componentField"
          :aria-invalid="!!errors.length"
        >
          <SelectTrigger>
            <SelectValue placeholder="Notice Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">
              Not specified
            </SelectItem>
            <SelectItem value="1 week">
              1 week
            </SelectItem>
            <SelectItem value="2 weeks">
              2 weeks
            </SelectItem>
            <SelectItem value="3 weeks">
              3 weeks
            </SelectItem>
            <SelectItem value="1 month">
              1 month
            </SelectItem>
            <SelectItem value="2 months">
              2 months
            </SelectItem>
            <SelectItem value="3 months">
              3 months
            </SelectItem>
            <SelectItem value="4 months">
              4 months
            </SelectItem>
            <SelectItem value="5 months">
              5 months
            </SelectItem>
            <SelectItem value="6 months">
              6 months
            </SelectItem>
            <SelectItem value="7 months">
              7 months
            </SelectItem>
            <SelectItem value="8 months">
              8 months
            </SelectItem>
            <SelectItem value="9 months">
              9 months
            </SelectItem>
            <SelectItem value="10 months">
              10 months
            </SelectItem>
            <SelectItem value="11 months">
              11 months
            </SelectItem>
            <SelectItem value="12 months">
              12 months
            </SelectItem>
          </SelectContent>
        </Select>
        <FieldError
          v-if="errors.length"
          :errors="errors"
        />
      </Field>
    </VeeField>

    <!-- Availability Date -->
    <VeeField
      v-slot="{ componentField, errors }"
      name="availability_date"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-availability-date">
          Availability Date
        </FieldLabel>
        <Input
          id="candidate-availability-date"
          v-bind="componentField"
          type="date"
          placeholder="01/01/2026"
          :min="new Date().toISOString().split('T')[0]"
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
      v-slot="{ componentField, errors }"
      name="education"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-education">
          Education
        </FieldLabel>
        <Input
          id="candidate-education"
          v-bind="componentField"
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
