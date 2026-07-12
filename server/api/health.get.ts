import { checkDbHealth } from '../database/db'
import { getRedisClient } from '../utils/redis'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  
  let dbStatus = 'error'
  try {
    if (await checkDbHealth()) {
      dbStatus = 'ok'
    }
  } catch {
    dbStatus = 'error'
  }

  let redisStatus = 'error'
  try {
    const redis = getRedisClient()
    if (redis) {
      await redis.ping()
      redisStatus = 'ok'
    }
  } catch {
    redisStatus = 'error'
  }

  return {
    status: 'ok',
    database: dbStatus,
    redis: redisStatus,
    version: config.public.appVersion
  }
})
