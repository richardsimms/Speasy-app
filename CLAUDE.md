# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

ALWAYS USE .claude/.mcp.json to access SUPABASE Database

# Claude Code Guidelines by Sabrina Ramonov

## Implementation Best Practices

### 0 — Purpose  

These rules ensure maintainability, safety, and developer velocity. 
**MUST** rules are enforced by CI; **SHOULD** rules are strongly recommended.

---

### 1 — Before Coding

- **BP-1 (MUST)** Ask the user clarifying questions.
- **BP-2 (SHOULD)** Draft and confirm an approach for complex work.  
- **BP-3 (SHOULD)** If ≥ 2 approaches exist, list clear pros and cons.

---

### 2 — While Coding

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

### 3 — Testing

- **T-1 (MUST)** For a simple function, colocate unit tests in `*.spec.ts` in same directory as source file.
- **T-2 (MUST)** For any API change, add/extend integration tests in `/tests/integration/*.spec.ts`.
- **T-3 (MUST)** ALWAYS separate pure-logic unit tests from DB-touching integration tests.
- **T-4 (SHOULD)** Prefer integration tests over heavy mocking.  
- **T-5 (SHOULD)** Unit-test complex algorithms thoroughly.
- **T-6 (SHOULD)** Test the entire structure in one assertion if possible
  ```ts
  expect(result).toBe([value]) // Good

  expect(result).toHaveLength(1); // Bad
  expect(result[0]).toBe(value); // Bad
  ```

---

### 4 — Database

- **D-1 (MUST)** All database access MUST go through the Data Access Layer (DAL) at `/lib/dal/`.
- **D-2 (MUST)** Use Supabase client patterns: `/utils/supabase/server.ts` for server components, `/utils/supabase/client.ts` for client components.
- **D-3 (MUST)** Never bypass DAL authentication checks - all data access must be user-scoped.

---

### 5 — Code Organization

- **O-1 (MUST)** Place shared utilities in `/lib/utils/` and shared components in `/components/`.
- **O-2 (MUST)** Use `/lib/services/` for external service integrations.
- **O-3 (MUST)** Keep mobile-specific code in `/mobile-app/` directory.

---

### 6 — Tooling Gates

- **G-1 (MUST)** `prettier --check` passes.  
- **G-2 (MUST)** `npm run lint` passes.
- **G-3 (MUST)** TypeScript compilation passes.
- **G-4 (SHOULD)** Run `npm test` to ensure tests pass.

---

### 7 - Git

- **GH-1 (MUST)** Use Conventional Commits format when writing commit messages: https://www.conventionalcommits.org/en/v1.0.0
- **GH-2 (SHOULD NOT)** Refer to Claude or Anthropic in commit messages.

---

## Writing Functions Best Practices

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

## Writing Tests Best Practices

When evaluating whether a test you've implemented is good or not, use this checklist:

1. SHOULD parameterize inputs; never embed unexplained literals such as 42 or "foo" directly in the test.
2. SHOULD NOT add a test unless it can fail for a real defect. Trivial asserts (e.g., expect(2).toBe(2)) are forbidden.
3. SHOULD ensure the test description states exactly what the final expect verifies. If the wording and assert don't align, rename or rewrite.
4. SHOULD compare results to independent, pre-computed expectations or to properties of the domain, never to the function's output re-used as the oracle.
5. SHOULD follow the same lint, type-safety, and style rules as prod code (prettier, ESLint, strict types).
6. SHOULD express invariants or axioms (e.g., commutativity, idempotence, round-trip) rather than single hard-coded cases whenever practical. Use `fast-check` library e.g.
```
import fc from 'fast-check';
import { describe, expect, test } from 'vitest';
import { getCharacterCount } from './string';

describe('properties', () => {
  test('concatenation functoriality', () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        (a, b) =>
          getCharacterCount(a + b) ===
          getCharacterCount(a) + getCharacterCount(b)
      )
    );
  });
});
```

7. Unit tests for a function should be grouped under `describe(functionName, () => ...`.
8. Use `expect.any(...)` when testing for parameters that can be anything (e.g. variable ids).
9. ALWAYS use strong assertions over weaker ones e.g. `expect(x).toEqual(1)` instead of `expect(x).toBeGreaterThanOrEqual(1)`.
10. SHOULD test edge cases, realistic input, unexpected input, and value boundaries.
11. SHOULD NOT test conditions that are caught by the type checker.

## Code Organization

This is a **Next.js 15 application** (not a monorepo) with the following structure:

- `/app/` - Next.js 15 App Router application
  - `/app/(app)/` - Authenticated routes (dashboard, content, player, settings, onboarding)
  - `/app/(pages)/` - Public marketing routes (about, blog, FAQ, privacy)
  - `/app/api/` - API routes (auth, webhooks, analytics, feeds)
- `/components/` - React components
  - `/components/ui/` - Shadcn/UI base components
  - `/components/sections/` - Landing page sections
  - `/components/analytics/` - Dashboard analytics components
  - `/components/player/` - Audio player components
- `/lib/` - Core application logic
  - `/lib/dal/` - **Data Access Layer (CRITICAL - see below)**
  - `/lib/services/` - External service integrations
  - `/lib/utils/` - Utility functions
- `/tests/` - Test files
  - `/tests/integration/` - API and integration tests
  - `/tests/unit/` - Unit tests for utilities
- `/mobile-app/` - React Native Expo mobile application

## Remember Shortcuts

Remember the following shortcuts which the user may invoke at any time.

### QNEW

When I type "qnew", this means:

```
Understand all BEST PRACTICES listed in CLAUDE.md.
Your code SHOULD ALWAYS follow these best practices.
```

### QPLAN
When I type "qplan", this means:
```
Analyze similar parts of the codebase and determine whether your plan:
- is consistent with rest of codebase
- introduces minimal changes
- reuses existing code
```

## QCODE

When I type "qcode", this means:

```
Implement your plan and make sure your new tests pass.
Always run tests to make sure you didn't break anything else.
Always run `prettier` on the newly created files to ensure standard formatting.
Always run `npm run lint` to make sure type checking and linting passes.
```

### QCHECK

When I type "qcheck", this means:

```
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR code change you introduced (skip minor changes):

1. CLAUDE.md checklist Writing Functions Best Practices.
2. CLAUDE.md checklist Writing Tests Best Practices.
3. CLAUDE.md checklist Implementation Best Practices.
```

### QCHECKF

When I type "qcheckf", this means:

```
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR function you added or edited (skip minor changes):

1. CLAUDE.md checklist Writing Functions Best Practices.
```

### QCHECKT

When I type "qcheckt", this means:

```
You are a SKEPTICAL senior software engineer.
Perform this analysis for every MAJOR test you added or edited (skip minor changes):

1. CLAUDE.md checklist Writing Tests Best Practices.
```

### QUX

When I type "qux", this means:

```
Imagine you are a human UX tester of the feature you implemented. 
Output a comprehensive list of scenarios you would test, sorted by highest priority.
```

### QGIT

When I type "qgit", this means:

```
Add all changes to staging, create a commit, and push to remote.

Follow this checklist for writing your commit message:
- SHOULD use Conventional Commits format: https://www.conventionalcommits.org/en/v1.0.0
- SHOULD NOT refer to Claude or Anthropic in the commit message.
- SHOULD structure commit message as follows:
<type>[optional scope]: <description>
[optional body]
[optional footer(s)]
- commit SHOULD contain the following structural elements to communicate intent: 
fix: a commit of the type fix patches a bug in your codebase (this correlates with PATCH in Semantic Versioning).
feat: a commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in Semantic Versioning).
BREAKING CHANGE: a commit that has a footer BREAKING CHANGE:, or appends a ! after the type/scope, introduces a breaking API change (correlating with MAJOR in Semantic Versioning). A BREAKING CHANGE can be part of commits of any type.
types other than fix: and feat: are allowed, for example @commitlint/config-conventional (based on the Angular convention) recommends build:, chore:, ci:, docs:, style:, refactor:, perf:, test:, and others.
footers other than BREAKING CHANGE: <description> may be provided and follow a convention similar to git trailer format.
```

## Common Commands

### Development
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Vitest tests

### Testing
- `npm test` - Run Vitest tests
- Test setup: Uses Vitest with happy-dom environment
- Integration tests located in `/tests/integration/`
- Unit tests located in `/tests/unit/`

### Storybook
- `npm run storybook` - Start Storybook development server on port 6006
- `npm run build-storybook` - Build Storybook for production

### Mobile Development
- `npx expo start` - Start React Native development server (from `/mobile-app/`)

## Architecture Overview

### Next.js 15 App Router Structure
- **`/app`**: Main application with two route groups:
  - **`(app)`**: Authenticated user dashboard pages (dashboard, content, player, settings, onboarding)
  - **`(pages)`**: Public marketing pages (about, blog, FAQ, privacy, terms)
- **App Router**: Uses Next.js 15 App Router with server components
- **Authentication**: Required for all routes under `(app)` group

### Data Access Layer (DAL)
**CRITICAL**: All database access MUST go through the DAL at `/lib/dal/`.

```typescript
import { dal } from '@/lib/dal';

// Get user's content
const content = await dal.content.getUserContent();

// Get authenticated user
const user = await dal.auth.getAuthenticatedUser();
```

The DAL ensures:
- User authentication before data access
- Users only access their own data
- Subscription requirements are enforced
- Proper authorization for all queries

### Key Integrations

#### Supabase (Database & Auth)
- **Client**: Uses `/utils/supabase/client.ts` for client components
- **Server**: Uses `/utils/supabase/server.ts` for server components
- **Middleware**: Session refresh handled in `/middleware.ts`
- **Legacy Support**: `/lib/supabase.ts` provides backward compatibility

#### Stripe (Payments)
- Subscription payments with webhooks at `/api/webhooks/stripe/route.ts`
- Environment variables required: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`

#### UI Components
- **Radix UI**: Extensive use of Radix primitives
- **Tailwind CSS**: Utility-first styling with custom theme
- **Shadcn/UI**: Component system in `/components/ui/`
- **Theme Support**: Dark/light mode via `next-themes`

### Security & Validation
- **CSRF Protection**: Implemented in `/middleware/csrf.ts`
- **Security Monitoring**: Logging and monitoring in `/lib/security-monitoring.ts`
- **Input Validation**: Zod schemas in `/lib/schemas.ts` and `/lib/validation.ts`

### Key Services
- **Audio Processing**: Audio player components and waveform visualization
- **Feed Generation**: RSS/podcast feed generation in `/lib/feed-generator.ts`
- **Email**: Resend integration for transactional emails
- **Analytics**: Vercel Analytics and custom analytics tracking

### Mobile App
- React Native Expo app in `/mobile-app/` directory
- `npx expo start` - Start development server on localhost:8081
- Shares authentication and API with web app
- Offline audio playback capabilities

### Important Notes
- **Next.js 15 Compatibility**: Uses modern Supabase client patterns
- **TypeScript**: Strict TypeScript configuration
- **Build Configuration**: ESLint and TypeScript errors ignored during builds (see `next.config.mjs`)
- **Font Loading**: Custom Eudoxus Sans font with variable weight support
- **PWA Support**: Service worker and manifest configured


### Important Documents
- Tasks that have been done ~/tasks
- Tests that need to pass ~/tests
- Important documents ~/docs
- Business model and speasy purpose ~/docs/speasy

---

## Technical Debt Prevention and Quality Assurance

Based on comprehensive technical debt remediation completed in 2025, this section outlines proven prevention strategies and quality assurance practices.

### 8 — Quality Gates and Prevention

**CRITICAL**: The following quality gates are enforced automatically to prevent technical debt accumulation:

- **QG-1 (MUST)** Pre-commit hooks execute automatically on every commit attempt.
- **QG-2 (MUST)** Console statements are blocked in non-script files (use structured logging via `/lib/logger.ts`).
- **QG-3 (MUST)** All files are automatically formatted with Prettier before commit.
- **QG-4 (MUST)** ESLint issues are fixed automatically where possible, blocks commit if manual fixes needed.
- **QG-5 (MUST)** Tests must pass before commit (use `pnpm test` for verification).
- **QG-6 (MUST)** TypeScript compilation must succeed before commit (use `pnpm run typecheck`).
- **QG-7 (SHOULD)** Bundle size increases >15% trigger CI warnings and require justification.
- **QG-8 (MUST)** Security vulnerabilities of moderate+ severity block CI/CD pipeline.

#### Console Statement Policy
```typescript
// ❌ Prohibited in production code
console.log('Debug info');
console.error('Error occurred');

// ✅ Required structured logging
import { log } from '@/lib/logger';
log.debug('Debug info');
log.error('Error occurred');

// ✅ Exception: Scripts directory (allowed for CLI output)
// scripts/build-check.js - console.log() permitted for script output
```

#### Quality Gates Bypass (Emergency Only)
```bash
# Only use in critical production incidents
git commit --no-verify -m "emergency: critical production fix"

# MUST follow up within 24 hours with proper fix
git commit -m "fix: resolve quality gate issues from emergency commit"
```

### 9 — Performance and Bundle Management

- **P-1 (MUST)** Bundle size target is <650kB first load JS (current: ~765kB acceptable).
- **P-2 (SHOULD)** Core Web Vitals must meet "Good" thresholds: FCP <1.5s, LCP <2.5s, FID <100ms, CLS <0.1.
- **P-3 (MUST)** Performance monitoring is active on all pages via `/lib/performance-monitor.ts`.
- **P-4 (SHOULD)** Heavy components use dynamic imports with `React.lazy()` and `Suspense`.
- **P-5 (MUST)** Images use `next/image` with proper optimization (AVIF/WebP formats).
- **P-6 (SHOULD)** Bundle analysis runs automatically in CI/CD to detect regressions.

#### Performance Budget Enforcement
```typescript
// Automatic performance budget validation
const PERFORMANCE_BUDGET = {
  FCP: 1500,  // 1.5 seconds
  LCP: 2500,  // 2.5 seconds  
  FID: 100,   // 100 milliseconds
  CLS: 0.1,   // 0.1 score
  TTFB: 600   // 600 milliseconds
};

// Usage in components
import { performanceMonitor } from '@/lib/performance-monitor';
performanceMonitor.startMeasure('component-name');
// ... component logic
performanceMonitor.endMeasure('component-name');
```

### 10 — Dependency Management and Security

- **DM-1 (MUST)** Dependabot automatically creates security update PRs weekly.
- **DM-2 (MUST)** High/critical vulnerabilities must be addressed within 24 hours.
- **DM-3 (SHOULD)** Major dependency updates require dedicated testing sprint with rollback plan.
- **DM-4 (MUST)** Package-lock file (`pnpm-lock.yaml`) is committed and verified in CI.
- **DM-5 (SHOULD)** New dependencies must be justified and documented for supply chain security.

#### Dependency Update Strategy
| Update Type | Risk Level | Process | Timeline |
|-------------|------------|---------|----------|
| **Patch (x.y.Z)** | Low | Auto-merge after CI | Immediate |
| **Minor (x.Y.z)** | Medium | Manual review + testing | 48 hours |
| **Major (X.y.z)** | High | Dedicated sprint | 1-2 weeks |

### 11 — Import Path Consistency

**CRITICAL**: Import path consistency prevents test failures and build issues.

- **IP-1 (MUST)** Use `@/` prefix for all internal imports: `import { util } from '@/lib/utils/util'`.
- **IP-2 (MUST)** Never mix `@/utils/` and `utils/` patterns in the same file.
- **IP-3 (MUST)** Use `import type { ... }` for type-only imports (enforced by ESLint).
- **IP-4 (SHOULD)** Configure IDE to suggest `@/` prefix for auto-imports.

```typescript
// ❌ Inconsistent import patterns (causes test failures)
import { isDemoMode } from 'utils/demo-helpers';
import { otherUtil } from '@/lib/utils/other';

// ✅ Consistent import patterns
import { isDemoMode } from '@/utils/demo-helpers';
import { otherUtil } from '@/lib/utils/other';
import type { User } from '@/types/user';
```

### 12 — Testing Infrastructure Standards

Based on test infrastructure remediation, follow these patterns:

- **TI-1 (MUST)** Mock server-only modules in `tests/setup.ts` for client-side test execution.
- **TI-2 (MUST)** Use Vitest patterns, not Jest patterns: `import { vi } from 'vitest'` not `jest.fn()`.
- **TI-3 (MUST)** Separate client and server tests to avoid module execution conflicts.
- **TI-4 (SHOULD)** Use current Supabase auth patterns, not deprecated `@supabase/auth-helpers-nextjs`.

#### Test Organization Best Practices
```typescript
// Unit tests - co-located with source
// components/my-component.spec.ts

// Integration tests - dedicated directory  
// tests/integration/api-endpoints.spec.ts

// Server-only test mocking
// tests/setup.ts
vi.mock('server-only', () => ({}));
vi.mock('@/lib/dal/auth', () => ({
  getAuthenticatedUser: vi.fn().mockResolvedValue({ id: 'test-user' }),
}));
```

### 13 — Structured Logging Standards

**CRITICAL**: Console statements in production code are automatically blocked by quality gates.

- **SL-1 (MUST)** Use Pino logger from `/lib/logger.ts` for all application logging.
- **SL-2 (MUST)** Never use `console.log()`, `console.error()`, `console.warn()` in production code.
- **SL-3 (SHOULD)** Use appropriate log levels: `debug`, `info`, `warn`, `error`.
- **SL-4 (SHOULD)** Include contextual information in log messages for debugging.

```typescript
// ❌ Blocked by pre-commit hooks
console.log('User logged in');

// ✅ Required structured logging
import { log } from '@/lib/logger';
log.info('User authenticated', { userId, timestamp: Date.now() });
log.error('Authentication failed', { error: error.message, userId });
```

### 14 — React and Next.js Patterns

Updated patterns based on Next.js 15 and React 19 compatibility:

- **RN-1 (MUST)** Use Next.js `<Link>` components instead of `<a>` tags for internal navigation.
- **RN-2 (MUST)** Use `next/image` instead of `<img>` tags for optimized loading.
- **RN-3 (SHOULD)** Remove ESLint suppressions by fixing underlying issues, not ignoring them.
- **RN-4 (MUST)** Include all dependencies in React Hook dependency arrays (enforced by ESLint).
- **RN-5 (SHOULD)** Use Server Components by default, Client Components only when needed.

```typescript
// ❌ Unoptimized navigation and images
<a href="/dashboard">Dashboard</a>
<img src="/hero.jpg" alt="Hero" />

// ✅ Optimized Next.js patterns
<Link href="/dashboard">Dashboard</Link>
<Image src="/hero.jpg" alt="Hero" width={800} height={400} priority />
```

## Lessons Learned from Technical Debt Remediation

### Critical Success Factors

1. **Prevention Over Cleanup**: Quality gates prevent 20+ hours/month of manual cleanup.
2. **Automated Enforcement**: Tools enforce standards better than documentation alone.
3. **Gradual Implementation**: Incremental rollout prevents development velocity disruption.
4. **Comprehensive Testing**: Test infrastructure must be solid before major changes.
5. **Documentation**: Process documentation enables team scaling and knowledge transfer.

### Common Anti-Patterns to Avoid

1. **Console Statement Accumulation**: `console.log()` statements reach production without structured logging.
2. **Import Path Inconsistency**: Mixed `@/` and relative imports cause test failures.
3. **ESLint Suppression Overuse**: `// eslint-disable` comments instead of fixing root issues.
4. **Test Infrastructure Neglect**: Broken tests block all other improvements.
5. **Bundle Size Blindness**: No monitoring leads to performance regressions.

### Emergency Procedures

If quality gates block critical work:

```bash
# 1. Emergency bypass (document reason)
git commit --no-verify -m "emergency: production hotfix for [issue]"

# 2. Create immediate follow-up task
echo "TODO: Fix quality gate violations from emergency commit" >> URGENT_TODO.md

# 3. Resolve quality issues within 24 hours
# Fix console statements, tests, linting issues
git commit -m "fix: resolve quality gate issues from emergency commit"
```

### Monitoring and Maintenance

#### Weekly Quality Review
- Review quality gate violation patterns
- Analyze bundle size trends  
- Check dependency security alerts
- Update prevention strategies based on new issues

#### Monthly Technical Health Check
- Comprehensive performance audit
- Dependency health assessment
- Quality gate effectiveness review
- Process refinement based on team feedback

This prevention-focused approach has proven to eliminate technical debt accumulation while maintaining development velocity.


## Visual Development

### Design Principles
- Comprehensive design checklist in `/docs/design-principles.md`
- Brand style guide in `/context/style-guide.md`
- When making visual (front-end, UI/UX) changes, always refer to these files for guidance

### Quick Visual Check
IMMEDIATELY after implementing any front-end change:
1. **Identify what changed** - Review the modified components/pages
2. **Navigate to affected pages** - Use `mcp__playwright__browser_navigate` to visit each changed view
3. **Verify design compliance** - Compare against `/docs/design-principles.md` and `/docs/style-guide.md`
4. **Validate feature implementation** - Ensure the change fulfills the user's specific request
5. **Check acceptance criteria** - Review any provided context files or requirements
6. **Capture evidence** - Take full page screenshot at desktop viewport (1440px) of each changed view
7. **Check for errors** - Run `mcp__playwright__browser_console_messages`

This verification ensures changes meet design standards and user requirements.

### Comprehensive Design Review
Invoke the `@agent-design-review` subagent for thorough design validation when:
- Completing significant UI/UX features
- Before finalizing PRs with visual changes
- Needing comprehensive accessibility and responsiveness testing
