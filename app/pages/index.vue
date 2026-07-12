<template>
  <div class="max-w-4xl mx-auto space-y-6 flex flex-col items-center justify-center min-h-[50vh] text-center">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
      Добро пожаловать в nuExpert
    </h1>
    <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
      Это AI-First фреймворк на Nuxt 4 + Nitro + Drizzle + Nuxt UI. 
      Если вы видите этот экран — базовый сетап работает отлично.
    </p>
    
    <UButton
      size="xl"
      color="primary"
      to="/demo"
      icon="i-heroicons-sparkles"
    >
      Открыть демо-дашборд
    </UButton>
  </div>
</template>

<script setup lang="ts">
// Hello World страница
</script>
