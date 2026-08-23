export interface URLRecord {
  original_url: string
  short_code: string
  created_at: string
}

export interface Storage {
  save(url: URLRecord): Promise<void>
  find(shortCode: string): Promise<URLRecord | null>
  getRecent(limit: number): Promise<URLRecord[]>
  delete(shortCode: string): Promise<boolean>
  clear(): Promise<void>
}

export class DuplicateShortCodeError extends Error {
  constructor(shortCode: string) {
    super(`Short code "${shortCode}" already exists.`)
    this.name = 'DuplicateShortCodeError'
  }
}
