import { seedParamsSchema } from '../../../shared/schemas/demo'
import { getDb } from '../../database/db'
import { demoMetrics } from '../../database/demo-schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {}
  const params = seedParamsSchema.safeParse(body)
  
  if (!params.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid params' })
  }
  
  const count = params.data.count
  const db = getDb()
  
  const dataToInsert = []
  const baseDate = new Date()
  
  for (let i = count; i >= 1; i--) {
    const d = new Date(baseDate)
    d.setDate(d.getDate() - i)
    dataToInsert.push({
      label: d.toISOString().split('T')[0] as string,
      value: Math.floor(Math.random() * 100),
      createdAt: new Date()
    })
  }
  
  await db.insert(demoMetrics).values(dataToInsert)
  
  return { inserted: count }
})
