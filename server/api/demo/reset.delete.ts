import { getDb } from '../../database/db'
import { demoMetrics } from '../../database/demo-schema'

export default defineEventHandler(async () => {
  const db = getDb()
  await db.delete(demoMetrics)
  
  return { success: true }
})
