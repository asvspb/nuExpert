<template>
  <div class="h-64 w-full">
    <VisXYContainer
      :data="data"
      :x="x"
      :y="y"
    >
      <VisLine
        :x="x"
        :y="y"
        color="#3b82f6"
      />
      <VisAxis
        type="x"
        :x="x"
        :tick-format="formatX"
      />
      <VisAxis
        type="y"
        :y="y"
      />
    </VisXYContainer>
  </div>
</template>

<script setup lang="ts">
import { VisXYContainer, VisLine, VisAxis } from '@unovis/vue'
import type { DemoMetric } from '../../../shared/schemas/demo'

const props = defineProps<{
  data: DemoMetric[]
}>()

const x = (d: DemoMetric, i: number) => i
const y = (d: DemoMetric) => d.value
const formatX = (i: number) => {
  const item = props.data[i]
  if (!item || !item.createdAt) return ''
  return new Date(item.createdAt).toLocaleDateString()
}
</script>
