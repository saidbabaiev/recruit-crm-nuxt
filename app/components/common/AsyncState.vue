<script setup lang="ts">
import { Loader2, AlertCircle, FileQuestion } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import type { AppError } from '@/types/errors'
import { getErrorMessage } from '@/utils/errors'

interface Props {
  isLoading: boolean
  error?: AppError | null
  isEmpty?: boolean
  emptyTitle?: string
  emptyDescription?: string | null
}

const props = defineProps<Props>()
defineEmits(['retry'])

const errorMessage = computed(() => {
  if (!props.error) return ''
  return getErrorMessage(props.error)
})
</script>

<template>
  <div
    v-if="isLoading"
    class="flex flex-col items-center justify-center py-8 space-y-4 min-h-50"
  >
    <slot name="loading">
      <Loader2 class="h-8 w-8 animate-spin text-primary/60" />
      <p class="text-sm text-muted-foreground animate-pulse">
        Loading data...
      </p>
    </slot>
  </div>

  <div
    v-else-if="error"
    class="py-4"
  >
    <Alert variant="destructive">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription class="flex flex-col gap-3 mt-2">
        <p>{{ errorMessage }}</p>

        <div
          v-if="error.type === 'validation'"
          class="p-2 rounded bg-destructive/10 text-xs font-mono"
        >
          Fields: {{ Object.keys(error.fields).join(', ') }}
        </div>

        <div class="pt-1">
          <Button
            variant="outline"
            size="sm"
            class="bg-background text-foreground hover:bg-accent"
            @click="$emit('retry')"
          >
            Try Again
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  </div>

  <div
    v-else-if="isEmpty"
    class="flex flex-col items-center justify-center py-8 text-center min-h-37.5"
  >
    <slot name="empty">
      <div class="rounded-full bg-muted p-3 mb-3">
        <FileQuestion class="h-6 w-6 text-muted-foreground" />
      </div>
      <h3
        v-if="emptyTitle"
        class="font-medium mb-1"
      >
        {{ emptyTitle }}
      </h3>
      <p class="text-sm text-muted-foreground max-w-62.5">
        {{ emptyDescription || 'No data to display' }}
      </p>
    </slot>
  </div>

  <slot v-else />
</template>
