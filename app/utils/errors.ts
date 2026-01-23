import type { PostgrestError, AuthError } from '@supabase/supabase-js'
import type { AppError } from '@/types/errors'
import { ERROR_MESSAGES, POSTGRES_ERROR_CODES } from '@/types/errors'

/**
 * Type guards
 */
function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object'
    && error !== null
    && 'code' in error
    && 'message' in error
    && 'details' in error
  )
}

function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === 'object'
    && error !== null
    && 'name' in error
    && error.name === 'AuthError'
  )
}

function hasHttpStatus(error: unknown): error is { status: number, message?: string } {
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
 * Safely extract status code from auth error
 */
function getAuthErrorCode(error: AuthError): string {
  // AuthError may have a status property
  if ('status' in error && typeof error.status === 'number') {
    return error.status.toString()
  }
  return 'AUTH_ERROR'
}

/**
 * Normalize any error to AppError
 * This is the ONLY function that converts unknown -> AppError
 */
export function normalizeError(error: unknown): AppError {
  // 1. Supabase Database Errors
  if (isPostgrestError(error)) {
    return {
      type: 'database',
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    }
  }

  // 2. Supabase Auth Errors
  if (isAuthError(error)) {
    return {
      type: 'auth',
      code: getAuthErrorCode(error),
      message: error.message,
    }
  }

  // 3. Network Errors
  if (isNetworkError(error)) {
    return {
      type: 'network',
      message: ERROR_MESSAGES.OFFLINE,
    }
  }

  // 4. HTTP Errors (fetch responses)
  if (hasHttpStatus(error)) {
    return {
      type: 'http',
      status: error.status,
      message: error.message || `HTTP ${error.status}`,
    }
  }

  // 5. Standard Error
  if (error instanceof Error) {
    return {
      type: 'unknown',
      message: error.message || ERROR_MESSAGES.UNKNOWN,
      originalError: error,
    }
  }

  // 6. String (bad practice but happens)
  if (typeof error === 'string') {
    return {
      type: 'unknown',
      message: error,
      originalError: error,
    }
  }

  // 7. Complete unknown
  return {
    type: 'unknown',
    message: ERROR_MESSAGES.UNKNOWN,
    originalError: error,
  }
}

/**
 * Get user-friendly message from AppError
 * This is what you show in toasts/UI
 */
export function getErrorMessage(error: AppError): string {
  switch (error.type) {
    case 'database':
      // Map common Postgres errors
      switch (error.code) {
        case POSTGRES_ERROR_CODES.UNIQUE_VIOLATION:
          return ERROR_MESSAGES.DUPLICATE
        case POSTGRES_ERROR_CODES.FOREIGN_KEY_VIOLATION:
          return ERROR_MESSAGES.FOREIGN_KEY
        case 'PGRST116':
          return ERROR_MESSAGES.NOT_FOUND
        default:
          return error.message
      }

    case 'auth':
      if (error.code === '401' || error.code === '403') {
        return ERROR_MESSAGES.SESSION_EXPIRED
      }
      return error.message

    case 'network':
      return error.message

    case 'validation':
      return error.message || ERROR_MESSAGES.VALIDATION

    case 'not_found':
      return `${error.resource} not found`

    case 'http':
      return `HTTP Error ${error.status}: ${error.message}`

    case 'unknown':
      return error.message
  }
}

/**
 * Check if error requires auth redirect
 */
export function isAuthRedirectError(error: AppError): boolean {
  return (
    error.type === 'auth'
    || (error.type === 'database' && error.code === 'PGRST301')
  )
}

/**
 * ALL-IN-ONE: normalize + get message
 * Use this in 90% of cases
 */
export function handleError(error: unknown) {
  const normalized = normalizeError(error)
  const message = getErrorMessage(normalized)

  return {
    error: normalized,
    message,
    shouldRedirectToAuth: isAuthRedirectError(normalized),
  }
}
