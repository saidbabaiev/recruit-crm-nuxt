import type { Database } from './supabase'

// --- ENUMS - Centralized enum definitions ---
export type AppRole = Database['public']['Enums']['app_role']
export type ApplicationStatus = Database['public']['Enums']['application_status']
export type JobStatus = Database['public']['Enums']['job_status']
export type InterviewStatus = Database['public']['Enums']['interview_status']
export type InterviewType = Database['public']['Enums']['interview_type']
export type WorkFormat = Database['public']['Enums']['work_format']

// --- ENUM UTILITIES - Helpers for working with enums ---
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline'

export const applicationStatusVariants: Record<ApplicationStatus, BadgeVariant> = {
  new: 'default',
  under_review: 'secondary',
  interview: 'outline',
  offer: 'default',
  hired: 'default',
  rejected: 'destructive',
  withdrawn: 'secondary',
}

export const jobStatusVariants: Record<JobStatus, BadgeVariant> = {
  open: 'default',
  closed: 'destructive',
  on_hold: 'outline',
  filled: 'secondary',
}

export const interviewTypeLabels: Record<InterviewType, string> = {
  phone: 'Phone Screen',
  video: 'Video Call',
  onsite: 'On-site',
  technical: 'Technical',
}
