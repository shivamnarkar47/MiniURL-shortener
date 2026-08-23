import { beforeEach, describe, expect, test } from 'bun:test'
import { createApp } from '../src/create-app'
import { MemoryStorage } from '../src/storage/memory'

const shorten = (body: Record<string, unknown> | string) =>
  app.request('/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })

let app: ReturnType<typeof createApp>

beforeEach(() => {
  app = createApp(new MemoryStorage())
})

describe('POST /shorten', () => {
  test('creates a short URL with generated code and created_at', async () => {
    const res = await shorten({ original_url: 'https://example.com' })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.original_url).toBe('https://example.com')
    expect(json.short_code).toMatch(/^[a-zA-Z0-9]{6}$/)
    expect(new Date(json.created_at).toISOString()).toBe(json.created_at)
  })

  test('accepts a custom short code', async () => {
    const res = await shorten({ original_url: 'https://example.com', short_code: 'mycode' })
    expect(res.status).toBe(200)
    expect((await res.json()).short_code).toBe('mycode')
  })

  test('rejects duplicate custom codes with 409', async () => {
    await shorten({ original_url: 'https://example.com', short_code: 'mycode' })
    const res = await shorten({ original_url: 'https://other.com', short_code: 'mycode' })
    expect(res.status).toBe(409)
    expect((await res.json()).error).toContain('already exists')
  })

  test('rejects missing original_url with 400', async () => {
    const res = await shorten({ short_code: 'mycode' })
    expect(res.status).toBe(400)
  })

  test('rejects invalid URLs with 400', async () => {
    const res = await shorten({ original_url: 'not a url' })
    expect(res.status).toBe(400)
  })

  test('rejects invalid custom codes with 400', async () => {
    const res = await shorten({ original_url: 'https://example.com', short_code: 'x!' })
    expect(res.status).toBe(400)
  })

  test('rejects malformed JSON with 400', async () => {
    const res = await shorten('{not json')
    expect(res.status).toBe(400)
  })

  test('sets CORS headers like the Go middleware did', async () => {
    const res = await shorten({ original_url: 'https://example.com' })
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*')
  })
})

describe('GET /recent', () => {
  test('returns empty array when no URLs exist', async () => {
    const res = await app.request('/recent')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
  })

  test('defaults to 10 and clamps to max 100', async () => {
    for (let i = 0; i < 15; i++) {
      await shorten({ original_url: `https://example.com/${i}` })
    }
    expect((await (await app.request('/recent')).json())).toHaveLength(10)
    expect((await (await app.request('/recent?limit=3')).json())).toHaveLength(3)
    expect((await (await app.request('/recent?limit=999')).json())).toHaveLength(15)
    expect((await (await app.request('/recent?limit=abc')).json())).toHaveLength(10)
  })
})

describe('DELETE /url/:code', () => {
  test('deletes an existing URL', async () => {
    const { short_code } = await (
      await shorten({ original_url: 'https://example.com', short_code: 'mycode' })
    ).json()
    const res = await app.request(`/url/${short_code}`, { method: 'DELETE' })
    expect(res.status).toBe(200)
    expect((await res.json()).message).toBe('URL deleted successfully')
  })

  test('returns 404 for unknown codes', async () => {
    const res = await app.request('/url/nope12', { method: 'DELETE' })
    expect(res.status).toBe(404)
  })
})

describe('GET /:code redirect', () => {
  test('redirects with 302 to the original URL', async () => {
    await shorten({ original_url: 'https://example.com/target', short_code: 'mycode' })
    const res = await app.request('/mycode', { redirect: 'manual' })
    expect(res.status).toBe(302)
    expect(res.headers.get('Location')).toBe('https://example.com/target')
  })

  test('returns 404 for unknown codes', async () => {
    const res = await app.request('/nope12')
    expect(res.status).toBe(404)
    expect((await res.json()).error).toBe('URL not found')
  })

  test('returns 400 for invalid code format', async () => {
    const res = await app.request('/ab')
    expect(res.status).toBe(400)
  })
})
