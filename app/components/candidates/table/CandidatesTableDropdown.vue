<script setup lang="ts">
import { MoreVertical, Edit, UserCheck, Trash } from 'lucide-vue-next'
import type { Candidate } from '@/types/candidates'

interface Props {
  candidate: Candidate
}

defineProps<Props>()

const handleEdit = (e: Event) => {
  e.stopPropagation()
}

const handleScheduleInterview = (e: Event) => {
  e.stopPropagation()
}

const handleDelete = (e: Event) => {
  e.stopPropagation()
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger
      as-child
      @click.stop
    >
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8 cursor-pointer"
      >
        <MoreVertical class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="handleEdit">
        <Edit class="mr-2 h-4 w-4" />
        <span>Edit</span>
      </DropdownMenuItem>
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
