# API Reference

This document provides reference information for working with the Recruit Pro codebase.

## Essential Commands

### Development

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Prepare Nuxt (generates types, etc.)
npm run postinstall
```

### Supabase

```bash
# Generate TypeScript types from remote Supabase schema
npm run supabase:generate-types

# Generate types from local Supabase instance
npm run supabase:generate-types-local

# Create a new database migration
npm run supabase:new-migration

# Push migrations to database
npm run supabase:push

# Check migration status
npm run supabase:status
```

### Linting

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix
```

## TypeScript Guidelines

### Strict Mode Rules

The project uses TypeScript strict mode with the following rules:

- **NO `any` allowed** - use `unknown` and type guards
- **Explicit return types** for public functions
- **Explicit prop types** in Vue components
- **Type imports** via `import type { ... }`

### Type Guard Example

```typescript
// ✅ Correct approach with type guard
function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unknown error occurred'
}

// ❌ Wrong - using any
function handleError(error: any): string {
  return error.message
}
```

### Component Props

```vue
<script setup lang="ts">
import type { Candidate } from '@/types/candidates'

// ✅ Correct - explicit types
interface Props {
  candidate: Candidate
  isEditable?: boolean
  onUpdate?: (candidate: Candidate) => void
}

const props = withDefaults(defineProps<Props>(), {
  isEditable: false,
})

// ❌ Wrong - runtime props
defineProps({
  candidate: Object,
  isEditable: Boolean,
})
</script>
```

### Reactive Types in Composables

Use Vue's utility types for reactive parameters:

```typescript
import type { MaybeRef, MaybeRefOrGetter } from 'vue'

// For simple refs
function useCandidate(id: MaybeRef<string>) {
  const candidateId = unref(id)
  // ...
}

// For refs, computed, or getters
function useCandidatesList(params: MaybeRefOrGetter<CandidateFilters>) {
  const filters = toValue(params)
  // ...
}
```

## Service Layer API

### Service Structure

All services follow this pattern:

```typescript
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export const [Feature]Service = {
  // List/query operations
  async getAll(
    client: SupabaseClient<Database>,
    params?: [Feature]Filters
  ): Promise<{ data: [Feature][]; count: number }> {
    // Implementation
  },

  // Single item operations
  async getById(
    client: SupabaseClient<Database>,
    id: string
  ): Promise<[Feature]> {
    // Implementation
  },

  // Create operations
  async create(
    client: SupabaseClient<Database>,
    data: [Feature]Insert
  ): Promise<[Feature]> {
    // Implementation
  },

  // Update operations
  async update(
    client: SupabaseClient<Database>,
    id: string,
    data: Partial<[Feature]Insert>
  ): Promise<[Feature]> {
    // Implementation
  },

  // Delete operations
  async delete(
    client: SupabaseClient<Database>,
    id: string
  ): Promise<void> {
    // Implementation
  },
}
```

### Service Best Practices

1. **Always inject `client` as first parameter** for testability
2. **Return data directly** - don't wrap in `{ success: true, data: ... }`
3. **Throw errors** - let upper layers handle them
4. **Keep services pure** - no side effects, no UI logic
5. **Use TypeScript strict types** from Supabase schema

### Example Service Implementation

```typescript
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import type { Candidate, CandidateInsert, CandidateFilters } from '@/types/candidates'

export const CandidatesService = {
  async getAll(
    client: SupabaseClient<Database>,
    params?: CandidateFilters
  ) {
    let query = client
      .from('candidates')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (params?.search) {
      query = query.or(
        `first_name.ilike.%${params.search}%,` +
        `last_name.ilike.%${params.search}%,` +
        `email.ilike.%${params.search}%`
      )
    }

    if (params?.status) {
      query = query.eq('status', params.status)
    }

    // Pagination
    if (params?.page) {
      const from = (params.page - 1) * 20
      const to = from + 19
      query = query.range(from, to)
    }

    const { data, error, count } = await query

    if (error) throw error

    return { data: data || [], count: count || 0 }
  },

  async getById(client: SupabaseClient<Database>, id: string) {
    const { data, error } = await client
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return data
  },

  async create(
    client: SupabaseClient<Database>,
    candidate: CandidateInsert
  ) {
    const { data, error } = await client
      .from('candidates')
      .insert(candidate)
      .select()
      .single()

    if (error) throw error

    return data
  },

  async update(
    client: SupabaseClient<Database>,
    id: string,
    updates: Partial<CandidateInsert>
  ) {
    const { data, error } = await client
      .from('candidates')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return data
  },

  async delete(client: SupabaseClient<Database>, id: string) {
    const { error } = await client
      .from('candidates')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}
```

## Composables API

### Composable Structure

```typescript
export const use[Feature] = () => {
  const client = useSupabaseClient()
  const user = useSupabaseUser()

  // Query hooks
  const use[Feature]List = (params: MaybeRefOrGetter<[Feature]Filters>) => {
    return useQuery({
      queryKey: computed(() => ['[feature]', 'list', toValue(params)]),
      queryFn: () => [Feature]Service.getAll(client, toValue(params)),
      enabled: computed(() => !!user.value),
      staleTime: 60 * 1000,
    })
  }

  // Mutation hooks
  const useCreate[Feature] = (options?: MutationOptions<[Feature]>) => {
    return useMutation({
      mutationFn: (data: [Feature]Insert) => 
        [Feature]Service.create(client, data),
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    })
  }

  return {
    use[Feature]List,
    useCreate[Feature],
  }
}
```

### Mutation Options Type

```typescript
interface MutationOptions<TData> {
  onSuccess?: (data: TData) => void | Promise<void>
  onError?: (error: unknown) => void
}
```

## Common Utilities

### Error Handling

```typescript
import { normalizeError } from '@/utils/errors'

// Convert any error to AppError
const normalized = normalizeError(error)

console.log(normalized.type)       // 'auth' | 'network' | etc.
console.log(normalized.message)    // User-friendly message
console.log(normalized.statusCode) // HTTP status code (if available)
```

### Class Names (cn utility)

```typescript
import { cn } from '@/lib/utils'

// Merge Tailwind classes
const className = cn(
  'base-class',
  isActive && 'active-class',
  isDisabled && 'disabled-class',
  props.className
)
```

## TanStack Query Configuration

### Global Config

Configured in `app/plugins/vue-query.ts`:

```typescript
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleGlobalError, // Global error handler
  }),
  mutationCache: new MutationCache({
    onError: handleGlobalError, // Global error handler
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5 minutes
      refetchOnWindowFocus: false,      // Don't refetch on focus
      retry: (failureCount, error) => {
        const err = normalizeError(error)
        
        // Network errors: retry 2x
        if (err.type === 'network') {
          return failureCount < 2
        }
        
        // Server errors: retry 1x
        if (err.type === 'server') {
          return failureCount < 1
        }
        
        // No retry for: auth, validation, client, unknown
        return false
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: false, // Never retry mutations
    },
  },
})
```

### Global Error Handler

The plugin includes a global error handler that:
- **Auth errors (401/403)**: Redirects to `/auth` with toast
- **Network errors**: Shows toast notification
- **Server errors (5xx)**: Shows toast notification
- **Client errors (404/409/429)**: Shows specific toast messages
- **Validation errors**: Handled locally in components

```typescript
const handleGlobalError = (error: unknown) => {
  const err = normalizeError(error)
  
  // Auth → redirect to /auth
  if (shouldRedirectToAuth(err)) {
    $toast.error('Session expired')
    router.push({ path: '/auth', query: { redirectTo: currentPath } })
    return
  }
  
  // Network → toast
  if (err.type === 'network') {
    $toast.error('No internet connection')
    return
  }
  
  // Server → toast
  if (err.type === 'server') {
    $toast.error('Server error')
    return
  }
  
  // Client → specific messages
  if (err.type === 'client') {
    if (err.status === 404) $toast.error('Resource not found')
    if (err.status === 409) $toast.error('Conflict: resource already exists')
    if (err.status === 429) $toast.error('Too many requests')
  }
}
```

This means **most errors are handled automatically** - components only need to handle validation errors locally.

### Query Options Reference

```typescript
useQuery({
  queryKey: ['key'],               // Cache key (must be unique)
  queryFn: () => fetchData(),      // Async function to fetch data
  enabled: true,                   // Whether to run query
  staleTime: 60 * 1000,           // How long data is fresh (ms)
  gcTime: 5 * 60 * 1000,          // How long to keep in cache (ms)
  placeholderData: keepPreviousData, // Show old data while refetching
  refetchOnWindowFocus: true,      // Refetch when window regains focus
  retry: 3,                        // Number of retries on error
})
```

### Mutation Options Reference

```typescript
useMutation({
  mutationFn: (vars) => mutateFn(vars), // Async function to mutate data
  onSuccess: (data) => { /* ... */ },   // Success callback
  onError: (error) => { /* ... */ },    // Error callback
  onSettled: () => { /* ... */ },       // Always runs (success or error)
})
```

## Environment Variables

Create `.env` file in project root:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key

# Optional: Analytics, monitoring, etc.
# SENTRY_DSN=...
# GOOGLE_ANALYTICS_ID=...
```

**Note:** See `.env.example` for full list of variables.

## Database Types

### Generating Types

Types are auto-generated from Supabase schema:

```bash
npm run supabase:generate-types
```

This creates `types/supabase.ts` with full database schema types.

### Using Generated Types

```typescript
import type { Database } from '@/types/supabase'

// Table row type
type Candidate = Database['public']['Tables']['candidates']['Row']

// Insert type (without auto-generated fields)
type CandidateInsert = Database['public']['Tables']['candidates']['Insert']

// Update type (all fields optional)
type CandidateUpdate = Database['public']['Tables']['candidates']['Update']
```

## Next Steps

- Read [PATTERNS.md](./PATTERNS.md) for code patterns
- Check [CONTRIBUTING.md](./CONTRIBUTING.md) for development workflow
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
