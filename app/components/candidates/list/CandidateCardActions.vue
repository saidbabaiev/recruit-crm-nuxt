<script setup lang="ts">
import { MoreVertical, FileText, UserCheck, Trash } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'scheduleInterview'): void
  (e: 'delete'): void
}>()
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
        class="h-8 w-8 shrink-0 cursor-pointer"
      >
        <MoreVertical class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="emit('edit')">
        <FileText class="mr-2 h-4 w-4" />
        <span>Edit</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="emit('scheduleInterview')">
        <UserCheck class="mr-2 h-4 w-4" />
        <span>Schedule Interview</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        class="text-destructive"
        @click="emit('delete')"
      >
        <Trash class="mr-2 h-4 w-4" />
        <span>Delete</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
