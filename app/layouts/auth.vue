<template>
  <div class="h-screen">
    <slot /> 

    <Toaster position="top-right" richColors :close-button="true" />
  </div>
</template>