import { NextRequest, NextResponse } from 'next/server'
import { LRUCache } from 'lru-cache'

const tokenCache = new LRUCache<string, number[]>({
  max: 500,
  ttl: 60000, // 1 minute
})

export async function rateLimit(request: NextRequest, limit: number = 20, windowMs: number = 60000) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1'
  const tokenCount = tokenCache.get(ip) || [0]
  
  if (tokenCount[0] === 0) {
    tokenCache.set(ip, [1, Date.now()])
  } else {
    const [count, startTime] = tokenCount
    if (Date.now() - startTime < windowMs) {
      if (count >= limit) {
        return false
      }
      tokenCache.set(ip, [count + 1, startTime])
    } else {
      tokenCache.set(ip, [1, Date.now()])
    }
  }
  
  return true
}

export function rateLimitResponse() {
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    { status: 429 }
  )
}
