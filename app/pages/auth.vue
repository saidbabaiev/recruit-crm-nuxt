<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

watchEffect(() => {
    if (user.value) {
        router.push('/dashboard')
    }
})

const mode = ref<'signin' | 'signup'>('signin')
const loading = ref(false)

const form = reactive({
    email: '',
    password: '',
    fullName: '',
    companyName: '',
})

const handleSignIn = async () => {
    loading.value = true
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
        })

        if (error) throw error

        router.push('/dashboard')
    } catch (error: any) {
        alert(error.message || 'Error signing in')
    } finally {
        loading.value = false
    }
}

const handleSignUp = async () => {
    loading.value = true
    try {
        if (!form.companyName.trim()) {
            alert('Company name is required')
            return
        }

        const { error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                data: {
                    full_name: form.fullName,
                    company_name: form.companyName,
                }
            }
        })

        if (error) throw error

        alert('Account created! Please check your email to confirm your account.')
        mode.value = 'signin'
    } catch (error: any) {
        alert(error.message || 'Error signing up')
    } finally {
        loading.value = false
    }
}

const handleSubmit = () => {
    if (mode.value === 'signin') {
        handleSignIn()
    } else {
        handleSignUp()
    }
}

definePageMeta({
    layout: 'auth',
})

</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-blue-600">Hire CRM</h1>
        <p class="text-gray-600 mt-2">Your IT Recruiting Solution</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mb-6">
        <button
          @click="mode = 'signin'"
          :class="[
            'flex-1 py-2 px-4 rounded-lg font-medium transition',
            mode === 'signin' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          Sign In
        </button>
        <button
          @click="mode = 'signup'"
          :class="[
            'flex-1 py-2 px-4 rounded-lg font-medium transition',
            mode === 'signup' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          Sign Up
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Sign Up Fields -->
        <template v-if="mode === 'signup'">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              v-model="form.fullName"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              v-model="form.companyName"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </template>

        <!-- Common Fields -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            minlength="6"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <span v-if="loading">Loading...</span>
          <span v-else>{{ mode === 'signin' ? 'Sign In' : 'Create Account' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>