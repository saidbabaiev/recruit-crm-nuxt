export interface AppError {
  type: 'auth' | 'network' | 'validation' | 'server' | 'client' | 'unknown'
  message: string
  status?: number
  fields?: Record<string, string[]>
}

export const ERROR_MESSAGES = {
  OFFLINE: 'No internet connection',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  UNAUTHORIZED: 'You do not have permission to perform this action.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  VALIDATION: 'Please fix the errors in the form',
  CLIENT_ERROR: 'Client error occurred. Please try again later.',
  UNKNOWN: 'An unexpected error occurred',
} as const
