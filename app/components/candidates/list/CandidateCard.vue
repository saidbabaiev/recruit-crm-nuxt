<script lang="ts" setup>
import type { Candidate } from '@/types/candidates'
import { Briefcase, Calendar, Mail, Phone } from 'lucide-vue-next'
import CandidateCardActions from '@/components/candidates/list/CandidateCardActions.vue'

interface Props {
  candidate: Candidate
}

const props = defineProps<Props>()
const router = useRouter()

const handleView = () => {
  router.push(`/candidates/${props.candidate.id}`)
}

const handleEdit = () => {
  // TODO: Implement edit
  console.log('Edit candidate', props.candidate.id)
}

const handleScheduleInterview = () => {
  // TODO: Implement schedule interview
  console.log('Schedule interview for', props.candidate.id)
}

const handleDelete = () => {
  // TODO: Implement delete
  console.log('Delete candidate', props.candidate.id)
}
</script>

<template>
  <Card
    class="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
    @click="handleView"
  >
    <CardHeader class="pb-3">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <Avatar class="h-12 w-12 shrink-0">
            <AvatarImage
              src=""
              alt="John Doe"
            />
            <AvatarFallback class="bg-linear-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {{ getCandidateInitials(candidate) }}
            </AvatarFallback>
          </Avatar>
          <div class="min-w-0 flex-1">
            <CardTitle class="text-base leading-none mb-1.5 truncate">
              {{ getFullName(candidate) }}
            </CardTitle>
            <CardDescription class="text-sm truncate">
              {{ candidate.current_position }}
            </CardDescription>
          </div>
        </div>
        <CandidateCardActions
          @edit="handleEdit"
          @schedule-interview="handleScheduleInterview"
          @delete="handleDelete"
        />
        <!-- <Badge
          variant="outline"
          class="shrink-0 text-xs"
        >
          New
        </Badge> -->
      </div>
    </CardHeader>

    <CardContent class="space-y-2.5 pb-4">
      <div class="flex items-center gap-2 text-sm">
        <Mail class="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span class="text-muted-foreground truncate text-xs">{{ candidate.email }}</span>
      </div>
      <div
        v-if="candidate.phone"
        class="flex items-center gap-2 text-sm"
      >
        <Phone class="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span class="text-muted-foreground text-xs">{{ candidate.phone }}</span>
      </div>
      <div
        v-if="candidate.experience_years"
        class="flex items-center gap-2 text-sm"
      >
        <Briefcase class="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span class="text-muted-foreground text-xs">{{ getCandidateExperienceLabel(candidate) }}</span>
      </div>
      <div
        v-if="candidate.notice_period"
        class="flex items-center gap-2 text-sm"
      >
        <Calendar class="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span class="text-muted-foreground text-xs">Notice period {{ candidate.notice_period }}</span>
      </div>

      <div class="flex flex-wrap gap-1.5 pt-2">
        <Badge
          variant="secondary"
          class="text-xs px-2 py-0.5"
        >
          React
        </Badge>
        <Badge
          variant="secondary"
          class="text-xs px-2 py-0.5"
        >
          TypeScript
        </Badge>
        <Badge
          variant="secondary"
          class="text-xs px-2 py-0.5"
        >
          Node.js
        </Badge>
      </div>
    </CardContent>
  </Card>
</template>
