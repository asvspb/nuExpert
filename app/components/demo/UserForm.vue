<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      label="Username"
      name="username"
    >
      <UInput v-model="state.username" />
    </UFormField>
    <UFormField
      label="Email"
      name="email"
    >
      <UInput
        v-model="state.email"
        type="email"
      />
    </UFormField>
    <UFormField
      label="Full Name"
      name="fullName"
    >
      <UInput v-model="state.fullName" />
    </UFormField>
    <UButton
      type="submit"
      color="primary"
    >
      Create User
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { z } from 'zod'

import type { FormSubmitEvent } from '#ui/types'

const schema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  fullName: z.string().min(3)
})

type Schema = z.output<typeof schema>

const state = reactive({
  username: '',
  email: '',
  fullName: ''
})

const emit = defineEmits(['submit'])

const onSubmit = (event: FormSubmitEvent<Schema>) => {
  emit('submit', event.data)
  state.username = ''
  state.email = ''
  state.fullName = ''
}
</script>
