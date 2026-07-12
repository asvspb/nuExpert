import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core'

export const demoMetrics = pgTable('demo_metrics', {
  id: serial('id').primaryKey(),
  label: varchar('label', { length: 50 }).notNull(),
  value: integer('value').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
