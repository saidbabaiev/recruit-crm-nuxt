<template>
  <div class="h-screen">
    <slot />

    <Toaster
      position="top-right"
      rich-colors
      :close-button="true"
    />
  </div>
</template>
