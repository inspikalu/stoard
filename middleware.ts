import { NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

const rateLimit = {
  RPS: Number(process.env.HELIUS_RATE_LIMIT_RPS) || 30,
  BURST: Number(process.env.HELIUS_RATE_LIMIT_BURST) || 100,
};

const tokenCache = new LRUCache<string, number[]>({
  max: 1000,
  ttl: 1000 * 60 * 5,
});

export async function middleware(request: Request) {
  const url = new URL(request.url);
  
  // Only apply to API routes
  if (!url.pathname.startsWith('/api')) return NextResponse.next();

  const ip = request.headers.get('x-real-ip') || 
             request.headers.get('x-forwarded-for') || 
             'unknown';

  const tokenState = tokenCache.get(ip) || [];
  const now = Date.now();
  const recentRequests = tokenState.filter(t => now - t < 1000);

  if (recentRequests.length >= rateLimit.RPS) {
    if (recentRequests.length >= rateLimit.BURST) {
      return new NextResponse('Too many requests', {
        status: 429,
        headers: { 'Retry-After': '1' },
      });
    }
    return new NextResponse('Too many requests', { status: 429 });
  }

  tokenCache.set(ip, [...recentRequests, now]);
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};