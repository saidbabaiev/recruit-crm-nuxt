<template>
    <h1 class="text-2xl font-bold">Interviews page</h1>
    <Toaster position="top-right" />
    <Button @click="$toast('Test toast')">test toast</Button>
</template>

<script setup lang="ts">
    const { $toast } = useNuxtApp()
</script>