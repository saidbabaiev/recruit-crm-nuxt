<script setup lang="ts">
import { Field as VeeField } from 'vee-validate'

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
</script>

<template>
  <FieldGroup class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

    <!-- Relocation Willingness -->
    <VeeField
      v-slot="{ field, errors }"
      name="relocation_willingness"
    >
      <Field
        :data-invalid="!!errors.length"
        class="h-full"
      >
        <div class="grid grid-cols-1 gap-2 h-full">
          <FieldLabel for="candidate-relocation-willingness">
            Willing to relocate
          </FieldLabel>
          <Switch
            id="candidate-relocation-willingness"
            :model-value="field.value"
            :aria-invalid="!!errors.length"
            class="cursor-pointer"
            @update:model-value="field['onUpdate:modelValue']"
          />
        </div>
        <FieldError
          v-if="errors.length"
          :errors="errors"
        />
      </Field>
    </VeeField>

    <!-- Remote Work Preference -->
    <VeeField
      v-slot="{ field, errors }"
      name="remote_work_preference"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-remote-work-preference">
          Remote Work Preference
        </FieldLabel>
        <Select
          id="candidate-remote-work-preference"
          v-bind="field"
          :aria-invalid="!!errors.length"
        >
          <SelectTrigger>
            <SelectValue placeholder="Remote Work Preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">
              Not specified
            </SelectItem>
            <SelectItem value="remote">
              Remote
            </SelectItem>
            <SelectItem value="hybrid">
              Hybrid
            </SelectItem>
            <SelectItem value="onsite">
              On-site
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <FieldError
        v-if="errors.length"
        :errors="errors"
      />
    </VeeField>
  </FieldGroup>
</template>
