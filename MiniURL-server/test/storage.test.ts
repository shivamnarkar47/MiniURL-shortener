import { beforeEach, describe, expect, test } from 'bun:test'
import { MemoryStorage } from '../src/storage/memory'
import type { URLRecord } from '../src/storage/types'

const makeRecord = (code: string, createdAt: string): URLRecord => ({
  original_url: `https://example.com/${code}`,
  short_code: code,
  created_at: createdAt,
})

describe('MemoryStorage', () => {
  let storage: MemoryStorage

  beforeEach(() => {
    storage = new MemoryStorage()
  })

  describe('save', () => {
    test('saves and finds a record', async () => {
      await storage.save(makeRecord('abcd01', '2026-08-23T00:00:00.000Z'))
      const found = await storage.find('abcd01')
      expect(found?.original_url).toBe('https://example.com/abcd01')
    })

    test('rejects duplicate short codes', async () => {
      await storage.save(makeRecord('abcd01', '2026-08-23T00:00:00.000Z'))
      expect(storage.save(makeRecord('abcd01', '2026-08-24T00:00:00.000Z'))).rejects.toHaveProperty(
        'name',
        'DuplicateShortCodeError',
      )
    })

    test('returns null for missing codes', async () => {
      expect(await storage.find('nope12')).toBeNull()
    })
  })

  describe('getRecent', () => {
    // MemoryStorage returns newest-first via insertion order,
    // which matches created_at order because save() stamps the time.
    test('returns newest first', async () => {
      await storage.save(makeRecord('older1', '2026-08-22T00:00:00.000Z'))
      await storage.save(makeRecord('middle', '2026-08-22T12:00:00.000Z'))
      await storage.save(makeRecord('newest', '2026-08-23T00:00:00.000Z'))
      const recent = await storage.getRecent(3)
      expect(recent.map((r) => r.short_code)).toEqual(['newest', 'middle', 'older1'])
    })

    test('applies the limit', async () => {
      for (let i = 0; i < 5; i++) {
        await storage.save(makeRecord(`code${i}`, `2026-08-2${i}T00:00:00.000Z`))
      }
      expect(await storage.getRecent(3)).toHaveLength(3)
    })

    test('returns everything when limit exceeds size', async () => {
      await storage.save(makeRecord('abcd01', '2026-08-23T00:00:00.000Z'))
      expect(await storage.getRecent(100)).toHaveLength(1)
    })
  })

  describe('delete', () => {
    test('deletes an existing code', async () => {
      await storage.save(makeRecord('abcd01', '2026-08-23T00:00:00.000Z'))
      expect(await storage.delete('abcd01')).toBe(true)
      expect(await storage.find('abcd01')).toBeNull()
    })

    test('returns false for a missing code', async () => {
      expect(await storage.delete('nope12')).toBe(false)
    })
  })
})
