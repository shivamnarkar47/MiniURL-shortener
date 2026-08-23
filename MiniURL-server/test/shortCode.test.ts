import { describe, expect, test } from 'bun:test'
import { generateShortCode } from '../src/lib/shortCode'

describe('generateShortCode', () => {
  test('generates codes of the requested length', () => {
    expect(generateShortCode()).toHaveLength(6)
    expect(generateShortCode(10)).toHaveLength(10)
    expect(generateShortCode(4)).toHaveLength(4)
  })

  test('only uses alphanumeric characters', () => {
    for (let i = 0; i < 100; i++) {
      expect(generateShortCode()).toMatch(/^[a-zA-Z0-9]{6}$/)
    }
  })

  test('generates unique codes', () => {
    const codes = new Set(Array.from({ length: 1000 }, () => generateShortCode()))
    // 62^6 space makes collisions astronomically unlikely
    expect(codes.size).toBe(1000)
  })
})
