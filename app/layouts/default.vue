<template>
  <div class="flex h-screen bg-gray-100">
    <aside class="w-64 border-r p-4">
       Sidebar
    </aside>

    <main class="flex-1 p-8 overflow-auto">
      <slot />
    </main>
  </div>
</template>