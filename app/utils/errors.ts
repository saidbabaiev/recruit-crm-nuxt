import type { PostgrestError, AuthError } from '@supabase/supabase-js'
import type { AppError } from '@/types/errors'
import { ERROR_MESSAGES } from '@/types/errors'

// Type guards
function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === 'object'
    && error !== null
    && 'name' in error
    && error.name === 'AuthError'
  )
}

function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object'
    && error !== null
    && 'code' in error
    && 'message' in error
    && 'details' in error
  )
}

function hasStatus(error: unknown): error is { status: number, message?: string } {
  return (
    typeof error === 'object'
    && error !== null
    && 'status' in error
    && typeof error.status === 'number'
  )
}

function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true
  }

  if (typeof error === 'object' && error !== null) {
    const message = (error as Error).message || ''
    return (
      message.includes('NetworkError')
      || message.includes('Failed to fetch')
      || message.includes('Network request failed')
    )
  }

  return false
}

/**
 * Normalize any error to AppError
 * This is the ONLY function that converts unknown -> AppError
 */
export function normalizeError(error: unknown): AppError {
  if (isAuthError(error)) {
    return {
      type: 'auth',
      message: error.message,
      status: error.status || 401,
    }
  }

  // 2. Network errors
  if (isNetworkError(error)) {
    return {
      type: 'network',
      message: ERROR_MESSAGES.OFFLINE,
    }
  }

  // 3. Supabase Database errors
  if (isPostgrestError(error)) {
    return {
      type: 'server',
      message: ERROR_MESSAGES.SERVER_ERROR,
      status: 500,
    }
  }

  // 4. HTTP 5xx
  if (hasStatus(error) && error.status >= 500) {
    return {
      type: 'server',
      message: ERROR_MESSAGES.SERVER_ERROR,
      status: error.status,
    }
  }

  // 5. Validation errors (only 400, 422)
  if (hasStatus(error) && (error.status === 400 || error.status === 422)) {
    return {
      type: 'validation',
      message: error.message || ERROR_MESSAGES.VALIDATION,
      status: error.status,
    }
  }

  // 6. Other client errors (404, 409, 429, etc)
  if (hasStatus(error) && error.status >= 400 && error.status < 500) {
    return {
      type: 'client',
      message: error.message || ERROR_MESSAGES.CLIENT_ERROR,
      status: error.status,
    }
  }

  // 7. Standard Error
  if (error instanceof Error) {
    return {
      type: 'unknown',
      message: error.message || ERROR_MESSAGES.UNKNOWN,
    }
  }

  // 8. String
  if (typeof error === 'string') {
    return {
      type: 'unknown',
      message: error,
    }
  }

  // 8. Complete unknown
  return {
    type: 'unknown',
    message: ERROR_MESSAGES.UNKNOWN,
  }
}

/**
 * Function to check if the error should redirect to auth page
 */
export function shouldRedirectToAuth(error: AppError): boolean {
  return error.type === 'auth' && (error.status === 401 || error.status === 403)
}
