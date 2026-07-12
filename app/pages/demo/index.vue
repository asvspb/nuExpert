<template>
  <div class="max-w-6xl mx-auto space-y-8 pb-12">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">
        Showcase Дашборд
      </h1>
      <div class="flex space-x-4 items-center">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-moon"
          @click="toggleColorMode"
        />
        <UButton
          color="error"
          variant="soft"
          icon="i-heroicons-trash"
          @click="() => { showCleanModal = true }"
        >
          🧹 Очистить демо
        </UButton>
      </div>
    </div>

    <!-- Infrastructure Status -->
    <section>
      <h2 class="text-xl font-semibold mb-4">
        Статус Инфраструктуры
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ClientOnly>
          <DemoStatusCard
            title="Database (PostgreSQL)"
            :status="sysStatus?.database"
          />
          <DemoStatusCard
            title="Redis Cache"
            :status="sysStatus?.redis"
          />
          <DemoStatusCard
            title="API Version"
            :status="sysStatus?.version"
          />
        </ClientOnly>
      </div>
      <div class="mt-4">
        <UButton
          color="neutral"
          variant="outline"
          :loading="redisLoading"
          @click="testRedis"
        >
          Проверить Redis (Echo)
        </UButton>
        <span
          v-if="redisResult"
          data-testid="redis-result"
          class="ml-4 text-sm text-gray-500"
        >Echo: {{ redisResult }}</span>
      </div>
    </section>

    <!-- Users CRUD -->
    <section>
      <h2 class="text-xl font-semibold mb-4">
        CRUD Пользователей
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="col-span-1">
          <DemoUserForm @submit="createUser" />
        </div>
        <div class="col-span-2">
          <DemoUserTable
            :users="users"
            @delete="deleteUser"
          />
        </div>
      </div>
    </section>

    <!-- Metrics Chart -->
    <section>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">
          График Метрик (Unovis)
        </h2>
        <div class="space-x-2">
          <UButton
            color="primary"
            variant="soft"
            @click="seedMetrics"
          >
            Сгенерировать данные
          </UButton>
          <UButton
            color="error"
            variant="soft"
            @click="resetMetrics"
          >
            Очистить данные
          </UButton>
        </div>
      </div>
      <UCard>
        <ClientOnly>
          <DemoChart
            v-if="metrics.length > 0"
            :data="metrics"
          />
          <div
            v-else
            class="text-center py-12 text-gray-500"
          >
            Нет данных для отображения
          </div>
        </ClientOnly>
      </UCard>
    </section>

    <!-- Clean Modal -->
    <UModal v-model="showCleanModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-red-600">
            Удаление демо-кода
          </h3>
        </template>
        <p class="mb-4 text-sm text-gray-600 dark:text-gray-300">
          Для полного удаления всех showcase-файлов (компонентов, API, миграций и страниц) выполните в терминале команду:
        </p>
        <pre class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm mb-4"><code>npm run clean:demo</code></pre>
        <p class="text-sm text-gray-500">
          Браузер не должен сам удалять файлы проекта по соображениям безопасности.
        </p>
        <template #footer>
          <UButton
            color="neutral"
            @click="() => { showCleanModal = false }"
          >
            Закрыть
          </UButton>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
/* global $fetch */
import { ref, onMounted } from 'vue'

import type { User, UserCreate } from '../../../shared/schemas'
import type { DemoMetric } from '../../../shared/schemas/demo'
import { useColorMode, useSystemStatus, useToast } from '#imports'

// System Status
const { status: sysStatus } = useSystemStatus()
const toast = useToast()

// Color mode
const colorMode = useColorMode()
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Clean Modal
const showCleanModal = ref(false)

// Redis Test
const redisLoading = ref(false)
const redisResult = ref('')
const testRedis = async () => {
  redisLoading.value = true
  try {
    const res = await $fetch<{ ok: boolean, echo: string }>('/api/demo/redis-test')
    redisResult.value = res.echo || 'empty'
  } catch (error) {
    redisResult.value = 'error'
    toast.add({ title: 'Redis Error', description: String(error), color: 'error' })
  }
  redisLoading.value = false
}

// Users CRUD
const users = ref<User[]>([])
const fetchUsers = async () => {
  users.value = await $fetch<User[]>('/api/users')
}
const createUser = async (data: UserCreate) => {
  try {
    await $fetch('/api/users', { method: 'POST', body: data })
    await fetchUsers()
  } catch (error) {
    toast.add({ title: 'Create User Failed', description: String(error), color: 'error' })
  }
}
const deleteUser = async (id: number) => {
  try {
    await $fetch(`/api/users/${id}`, { method: 'DELETE' })
    await fetchUsers()
  } catch (error) {
    toast.add({ title: 'Delete User Failed', description: String(error), color: 'error' })
  }
}

// Metrics Chart
const metrics = ref<DemoMetric[]>([])
const fetchMetrics = async () => {
  metrics.value = await $fetch<DemoMetric[]>('/api/demo/metrics')
}
const seedMetrics = async () => {
  await $fetch('/api/demo/seed', { method: 'POST', body: { count: 30 } })
  await fetchMetrics()
}
const resetMetrics = async () => {
  await $fetch('/api/demo/reset', { method: 'DELETE' })
  await fetchMetrics()
}

onMounted(() => {
  fetchUsers()
  fetchMetrics()
})
</script>
