import { DuplicateShortCodeError, type Storage, type URLRecord } from './types'

export class MemoryStorage implements Storage {
  private urls = new Map<string, URLRecord>()

  async save(url: URLRecord): Promise<void> {
    if (this.urls.has(url.short_code)) {
      throw new DuplicateShortCodeError(url.short_code)
    }
    this.urls.set(url.short_code, url)
  }

  async find(shortCode: string): Promise<URLRecord | null> {
    return this.urls.get(shortCode) ?? null
  }

  async getRecent(limit: number): Promise<URLRecord[]> {
    // Map iteration preserves insertion order, which equals created_at order,
    // so we can slice instead of re-sorting on every request.
    const urls = [...this.urls.values()]
    if (limit > 0 && limit < urls.length) {
      return urls.slice(urls.length - limit).reverse()
    }
    return urls.reverse()
  }

  async delete(shortCode: string): Promise<boolean> {
    return this.urls.delete(shortCode)
  }

  async clear(): Promise<void> {
    this.urls.clear()
  }
}
