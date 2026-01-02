<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
}

</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Dashboard</h1>
          <Button
            @click="handleLogout"
            >
            Logout
        </Button>

        </div>
        
        <div class="space-y-4">
          <p class="text-gray-600">Welcome to your dashboard!</p>
          
          <div class="bg-blue-50 p-4 rounded">
            <p class="font-medium">User Info:</p>
            <pre class="mt-2 text-sm">{{ user }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>