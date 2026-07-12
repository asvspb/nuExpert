<template>
  <UCard>
    <div class="flex items-center justify-between">
      <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
        {{ title }}
      </div>
      <UBadge
        :color="badgeColor"
        variant="subtle"
      >
        {{ status }}
      </UBadge>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  status?: string
}>()

const badgeColor = computed(() => {
  if (props.status === 'ok') return 'success'
  if (props.status === 'error') return 'error'
  return 'neutral'
})
</script>
