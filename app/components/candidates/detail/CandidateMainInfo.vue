<script setup lang="ts">
import { Pencil } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CandidateContacts from '@/components/candidates/detail/CandidateContacts.vue'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Candidate } from '@/types/candidates'
import { getFullName, getCandidateInitials } from '@/utils/formatters'
import CandidateActionsDropdown from '@/components/candidates/detail/CandidateActionsDropdown.vue'

interface Props {
  candidate: Candidate
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'delete'): []
  (e: 'editCandidate'): void
}>()

const handleDeleteCandidate = () => {
  emit('delete')
}

const handleEditCandidate = () => {
  emit('editCandidate')
}
</script>

<template>
  <Card class="pb-4">
    <CardContent class="p-0">
      <div class="flex items-start gap-6 px-6">
        <!-- Avatar -->
        <Avatar class="h-16 w-16">
          <AvatarFallback class="text-2xl bg-linear-to-br from-blue-300 to-violet-300 text-white font-semibold">
            {{ getCandidateInitials(candidate) }}
          </AvatarFallback>
        </Avatar>

        <div class="flex-1 space-y-2">
          <div class="flex items-center justify-between">
            <!-- Name -->
            <h1 class="text-xl font-bold tracking-tight">
              {{ getFullName(candidate) }}
            </h1>

            <!-- Actions -->
            <div class="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                class="w-8 h-8 rounded-full cursor-pointer"
                @click="handleEditCandidate"
              >
                <Pencil class="h-4 w-4" />
              </Button>
              <CandidateActionsDropdown
                v-if="candidate"
                :candidate="candidate"
                @delete="handleDeleteCandidate"
              />
            </div>
          </div>

          <!-- Position & Location -->
          <div class="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 text-sm">
            <p
              v-if="candidate.current_position"
              class="text-muted-foreground"
            >
              {{ candidate.current_position }}
            </p>
            <p
              v-if="candidate.city || candidate.country"
              class="flex items-center gap-1.5 text-muted-foreground"
            >
              {{ candidate.city ? `${candidate.city}, ` : '' }}{{ candidate.country }}
            </p>

            <p class="flex items-center gap-1.5">
              <span class="text-muted-foreground">Willing To Relocate:</span>
              <Badge
                :class="candidate.relocation_willingness ? 'bg-green-500' : 'bg-gray-400'"
                class="text-xs"
              >
                {{ candidate.relocation_willingness ? 'Yes' : 'No' }}
              </Badge>
            </p>
          </div>
        </div>
      </div>

      <Separator class="my-4" />

      <CandidateContacts :candidate="candidate" />
    </CardContent>
  </Card>
</template>
