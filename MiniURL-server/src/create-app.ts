import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { generateShortCode } from './lib/shortCode'
import { isValidOriginalUrl, isValidShortCode, parseRecentLimit } from './lib/validate'
import type { Storage, URLRecord } from './storage/types'

const DEFAULT_RECENT_LIMIT = 10
const MAX_RECENT_LIMIT = 100

export function createApp(storage: Storage) {
  const app = new Hono()

  app.use('*', cors())

  app.post('/shorten', async (c) => {
    let body: { original_url?: unknown; short_code?: unknown }
    try {
      body = await c.req.json()
    } catch {
      return c.json({ error: 'Invalid JSON body' }, 400)
    }

    const originalUrl = typeof body.original_url === 'string' ? body.original_url.trim() : ''
    if (!originalUrl) {
      return c.json({ error: 'Original URL is required' }, 400)
    }
    if (!isValidOriginalUrl(originalUrl)) {
      return c.json({ error: 'Original URL must be a valid http(s) URL' }, 400)
    }

    let shortCode =
      typeof body.short_code === 'string' && body.short_code.trim() !== ''
        ? body.short_code.trim()
        : generateShortCode()

    if (!isValidShortCode(shortCode)) {
      return c.json({ error: 'Invalid short code format' }, 400)
    }

    // Retry with generated codes in case of a collision.
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const record: URLRecord = {
          original_url: originalUrl,
          short_code: shortCode,
          created_at: new Date().toISOString(),
        }
        await storage.save(record)
        return c.json(record, 200)
      } catch (err) {
        if (err instanceof Error && err.name === 'DuplicateShortCodeError') {
          if (body.short_code) {
            return c.json({ error: err.message }, 409)
          }
          shortCode = generateShortCode()
          continue
        }
        throw err
      }
    }
    return c.json({ error: 'Failed to generate a unique short code' }, 500)
  })

  app.get('/recent', (c) => {
    const limit = parseRecentLimit(
      c.req.query('limit'),
      DEFAULT_RECENT_LIMIT,
      MAX_RECENT_LIMIT,
    )
    return storage.getRecent(limit).then((urls) => c.json(urls))
  })

  app.delete('/url/:code', async (c) => {
    const code = c.req.param('code')
    if (!code || !isValidShortCode(code)) {
      return c.json({ error: 'Short code is required' }, 400)
    }
    const deleted = await storage.delete(code)
    if (!deleted) {
      return c.json({ error: 'URL not found' }, 404)
    }
    return c.json({ message: 'URL deleted successfully' })
  })

  app.get('/_health', (c) => c.json({ status: 'ok' }))

  app.get('/', (c) => c.json({ error: 'Short code is required' }, 400))

  app.get('/:code', async (c) => {
    const code = c.req.param('code')
    if (!isValidShortCode(code)) {
      return c.json({ error: 'Invalid short code format' }, 400)
    }
    const url = await storage.find(code)
    if (!url) {
      return c.json({ error: 'URL not found' }, 404)
    }
    // 302 so browsers do not permanently cache redirects of since-deleted codes.
    return c.redirect(url.original_url, 302)
  })

  app.notFound((c) => c.json({ error: 'Not Found' }, 404))
  app.onError((err, c) => {
    console.error(err)
    return c.json({ error: 'Internal server error' }, 500)
  })

  return app
}
