import { z } from 'zod'

export const userCreateSchema = z.object({
  username: z.string().min(1).max(50),
  email: z.string().email().max(255),
  fullName: z.string().max(100).optional(),
})

export type UserCreate = z.infer<typeof userCreateSchema>

export const userSchema = userCreateSchema.extend({
  id: z.number(),
  createdAt: z.string().or(z.date()),
})

export type User = z.infer<typeof userSchema>

export const logEventSchema = z.object({
  level: z.enum(['info', 'warn', 'error', 'debug']),
  message: z.string().max(1000),
  context: z.record(z.string(), z.any()).optional(),
  timestamp: z.string().datetime().optional(),
  url: z.string().max(500).optional(),
  userAgent: z.string().max(500).optional(),
})

export type LogEvent = z.infer<typeof logEventSchema>
