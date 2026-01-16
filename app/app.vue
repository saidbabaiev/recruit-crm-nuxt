<template>
  <NuxtLayout>
    <NuxtPage />

    <VueQueryDevtools />

    <Toaster
      position="top-right"
      rich-colors
      :close-button="true"
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
</script>
