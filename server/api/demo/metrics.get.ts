import { asc } from 'drizzle-orm'
import { getDb } from '../../database/db'
import { demoMetrics } from '../../database/demo-schema'

export default defineEventHandler(async () => {
  const db = getDb()
  
  // Just return the raw points ordered by creation or label
  const records = await db.select({
    label: demoMetrics.label,
    value: demoMetrics.value
  })
  .from(demoMetrics)
  .orderBy(asc(demoMetrics.id))
  
  return records
})
