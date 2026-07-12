import { logEventSchema } from '../../shared/schemas'
import { logger } from '../utils/logger'

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body) => logEventSchema.parse(body))
  
  const sanitizedMessage = body.message.replace(/[\r\n]+/g, ' ')
  
  logger[body.level]({
    context: body.context,
    url: body.url,
    userAgent: body.userAgent,
    timestamp: body.timestamp
  }, sanitizedMessage)
  
  return { success: true }
})
