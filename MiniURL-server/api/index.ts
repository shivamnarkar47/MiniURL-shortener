import { handle } from 'hono/vercel'
import { createApp } from '../src/app'
import { MemoryStorage } from '../src/storage/memory'

// One storage instance per serverless instance; swap MemoryStorage
// for a DB-backed implementation in src/storage/ when needed.
const app = createApp(new MemoryStorage())

export default handle(app)
