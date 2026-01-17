<script setup lang="ts">
import {
  Briefcase,
  Calendar,
  Edit,
  Eye,
  FileText,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Trash,
  UserCheck,
} from 'lucide-vue-next'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getCandidateExperienceLabel, getCandidateInitials, getFullName } from '~/utils/candidates'

const filters = ref({
  search: '',
  status: undefined,
  position: undefined,
  page: 1,
  limit: 10,
})

const { useCandidatesList } = useCandidates()
const { data: candidatesResponse, isPending, error } = useCandidatesList(filters)

const candidates = computed(() => candidatesResponse.value?.data || [])
// const totalCount = computed(() => candidatesResponse.value?.count || 0)
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">
          Candidates
        </h1>
        <p class="text-muted-foreground mt-1">
          Manage and track all your candidates
        </p>
      </div>
      <Button>
        <Plus class="mr-2 h-4 w-4" />
        Add Candidate
      </Button>
    </div>

    <!-- Filters Section -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <Input
          type="search"
          placeholder="Search candidates by name, email, or skills..."
          class="w-full"
        />
      </div>
      <Select>
        <SelectTrigger class="w-full sm:w-45">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            All Statuses
          </SelectItem>
          <SelectItem value="new">
            New
          </SelectItem>
          <SelectItem value="screening">
            Screening
          </SelectItem>
          <SelectItem value="interview">
            Interview
          </SelectItem>
          <SelectItem value="offer">
            Offer
          </SelectItem>
          <SelectItem value="hired">
            Hired
          </SelectItem>
          <SelectItem value="rejected">
            Rejected
          </SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger class="w-full sm:w-45">
          <SelectValue placeholder="Position" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            All Positions
          </SelectItem>
          <SelectItem value="frontend">
            Frontend Developer
          </SelectItem>
          <SelectItem value="backend">
            Backend Developer
          </SelectItem>
          <SelectItem value="fullstack">
            Full Stack Developer
          </SelectItem>
          <SelectItem value="devops">
            DevOps Engineer
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Candidates Grid -->
    <div
      v-if="!isPending && !error && candidates?.length"
      class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      <Card
        v-for="candidate in candidates"
        :key="candidate.id"
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
    </div>

    <!-- Loading State -->
    <div
      v-if="isPending"
      class="text-center py-12"
    >
      <p class="text-muted-foreground">
        Loading candidates...
      </p>
    </div>

    <!-- Error State -->
    <div
      v-if="error"
      class="text-center py-12"
    >
      <p class="text-destructive">
        {{ error.message }}
      </p>
    </div>

    <!-- Empty State -->
    <div
      v-if="!isPending && !error && !candidates?.length"
      class="text-center py-12"
    >
      <p class="text-muted-foreground">
        No candidates found
      </p>
    </div>
  </div>
</template>
