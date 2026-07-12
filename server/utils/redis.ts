import Redis from 'ioredis'

let redisClient: Redis | null = null

export const getRedisClient = () => {
  if (!redisClient) {
    const config = useRuntimeConfig()
    redisClient = new Redis(config.redisUrl as string, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    })
  }
  return redisClient
}

export const closeRedis = async () => {
  if (redisClient) {
    await redisClient.quit()
  }
}
