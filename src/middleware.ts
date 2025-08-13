import { NextResponse, type NextRequest } from 'next/server';

// AWS Amplify compatible middleware - simplified for better compatibility
export function middleware(req: NextRequest) {
  try {
    const primaryDomain = process.env.PRIMARY_DOMAIN || 'youragent.cloud9digital.in';
    const host = req.headers.get('host') || '';
    const hostname = host.split(':')[0];

    // Skip rewrites for Next internals, static, and API
    const { pathname } = req.nextUrl;
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/robots.txt') ||
      pathname.startsWith('/sitemap') ||
      pathname.startsWith('/.well-known')
    ) {
      return NextResponse.next();
    }

    // If request is for apex domain exactly, do nothing
    if (hostname === primaryDomain) {
      return NextResponse.next();
    }

    // Handle subdomain only when hostname ends with ".{primaryDomain}"
    if (hostname.endsWith(`.${primaryDomain}`)) {
      const prefix = hostname.slice(0, -(primaryDomain.length + 1));
      const subdomain = prefix.split('.')[0] || '';
      const reserved = new Set(['', 'www', 'app', 'admin']);
      
      if (subdomain && !reserved.has(subdomain)) {
        const url = req.nextUrl.clone();
        url.pathname = `/${subdomain}${pathname}`;
        return NextResponse.rewrite(url);
      }
    }

    return NextResponse.next();
  } catch (error) {
    // AWS Amplify middleware error handling - return next() on error
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!.*\.(?:png|jpg|jpeg|gif|svg|ico|css|js|map|txt)$).*)'],
};


