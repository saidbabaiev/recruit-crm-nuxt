<script setup lang="ts">
import { ArrowLeft, Mail, Phone, MapPin, FileText, Clock, Calendar, Edit, Github, Linkedin } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

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
      <Card>
        <CardContent class="pt-6">
          <div class="flex items-start gap-6">
            <!-- Avatar -->
            <Avatar class="h-24 w-24">
              <AvatarFallback class="text-2xl">
                {{ initials }}
              </AvatarFallback>
            </Avatar>

            <!-- Main Info -->
            <div class="flex-1 space-y-4">
              <!-- Name & Position -->
              <div>
                <div class="flex items-start justify-between">
                  <div>
                    <h1 class="text-3xl font-bold tracking-tight">
                      {{ candidate.first_name }} {{ candidate.last_name }}
                    </h1>
                    <p class="text-lg text-muted-foreground mt-1">
                      {{ candidate.current_position || 'Not specified' }}
                    </p>
                  </div>
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

                <!-- Location & Relocation -->
                <div class="flex items-center gap-6 mt-3 text-sm">
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
              </div>

              <Separator />

              <!-- Contact Info Grid -->
              <div class="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <!-- Email -->
                <div class="flex items-center gap-2">
                  <Mail class="h-4 w-4 text-muted-foreground shrink-0" />
                  <a
                    v-if="candidate.email"
                    :href="`mailto:${candidate.email}`"
                    class="text-primary hover:underline truncate"
                  >
                    {{ candidate.email }}
                  </a>
                  <span
                    v-else
                    class="text-muted-foreground"
                  >Not specified</span>
                </div>

                <!-- Phone -->
                <div class="flex items-center gap-2">
                  <Phone class="h-4 w-4 text-muted-foreground shrink-0" />
                  <a
                    v-if="candidate.phone"
                    :href="`tel:${candidate.phone}`"
                    class="text-primary hover:underline"
                  >
                    {{ candidate.phone }}
                  </a>
                  <span
                    v-else
                    class="text-muted-foreground"
                  >Not specified</span>
                </div>

                <!-- LinkedIn -->
                <div class="flex items-center gap-2">
                  <Linkedin class="h-4 w-4 text-muted-foreground shrink-0" />
                  <a
                    v-if="candidate.linkedin_url"
                    :href="candidate.linkedin_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:underline truncate"
                  >
                    LinkedIn Profile
                  </a>
                  <span
                    v-else
                    class="text-muted-foreground"
                  >Not specified</span>
                </div>

                <!-- GitHub -->
                <div class="flex items-center gap-2">
                  <Github class="h-4 w-4 text-muted-foreground shrink-0" />
                  <a
                    v-if="candidate.github_url"
                    :href="candidate.github_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:underline truncate"
                  >
                    GitHub Profile
                  </a>
                  <span
                    v-else
                    class="text-muted-foreground"
                  >Not specified</span>
                </div>

                <!-- Resume -->
                <div class="flex items-center gap-2 col-span-2">
                  <FileText class="h-4 w-4 text-muted-foreground shrink-0" />
                  <a
                    v-if="candidate.resume_url"
                    :href="candidate.resume_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:underline truncate"
                  >
                    Download Resume
                  </a>
                  <span
                    v-else
                    class="text-muted-foreground"
                  >Not specified</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Unified Details Card -->
      <Card class="mt-6">
        <CardContent class="pt-6">
          <div class="grid grid-cols-2 gap-x-16 gap-y-4 text-sm">
            <!-- Current Organization -->
            <div class="flex justify-between items-start">
              <span class="text-muted-foreground">Current Organization</span>
              <span class="font-medium text-right">{{ candidate.current_company || 'Not specified' }}</span>
            </div>

            <!-- Education -->
            <div class="flex justify-between items-start">
              <span class="text-muted-foreground">Education</span>
              <span class="font-medium text-right">{{ candidate.education || 'Not specified' }}</span>
            </div>

            <!-- Skills -->
            <div class="flex justify-between items-start">
              <span class="text-muted-foreground">Skills</span>
              <div class="text-right">
                <span
                  v-if="candidate.skills && candidate.skills.length"
                  class="font-medium"
                >
                  {{ candidate.skills.join(', ') }}
                </span>
                <span
                  v-else
                  class="text-muted-foreground"
                >Not specified</span>
              </div>
            </div>

            <!-- Languages -->
            <div class="flex justify-between items-start">
              <span class="text-muted-foreground">Languages</span>
              <div class="text-right">
                <span
                  v-if="candidate.languages && candidate.languages.length"
                  class="font-medium"
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
              <span class="text-muted-foreground">Salary Expectation</span>
              <div class="font-medium text-right">
                <div v-if="candidate.expected_salary_min || candidate.expected_salary_max">
                  {{ formatSalary(candidate.expected_salary_min || candidate.expected_salary_max, candidate.salary_currency, candidate.salary_period) }}
                </div>
                <span
                  v-else
                  class="text-muted-foreground font-normal"
                >Not specified</span>
              </div>
            </div>

            <!-- Total Experience -->
            <div class="flex justify-between items-start">
              <span class="text-muted-foreground">Total Experience</span>
              <span class="font-medium text-right">
                {{ candidate.experience_years ? `${candidate.experience_years} Year${candidate.experience_years > 1 ? 's' : ''}` : 'Not specified' }}
              </span>
            </div>

            <!-- Notice Period -->
            <div class="flex justify-between items-start">
              <span class="text-muted-foreground">Notice Period (Days)</span>
              <span class="font-medium text-right">{{ candidate.notice_period ?? 'Not specified' }}</span>
            </div>

            <!-- Availability Date -->
            <div class="flex justify-between items-start">
              <span class="text-muted-foreground">Availability Date</span>
              <span class="font-medium text-right">{{ formatDate(candidate.availability_date) }}</span>
            </div>

            <!-- Remote Work Preference -->
            <div class="flex justify-between items-start">
              <span class="text-muted-foreground">Remote Work Preference</span>
              <span class="font-medium text-right">{{ formatRemotePreference(candidate.remote_work_preference) }}</span>
            </div>

            <!-- Visa Status -->
            <div class="flex justify-between items-start">
              <span class="text-muted-foreground">Visa Status</span>
              <span class="font-medium text-right">{{ formatVisaStatus(candidate.visa_status) }}</span>
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
