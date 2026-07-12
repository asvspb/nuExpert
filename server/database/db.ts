import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

let sql: ReturnType<typeof postgres>
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null

export const initDb = (url: string) => {
  sql = postgres(url)
  dbInstance = drizzle(sql, { schema })
}

export const getDb = () => {
  if (!dbInstance) {
    throw new Error('Database is not initialized')
  }
  return dbInstance
}

export const checkDbHealth = async () => {
  if (sql) {
    await sql`SELECT 1`
    return true
  }
  return false
}

export const closeDb = async () => {
  if (sql) {
    await sql.end()
  }
}
