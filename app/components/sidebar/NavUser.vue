<script setup lang="ts">
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings,
  Sparkles,
} from 'lucide-vue-next'

import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useMutation } from '@tanstack/vue-query'

const user = useSupabaseUser()
const { signOut } = useAuth()
// const { isMobile } = useSidebar()

// Compute user display info
const userName = computed(() => {
  return user.value?.user_metadata?.full_name || 'User'
})
const userEmail = computed(() => user.value?.email || '')
const userAvatarFallback = computed(() =>
  userName.value
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase(),
)

const { mutate: handleLogout, isPending } = useMutation({
  mutationFn: signOut,
  onSuccess: async () => {
    await navigateTo('/auth')
  },
})
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarFallback
                class="rounded-lg"
              >
                {{ userAvatarFallback }}
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-medium">{{ userName }}</span>
              <span class="truncate text-xs">{{ userEmail }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side="bottom"
          align="end"
          :side-offset="4"
        >
          <!-- <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              Admin Account
            </div>
          </DropdownMenuLabel> -->
          <!-- <DropdownMenuSeparator /> -->
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Sparkles :size="16" />
              Upgrade to Pro
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BadgeCheck :size="16" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard :size="16" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell :size="16" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings :size="16" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            :disabled="isPending"
            @click="handleLogout"
          >
            <LogOut :size="16" />
            {{ isPending ? 'Logging out...' : 'Log out' }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
