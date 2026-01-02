<script setup lang="ts">
const user = useSupabaseUser()

definePageMeta({
    layout: false,
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <!-- Header -->
    <header class="container mx-auto px-4 py-6">
      <nav class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-blue-600 rounded-lg"></div>
          <span class="text-2xl font-bold text-gray-900">HireCRM</span>
        </div>

        <div v-if="user" class="flex items-center gap-3">
          <span class="text-sm text-gray-600">{{ user.email }}</span>
          <Button as-child>
            <NuxtLink to="/dashboard">Dashboard</NuxtLink>
          </Button>
        </div>
        <div v-else class="flex gap-3">
          <Button variant="outline" as-child>
            <NuxtLink to="/auth">Sign In</NuxtLink>
          </Button>
          <Button as-child>
            <NuxtLink to="/auth">Get Started</NuxtLink>
          </Button>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-20 md:py-32">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Streamline Your
          <span class="text-blue-600"> IT Recruiting</span>
        </h1>
        <p class="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Manage candidates, track applications, and hire top tech talent faster with our modern recruitment CRM.
        </p>
        <div v-if="user" class="flex justify-center">
          <Button size="lg" as-child>
            <NuxtLink to="/dashboard">Go to Dashboard</NuxtLink>
          </Button>
        </div>
        <div v-else class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" as-child>
            <NuxtLink to="/auth">Start Free Trial</NuxtLink>
          </Button>
          <Button size="lg" variant="outline" as-child>
            <NuxtLink to="/auth">Sign In</NuxtLink>
          </Button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container mx-auto px-4 py-16">
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <!-- Feature 1 -->
        <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Candidate Management</h3>
          <p class="text-gray-600">
            Organize and track all your candidates in one place with powerful search and filtering.
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Job Pipeline</h3>
          <p class="text-gray-600">
            Visualize your hiring process with Kanban boards and move candidates through stages effortlessly.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Multi-Workspace</h3>
          <p class="text-gray-600">
            Manage multiple organizations and teams with role-based access control and permissions.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="container mx-auto px-4 py-16 mb-16">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to transform your hiring process?
        </h2>
        <p class="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
          Join hundreds of companies using HireCRM to find and hire the best tech talent.
        </p>
        <Button size="lg" variant="secondary" as-child>
          <NuxtLink to="/auth">Get Started for Free</NuxtLink>
        </Button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="container mx-auto px-4 py-8 border-t">
      <div class="text-center text-gray-600">
        <p>&copy; 2026 HireCRM. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>