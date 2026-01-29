# Contributing Guide

Thank you for contributing to **Recruit Pro**! This guide will help you understand our development philosophy, workflow, and standards.

## Development Philosophy

**Pragmatic Quality** - We write clean, readable, and robust code while avoiding unnecessary over-engineering.

### Core Values

1. **Type Safety** - TypeScript strict mode, no `any` types
2. **Separation of Concerns** - 3-layer architecture (Types → Services → Composables)
3. **Scalability** - Ready for cloud deployment (AWS, Vercel, etc.)
4. **Developer Experience** - Clear patterns, good documentation, fast feedback

### Balance

- ✅ Write tests for critical business logic
- ❌ Don't test trivial getters/setters
- ✅ Optimize for readability first, performance second
- ❌ Don't prematurely optimize
- ✅ Document complex logic with comments
- ❌ Don't comment obvious code

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Supabase account (for local development)

### Setup

1. Clone the repository

```bash
git clone https://github.com/your-org/recruit-pro.git
cd recruit-pro
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. Generate Supabase types

```bash
npm run supabase:generate-types
```

5. Start development server

```bash
npm run dev
```

6. Open browser at http://localhost:3000

## Development Workflow

### Adding a New Feature

Follow this order: **Types → Service → Composable → Component**

#### 1. Define Types

Create types in `app/types/[feature].ts`:

```typescript
import type { Database } from '@/types/supabase'

export type Job = Database['public']['Tables']['jobs']['Row']
export type JobInsert = Database['public']['Tables']['jobs']['Insert']

export interface JobFilters {
  search?: string
  status?: 'open' | 'closed' | null
  location?: string
}
```

#### 2. Create Service

Create service in `app/services/[feature].ts`:

```typescript
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import type { Job, JobInsert, JobFilters } from '@/types/jobs'

export const JobsService = {
  async getAll(
    client: SupabaseClient<Database>,
    params?: JobFilters
  ) {
    let query = client.from('jobs').select('*', { count: 'exact' })
    
    if (params?.search) {
      query = query.ilike('title', `%${params.search}%`)
    }
    
    if (params?.status) {
      query = query.eq('status', params.status)
    }
    
    const { data, error, count } = await query
    if (error) throw error
    
    return { data: data || [], count: count || 0 }
  },

  async getById(client: SupabaseClient<Database>, id: string) {
    const { data, error } = await client
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(
    client: SupabaseClient<Database>,
    job: JobInsert
  ) {
    const { data, error } = await client
      .from('jobs')
      .insert(job)
      .select()
      .single()
    
    if (error) throw error
    return data
  },
}
```

#### 3. Create Composable

Create composable in `app/composables/use[Feature].ts`:

```typescript
import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import type { JobFilters } from '@/types/jobs'
import { JobsService } from '@/services/jobs'

export const useJobs = () => {
  const client = useSupabaseClient()
  const user = useSupabaseUser()

  const useJobsList = (params: MaybeRefOrGetter<JobFilters>) => {
    return useQuery({
      queryKey: computed(() => ['jobs', 'list', toValue(params)]),
      queryFn: () => JobsService.getAll(client, toValue(params)),
      enabled: computed(() => !!user.value),
      placeholderData: keepPreviousData,
      staleTime: 60 * 1000,
    })
  }

  const useJobDetails = (id: MaybeRef<string>) => {
    return useQuery({
      queryKey: computed(() => ['jobs', 'detail', unref(id)]),
      queryFn: () => JobsService.getById(client, unref(id)),
      enabled: computed(() => !!unref(id) && !!user.value),
    })
  }

  return {
    useJobsList,
    useJobDetails,
  }
}
```

#### 4. Create Components

Create UI in `app/pages/jobs/index.vue`:

```vue
<script setup lang="ts">
const { useJobsList } = useJobs()
const params = ref({ search: '', status: null })

const { data: jobs, isPending, error } = useJobsList(params)
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Jobs</h1>
    
    <AsyncState 
      :is-loading="isPending" 
      :error="error"
      :is-empty="!jobs?.length"
      empty-title="No jobs found"
    >
      <div class="grid gap-4">
        <JobCard v-for="job in jobs" :key="job.id" :job="job" />
      </div>
    </AsyncState>
  </div>
</template>
```

### Making Changes

1. **Create a feature branch**

```bash
git checkout -b feature/job-matching
```

2. **Make your changes** following the patterns in [PATTERNS.md](./PATTERNS.md)

3. **Test your changes** manually in the browser

4. **Lint your code**

```bash
npm run lint:fix
```

5. **Commit with descriptive message**

```bash
git commit -m "feat: add job matching algorithm"
```

6. **Push and create Pull Request**

```bash
git push origin feature/job-matching
```

## Code Review Checklist

Before submitting a PR, ensure:

### TypeScript
- [ ] No `any` types (use `unknown` with type guards)
- [ ] Explicit prop types in components
- [ ] Type imports use `import type { ... }`
- [ ] All functions have return types

### Architecture
- [ ] Follows 3-layer pattern (Types → Services → Composables)
- [ ] Services use dependency injection (client as first param)
- [ ] Composables are pure (no toasts, no navigation)
- [ ] Components handle all side effects

### Code Quality
- [ ] Uses shadcn-vue components (no raw HTML)
- [ ] Uses `navigateTo()` for navigation
- [ ] Uses `$toast` for notifications
- [ ] Proper error handling with `normalizeError()`
- [ ] Uses `AsyncState` component for loading/error states

### Naming
- [ ] Composables: `use[Feature].ts`
- [ ] Services: `[Feature]Service`
- [ ] Types: match database table names
- [ ] Components: PascalCase

### Documentation
- [ ] Complex logic has comments
- [ ] JSDoc for public APIs with non-obvious behavior
- [ ] README updated if adding new features

## Testing Guidelines

### Manual Testing

Always test your changes manually:

1. **Happy path** - Feature works as expected
2. **Error cases** - Network errors, validation errors
3. **Edge cases** - Empty states, long text, special characters
4. **Different screen sizes** - Mobile, tablet, desktop
5. **Authentication states** - Logged in, logged out

### Future: Automated Tests

(Not yet implemented - coming soon)

```bash
# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e
```

## Common Tasks

### Adding a New Database Table

1. Create migration in Supabase

```bash
npm run supabase:new-migration add_jobs_table
```

2. Edit migration file in `supabase/migrations/`

```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

3. Push migration

```bash
npm run supabase:push
```

4. Regenerate types

```bash
npm run supabase:generate-types
```

5. Follow "Adding a New Feature" workflow above

### Adding a New UI Component

Use shadcn-vue CLI to add components:

```bash
npx shadcn-vue@latest add [component-name]
```

Example:

```bash
npx shadcn-vue@latest add dialog
npx shadcn-vue@latest add select
```

Components are added to `app/components/ui/`.

### Debugging Tips

#### Query Caching Issues

```typescript
// Invalidate specific query
await queryClient.invalidateQueries({ queryKey: ['candidates', 'list'] })

// Clear all queries
queryClient.clear()
```

#### Auth Issues

```typescript
// Check current user
const user = useSupabaseUser()
console.log('Current user:', user.value)

// Check session
const client = useSupabaseClient()
const { data: { session } } = await client.auth.getSession()
console.log('Session:', session)
```

#### Type Errors

```bash
# Regenerate Supabase types
npm run supabase:generate-types

# Restart TypeScript server in your IDE
# VSCode: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

## Git Commit Messages

Follow Conventional Commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Build process, tooling changes

### Examples

```bash
feat(candidates): add candidate filtering by status
fix(auth): resolve race condition in sign-in flow
docs(architecture): update 3-layer pattern documentation
refactor(services): extract common pagination logic
```

## Getting Help

- **Architecture questions**: Check [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Pattern questions**: Check [PATTERNS.md](./PATTERNS.md)
- **API questions**: Check [API.md](./API.md)
- **Bugs**: Open an issue on GitHub
- **Questions**: Ask in team chat or open a discussion

## Resources

- [Nuxt 4 Documentation](https://nuxt.com/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [TanStack Query](https://tanstack.com/query/latest)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn-vue](https://www.shadcn-vue.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Thank you for contributing! 🎉
