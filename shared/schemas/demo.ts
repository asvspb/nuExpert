import { z } from 'zod'

export const demoMetricSchema = z.object({
  id: z.number().optional(),
  label: z.string().min(1).max(50),
  value: z.number(),
  createdAt: z.union([z.string(), z.date()]).optional(),
})

export const seedParamsSchema = z.object({
  count: z.number().min(1).max(100).default(30)
})

export type DemoMetric = z.infer<typeof demoMetricSchema>
export type SeedParams = z.infer<typeof seedParamsSchema>
