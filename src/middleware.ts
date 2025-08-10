import { NextResponse, type NextRequest } from 'next/server';

// Wildcard subdomain support: rewrite slug.youragent.in/* -> /[agentSlug]/*
export function middleware(req: NextRequest) {
  const primaryDomain = process.env.PRIMARY_DOMAIN || 'youragent.in';
  const host = req.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Skip rewrites for Next internals, static, and API
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap')
  ) {
    return NextResponse.next();
  }

  // Handle subdomain only when hostname ends with our primary domain and has a subdomain
  if (hostname.endsWith(primaryDomain)) {
    const parts = hostname.replace(`.${primaryDomain}`, '').split('.');
    const subdomain = parts.length >= 1 ? parts[0] : '';

    const reserved = new Set(['', 'www', 'app', 'admin']);
    if (subdomain && !reserved.has(subdomain)) {
      const url = req.nextUrl.clone();
      url.pathname = `/${subdomain}${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\.(?:png|jpg|jpeg|gif|svg|ico|css|js|map|txt)$).*)'],
};


