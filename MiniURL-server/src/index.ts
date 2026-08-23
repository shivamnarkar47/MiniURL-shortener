import { serve } from '@hono/node-server'
import { createApp } from './app'
import { MemoryStorage } from './storage/memory'

const port = Number(process.env.PORT) || 8080

const app = createApp(new MemoryStorage())

serve({ fetch: app.fetch, port, hostname: '0.0.0.0' })

console.log(`Server is running on port ${port}`)
