import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('[Middleware] Running for:', request.nextUrl.pathname)

  const res = NextResponse.next()
  res.headers.set('x-debug-middleware', 'true')
  return res
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
}
  