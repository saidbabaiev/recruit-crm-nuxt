<script setup lang="ts">
const { useJobsList } = useJobs()
const { data: jobsResponse } = useJobsList({ status: 'open' })
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">
      Jobs page
    </h1>

    <pre class="text-xs">
      {{ jobsResponse }}
    </pre>
  </div>
</template>
