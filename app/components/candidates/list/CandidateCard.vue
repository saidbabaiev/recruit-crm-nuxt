
<script lang="ts" setup>
import type { Candidate } from '@/types/candidates'
import { Briefcase, Calendar, Edit, Eye, FileText, Mail, MoreVertical, Phone, Trash, UserCheck } from 'lucide-vue-next';

interface Props {
  candidate: Candidate
}

const props = defineProps<Props>()
const router = useRouter()

const handleView = () => {
  router.push(`/candidates/${props.candidate.id}`)
}
</script>

<template>
  <Card
    class="overflow-hidden hover:shadow-lg transition-shadow duration-200"
  >
    <CardHeader class="pb-3">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-start gap-3 min-w-0 flex-1">
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
        <Badge
          variant="outline"
          class="shrink-0 text-xs"
        >
          New
        </Badge>
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

    <CardFooter class="flex gap-2 pt-3 border-t">
      <Button
        variant="outline"
        class="flex-1"
        size="sm"
      >
        <Eye class="mr-1.5 h-3.5 w-3.5" />
        <span class="text-xs">View</span>
      </Button>
      <Button
        variant="outline"
        class="flex-1"
        size="sm"
      >
        <Edit class="mr-1.5 h-3.5 w-3.5" />
        <span class="text-xs">Edit</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 shrink-0"
          >
            <MoreVertical class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <UserCheck class="mr-2 h-4 w-4" />
            <span>Schedule Interview</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileText class="mr-2 h-4 w-4" />
            <span>View Resume</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="text-destructive">
            <Trash class="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardFooter>
  </Card>
</template>

