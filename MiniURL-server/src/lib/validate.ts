// Codes are generated 6 chars long; custom codes may be 4-10 alphanumeric chars.
export const isValidShortCode = (code: string): boolean =>
  /^[a-zA-Z0-9]{4,10}$/.test(code)

export const isValidOriginalUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export const parseRecentLimit = (
  raw: string | undefined,
  defaultValue: number,
  maxValue: number,
): number => {
  if (!raw) return defaultValue
  const parsed = Number.parseInt(raw, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return defaultValue
  return Math.min(parsed, maxValue)
}
