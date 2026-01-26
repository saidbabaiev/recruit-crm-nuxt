# 🛡️ Error Handling Review - Recruit Pro

> **Цель документа**: Подробный разбор архитектуры обработки ошибок в проекте для изучения и понимания кода

---

## 📋 Содержание

1. [Обзор архитектуры](#обзор-архитектуры)
2. [Типы ошибок (AppError)](#типы-ошибок-apperror)
3. [Утилиты для обработки ошибок](#утилиты-для-обработки-ошибок)
4. [Глобальная обработка в Vue Query](#глобальная-обработка-в-vue-query)
5. [Использование в компонентах](#использование-в-компонентах)
6. [Паттерны и Best Practices](#паттерны-и-best-practices)
7. [Примеры использования](#примеры-использования)

---

## 🏗️ Обзор архитектуры

### Философия подхода

Система обработки ошибок построена на **трёх ключевых принципах**:

1. **Централизованная нормализация** - все ошибки приводятся к единому типу `AppError`
2. **Типобезопасность** - использование TypeScript discriminated unions для автокомплита
3. **Разделение ответственности** - глобальные vs локальные ошибки

### Поток обработки ошибки

```
┌─────────────────┐
│  Supabase/API   │
│  (любая ошибка) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ normalizeError()│  ← Преобразует unknown → AppError
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Vue Query      │  ← Глобальный обработчик (toast + redirect)
│  Plugin         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  useAppError()  │  ← Адаптер для компонентов (reactive)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AsyncState.vue │  ← UI-отображение ошибки
└─────────────────┘
```

---

## 🎯 Типы ошибок (AppError)

**Файл**: `app/types/errors.ts`

### Discriminated Union Pattern

```typescript
export type AppError
  = | { type: 'database'; code: string; message: string; details?: string; hint?: string }
  | | { type: 'auth'; code: string; message: string }
  | | { type: 'network'; message: string }
  | | { type: 'validation'; fields: Record<string, string[]>; message?: string }
  | | { type: 'not_found'; resource: string; id?: string }
  | | { type: 'http'; status: number; message: string }
  | | { type: 'unknown'; message: string; originalError?: unknown }
```

### 📦 Разбор каждого типа

#### 1️⃣ Database Error
```typescript
{
  type: 'database',
  code: '23505',           // PostgreSQL error code
  message: 'duplicate key value violates unique constraint',
  details: 'Key (email)=(test@test.com) already exists',
  hint: 'Change the email address'
}
```

**Когда возникает**:
- Нарушение UNIQUE constraint
- Нарушение FOREIGN KEY constraint
- NOT NULL violation
- CHECK constraint violation

**Коды Postgres** (из `POSTGRES_ERROR_CODES`):
```typescript
UNIQUE_VIOLATION: '23505'        → "This record already exists"
FOREIGN_KEY_VIOLATION: '23503'   → "Cannot delete: related records exist"
NOT_NULL_VIOLATION: '23502'      → "Required field is missing"
CHECK_VIOLATION: '23514'         → "Invalid value provided"
```

#### 2️⃣ Auth Error
```typescript
{
  type: 'auth',
  code: '401',
  message: 'User not authenticated'
}
```

**Когда возникает**:
- Токен истёк
- Отсутствует токен
- Неверные credentials
- RLS policy violation

**Особенность**: Триггерит редирект на `/auth`

#### 3️⃣ Network Error
```typescript
{
  type: 'network',
  message: 'No internet connection. Please check your network.'
}
```

**Когда возникает**:
- Нет интернета
- DNS не резолвится
- Таймаут запроса
- `fetch()` failed

**Ретраи**: Автоматически повторяется до 2 раз (см. `vue-query.ts`)

#### 4️⃣ Validation Error
```typescript
{
  type: 'validation',
  fields: {
    email: ['Invalid email format', 'Email is required'],
    phone: ['Must be 10 digits']
  },
  message: 'Please fix the errors in the form'
}
```

**Когда возникает**:
- Форма не прошла валидацию на клиенте
- API вернул 422 Unprocessable Entity
- Бизнес-логика не выполнена

**UI**: Показывается в компоненте `AsyncState.vue` с детализацией по полям

#### 5️⃣ Not Found Error
```typescript
{
  type: 'not_found',
  resource: 'Candidate',
  id: '123e4567-e89b-12d3-a456-426614174000'
}
```

**Когда возникает**:
- Запрос `.single()` в Supabase вернул null
- 404 от API
- Ресурс удалён или недоступен по RLS

**Message**: `"Candidate not found"`

#### 6️⃣ HTTP Error
```typescript
{
  type: 'http',
  status: 500,
  message: 'Internal Server Error'
}
```

**Когда возникает**:
- 4xx/5xx статусы от внешних API
- Rate limiting (429)
- Bad Gateway (502)

#### 7️⃣ Unknown Error
```typescript
{
  type: 'unknown',
  message: 'An unexpected error occurred',
  originalError: /* что угодно */
}
```

**Когда возникает**:
- Любая необработанная ошибка
- Ошибки в коде (null pointer, etc.)
- Fallback для всех edge cases

---

## 🔧 Утилиты для обработки ошибок

**Файл**: `app/utils/errors.ts`

### 1. Type Guards (Определение типа ошибки)

#### `isPostgrestError()`
```typescript
function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object'
    && error !== null
    && 'code' in error
    && 'message' in error
    && 'details' in error
  )
}
```

**Что проверяет**: Является ли ошибка от Supabase Database (Postgrest)

**Пример входа**:
```typescript
{
  code: '23505',
  message: 'duplicate key value',
  details: 'Key (email)=(...) already exists',
  hint: 'Change email'
}
```

#### `isAuthError()`
```typescript
function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === 'object'
    && error !== null
    && 'name' in error
    && error.name === 'AuthError'
  )
}
```

**Что проверяет**: Является ли ошибка от Supabase Auth

**Пример входа**:
```typescript
{
  name: 'AuthError',
  message: 'Invalid login credentials',
  status: 400
}
```

#### `hasHttpStatus()`
```typescript
function hasHttpStatus(error: unknown): error is { status: number, message?: string } {
  return (
    typeof error === 'object'
    && error !== null
    && 'status' in error
    && typeof error.status === 'number'
  )
}
```

**Что проверяет**: Есть ли HTTP status code

#### `isNetworkError()`
```typescript
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
```

**Что проверяет**: Сетевые ошибки (offline, DNS issues)

---

### 2. normalizeError() - Главная функция

```typescript
export function normalizeError(error: unknown): AppError {
  // 1. Supabase Database Errors
  if (isPostgrestError(error)) { ... }
  
  // 2. Supabase Auth Errors
  if (isAuthError(error)) { ... }
  
  // 3. Network Errors
  if (isNetworkError(error)) { ... }
  
  // 4. HTTP Errors (fetch responses)
  if (hasHttpStatus(error)) { ... }
  
  // 5. Standard Error
  if (error instanceof Error) { ... }
  
  // 6. String (bad practice but happens)
  if (typeof error === 'string') { ... }
  
  // 7. Complete unknown
  return { type: 'unknown', ... }
}
```

**Цель**: Превратить **любую ошибку** (`unknown`) в типизированный `AppError`

**Порядок проверок важен**:
1. Специфичные типы (database, auth) → сначала
2. Общие типы (Error, string) → потом
3. Fallback (unknown) → последний

**Пример использования**:
```typescript
try {
  await supabase.from('candidates').insert(data)
} catch (err) {
  const appError = normalizeError(err)
  // Теперь appError имеет тип AppError с автокомплитом
}
```

---

### 3. getErrorMessage() - User-friendly сообщения

```typescript
export function getErrorMessage(error: AppError): string {
  switch (error.type) {
    case 'database':
      return DB_ERROR_MESSAGES[error.code] || error.message
    
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
```

**Цель**: Превратить технический `AppError` в человекочитаемое сообщение для UI

**Маппинг database ошибок**:
```typescript
const DB_ERROR_MESSAGES: Record<string, string> = {
  '23505': 'This record already exists',           // UNIQUE_VIOLATION
  '23503': 'Cannot delete: related records exist', // FOREIGN_KEY
  '23502': 'Required field is missing',            // NOT_NULL
  '23514': 'Invalid value provided',               // CHECK_VIOLATION
  'PGRST116': 'Record not found',
}
```

**Пример**:
```typescript
const error = { type: 'database', code: '23505', message: 'duplicate key...' }
getErrorMessage(error) // → "This record already exists"
```

---

### 4. isAuthRedirectError() - Проверка редиректа

```typescript
export function isAuthRedirectError(error: AppError): boolean {
  return (
    error.type === 'auth'
    || (error.type === 'database' && error.code === 'PGRST301')
  )
}
```

**Цель**: Определить, нужно ли редиректить на страницу авторизации

**Кейсы**:
- `auth` error → всегда редирект
- `PGRST301` (JWT expired) → тоже редирект

---

### 5. handleError() - All-in-One утилита

```typescript
export function handleError(error: unknown) {
  const normalized = normalizeError(error)
  const message = getErrorMessage(normalized)

  return {
    error: normalized,
    message,
    shouldRedirectToAuth: isAuthRedirectError(normalized),
  }
}
```

**Цель**: Одна функция для быстрой обработки ошибки

**Возвращает**:
```typescript
{
  error: AppError,              // Нормализованная ошибка
  message: string,              // User-friendly текст
  shouldRedirectToAuth: boolean // Нужен ли редирект?
}
```

**Когда использовать**: В 90% случаев достаточно этой функции

**Пример**:
```typescript
try {
  await fetchData()
} catch (err) {
  const { error, message, shouldRedirectToAuth } = handleError(err)
  
  if (shouldRedirectToAuth) {
    router.push('/auth')
  }
  
  toast.error(message)
}
```

---

### 6. Factory Functions - Создание ошибок

#### `createAuthError()`
```typescript
export const createAuthError = (message: string, code = '401'): AppError => ({
  type: 'auth',
  code,
  message,
})
```

**Пример**:
```typescript
if (!user.value?.sub) {
  throw createAuthError('User not authenticated')
}
```

#### `createValidationError()`
```typescript
export const createValidationError = (message: string): AppError => ({
  type: 'validation',
  fields: {},
  message,
})
```

**Пример**:
```typescript
if (!companyId) {
  throw createValidationError('Unable to get company context')
}
```

#### `createNotFoundError()`
```typescript
export const createNotFoundError = (resource: string, id?: string): AppError => ({
  type: 'not_found',
  resource,
  id,
})
```

**Пример**:
```typescript
if (!candidate) {
  throw createNotFoundError('Candidate', candidateId)
}
```

---

## 🌐 Глобальная обработка в Vue Query

**Файл**: `app/plugins/vue-query.ts`

### Концепция

Vue Query Plugin перехватывает **все** ошибки из queries и mutations, обрабатывает их глобально (toast, redirect) и решает, нужны ли ретраи.

### handleGlobalError()

```typescript
const handleGlobalError = (error: unknown) => {
  const normalized = normalizeError(error)

  // Dev logging
  if (import.meta.dev) {
    console.error('[Global Query Error]:', {
      type: normalized.type,
      normalized,
      original: error,
    })
  }

  // 1. Auth Redirect → redirect + toast
  if (isAuthRedirectError(normalized)) {
    const currentPath = router.currentRoute.value.path
    if (currentPath !== '/auth') {
      $toast.error('Your session has expired', {
        description: 'Please sign in to continue',
      })
      router.push({
        path: '/auth',
        query: { redirectTo: currentPath },
      })
    }
    return
  }

  // 2. Network → toast
  if (normalized.type === 'network') {
    $toast.error('No internet connection', {
      description: 'Please check your network settings',
    })
    return
  }

  // 3. Database → toast
  if (normalized.type === 'database') {
    $toast.error('Database error occurred', {
      description: normalized.hint || 'Please try again later',
    })
    return
  }

  // 4. HTTP 5xx → toast
  if (normalized.type === 'http' && normalized.status >= 500) {
    $toast.error('Server error', {
      description: 'Please try again later',
    })
    return
  }

  // 5. HTTP 4xx → silent (handled locally)
  if (normalized.type === 'http' && normalized.status >= 400) {
    return
  }

  // Validation, not_found, auth → handled locally in components
}
```

### Логика обработки

#### ✅ Глобально обрабатываются (toast + action):
- **Auth errors** → toast + redirect на `/auth`
- **Network errors** → toast "No internet"
- **Database errors** → toast с hint
- **HTTP 5xx** → toast "Server error"

#### ❌ Локально обрабатываются (без toast):
- **Validation errors** → показываются в форме
- **Not found errors** → показываются в AsyncState
- **HTTP 4xx** → показываются в компоненте

### Retry Strategy

```typescript
retry: (failureCount, error) => {
  const normalized = normalizeError(error)

  // No retry auth redirect
  if (isAuthRedirectError(normalized)) return false

  // No retry validation/not_found
  if (normalized.type === 'validation' || normalized.type === 'not_found') {
    return false
  }

  // No retry auth errors
  if (normalized.type === 'auth') return false

  // Retry network up to 2 times
  if (normalized.type === 'network' && failureCount < 2) {
    return true
  }

  // Retry 5xx up to 1 time
  return failureCount < 1
}
```

**Логика**:
- **Auth** → НЕ ретраить (всё равно не авторизован)
- **Validation** → НЕ ретраить (не пройдёт валидацию)
- **Not found** → НЕ ретраить (ресурс не существует)
- **Network** → ретраить 2 раза (может интернет появится)
- **5xx** → ретраить 1 раз (может сервер восстановится)

**Delay между ретраями**:
```typescript
retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
// Attempt 1: 2s
// Attempt 2: 4s
// Attempt 3+: 30s (cap)
```

---

## 🎨 Использование в компонентах

### 1. useAppError() composable

**Файл**: `app/composables/useAppError.ts`

```typescript
export function useAppError(errorRef: Ref<unknown>) {
  return computed<AppError | null>(() => {
    if (!errorRef.value) return null
    return normalizeError(errorRef.value)
  })
}
```

**Цель**: Реактивный адаптер для TanStack Query ошибок

**Использование**:
```typescript
const { data, error } = useQuery({ ... })
const appError = useAppError(error)

// appError имеет тип Ref<AppError | null>
// Автоматически обновляется при изменении error
```

**Зачем нужен**:
- TanStack Query возвращает `error: Ref<unknown>`
- `useAppError` преобразует `unknown` → `AppError | null`
- Даёт типобезопасность и реактивность

---

### 2. AsyncState.vue компонент

**Файл**: `app/components/common/AsyncState.vue`

**Props**:
```typescript
interface Props {
  isLoading?: boolean
  error?: AppError | null
  isEmpty?: boolean
  emptyTitle?: string
  emptyDescription?: string | null
  skipLoading?: boolean
}
```

**Функционал**: Единый UI для 4 состояний:
1. **Loading** → спиннер
2. **Error** → красный Alert с кнопкой Retry
3. **Empty** → пустой state с иконкой
4. **Success** → `<slot>` с данными

**Пример использования**:
```vue
<AsyncState
  :is-loading="isPending"
  :error="appError"
  :is-empty="candidates.length === 0"
  empty-title="No candidates"
  empty-description="Try adjusting filters"
  @retry="refetch"
>
  <!-- Данные показываются здесь -->
  <CandidatesTable :data="candidates" />
</AsyncState>
```

**Отображение ошибки**:
```vue
<Alert variant="destructive">
  <AlertCircle class="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    <p>{{ errorMessage }}</p>
    
    <!-- Если validation error → показываем поля -->
    <div v-if="error.type === 'validation'">
      Fields: {{ Object.keys(error.fields).join(', ') }}
    </div>
    
    <Button @click="$emit('retry')">
      Try Again
    </Button>
  </AlertDescription>
</Alert>
```

---

### 3. Пример в странице

**Файл**: `app/pages/candidates/index.vue`

```vue
<script setup>
const { useCandidatesList } = useCandidates()
const { data: candidatesResponse, isPending, error } = useCandidatesList(params)

// Нормализуем ошибку для AsyncState
const formatAppError = useAppError(error)

const candidates = computed(() => candidatesResponse.value?.data || [])
</script>

<template>
  <AsyncState
    :skip-loading="true"
    :error="formatAppError"
    :is-empty="!isPending && candidates.length === 0"
    empty-title="No candidates found"
  >
    <CandidatesTable :data="candidates" :is-loading="isPending" />
  </AsyncState>
</template>
```

**Поток**:
1. `useQuery()` возвращает `error: Ref<unknown>`
2. `useAppError(error)` → `Ref<AppError | null>`
3. `AsyncState` получает типизированную ошибку
4. `getErrorMessage()` генерирует текст для UI
5. Глобальный handler уже показал toast (если нужно)

---

### 4. Пример в composable с мутацией

**Файл**: `app/composables/useApplications.ts`

```typescript
const useCreateApplication = (options?: {
  onSuccess?: (data: JobApplication) => void | Promise<void>
  onError?: (error: Error) => void
}) => {
  return useMutation({
    mutationFn: async (data: JobApplicationInvite) => {
      // Валидация auth
      if (!user.value?.sub) {
        throw createAuthError('User not authenticated')
      }
      
      // Получение company context
      const { data: companyId, error: companyError } = await client
        .rpc('get_user_company_id')

      if (companyError || !companyId) {
        throw createValidationError('Unable to get company context')
      }

      return ApplicationsService.create(client, {
        ...data,
        company_id: companyId,
        created_by: user.value.sub,
      })
    },
    onSuccess: async (data, vars) => {
      await queryClient.invalidateQueries({
        queryKey: applicationQueryKeys.byCandidate(vars.candidate_id),
      })
      await options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}
```

**Обработка**:
1. Если `throw createAuthError()` → глобальный handler → toast + redirect
2. Если `throw createValidationError()` → глобальный handler → skip (локально)
3. Если Supabase ошибка → `normalizeError()` → глобальный handler
4. `onError` callback может добавить локальную логику

---

## 📚 Паттерны и Best Practices

### ✅ Правильные паттерны

#### 1. Используйте Factory Functions для создания ошибок
```typescript
// ✅ Хорошо
if (!user) {
  throw createAuthError('User not authenticated')
}

// ❌ Плохо
if (!user) {
  throw new Error('User not authenticated')
}
```

**Почему**: Factory создаёт типизированный `AppError`, который правильно обрабатывается

---

#### 2. Обрабатывайте ошибки в Service Layer
```typescript
// ✅ Хорошо - Service пробрасывает ошибку дальше
async getById(client, id) {
  const { data, error } = await client
    .from('candidates')
    .select()
    .eq('id', id)
    .single()

  if (error) throw error  // Supabase error → будет нормализована
  return data
}

// ❌ Плохо - Service скрывает ошибку
async getById(client, id) {
  const { data, error } = await client...
  
  if (error) {
    console.error(error)
    return null  // ❌ Компонент не узнает об ошибке!
  }
  
  return data
}
```

**Почему**: Ошибки должны пробрасываться до Vue Query, где их нормализует глобальный handler

---

#### 3. Используйте useAppError для реактивности
```typescript
// ✅ Хорошо
const { error } = useQuery({ ... })
const appError = useAppError(error)

// ❌ Плохо - теряется реактивность
const { error } = useQuery({ ... })
const appError = error.value ? normalizeError(error.value) : null
```

**Почему**: `useAppError` возвращает computed ref, который автоматически обновляется

---

#### 4. Глобальные vs локальные ошибки
```typescript
// Глобально (toast + redirect):
- Auth errors → показать toast + redirect
- Network errors → показать toast
- Database errors → показать toast
- 5xx errors → показать toast

// Локально (в компоненте):
- Validation errors → показать в форме
- Not found errors → показать в AsyncState
- 4xx errors → показать в UI
```

**Почему**: Критичные ошибки (auth, network) требуют немедленной глобальной реакции

---

#### 5. AsyncState для UI состояний
```vue
<!-- ✅ Хорошо -->
<AsyncState
  :is-loading="isPending"
  :error="appError"
  :is-empty="data.length === 0"
  @retry="refetch"
>
  <MyComponent :data="data" />
</AsyncState>

<!-- ❌ Плохо - дублирование логики -->
<div v-if="isPending">Loading...</div>
<div v-else-if="error">Error: {{ error }}</div>
<div v-else-if="data.length === 0">No data</div>
<MyComponent v-else :data="data" />
```

**Почему**: `AsyncState` - переиспользуемый компонент с консистентным UI

---

### ❌ Антипаттерны

#### 1. Не создавайте ошибки вручную
```typescript
// ❌ Плохо
throw {
  type: 'auth',
  message: 'Not authenticated'
}

// ✅ Хорошо
throw createAuthError('Not authenticated')
```

#### 2. Не игнорируйте ошибки
```typescript
// ❌ Плохо
try {
  await api.call()
} catch (err) {
  console.log(err)  // Ошибка потеряна!
}

// ✅ Хорошо
try {
  await api.call()
} catch (err) {
  throw err  // Или обработать через handleError()
}
```

#### 3. Не показывайте технические детали пользователю
```typescript
// ❌ Плохо
toast.error(error.message)  // "PGRST116: JWT expired"

// ✅ Хорошо
const message = getErrorMessage(normalizeError(error))
toast.error(message)  // "Your session has expired"
```

#### 4. Не обрабатывайте все ошибки глобально
```typescript
// ❌ Плохо - валидация должна быть локальной
if (normalized.type === 'validation') {
  toast.error('Validation error')  // ❌ Пользователь не знает, что исправить
}

// ✅ Хорошо - validation в компоненте
<AsyncState :error="appError">
  <!-- error.type === 'validation' → показываем поля -->
</AsyncState>
```

---

## 🔍 Примеры использования

### Пример 1: Query с обработкой ошибок

```typescript
// 1. Service Layer (app/services/candidates.ts)
export const CandidatesService = {
  async getById(client: SupabaseClient, id: string) {
    const { data, error } = await client
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error  // Суп-ase error
    return data
  }
}

// 2. Composable (app/composables/useCandidates.ts)
export const useCandidates = () => {
  const client = useSupabaseClient()
  
  const useCandidateDetails = (id: MaybeRef<string>) => {
    return useQuery({
      queryKey: ['candidates', 'detail', id],
      queryFn: () => CandidatesService.getById(client, unref(id)),
    })
  }
  
  return { useCandidateDetails }
}

// 3. Component (app/pages/candidates/[id].vue)
<script setup>
const route = useRoute()
const { useCandidateDetails } = useCandidates()

const { data: candidate, isPending, error, refetch } = useCandidateDetails(
  computed(() => route.params.id)
)

const appError = useAppError(error)
</script>

<template>
  <AsyncState
    :is-loading="isPending"
    :error="appError"
    :is-empty="!candidate"
    @retry="refetch"
  >
    <CandidateCard :candidate="candidate" />
  </AsyncState>
</template>

// 4. Что происходит при ошибке:
// - Supabase возвращает PostgrestError
// - Service пробрасывает throw error
// - Vue Query ловит в onError
// - normalizeError() → AppError
// - handleGlobalError() → toast (если глобальная)
// - useAppError() → reactive AppError
// - AsyncState → UI с ошибкой
```

---

### Пример 2: Mutation с валидацией

```typescript
// 1. Composable (app/composables/useApplications.ts)
const useCreateApplication = (options) => {
  return useMutation({
    mutationFn: async (data: JobApplicationInvite) => {
      // Валидация 1: auth
      if (!user.value?.sub) {
        throw createAuthError('User not authenticated')
      }
      
      // Валидация 2: company context
      const { data: companyId, error: companyError } = await client
        .rpc('get_user_company_id')

      if (companyError || !companyId) {
        throw createValidationError('Unable to get company context')
      }

      // Вызов service
      return ApplicationsService.create(client, {
        ...data,
        company_id: companyId,
        created_by: user.value.sub,
      })
    },
    onSuccess: async (data, vars) => {
      await queryClient.invalidateQueries({
        queryKey: ['applications', 'candidate', vars.candidate_id],
      })
      await options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}

// 2. Component (app/components/candidates/JobMatchItem.vue)
<script setup>
const { useCreateApplication } = useApplications()
const { $toast } = useNuxtApp()

const { mutate, isPending, error } = useCreateApplication({
  onSuccess: () => {
    $toast.success('Candidate invited successfully')
  },
  onError: (err) => {
    // Глобальный handler уже обработал критичные ошибки
    // Здесь можем добавить локальную логику
    const { message } = handleError(err)
    console.log('Local error handling:', message)
  }
})

const inviteCandidate = (jobId: string) => {
  mutate({
    candidate_id: props.candidateId,
    job_id: jobId,
    status: 'invited',
  })
}
</script>

<template>
  <Button
    @click="inviteCandidate(job.id)"
    :disabled="isPending"
  >
    {{ isPending ? 'Inviting...' : 'Invite to Job' }}
  </Button>
</template>

// 3. Что происходит при ошибках:
// - createAuthError() → type: 'auth' → redirect + toast
// - createValidationError() → type: 'validation' → skip global
// - Supabase error → normalizeError() → обработка по типу
```

---

### Пример 3: Обработка специфичной ошибки

```typescript
// Кастомная обработка database constraint
const { mutate } = useMutation({
  mutationFn: async (email: string) => {
    const { error } = await client
      .from('candidates')
      .insert({ email })

    if (error) throw error
  },
  onError: (err) => {
    const appError = normalizeError(err)
    
    // Специфичная обработка UNIQUE_VIOLATION
    if (appError.type === 'database' && appError.code === '23505') {
      $toast.error('Email already exists', {
        description: 'Please use a different email address',
        action: {
          label: 'View existing candidate',
          onClick: () => router.push(`/candidates/${existingId}`)
        }
      })
      return
    }
    
    // Остальные ошибки → глобальный handler
    throw err
  }
})
```

---

## 🎓 Ключевые выводы

### 1. Централизация
Все ошибки проходят через **одну точку входа** (`normalizeError`), что даёт:
- Консистентность
- Лёгкость отладки
- Типобезопасность

### 2. Типизация
Discriminated union `AppError` даёт:
- Автокомплит в IDE
- Защиту от ошибок во время компиляции
- Понятную структуру

### 3. Разделение ответственности
- **Service** → пробрасывает ошибки
- **Vue Query** → нормализует + глобальная обработка
- **Composable** → создаёт типизированные ошибки
- **Component** → показывает UI

### 4. User Experience
- Критичные ошибки → **toast + redirect** (автоматически)
- Локальные ошибки → **в компоненте** (AsyncState)
- Ретраи → **умные** (network да, validation нет)

### 5. Developer Experience
- Type guards → безопасное определение типа
- Factory functions → лёгкое создание ошибок
- useAppError → реактивность из коробки
- AsyncState → переиспользуемый UI

---

## 📊 Диаграмма принятия решений

```
Произошла ошибка
        ↓
┌───────────────────┐
│ normalizeError()  │
└────────┬──────────┘
         ↓
    AppError.type?
         ├─ 'auth' ────────────→ Redirect + Toast (глобально)
         ├─ 'network' ─────────→ Toast + Retry x2 (глобально)
         ├─ 'database' ────────→ Toast с hint (глобально)
         ├─ 'validation' ──────→ Локально в форме
         ├─ 'not_found' ───────→ Локально в AsyncState
         ├─ 'http' (5xx) ──────→ Toast + Retry x1 (глобально)
         ├─ 'http' (4xx) ──────→ Локально
         └─ 'unknown' ─────────→ Toast generic (глобально)
```

---

## 🚀 Быстрый старт

### Шаблон для нового query
```typescript
// 1. Service
async myMethod(client, params) {
  const { data, error } = await client.from('table')...
  if (error) throw error
  return data
}

// 2. Composable
const useMyQuery = (params) => {
  return useQuery({
    queryKey: ['my-key', params],
    queryFn: () => MyService.myMethod(client, params),
  })
}

// 3. Component
const { data, isPending, error, refetch } = useMyQuery(params)
const appError = useAppError(error)

// 4. Template
<AsyncState :is-loading="isPending" :error="appError" @retry="refetch">
  <MyComponent :data="data" />
</AsyncState>
```

### Шаблон для mutation
```typescript
const { mutate, isPending, error } = useMutation({
  mutationFn: async (input) => {
    // Валидация
    if (!valid) throw createValidationError('...')
    
    // API call
    return MyService.create(client, input)
  },
  onSuccess: () => {
    $toast.success('Success!')
    queryClient.invalidateQueries({ queryKey: ['...'] })
  }
})
```

---

**Последнее обновление**: 2026-01-25
**Версия проекта**: Recruit Pro v1.0
