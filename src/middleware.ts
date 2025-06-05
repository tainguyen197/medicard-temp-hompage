import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { nextUrl } = request
  const subdomain = request.headers.get('host')?.split('.')[0]
  console.log('subdomain', subdomain)

  if (nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  if (nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  // only rewrite if you're NOT already under /dashboard/admin
  if (subdomain === 'dashboard') {
    // preserve the rest of the path after "/"
    console.log('Rewriting to /dashboard/admin', `/dashboard/admin${nextUrl.pathname}`)
    return NextResponse.rewrite(
      new URL(`/dashboard/admin${nextUrl.pathname}`, request.url)
    )
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
}
  