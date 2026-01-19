# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Reference

**Database Access**: Use MCP server configured in `.claude/.mcp.json` for Supabase database operations
**Package Manager**: `pnpm` (uses catalog mode - see `pnpm-workspace.yaml`)
**Next.js Version**: 16.0.10
**React Version**: 19.2.3
**TypeScript**: Strict mode enabled
**Path Aliases**: `@/*` maps to `./src/*`, `@/public/*` maps to `./public/*`

---

# Implementation Best Practices

## 0 — Purpose

These rules ensure maintainability, safety, and developer velocity.
**MUST** rules are enforced by CI; **SHOULD** rules are strongly recommended.

---

## 1 — Before Coding

- **BP-1 (MUST)** Ask the user clarifying questions.
- **BP-2 (SHOULD)** Draft and confirm an approach for complex work.
- **BP-3 (SHOULD)** If ≥ 2 approaches exist, list clear pros and cons.

---

## 2 — While Coding

- **C-1 (MUST)** Follow TDD: scaffold stub -> write failing test -> implement.
- **C-2 (MUST)** Name functions with existing domain vocabulary for consistency.
- **C-3 (SHOULD NOT)** Introduce classes when small testable functions suffice.
- **C-4 (SHOULD)** Prefer simple, composable, testable functions.
- **C-5 (MUST)** Prefer branded `type`s for IDs
  ```ts
  type UserId = Brand<string, 'UserId'>   // ✅ Good
  type UserId = string                    // ❌ Bad
  ```
- **C-6 (MUST)** Use `import type { … }` for type-only imports.
- **C-7 (SHOULD NOT)** Add comments except for critical caveats; rely on self‑explanatory code.
- **C-8 (SHOULD)** Default to `type`; use `interface` only when more readable or interface merging is required.
- **C-9 (SHOULD NOT)** Extract a new function unless it will be reused elsewhere, is the only way to unit-test otherwise untestable logic, or drastically improves readability of an opaque block.

---

## 3 — Testing

- **T-1 (MUST)** For a simple function, colocate unit tests in `*.test.ts` in same directory as source file.
- **T-2 (MUST)** For any API change, add/extend integration tests in `/tests/e2e/*.e2e.ts`.
- **T-3 (MUST)** ALWAYS separate pure-logic unit tests from integration tests.
- **T-4 (SHOULD)** Prefer integration tests over heavy mocking.
- **T-5 (SHOULD)** Unit-test complex algorithms thoroughly.
- **T-6 (SHOULD)** Test the entire structure in one assertion if possible
  ```ts
  expect(result).toBe([value]) // Good

  expect(result).toHaveLength(1); // Bad
  expect(result[0]).toBe(value); // Bad
  ```

---

## 4 — Database

- **D-1 (MUST)** Use Drizzle ORM for database operations - schema defined in `src/models/Schema.ts`
- **D-2 (MUST)** For Supabase operations, use `src/libs/Supabase.ts` which provides `getSupabaseAdmin()` and `userOperations`
- **D-3 (MUST)** Use Clerk for authentication - accessed via `@clerk/nextjs/server` in server components
- **D-4 (MUST)** All user data must be scoped to authenticated user via Clerk's `auth()` or `currentUser()`

---

## 5 — Code Organization

- **O-1 (MUST)** Place shared utilities in `src/utils/` and shared components in `src/components/`
- **O-2 (MUST)** Use `src/libs/` for third-party library configurations and integrations
- **O-3 (MUST)** Place blog content in `src/blog/` directory
- **O-4 (MUST)** Use `@/` path alias for all internal imports (e.g., `import { Env } from '@/libs/Env'`)

---

## 6 — Tooling Gates

- **G-1 (MUST)** ESLint passes - run `pnpm run lint` or `pnpm run lint:fix`
- **G-2 (MUST)** TypeScript compilation passes - run `pnpm run check:types`
- **G-3 (SHOULD)** Run `pnpm test` to ensure tests pass
- **G-4 (SHOULD)** Validate dependencies with `pnpm run check:deps` (Knip)

---

## 7 - Git

- **GH-1 (MUST)** Use Conventional Commits format: https://www.conventionalcommits.org/en/v1.0.0
- **GH-2 (SHOULD NOT)** Refer to Claude or Anthropic in commit messages
- **GH-3 (MUST)** Lefthook runs automatically on pre-commit (lint + type check) and commit-msg (commitlint)

---

## 8 — Motion Design

### Animation System
- **A-1 (MUST)** Use Framer Motion for all declarative animations
- **A-2 (MUST)** Import motion config from `@/libs/motion-config` for consistent timing and easing
- **A-3 (MUST)** Add `useReducedMotion` check to all animated components for accessibility
- **A-4 (SHOULD)** Use GPU-accelerated properties only (transform, opacity)
- **A-5 (SHOULD NOT)** Animate layout properties (width, height, top, left) - use transform instead

### Motion Configuration
```typescript
import { MOTION } from '@/libs/motion-config';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Standard animation pattern
const reducedMotion = useReducedMotion();

<motion.div
  initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
  whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-50px' }}
  transition={
    reducedMotion
      ? { duration: 0 }
      : {
          duration: MOTION.duration.slow,
          ease: MOTION.easing.default,
        }
  }
>
  {children}
</motion.div>
```

### Animation Patterns
- **Entry**: `{ opacity: 0, y: 20 }` → `{ opacity: 1, y: 0 }`
- **Exit**: `{ opacity: 1, y: 0 }` → `{ opacity: 0, y: -20 }`
- **Hover Scale**: `whileHover={{ scale: 1.05 }}`
- **Tap Feedback**: `whileTap={{ scale: 0.95 }}` or `active:scale-95` CSS class
- **Stagger**: Use `delay: index * MOTION.stagger.cards`

### Performance Guidelines
- **P-1 (MUST)** Use specific CSS transition properties, never `transition-all`
  ```typescript
  // ✅ Good
  transition-[background-color,border-color,color,opacity]

  // ❌ Bad
  transition-all
  ```
- **P-2 (MUST)** Set `viewport={{ once: true }}` on scroll-triggered animations
- **P-3 (SHOULD)** Use `AnimatePresence` with `mode="wait"` for page transitions
- **P-4 (SHOULD)** Keep animations under 500ms duration for perceived performance
- **P-5 (SHOULD NOT)** Animate more than 5 elements simultaneously

### Accessibility Requirements
- **AC-1 (MUST)** Check `useReducedMotion()` in all components with motion
- **AC-2 (MUST)** Disable all non-essential animations when `prefers-reduced-motion` is set
  - Use `undefined` (not `false`) for animation props when reduced motion is enabled
  - Pattern: `initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}`
- **AC-3 (SHOULD)** Provide instant state changes as fallback (duration: 0)
- **AC-4 (SHOULD)** Keep essential animations (progress indicators) but reduce intensity

### Interactive Feedback
- **I-1 (SHOULD)** Add `whileTap={{ scale: 0.98 }}` to clickable cards and large buttons
- **I-2 (SHOULD)** Add `whileHover={{ scale: 1.05 }}` to play buttons and primary CTAs
- **I-3 (SHOULD)** Use `active:scale-95` CSS class for links and nav items
- **I-4 (SHOULD NOT)** Add haptic feedback to elements that already animate via other means

### Common Mistakes to Avoid
- ❌ Using `transition-all` (causes performance issues)
- ❌ Animating without checking `useReducedMotion`
- ❌ Forgetting `AnimatePresence` for exit animations
- ❌ Missing `viewport={{ once: true }}` on scroll animations
- ❌ Animating width/height instead of scale
- ❌ Over-animating (too many simultaneous motions)
- ❌ Animation durations > 700ms (feels sluggish)

### Testing Animations
- Run `pnpm run lint` to catch `transition-all` usage
- Check browser DevTools Performance tab for 60 FPS
- Test with "Prefers Reduced Motion" enabled in OS settings
- Use `animation-performance-audit.md` checklist for comprehensive testing

### Resources
- Motion Config: `src/libs/motion-config.ts`
- Reduced Motion Hook: `src/hooks/useReducedMotion.ts`
- Performance Audit: `animation-performance-audit.md`
- Design Audit: `motion-review.md`
- Framer Motion Docs: https://www.framer.com/motion/

---

# Writing Functions Best Practices

When evaluating whether a function you implemented is good or not, use this checklist:

1. Can you read the function and HONESTLY easily follow what it's doing? If yes, then stop here.
2. Does the function have very high cyclomatic complexity? (number of independent paths, or, in a lot of cases, number of nesting if if-else as a proxy). If it does, then it's probably sketchy.
3. Are there any common data structures and algorithms that would make this function much easier to follow and more robust? Parsers, trees, stacks / queues, etc.
4. Are there any unused parameters in the function?
5. Are there any unnecessary type casts that can be moved to function arguments?
6. Is the function easily testable without mocking core features (e.g. sql queries, redis, etc.)? If not, can this function be tested as part of an integration test?
7. Does it have any hidden untested dependencies or any values that can be factored out into the arguments instead? Only care about non-trivial dependencies that can actually change or affect the function.
8. Brainstorm 3 better function names and see if the current name is the best, consistent with rest of codebase.

IMPORTANT: you SHOULD NOT refactor out a separate function unless there is a compelling need, such as:
  - the refactored function is used in more than one place
  - the refactored function is easily unit testable while the original function is not AND you can't test it any other way
  - the original function is extremely hard to follow and you resort to putting comments everywhere just to explain it

# Writing Tests Best Practices

When evaluating whether a test you've implemented is good or not, use this checklist:

1. SHOULD parameterize inputs; never embed unexplained literals such as 42 or "foo" directly in the test.
2. SHOULD NOT add a test unless it can fail for a real defect. Trivial asserts (e.g., expect(2).toBe(2)) are forbidden.
3. SHOULD ensure the test description states exactly what the final expect verifies. If the wording and assert don't align, rename or rewrite.
4. SHOULD compare results to independent, pre-computed expectations or to properties of the domain, never to the function's output re-used as the oracle.
5. SHOULD follow the same lint, type-safety, and style rules as prod code (ESLint, strict types).
6. SHOULD express invariants or axioms (e.g., commutativity, idempotence, round-trip) rather than single hard-coded cases whenever practical. Use `fast-check` library if beneficial.
7. Unit tests for a function should be grouped under `describe(functionName, () => ...`.
8. Use `expect.any(...)` when testing for parameters that can be anything (e.g. variable ids).
9. ALWAYS use strong assertions over weaker ones e.g. `expect(x).toEqual(1)` instead of `expect(x).toBeGreaterThanOrEqual(1)`.
10. SHOULD test edge cases, realistic input, unexpected input, and value boundaries.
11. SHOULD NOT test conditions that are caught by the type checker.

---

# Code Organization

This is a **Next.js 16 application** using the App Router with the following structure:

```
/home/user/Speasy-app/
├── .claude/                    # Claude Code configuration
│   ├── .mcp.json              # MCP servers (Supabase, Pipedream)
│   ├── agents/                # Custom agents
│   └── commands/              # Slash commands
├── .github/                   # GitHub Actions workflows
│   ├── actions/               # Reusable actions
│   └── workflows/             # CI/CD workflows
├── migrations/                # Drizzle ORM migrations
├── public/                    # Static assets
│   ├── assets/               # Images, fonts, etc.
│   ├── sw.js                 # Service worker (PWA)
│   ├── manifest.json         # PWA manifest
│   └── offline.html          # Offline fallback
├── scripts/                   # Build and utility scripts
├── src/
│   ├── app/                  # Next.js 16 App Router
│   │   ├── [locale]/         # Internationalized routes
│   │   │   ├── (auth)/       # Auth routes (sign-in, sign-up, dashboard)
│   │   │   │   ├── (center)/ # Centered auth pages
│   │   │   │   └── dashboard/# Protected dashboard
│   │   │   └── (marketing)/  # Public marketing pages
│   │   │       ├── page.tsx  # Landing page
│   │   │       ├── about/    # About page
│   │   │       ├── blog/     # Blog listing and posts
│   │   │       ├── content/  # Content detail pages
│   │   │       ├── manifesto/# Manifesto page
│   │   │       ├── original/ # Original content
│   │   │       └── portfolio/# Portfolio pages
│   │   ├── api/              # API routes
│   │   │   ├── feeds/        # RSS/Podcast feed generation
│   │   │   ├── push/         # Push notification endpoints
│   │   │   ├── users/        # User sync endpoints
│   │   │   └── webhooks/     # Webhook handlers (Clerk, Stripe)
│   │   ├── offline/          # Offline page
│   │   ├── global-error.tsx  # Global error handler
│   │   ├── manifest.ts       # PWA manifest generator
│   │   ├── robots.ts         # robots.txt generator
│   │   └── sitemap.ts        # sitemap.xml generator
│   ├── blog/                 # Blog markdown content
│   ├── components/           # React components
│   │   ├── ui/              # Base UI components (shadcn/ui)
│   │   ├── analytics/       # Analytics components
│   │   ├── audio/           # Audio player components
│   │   └── pwa/             # PWA-specific components
│   ├── hooks/                # Custom React hooks
│   ├── libs/                 # Third-party library configs
│   │   ├── Arcjet.ts        # Arcjet security client
│   │   ├── Env.ts           # Environment variable validation
│   │   ├── I18n.ts          # Internationalization config
│   │   ├── Logger.ts        # LogTape logger setup
│   │   ├── Supabase.ts      # Supabase client and operations
│   │   ├── blog.ts          # Blog utilities
│   │   ├── feed-generator.ts# RSS/Podcast feed generator
│   │   └── server-only.ts   # Server-only utilities
│   ├── locales/              # Translation files
│   │   ├── en.json          # English
│   │   └── fr.json          # French
│   ├── models/               # Database models
│   │   └── Schema.ts        # Drizzle ORM schema
│   ├── styles/               # Global styles
│   ├── templates/            # Page templates
│   ├── types/                # TypeScript type definitions
│   └── utils/                # Utility functions
│       ├── AppConfig.ts     # App configuration
│       ├── DBConnection.ts  # Database connection helper
│       └── Helpers.ts       # General helpers
├── tests/
│   └── e2e/                  # Playwright E2E tests
│       └── *.e2e.ts         # E2E test files
│       └── *.check.e2e.ts   # Checkly monitoring tests
├── middleware.ts             # Next.js middleware (Clerk, Arcjet, i18n)
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── vitest.config.mts         # Vitest test configuration
├── playwright.config.ts      # Playwright E2E config
├── lefthook.yml              # Git hooks configuration
├── pnpm-workspace.yaml       # pnpm catalog configuration
└── package.json              # Dependencies and scripts
```

## Architecture Overview

### Next.js 16 App Router Structure

- **`src/app/[locale]`**: Internationalized routes using next-intl
  - **`(auth)`**: Authentication and protected routes
    - **`(center)`**: Centered layout for sign-in/sign-up pages
    - **`dashboard`**: Protected dashboard area requiring authentication
  - **`(marketing)`**: Public marketing pages (landing, about, blog, etc.)
- **`src/app/api`**: API routes for webhooks, feeds, user sync, push notifications
- **`src/app/offline`**: PWA offline fallback page

### Authentication & Authorization

**Primary Auth**: Clerk (`@clerk/nextjs`)
- Middleware: `src/middleware.ts` handles auth routing
- Protected routes: Match pattern `/dashboard(.*)` and `/:locale/dashboard(.*)`
- Auth pages: `/sign-in`, `/sign-up` and localized versions
- Server auth: Use `auth()` from `@clerk/nextjs/server` in Server Components
- Client auth: Use `useAuth()`, `useUser()` from `@clerk/nextjs`

```typescript
// Server Component
import { auth, currentUser } from '@clerk/nextjs/server';

export default async function Page() {
  const { userId } = await auth();
  const user = await currentUser();
  // ...
}

// API Route
import { auth } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }
  // ...
}
```

### Database

**ORM**: Drizzle ORM (`drizzle-orm`)
- Schema: `src/models/Schema.ts`
- Local dev: PGlite (file-based `local.db`)
- Production: PostgreSQL
- Migrations: Auto-applied via `instrumentation.ts` or manual `pnpm run db:migrate`

**Supabase** (Optional):
- Used for specific features requiring Supabase
- Admin client: `getSupabaseAdmin()` from `src/libs/Supabase.ts`
- User operations: `userOperations` object with CRUD methods
- MCP server configured in `.claude/.mcp.json` for database queries

```typescript
// Using Drizzle ORM
import { db } from '@/utils/DBConnection';
import { usersSchema } from '@/models/Schema';

// Using Supabase
import { getSupabaseAdmin, userOperations } from '@/libs/Supabase';

const supabase = getSupabaseAdmin();
const user = await userOperations.getUserByEmail(email);
```

### Key Integrations

#### Clerk (Authentication)
- **Middleware**: `src/middleware.ts` - Route protection and auth flow
- **Webhooks**: `src/app/api/webhooks/clerk/route.ts` - User sync webhook
- **Env vars**: `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

#### Supabase (Optional Database)
- **Client**: `src/libs/Supabase.ts` - Admin client and user operations
- **MCP**: `.claude/.mcp.json` - Database access for AI assistant
- **Env vars**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (optional)

#### Arcjet (Security)
- **Client**: `src/libs/Arcjet.ts`
- **Middleware**: Bot detection and WAF protection
- **Env vars**: `ARCJET_KEY` (optional)

#### Stripe (Payments - Optional)
- **Webhooks**: `src/app/api/webhooks/stripe/route.ts`
- **Env vars**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`

#### Sentry (Error Monitoring)
- **Config**: `next.config.ts` - Conditionally enabled
- **Env vars**: `SENTRY_ORGANIZATION`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`
- **Dev**: Spotlight at `http://localhost:8969`

#### PostHog (Analytics)
- **Env vars**: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`

#### LogTape (Logging)
- **Config**: `src/libs/Logger.ts`
- **Production**: Better Stack integration
- **Env vars**: `NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN`, `NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST`

### UI Components

- **Base components**: `src/components/ui/` - Shadcn/ui components (button, card, select, badge)
- **Radix UI**: Headless UI primitives for accessible components
- **Tailwind CSS 4**: Utility-first CSS framework
- **Theming**: `next-themes` for dark/light mode support
- **Icons**: `lucide-react`
- **Fonts**: Geist font family

### Internationalization (i18n)

- **Library**: `next-intl`
- **Config**: `src/libs/I18n.ts`, `src/libs/I18nRouting.ts`, `src/libs/I18nNavigation.ts`
- **Locales**: `src/locales/en.json`, `src/locales/fr.json`
- **Supported**: English (en), French (fr)
- **Route structure**: `/[locale]/...` for all pages

### PWA Support

- **Service Worker**: `public/sw.js`
- **Manifest**: Generated via `src/app/manifest.ts`
- **Offline**: `src/app/offline/page.tsx`
- **Components**: `src/components/pwa/`

### Security & Validation

- **Arcjet**: Bot detection and WAF in `src/middleware.ts`
- **Env validation**: Type-safe env vars via `@t3-oss/env-nextjs` in `src/libs/Env.ts`
- **CSRF**: Handled by Next.js and Clerk
- **Webhooks**: Validated via Clerk and Stripe webhook signatures

---

# Common Commands

### Development
```bash
pnpm run dev              # Start dev server with PGlite + Sentry Spotlight
pnpm run dev:next         # Start only Next.js dev server
pnpm run dev:spotlight    # Start Sentry Spotlight
pnpm run build            # Production build
pnpm run build-local      # Build with in-memory database (for testing)
pnpm run start            # Start production server
```

### Code Quality
```bash
pnpm run lint             # Run ESLint
pnpm run lint:fix         # Auto-fix ESLint issues
pnpm run check:types      # TypeScript type checking
pnpm run check:deps       # Check unused dependencies (Knip)
```

### Testing
```bash
pnpm test                 # Run Vitest unit tests
pnpm run test:e2e         # Run Playwright E2E tests
```

### Database
```bash
pnpm run db:generate      # Generate migration from schema changes
pnpm run db:migrate       # Apply migrations
pnpm run db:studio        # Open Drizzle Studio
pnpm run db-server:file   # Start PGlite server (file-based)
pnpm run db-server:memory # Start PGlite server (in-memory)
```

### Other
```bash
pnpm run build-stats      # Analyze bundle size
pnpm run commit           # Interactive conventional commit
pnpm run clean            # Remove build artifacts
```

---

# Testing Infrastructure

### Vitest Configuration

The project uses Vitest with two test projects:

1. **Unit tests** (`*.test.ts`):
   - Environment: Node.js
   - Location: Co-located with source files (e.g., `src/utils/Helpers.test.ts`)
   - Exclude: React hooks and component tests

2. **UI tests** (`*.test.tsx` and hooks):
   - Environment: Browser (Playwright provider)
   - Location: Component files and `src/hooks/`
   - Browser: Chromium (headless)

```typescript
// Unit test example
import { describe, expect, test } from 'vitest';
import { helperFunction } from './Helpers';

describe('helperFunction', () => {
  test('should return expected value', () => {
    expect(helperFunction('input')).toBe('expected');
  });
});

// UI test example (*.test.tsx)
import { render, screen } from 'vitest-browser-react';
import { describe, expect, test } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  test('renders with text', async () => {
    render(<Button>Click me</Button>);
    await expect.element(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### E2E Tests

- **Framework**: Playwright
- **Location**: `tests/e2e/*.e2e.ts`
- **Monitoring**: `*.check.e2e.ts` files run on Checkly
- **Config**: `playwright.config.ts`

---

# Environment Variables

Validated via `@t3-oss/env-nextjs` in `src/libs/Env.ts`.

### Required
```bash
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
DATABASE_URL=postgresql://localhost:5433/postgres
```

### Optional - Services
```bash
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
SENTRY_ORGANIZATION=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=sntrys_...

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Arcjet
ARCJET_KEY=ajkey_...

# Better Stack (Logging)
NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN=...
NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST=in.logs.betterstack.com

# Other
OPENAI_KEY=sk-...
UNSPLASH_ACCESS_KEY=...
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
CLERK_WEBHOOK_SIGNING_SECRET=whsec_...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:...
```

---

# Remember Shortcuts

## QNEW
```
Understand all BEST PRACTICES listed in CLAUDE.md.
Your code SHOULD ALWAYS follow these best practices.
```

## QPLAN
```
Analyze similar parts of the codebase and determine whether your plan:
- is consistent with rest of codebase
- introduces minimal changes
- reuses existing code
```

## QCODE
```
Implement your plan and make sure your new tests pass.
Always run tests to make sure you didn't break anything else.
Always run ESLint to ensure code quality.
Always run TypeScript type checking.
```

## QCHECK
```
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR code change you introduced (skip minor changes):

1. CLAUDE.md checklist Writing Functions Best Practices.
2. CLAUDE.md checklist Writing Tests Best Practices.
3. CLAUDE.md checklist Implementation Best Practices.
```

## QCHECKF
```
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR function you added or edited (skip minor changes):

1. CLAUDE.md checklist Writing Functions Best Practices.
```

## QCHECKT
```
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR test you added or edited (skip minor changes):

1. CLAUDE.md checklist Writing Tests Best Practices.
```

## QUX
```
Imagine you are a human UX tester of the feature you implemented.
Output a comprehensive list of scenarios you would test, sorted by highest priority.
```

## QGIT
```
Add all changes to staging, create a commit, and push to remote.

Follow this checklist for writing your commit message:
- MUST use Conventional Commits format
- MUST NOT refer to Claude or Anthropic
- Structure: <type>[optional scope]: <description>

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore
```

---

# Key Technical Details

### TypeScript Configuration
- **Strict mode**: Enabled with all strict checks
- **Additional checks**: `noUncheckedIndexedAccess`, `noImplicitReturns`, `noUnusedLocals`, `noUnusedParameters`
- **Path aliases**: `@/*` → `./src/*`, `@/public/*` → `./public/*`
- **Target**: ES2017
- **Module**: ESNext with bundler resolution

### ESLint Configuration
- **Base**: `@antfu/eslint-config` (v6.6.1)
- **Plugins**: Next.js, React, React Hooks, Tailwind CSS, JSX a11y, Playwright
- **Format**: Integrated with ESLint plugin for formatting

### Git Hooks (Lefthook)
- **pre-commit**: ESLint auto-fix + TypeScript type check
- **commit-msg**: Commitlint validation (Conventional Commits)

### Package Management
- **Manager**: pnpm with catalog mode
- **Catalog**: Centralized dependency versions in `pnpm-workspace.yaml`
- **Shell emulator**: Enabled for cross-platform compatibility

### Build & Performance
- **React Compiler**: Enabled (`reactCompiler: true`)
- **Turbopack**: File system cache enabled for dev
- **Bundle analyzer**: Available via `ANALYZE=true pnpm run build-stats`
- **Image optimization**: Remote patterns for Unsplash and Supabase

---

# Common Patterns

### Server Component with Auth
```typescript
import { auth, currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await currentUser();
  // Fetch user-specific data
  return <div>Dashboard for {user.firstName}</div>;
}
```

### API Route with Auth
```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Handle authenticated request
  return NextResponse.json({ success: true });
}
```

### Using Environment Variables
```typescript
import { Env } from '@/libs/Env';

// Env is type-safe and validated
const apiKey = Env.OPENAI_KEY; // string | undefined
const dbUrl = Env.DATABASE_URL; // string (required, always present)
```

### Database Query (Drizzle)
```typescript
import { db } from '@/utils/DBConnection';
import { usersSchema } from '@/models/Schema';
import { eq } from 'drizzle-orm';

const user = await db.select()
  .from(usersSchema)
  .where(eq(usersSchema.id, userId))
  .limit(1);
```

### Supabase User Operations
```typescript
import { userOperations } from '@/libs/Supabase';

// Get user by email
const user = await userOperations.getUserByEmail('user@example.com');

// Create or update user
const user = await userOperations.upsertUser('user@example.com', {
  stripe_customer_id: 'cus_xxx',
  subscription_status: 'active',
});
```

### Internationalization
```typescript
// Server Component
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}

// Client Component
'use client';
import { useTranslations } from 'next-intl';

export default function Component() {
  const t = useTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}
```

---

# Important Notes

- **No DAL layer**: This project does not use a Data Access Layer pattern. Use Clerk for auth and Drizzle/Supabase directly.
- **Clerk primary auth**: While Supabase is available, Clerk is the primary authentication system.
- **PGlite for local dev**: No need for external PostgreSQL in development - PGlite runs automatically.
- **Catalog dependencies**: Use `catalog:` prefix in `package.json` - versions defined in `pnpm-workspace.yaml`.
- **Service worker**: PWA functionality via `public/sw.js` - update carefully to avoid cache issues.
- **Blog content**: Stored as markdown in `src/blog/` and processed by `src/libs/blog.ts`.
- **Feed generation**: RSS/podcast feeds generated via `src/libs/feed-generator.ts` and `src/app/api/feeds/` routes.

---

# Troubleshooting

### Build fails with "Invalid environment variables"
Check `src/libs/Env.ts` for required environment variables. At minimum, you need:
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `DATABASE_URL`

### PGlite port already in use
Kill existing process: `lsof -ti:5433 | xargs kill -9`

### Tests fail with module errors
Ensure you're using correct test file extensions:
- Unit tests: `*.test.ts` (Node environment)
- UI tests: `*.test.tsx` (Browser environment)

### Type errors after dependency update
Run: `pnpm run check:types` to see all errors, then `rm -rf .next node_modules && pnpm install`

### Lefthook not running
Install hooks: `npx lefthook install`
