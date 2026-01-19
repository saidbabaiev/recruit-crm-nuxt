<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { AlertCircle, Eye, EyeOff } from 'lucide-vue-next'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Composables
const { $toast } = useNuxtApp()
const { signIn, signUp } = useAuth()
const router = useRouter()
const route = useRoute()

// State
const tabs = ['signin', 'signup'] as const
const showPassword = ref(false)
const mode = ref<'signin' | 'signup'>('signin')
const error = ref<string | null>(null)

// Reactive form data
const form = reactive({
  email: '',
  password: '',
  fullName: '',
  companyName: '',
})

watch(mode, () => {
  error.value = null
})

watch(() => form.email, () => {
  if (error.value) error.value = null
})

watch(() => form.password, () => {
  if (error.value) error.value = null
})

// --- Types ---
type SignInVariables = {
  email: string
  password: string
}

type SignUpVariables = {
  email: string
  password: string
  metadata: {
    full_name: string
    company_name: string
  }
}

// --- Mutations ---
// Sign In Mutation
const { mutate: login, isPending: isLoginPending } = useMutation({
  mutationFn: (variables: SignInVariables) => {
    return signIn(variables.email, variables.password)
  },
  onMutate: () => {
    error.value = null
  },
  onSuccess: () => {
    $toast.success('Successfully signed in!')
    const destination = (route.query.redirectTo as string) || '/dashboard'
    router.push(destination)
  },
  onError: (err: Error) => {
    error.value = err.message || 'Your login or password is incorrect.'
  },
})

// Sign Up Mutation
const { mutate: register, isPending: isRegisterPending } = useMutation({
  mutationFn: (variables: SignUpVariables) => {
    return signUp(variables.email, variables.password, variables.metadata)
  },
  onMutate: () => {
    error.value = null
  },
  onSuccess: () => {
    $toast.success('Account created! Please check your email to verify your account.')
    mode.value = 'signin'
    form.password = ''
  },
  onError: (err: Error) => {
    error.value = err.message || 'Failed to create account. Please try again.'
  },
})

// --- Handlers ---

const handleSubmit = () => {
  if (mode.value === 'signin') {
    login({ email: form.email, password: form.password })
  }
  else {
    register({
      email: form.email,
      password: form.password,
      metadata: {
        full_name: form.fullName,
        company_name: form.companyName,
      },
    })
  }
}

// Watcher for user authentication state
const user = useSupabaseUser()
watch(user, (currentUser) => {
  if (currentUser && mode.value === 'signin') {
    const destination = (route.query.redirectTo as string) || '/dashboard'
    router.push(destination)
  }
}, { immediate: true })

definePageMeta({
  layout: 'auth',
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-muted/30 to-accent/20 p-4">
    <div class="w-full max-w-md bg-card rounded-lg shadow-lg p-8 border">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-primary">
          Hire CRM
        </h1>
        <p class="text-muted-foreground mt-2">
          Your IT Recruiting Solution
        </p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6">
        <Button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          :variant="mode === tab ? 'default' : 'secondary'"
          class="flex-1"
          @click="mode = tab"
        >
          {{ tab === 'signin' ? 'Sign In' : 'Sign Up' }}
        </Button>
      </div>

      <!-- Error Alert -->
      <Alert
        v-if="error"
        variant="destructive"
        class="mb-4"
      >
        <AlertCircle class="h-4 w-4" />
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>

      <!-- Form -->
      <form
        class="space-y-4"
        @submit.prevent="handleSubmit"
      >
        <!-- Sign Up Fields -->
        <template v-if="mode === 'signup'">
          <div class="space-y-2">
            <Label for="fullName">Full Name</Label>
            <Input
              id="fullName"
              v-model="form.fullName"
              type="text"
              required
            />
          </div>
          <div class="space-y-2">
            <Label for="companyName">Company Name</Label>
            <Input
              id="companyName"
              v-model="form.companyName"
              type="text"
              required
            />
          </div>
        </template>

        <!-- Email -->
        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            v-model="form.email"
            type="email"
            required
          />
        </div>

        <!-- Password -->
        <div class="space-y-2">
          <Label for="password">Password</Label>
          <div class="relative">
            <Input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="6"
              class="pr-10"
            />
            <button
              v-if="form.password.length > 0"
              type="button"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground hover:text-foreground"
              @click="showPassword = !showPassword"
            >
              <Eye
                v-if="!showPassword"
                class="h-4 w-4"
              />
              <EyeOff
                v-else
                class="h-4 w-4"
              />
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <Button
          type="submit"
          class="w-full"
          :disabled="isLoginPending || isRegisterPending"
        >
          <span
            v-if="isLoginPending || isRegisterPending"
            class="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
          />
          {{ mode === 'signin' ? 'Sign In' : 'Create Account' }}
        </Button>
      </form>
    </div>
  </div>
</template>
