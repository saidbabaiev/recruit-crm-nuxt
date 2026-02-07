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
    <!-- Expected Salary Min -->
    <VeeField
      v-slot="{ field, errors }"
      name="expected_salary_min"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-expected-salary-min">
          Expected Salary Min
        </FieldLabel>
        <Input
          id="candidate-expected-salary-min"
          type="number"
          v-bind="field"
          placeholder="60000"
          :aria-invalid="!!errors.length"
        />
        <FieldError
          v-if="errors.length"
          :errors="errors"
        />
      </Field>
    </VeeField>

    <!-- Expected Salary Max -->
    <VeeField
      v-slot="{ field, errors }"
      name="expected_salary_max"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-expected-salary-max">
          Expected Salary Max
        </FieldLabel>
        <Input
          id="candidate-expected-salary-max"
          type="number"
          v-bind="field"
          placeholder="200000"
          :aria-invalid="!!errors.length"
        />
        <FieldError
          v-if="errors.length"
          :errors="errors"
        />
      </Field>
    </VeeField>

    <!-- Salary Currency -->
    <VeeField
      v-slot="{ field, errors }"
      name="salary_currency"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-salary-currency">
          Salary Currency
        </FieldLabel>
        <Input
          id="candidate-salary-currency"
          v-bind="field"
          placeholder="USD"
          :aria-invalid="!!errors.length"
        />
        <FieldError
          v-if="errors.length"
          :errors="errors"
        />
      </Field>
    </VeeField>

    <!-- Salary Period -->
    <VeeField
      v-slot="{ field, errors }"
      name="salary_period"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-salary-period">
          Salary Period
        </FieldLabel>
        <Select
          id="candidate-salary-period"
          v-bind="field"
          :aria-invalid="!!errors.length"
        >
          <SelectTrigger>
            <SelectValue placeholder="Salary Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">
              Monthly
            </SelectItem>
            <SelectItem value="yearly">
              Yearly
            </SelectItem>
          </SelectContent>
        </Select>
        <FieldError
          v-if="errors.length"
          :errors="errors"
        />
      </Field>
    </VeeField>
  </FieldGroup>
</template>
