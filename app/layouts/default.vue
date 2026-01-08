<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Input } from "~/components/ui/input";

</script>

<template>
  <div class="flex h-screen bg-green-100">
    <SidebarProvider>
      <AppSidebar collapsible="icon" />
      <SidebarInset>
        <header class="flex h-16 shrink-0 items-center gap-2">
          <div class="w-full flex items-center gap-2 px-4">
            <SidebarTrigger class="-ml-1" />
            <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
            <Input type="search" placeholder="Search..." class="w-50"/>
            <!-- <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem class="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator class="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> -->
          </div>
        </header>
        <main class="flex-1 overflow-auto">
          <slot />
        </main>
      </SidebarInset>
    </SidebarProvider>

    <Toaster position="top-right" richColors :close-button="true" />
  </div>
</template>