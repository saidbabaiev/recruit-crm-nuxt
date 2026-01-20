<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import {
  Briefcase,
  Building2,
  Command,
  FileUser,
  LifeBuoy,
  PieChart,
  Send,
  Users,
} from 'lucide-vue-next'

import NavMain from '@/components/sidebar/NavMain.vue'
import NavSecondary from '@/components/sidebar/NavSecondary.vue'
import NavUser from '@/components/sidebar/NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const props = withDefaults(defineProps<SidebarProps>(), {
  variant: 'inset',
  collapsible: 'icon',
})

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: PieChart,
    },
    {
      title: 'Candidates',
      url: '/candidates',
      icon: Users,
    },
    {
      title: 'Jobs',
      url: '/jobs',
      icon: Briefcase,
    },
    {
      title: 'Clients',
      url: '/clients',
      icon: Building2,
    },
    {
      title: 'Applications',
      url: '/applications',
      icon: FileUser,
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
}
</script>

<template>
  <Sidebar
    v-bind="props"
  >
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            as-child
          >
            <a href="#">
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Command class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">Hire CRM</span>
                <span class="truncate text-xs">Enterprise</span>
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
      <NavSecondary
        :items="data.navSecondary"
        class="mt-auto"
      />
    </SidebarContent>
    <SidebarFooter>
      <NavUser />
    </SidebarFooter>
  </Sidebar>
</template>
