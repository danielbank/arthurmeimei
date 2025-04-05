import { NextResponse, type NextRequest } from 'next/server'

import { createClient } from '@/lib/supabase/server'

const authedPathPattern = /^\/(?:account|files|chat|group)/
const nonAuthedPathPattern = /^\/(?:login|sign-up|forgot-password)?$/

export async function updateSession(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  if (requestUrl.pathname.startsWith('/api/auth/callback')) {
    return response
  }

  if (nonAuthedPathPattern.test(request.nextUrl.pathname)) {
    return response
  }

  const supabase = await createClient()

  if (authedPathPattern.test(request.nextUrl.pathname)) {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (!session || sessionError) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}
