<template>
    <h1 class="text-2xl font-bold">Interviews page</h1>
    
    <Button @click="testToast">Show Success</Button>
    <Button @click="testError">Show Error</Button>
</template>

<script setup lang="ts">
    // const { $toast } = useNuxtApp()
    // 🔥 Используем composable
const { success, error } = useNotifications()

const testToast = () => {
  success('This is a success message!')
}

const testError = () => {
  error('Something went wrong!', 'Please try again later')
}
</script>