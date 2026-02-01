<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

interface Props {
  search: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
}>()

const search = computed({
  get: () => props.search,
  set: value => emit('update:search', value),
})
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4">
    <div class="flex-1">
      <Input
        v-model="search"
        type="search"
        placeholder="Search candidates by name, email, phone or location..."
        class="w-full"
      />
    </div>

    <Button>
      <Plus class="mr-2 h-4 w-4" />
      Add Candidate
    </Button>
  </div>
</template>
