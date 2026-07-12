import { userCreateSchema } from '../../shared/schemas'
import { getDb } from '../database/db'
import { users } from '../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body) => userCreateSchema.parse(body))
  
  try {
    const [newUser] = await getDb().insert(users).values({
      username: body.username,
      email: body.email,
      fullName: body.fullName || null,
    }).returning()
    
    return newUser
  } catch (error: unknown) {
    if (typeof error === 'object' && error && 'code' in error && (error as { code?: string }).code === '23505') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Username or email already exists'
      })
    }
    throw error
  }
})
