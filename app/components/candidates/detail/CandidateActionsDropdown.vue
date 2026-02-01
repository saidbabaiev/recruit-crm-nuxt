<script setup lang="ts">
import { EllipsisVertical, Trash, UserCheck } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { Candidate } from '@/types/candidates'

interface Props {
  candidate: Candidate
}

defineProps<Props>()

const emit = defineEmits<{
  delete: []
}>()

const handleScheduleInterview = (e: Event) => {
  e.stopPropagation()
}

const handleDelete = (e: Event) => {
  e.stopPropagation()
  emit('delete')
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="outline"
        size="icon"
        class="w-8 h-8 rounded-full cursor-pointer"
      >
        <EllipsisVertical class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="handleScheduleInterview">
        <UserCheck class="mr-2 h-4 w-4" />
        <span>Schedule Interview</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        class="text-destructive"
        @click="handleDelete"
      >
        <Trash class="mr-2 h-4 w-4" />
        <span>Delete</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
