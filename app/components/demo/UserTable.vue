<template>
  <UTable
    :data="users"
    :columns="columns"
  >
    <template #actions-cell="{ row }">
      <UButton
        color="error"
        variant="ghost"
        icon="i-heroicons-trash"
        @click="emit('delete', Number(row.original.id))"
      />
    </template>
  </UTable>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { User } from '../../../shared/schemas'

defineProps<{
  users: User[]
}>()

const emit = defineEmits<{
  delete: [id: number]
}>()

const columns: TableColumn<User>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'username', header: 'Username' },
  { accessorKey: 'email', header: 'Email' },
  { id: 'actions', header: '' }
]
</script>
