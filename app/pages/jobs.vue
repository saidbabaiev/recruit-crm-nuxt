<script setup lang="ts">
const { useJobsList } = useJobs()
const { data: jobsResponse, isPending: isLoadingJobs, error: jobsError } = useJobsList({ status: 'open' })
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">
      Jobs page
    </h1>

    <pre class="text-xs text-muted-foreground">
  isLoadingJobs: {{ isLoadingJobs }} |
  jobsError: {{ jobsError }}
</pre>

    <pre class="text-xs">
  jobsResponse: {{ jobsResponse }}
</pre>
  </div>
</template>
