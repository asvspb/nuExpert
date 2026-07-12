import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getDb } from '../../database/db'
import { users } from '../../database/schema'

const idSchema = z.object({
  id: z.coerce.number().int().positive()
})

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, (data) => idSchema.safeParse(data))

  if (!params.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid user ID',
      data: params.error.issues
    })
  }

  const db = getDb()
  const result = await db.delete(users).where(eq(users.id, params.data.id)).returning()

  if (result.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  return { success: true, deleted: result[0] }
})
