// ./types/errors.ts
/**
 * Unified application error type using discriminated union
 *
 * Why discriminated union over class hierarchy:
 * - Better TypeScript type narrowing (autocomplete works perfectly)
 * - Serializable (can be sent over network/stored)
 * - No prototype chain issues
 * - Easier to pattern match
 */
export type AppError
  = | {
    type: 'database'
    code: string
    message: string
    details?: string
    hint?: string
  }
  | {
    type: 'auth'
    code: string
    message: string
  }
  | {
    type: 'network'
    message: string
  }
  | {
    type: 'validation'
    fields: Record<string, string[]>
    message?: string
  }
  | {
    type: 'not_found'
    resource: string
    id?: string
  }
  | {
    type: 'http'
    status: number
    message: string
  }
  | {
    type: 'unknown'
    message: string
    originalError?: unknown
  }

/**
 * User-facing error messages mapping
 * Centralized so we can easily update copy
 */
export const ERROR_MESSAGES = {
  // Database
  DUPLICATE: 'This record already exists',
  FOREIGN_KEY: 'Cannot delete: related records exist',
  NOT_FOUND: 'Record not found',

  // Network
  OFFLINE: 'No internet connection. Please check your network.',
  TIMEOUT: 'Request timed out. Please try again.',

  // Auth
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  UNAUTHORIZED: 'You do not have permission to perform this action.',

  // Generic
  UNKNOWN: 'An unexpected error occurred',
  VALIDATION: 'Please fix the errors in the form',
} as const

/**
 * Supabase error codes we care about
 */
export const POSTGRES_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
  CHECK_VIOLATION: '23514',
} as const
