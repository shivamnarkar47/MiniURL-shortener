import { Hono } from 'hono'
import { createApp } from './create-app'
import { MemoryStorage } from './storage/memory'

// Vercel entry point (zero-config Hono detection requires a default-exported
// Hono app here). One storage instance per serverless instance; swap
// MemoryStorage for a DB-backed implementation in src/storage/ when needed.
const app: Hono = createApp(new MemoryStorage())

export default app
