import { getDb } from '../database/db'
import { users } from '../database/schema'

export default defineEventHandler(async () => {
  const allUsers = await getDb().select().from(users)
  return allUsers
})
