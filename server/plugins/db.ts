import { initDb, closeDb } from '../database/db'

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig()
  
  if (config.dbUrl) {
    initDb(config.dbUrl as string)
  } else {
    console.warn('DATABASE_URL is not set. Database will not be initialized.')
  }

  nitroApp.hooks.hook('close', async () => {
    await closeDb()
  })
})
