import { serve } from '@hono/node-server'
import app from './server'

const port = Number(process.env.PORT) || 8080

serve({ fetch: app.fetch, port, hostname: '0.0.0.0' })

console.log(`Server is running on port ${port}`)
