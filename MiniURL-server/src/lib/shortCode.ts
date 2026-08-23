const CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
// Pre-allocated scratch buffer avoids a heap allocation per call.
const SCRATCH = new Uint32Array(10)

export function generateShortCode(length = 6): string {
  const random = SCRATCH.subarray(0, length)
  crypto.getRandomValues(random)
  let code = ''
  for (let i = 0; i < length; i++) {
    code += CHARSET[random[i] % CHARSET.length]
  }
  return code
}
