<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import {
  Briefcase,
  Building2,
  Calendar,
  Command,
  FileUser,
  LifeBuoy,
  PieChart,
  Send,
  Users,
} from 'lucide-vue-next'

import NavMain from '@/components/NavMain.vue'
// import NavProjects from '@/components/NavProjects.vue'
import NavSecondary from '@/components/NavSecondary.vue'
import NavUser from '@/components/NavUser.vue'
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

const user = useSupabaseUser()
const userName = user.value?.user_metadata?.full_name || 'User'
const userEmail = user.value?.email || ''

const data = {
  user: {
    name: userName,
    email: userEmail,
    avatar: null,
  },
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
      // items: [
      //   { title: "All Candidates", url: "/candidates" },
      //   { title: "Active", url: "/candidates?status=active" },
      //   { title: "Archived", url: "/candidates?status=archived" },
      // ],
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
    {
      title: 'Interviews',
      url: '/interviews',
      icon: Calendar,
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
    class="bg-card"
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
      <!-- <NavProjects :projects="data.projects" /> -->
      <NavSecondary
        :items="data.navSecondary"
        class="mt-auto"
      />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
  </Sidebar>
</template>
