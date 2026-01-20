<script setup lang="ts">
import { ArrowLeft, MapPin, Clock, Calendar, Edit } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import CandidateSkillsCell from '@/components/candidates/table/cells/CandidateSkillsCell.vue'
import CandidateContacts from '~/components/candidates/detail/CandidateContacts.vue'

const route = useRoute()
const candidateId = computed(() => route.params.id as string)

const { useCandidateDetails } = useCandidates()
const { data: candidate, isPending, error } = useCandidateDetails(candidateId)

// Navigate back to list
const goBack = () => navigateTo('/candidates')

// Get initials for avatar
const initials = computed(() => {
  if (!candidate.value) return '?'
  const first = candidate.value.first_name?.[0] || ''
  const last = candidate.value.last_name?.[0] || ''
  return `${first}${last}`.toUpperCase() || '?'
})

// Format salary with period
const formatSalary = (amount: number | null, currency?: string | null, period?: string | null) => {
  if (!amount) return 'Not specified'
  const periodText = period ? `/${period}` : ''
  return `${currency || 'EUR'} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${periodText}`
}

// Format date
const formatDate = (date: string | null) => {
  if (!date) return 'Not specified'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Format remote work preference
const formatRemotePreference = (preference: string | null) => {
  if (!preference) return 'Not specified'
  const map: Record<string, string> = {
    remote: 'Remote Only',
    hybrid: 'Hybrid',
    onsite: 'On-site',
  }
  return map[preference] || preference
}

// Format visa status
const formatVisaStatus = (status: string | null) => {
  if (!status) return 'Not specified'
  const map: Record<string, string> = {
    citizen: 'Citizen',
    permanent_resident: 'Permanent Resident',
    work_permit: 'Work Permit',
    visa_required: 'Visa Required',
  }
  return map[status] || status
}
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Back button -->
    <Button
      variant="ghost"
      size="sm"
      @click="goBack"
    >
      <ArrowLeft class="mr-2 h-4 w-4" />
      Back to Candidates
    </Button>

    <!-- Loading state -->
    <div
      v-if="isPending"
      class="text-center py-12"
    >
      <p class="text-muted-foreground">
        Loading candidate...
      </p>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="text-center py-12"
    >
      <p class="text-destructive">
        {{ error.message }}
      </p>
      <Button
        class="mt-4"
        @click="goBack"
      >
        Back to List
      </Button>
    </div>

    <!-- Success state -->
    <div
      v-else-if="candidate"
      class="max-w-6xl mx-auto"
    >
      <!-- Header Card -->
      <Card class="pb-4">
        <CardContent class="p-0">
          <div class="flex items-start gap-6 px-6">
            <!-- Avatar -->
            <Avatar class="h-16 w-16">
              <AvatarFallback class="text-2xl bg-linear-to-br from-blue-300 to-violet-300 text-white font-semibold">
                {{ initials }}
              </AvatarFallback>
            </Avatar>

            <!-- Main Info -->
            <div class="flex-1 space-y-4">
              <div class="flex items-center justify-between mb-0">
                <!-- Left: Name + Social Icons -->
                <div class="flex items-center gap-3">
                  <h1 class="text-3xl font-bold tracking-tight">
                    {{ candidate.first_name }} {{ candidate.last_name }}
                  </h1>
                </div>

                <!-- Right: Action Buttons -->
                <div class="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Edit class="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button size="sm">
                    Schedule Interview
                  </Button>
                </div>
              </div>

              <!-- Position & Location & Relocation (new line below) -->
              <div class="flex items-center gap-6 text-sm">
                <p class="text-lg text-muted-foreground">
                  {{ candidate.current_position || 'Not specified' }}
                </p>
                <span
                  v-if="candidate.city || candidate.country"
                  class="flex items-center gap-1.5 text-muted-foreground"
                >
                  <MapPin class="h-4 w-4" />
                  {{ candidate.city ? `${candidate.city}, ` : '' }}{{ candidate.country }}
                </span>

                <span class="flex items-center gap-1.5">
                  <span class="text-muted-foreground">Willing To Relocate:</span>
                  <Badge
                    :variant="candidate.relocation_willingness ? 'default' : 'secondary'"
                    class="text-xs"
                  >
                    {{ candidate.relocation_willingness ? 'Yes' : 'No' }}
                  </Badge>
                </span>
              </div>

              <!-- <Separator />

              <CandidateContacts :candidate="candidate" /> -->
            </div>
          </div>

          <Separator class="my-4" />

          <div class="px-6">
            <CandidateContacts :candidate="candidate" />
          </div>
        </CardContent>
      </Card>

      <!-- Unified Details Card -->
      <Card class="mt-6">
        <CardContent class="pt-6">
          <div class="grid grid-cols-2 gap-x-16 gap-y-4 text-sm">
            <!-- Current Organization -->
            <div class="flex justify-between items-start">
              <span class="font-medium">Current Organization</span>
              <span class="text-right font-light">{{ candidate.current_company || 'Not specified' }}</span>
            </div>

            <!-- Education -->
            <div class="flex justify-between items-start">
              <span class="font-medium">Education</span>
              <span class="text-right font-light">{{ candidate.education || 'Not specified' }}</span>
            </div>

            <!-- Skills -->
            <div class="flex justify-between items-start">
              <span class="font-medium">Skills</span>
              <div class="text-right font-light">
                <CandidateSkillsCell
                  :candidate="candidate"
                  text-size="sm"
                />
              </div>
            </div>

            <!-- Languages -->
            <div class="flex justify-between items-start">
              <span class="font-medium">Languages</span>
              <div class="text-right font-light">
                <span
                  v-if="candidate.languages && candidate.languages.length"
                  class="font-light"
                >
                  {{ candidate.languages.join(', ') }}
                </span>
                <span
                  v-else
                  class="text-muted-foreground"
                >Not specified</span>
              </div>
            </div>

            <!-- Salary Expectation -->
            <div class="flex justify-between items-start">
              <span class="font-medium">Salary Expectation</span>
              <div class="text-right font-light">
                <div v-if="candidate.expected_salary_min || candidate.expected_salary_max">
                  {{ formatSalary(candidate.expected_salary_min || candidate.expected_salary_max, candidate.salary_currency, candidate.salary_period) }}
                </div>
                <span
                  v-else
                  class="text-muted-foreground font-light"
                >Not specified</span>
              </div>
            </div>

            <!-- Total Experience -->
            <div class="flex justify-between items-start">
              <span class="font-medium">Experience</span>
              <span class="text-right font-light">
                {{ getCandidateExperienceLabel(candidate) }}
              </span>
            </div>

            <!-- Notice Period -->
            <div class="flex justify-between items-start">
              <span class="font-medium">Notice Period (Days)</span>
              <span class="text-right font-light">{{ candidate.notice_period ?? 'Not specified' }}</span>
            </div>

            <!-- Availability Date -->
            <div class="flex justify-between items-start">
              <span class="font-medium">Availability Date</span>
              <span class="text-right font-light">{{ formatDate(candidate.availability_date) }}</span>
            </div>

            <!-- Remote Work Preference -->
            <div class="flex justify-between items-start">
              <span class="font-medium">Remote Work Preference</span>
              <span class="text-right font-light">{{ formatRemotePreference(candidate.remote_work_preference) }}</span>
            </div>

            <!-- Visa Status -->
            <div class="flex justify-between items-start">
              <span class="font-medium">Visa Status</span>
              <span class="text-right font-light">{{ formatVisaStatus(candidate.visa_status) }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Metadata Footer -->
      <div class="flex items-center justify-between text-xs text-muted-foreground mt-6">
        <div class="flex items-center gap-2">
          <Clock class="h-3 w-3" />
          <span>Created: {{ formatDate(candidate.created_at) }}</span>
        </div>
        <div
          v-if="candidate.updated_at"
          class="flex items-center gap-2"
        >
          <Calendar class="h-3 w-3" />
          <span>Last Updated: {{ formatDate(candidate.updated_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
