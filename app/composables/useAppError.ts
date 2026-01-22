import { computed, type Ref } from 'vue'
import type { AppError } from '@/types/errors'
import { normalizeError } from '@/utils/errors'

/**
 * Reactive adapter to convert TanStack Query errors into strict AppError.
 * Usage: const appError = useAppError(queryError)
 */
export function useAppError(errorRef: Ref<unknown>) {
  return computed<AppError | null>(() => {
    if (!errorRef.value) return null
    return normalizeError(errorRef.value)
  })
}
