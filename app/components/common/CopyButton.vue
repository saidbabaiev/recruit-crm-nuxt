<script setup lang="ts">
import { Copy, Check } from 'lucide-vue-next'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

interface Props {
  value: string
  size?: 'xs' | 'sm'
  tooltip?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm',
  tooltip: 'Copy to clipboard',
})

const { $toast } = useNuxtApp()
const isCopied = ref(false)

const sizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.value)
    isCopied.value = true
    $toast.success('Copied to clipboard')

    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  }
  catch (error) {
    console.error('Failed to copy:', error)
    $toast.error('Failed to copy')
  }
}
</script>

<template>
  <TooltipProvider :delay-duration="200">
    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="h-6 w-6 shrink-0 hover:bg-accent cursor-pointer"
          @click.stop="copyToClipboard"
        >
          <Check
            v-if="isCopied"
            :class="['text-green-500 transition-all', sizeClasses[size]]"
          />
          <Copy
            v-else
            :class="['text-muted-foreground transition-all', sizeClasses[size]]"
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{{ isCopied ? 'Copied!' : tooltip }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
