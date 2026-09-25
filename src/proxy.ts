import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabasePublishableKey, supabaseUrl } from '@/lib/supabase/config';
import { safeLoginPath } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const pendingCookies: { name: string; value: string; options: CookieOptions }[] = [];
  const client = createServerClient(supabaseUrl!, supabasePublishableKey!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        pendingCookies.push(...values);
      },
    },
  });

  const { data } = await client.auth.getClaims();
  const isStudentRoute = request.nextUrl.pathname === '/student' || request.nextUrl.pathname.startsWith('/student/');
  const isCompanyRoute = request.nextUrl.pathname === '/company' || request.nextUrl.pathname.startsWith('/company/');
  if ((isStudentRoute || isCompanyRoute) && !data?.claims.sub) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    loginUrl.searchParams.set('next', safeLoginPath(`${request.nextUrl.pathname}${request.nextUrl.search}`, '/'));
    response = NextResponse.redirect(loginUrl);
  }

  pendingCookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'] };
