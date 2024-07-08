import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { localePrefix, defaultLocale, locales } from './i18n.config';
 
const IGNORED_PATHS = ['/api', '/_next/static', '/_next/image', '/favicon.ico', '/wp-content', '/preview', '/_next/data'];
export const middleware = (request: NextRequest) => {
  const params = request.nextUrl.searchParams;
  const basicAuth = request.headers.get("authorization");
  const { AUTH_PW, AUTH_USER } = process.env;
  const url = request.nextUrl;
  if (IGNORED_PATHS.some((path) => request.nextUrl.pathname.startsWith(path))) return NextResponse.next();

  const handleI18nRouting = createMiddleware({ locales, localeDetection: false, localePrefix, defaultLocale });
  const response = handleI18nRouting(request);
  let pathname = request.nextUrl.pathname;
  locales.forEach((locale) => { if (pathname.startsWith(`/${locale}`)) pathname = pathname.replace(`/${locale}`, ''); });
  if (pathname.startsWith('/')) pathname = pathname.substring(1);
  response.headers.set('x-pathname', pathname);

  if (!request.nextUrl.pathname.startsWith('/api') && AUTH_USER && AUTH_PW) {
    if (basicAuth) {
      const authValue = basicAuth.split(" ")[1];
      const [user, pwd] = atob(authValue).split(":");
      if (user === AUTH_USER && pwd === AUTH_PW) {
        if (params.get('preview')) {
          const url = request.nextUrl.clone();
          url.pathname = '/preview'
          return NextResponse.rewrite(url);
        }
        return response;
      }
    }
    url.pathname = "/api/basicauth";
    return NextResponse.rewrite(url); 
  }
  return response;
}