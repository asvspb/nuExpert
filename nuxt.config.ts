import tailwindcss from '@tailwindcss/vite'
import pkg from './package.json'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@pinia/nuxt'
  ],

  vite: {
    plugins: [
      tailwindcss()
    ]
  },

  css: ['~/assets/css/tailwind.css'],

  typescript: {
    strict: true,
    typeCheck: true
  },

  runtimeConfig: {
    public: {
      appVersion: pkg.version
    },
    dbUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5435/nuexpert',
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6380',
    corsOrigins: process.env.CORS_ORIGINS || 'http://localhost:3000',
  }
})
