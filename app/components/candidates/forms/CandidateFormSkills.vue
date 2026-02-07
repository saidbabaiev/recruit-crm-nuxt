<script setup lang="ts">
import { TagsInput, TagsInputItem, TagsInputItemText, TagsInputItemDelete, TagsInputInput } from '@/components/ui/tags-input'

import { Field as VeeField } from 'vee-validate'

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
</script>

<template>
  <FieldGroup>
    <!-- TODO: skills, languages -->
    <VeeField
      v-slot="{ componentField, errors }"
      name="skills"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel for="candidate-skills">
          Technical Skills
        </FieldLabel>

        <TagsInput
          id="candidate-skills"
          :model-value="(componentField.modelValue ?? [])"
          :aria-invalid="!!errors.length"
          @update:model-value="componentField['onUpdate:modelValue']"
        >
          <TagsInputItem
            v-for="item in (componentField.modelValue || [])"
            :key="item"
            :value="item"
          >
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>

          <TagsInputInput
            placeholder="Add skill..."
            class="min-w-[120px]"
          />
        </TagsInput>

        <FieldError
          v-if="errors.length"
          :errors="errors"
        />
      </Field>
    </VeeField>
  </FieldGroup>
</template>
