<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { AlertCircle, Eye, EyeOff } from 'lucide-vue-next'
import { Alert, AlertDescription } from '@/components/ui/alert'

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
    if (!form.companyName.trim()) {
      $toast.error('Company name is required')
      return
    }

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
  <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-blue-600">
          Hire CRM
        </h1>
        <p class="text-gray-600 mt-2">
          Your IT Recruiting Solution
        </p>
      </div>

      <div class="flex gap-2 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          :class="[
            'flex-1 py-2 px-4 rounded-lg font-medium transition',
            mode === tab
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          ]"
          @click="mode = tab"
        >
          {{ tab === 'signin' ? 'Sign In' : 'Sign Up' }}
        </button>
      </div>

      <Alert
        v-if="error"
        variant="destructive"
        class="mb-4"
      >
        <AlertCircle class="h-4 w-4" />
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>

      <form
        class="space-y-4"
        @submit.prevent="handleSubmit"
      >
        <template v-if="mode === 'signup'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              v-model="form.fullName"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              v-model="form.companyName"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              minlength="6"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition pr-10"
            >
            <button
              v-if="form.password.length > 0"
              type="button"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-blue-600 cursor-pointer transition"
              @click="showPassword = !showPassword"
            >
              <span v-show="!showPassword"><Eye /></span>
              <span v-show="showPassword"><EyeOff /></span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoginPending || isRegisterPending"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex justify-center items-center gap-2"
        >
          <span
            v-if="isLoginPending || isRegisterPending"
            class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
          />
          <span>
            {{ mode === 'signin' ? 'Sign In' : 'Create Account' }}
          </span>
        </button>
      </form>
    </div>
  </div>
</template>
