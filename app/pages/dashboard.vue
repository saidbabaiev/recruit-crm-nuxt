<script setup lang="ts">
const user = useSupabaseUser()
</script>

<template>
  <div class="min-h-screen p-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">
            Dashboard
          </h1>
        </div>

        <div class="space-y-4">
          <p class="text-gray-600">
            Welcome to your dashboard!
          </p>

          <div class="bg-blue-50 p-4 rounded">
            <p class="font-medium">
              User Info:
            </p>
            <pre class="mt-2 text-sm">{{ user }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
