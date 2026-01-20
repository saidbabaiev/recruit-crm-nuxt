<script setup lang="ts">
import AppSidebar from '@/components/sidebar/AppSidebar.vue'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import NavUser from '~/components/sidebar/NavUser.vue'
</script>

<template>
  <div class="flex h-screen">
    <SidebarProvider>
      <AppSidebar collapsible="icon" />
      <SidebarInset class="bg-background">
        <header class="flex h-16 shrink-0 items-center border-b">
          <div class="w-full flex items-center justify-between gap-2 px-4">
            <div class="flex items-center justify-between gap-2">
              <SidebarTrigger class="-ml-1" />
              <Separator
                orientation="vertical"
                class="mr-2 data-[orientation=vertical]:h-4"
              />
            </div>
            <div class=" min-w-56">
              <NavUser />
            </div>
          </div>
        </header>
        <main class="flex-1 overflow-auto">
          <slot />
        </main>
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>
