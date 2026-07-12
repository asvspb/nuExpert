import { ref, onMounted, onUnmounted } from 'vue'

export type SystemStatus = {
  database: string
  redis: string
  version: string
}

export const useSystemStatus = () => {
  const status = ref<SystemStatus | null>(null)
  let interval: NodeJS.Timeout | null = null

  const refresh = async () => {
    try {
      const data = await $fetch<{ status: string, timestamp: string, database: string, redis: string, version: string }>('/api/health')
      status.value = {
        database: data.database || 'unknown',
        redis: data.redis || 'unknown',
        version: data.version || 'unknown'
      }
    } catch {
      status.value = { database: 'error', redis: 'error', version: 'unknown' }
    }
  }

  onMounted(() => {
    refresh()
    interval = setInterval(refresh, 10000)
  })

  onUnmounted(() => {
    if (interval) clearInterval(interval)
  })

  return { status, refresh }
}
