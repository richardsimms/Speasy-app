import type { NextFetchEvent, NextRequest } from 'next/server';
import { detectBot } from '@arcjet/next';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import arcjet from '@/libs/Arcjet';
import { routing } from './libs/I18nRouting';

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/:locale/dashboard(.*)',
  '/onboarding(.*)',
  '/:locale/onboarding(.*)',
]);

const isAuthPage = createRouteMatcher([
  '/sign-in(.*)',
  '/:locale/sign-in(.*)',
  '/sign-up(.*)',
  '/:locale/sign-up(.*)',
]);

// Improve security with Arcjet
const aj = arcjet.withRule(
  detectBot({
    mode: 'LIVE',
    // Block all bots except the following
    allow: [
      // See https://docs.arcjet.com/bot-protection/identifying-bots
      'CATEGORY:SEARCH_ENGINE', // Allow search engines
      'CATEGORY:PREVIEW', // Allow preview links to show OG images
      'CATEGORY:MONITOR', // Allow uptime monitoring services
    ],
  }),
);

// Currently, with database connections, Webpack is faster than Turbopack in production environment at runtime.
// Then, unfortunately, Webpack doesn't support `proxy.ts` on Vercel yet, here is the error: "Error: ENOENT: no such file or directory, lstat '/vercel/path0/.next/server/proxy.js'"
export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  // Skip Clerk middleware for webhook routes (they need to be public)
  const isWebhookRoute = request.nextUrl.pathname.startsWith('/api/webhooks');

  // Verify the request with Arcjet (skip for webhooks)
  if (!isWebhookRoute && process.env.ARCJET_KEY) {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // For webhook routes, skip Clerk middleware and i18n routing
  if (isWebhookRoute) {
    return NextResponse.next();
  }

  // Clerk keyless mode doesn't work with i18n, this is why we need to run the middleware conditionally
  if (isAuthPage(request) || isProtectedRoute(request)) {
    return clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        const locale
          = req.nextUrl.pathname.match(/(\/.*)\/dashboard/)?.at(1) ?? '';

        const signInUrl = new URL(`${locale}/sign-in`, req.url);

        await auth.protect({
          unauthenticatedUrl: signInUrl.toString(),
        });
      }

      return handleI18nRouting(req);
    })(request, event);
  }

  // For API routes that use Clerk (like /api/users/sync), we need Clerk middleware to run
  // but we don't need to protect them - they handle auth internally
  if (request.nextUrl.pathname.startsWith('/api')) {
    return clerkMiddleware()(request, event);
  }

  const response = handleI18nRouting(request);

  // Add pathname to headers for layout detection
  if (response) {
    response.headers.set('x-pathname', request.nextUrl.pathname);
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/_next`, `/_vercel` or `monitoring`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // Note: We include /api routes so Clerk middleware can run for routes using currentUser()
  matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
  runtime: 'nodejs',
};
