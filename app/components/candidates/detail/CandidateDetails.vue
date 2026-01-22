<script setup lang="ts">
import CandidateSkillsCell from '@/components/candidates/table/cells/CandidateSkillsCell.vue'
import type { Candidate } from '@/types/candidates'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  candidate: Candidate
}

defineProps<Props>()

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
  <!-- Unified Details Card -->
  <Card>
    <CardContent>
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
            {{ getCandidateExperienceLabel(candidate.experience_years) }}
          </span>
        </div>

        <!-- Notice Period -->
        <div class="flex justify-between items-start">
          <span class="font-medium">Notice Period</span>
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
</template>
