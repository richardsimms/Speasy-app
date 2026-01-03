# Speasy

> Turn newsletters and saved articles into personal podcast-style audio you can listen to.

**Speasy** transforms your reading backlog into an audio experience. Stop feeling guilty about unread newsletters—convert them into high-quality audio summaries you can absorb while commuting, exercising, or doing chores.

🌐 **Live Site**: [speasy.app](https://www.speasy.app)
📧 **Contact**: hello@speasy.app
☁️ **Hosting**: Deployed on [Vercel](https://vercel.com)

## What is Speasy?

Speasy solves the modern reader's dilemma: too much content, too little time. Instead of staring at an overflowing inbox or a growing "read later" list, Speasy automatically converts your newsletters and saved articles into podcast-style audio using advanced AI text-to-speech technology.

The production application at [speasy.app](https://speasy.app) uses Supabase for content storage, audio conversion processing, and database management, ensuring reliable and scalable content delivery.

### Key Features

- 🎙️ **Automatic Audio Conversion**: High-quality text-to-speech conversion powered by Supabase Edge Functions
- 📱 **PWA Support**: Install as an app, listen offline with service worker support
- 🎧 **Universal Compatibility**: Works with Apple Podcasts, Spotify, Overcast, and other podcast apps via RSS feeds
- 🗄️ **Supabase Backend**: Content storage, audio processing, and PostgreSQL database
- 🌍 **Multi-language Support**: Available in English and French (with more languages coming)
- 🔒 **Secure Authentication**: Powered by Clerk with passwordless options, MFA, and social auth
- 💳 **Subscription Management**: Integrated Stripe billing for premium features
- 🎨 **Modern UI**: Beautiful, responsive design with dark/light mode support
- 📊 **Analytics**: PostHog integration for user insights
- 🚨 **Error Monitoring**: Sentry integration for production error tracking
- ☁️ **Vercel Deployment**: Global edge network for optimal performance

## Tech Stack

Built with modern, production-ready technologies:

### Core Framework
- ⚡ [Next.js 16](https://nextjs.org) with App Router
- ⚛️ [React 19](https://react.dev) with TypeScript
- 🎨 [Tailwind CSS 4](https://tailwindcss.com) for styling
- ☁️ [Vercel](https://vercel.com) for hosting and deployment

### Backend & Database
- 🗄️ [Supabase](https://supabase.com) - Production database, content storage, and audio conversion
- 🗄️ [DrizzleORM](https://orm.drizzle.team) - Type-safe database queries
- 💾 [PGlite](https://github.com/electric-sql/pglite) - Local development database

### Authentication & Payments
- 🔒 [Clerk](https://clerk.com) - Authentication and user management
- 💳 [Stripe](https://stripe.com) - Subscription billing

### Infrastructure & Monitoring
- 🌐 [next-intl](https://next-intl-docs.vercel.app) - Internationalization
- 📝 [LogTape](https://logtape.logtape.dev) - Structured logging
- 🚨 [Sentry](https://sentry.io) - Error monitoring
- 🔐 [Arcjet](https://arcjet.com) - Security and bot protection
- 📊 [PostHog](https://posthog.com) - Product analytics

### Developer Experience

- 🔥 Type checking with TypeScript (strict mode)
- ✅ ESLint with Next.js, Core Web Vitals, and Antfu configurations
- 💖 Prettier for code formatting
- 🦊 Lefthook for Git hooks
- 🚫 Lint-staged for pre-commit checks
- 🚓 Commitlint for commit message validation
- 🦺 Unit testing with Vitest
- 🧪 E2E testing with Playwright
- 🔍 Knip for unused dependency detection
- 🌍 i18n-check for translation validation

## Requirements

- Node.js 20+ and [pnpm](https://pnpm.io) (recommended) or npm

## Getting Started

### Installation

```shell
git clone https://github.com/your-username/Speasy-app.git
cd Speasy-app
pnpm install
```

> **Note**: This project uses [pnpm](https://pnpm.io) for package management with a catalog-based dependency system. If you prefer npm, you can use it, but pnpm is recommended for consistency with the lockfile.

### Development

Run the development server:

```shell
pnpm run dev
```

This will:
- Start the PGlite database server on port 5433
- Start the Next.js development server on port 3000
- Start Sentry Spotlight for local error monitoring

Open [http://localhost:3000](http://localhost:3000) in your browser. The project is pre-configured with a local PGlite database—no additional setup required for local development.

### Environment Variables

The project uses [`@t3-oss/env-nextjs`](https://env.t3.gg) for type-safe environment variable validation. If required variables are missing, you'll see a clear error message listing which variables need to be set.

Create a `.env.local` file in the root directory with the following variables:

```shell
# Required - Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Required - Database (PGlite is used automatically in dev, but DATABASE_URL is still required)
DATABASE_URL=postgresql://localhost:5433/postgres

# Optional - Stripe (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRICE_ID=your_stripe_price_id

# Optional - Sentry (for error monitoring)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_ORGANIZATION=your_sentry_org
SENTRY_PROJECT=your_sentry_project
SENTRY_AUTH_TOKEN=your_sentry_auth_token

# Optional - PostHog (for analytics)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Optional - Arcjet (for security and bot protection)
ARCJET_KEY=ajkey_your_arcjet_key

# Optional - Better Stack (for log management)
NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN=your_better_stack_token
NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST=your_better_stack_host

# Production - Supabase (required for production content conversion and storage)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional - OpenAI (for AI features)
OPENAI_KEY=your_openai_key

# Optional - Other services
UNSPLASH_ACCESS_KEY=your_unsplash_key
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
CLERK_WEBHOOK_SIGNING_SECRET=your_clerk_webhook_secret
```

**Required Variables:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key for authentication
- `CLERK_SECRET_KEY` - Clerk secret key for server-side operations
- `DATABASE_URL` - PostgreSQL connection string (PGlite uses `postgresql://localhost:5433/postgres` in development)

All other variables are optional and can be added as needed for specific features.

### Set Up Authentication

1. Create a [Clerk](https://clerk.com) account
2. Create a new application in the Clerk Dashboard
3. Copy your `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
4. Add them to your `.env.local` file

Clerk provides a complete authentication system including sign up, sign in, password reset, profile management, and more.

### Set Up Database

**Local Development:**
PGlite is automatically used—no setup required. It runs a local PostgreSQL-compatible database on port 5433.

**Production:**
The production site at [speasy.app](https://speasy.app) uses Supabase for:
- PostgreSQL database hosting
- Content storage and management
- Audio file processing and conversion
- Real-time subscriptions

To set up Supabase for your deployment:

1. Create a [Supabase](https://supabase.com) project
2. Get your project credentials from the Supabase dashboard
3. Add the following to your production environment variables:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Service role key for server-side operations
   - `NEXT_PUBLIC_SUPABASE_URL` - Public Supabase URL for client-side access
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anonymous key for client-side access

The project uses DrizzleORM for type-safe database access. See the [Database Schema](#database-schema) section for more details.

## Project Structure

```shell
.
├── README.md                       # This file
├── CLAUDE.md                       # Development guidelines and best practices
├── .github                         # GitHub Actions workflows
├── .vscode                         # VSCode settings and extensions
├── migrations                      # Database migrations
├── public                          # Static assets
│   ├── sw.js                       # Service worker for PWA
│   ├── manifest.json              # PWA manifest
│   └── offline.html               # Offline fallback page
├── src
│   ├── app                         # Next.js App Router
│   │   ├── [locale]               # Internationalized routes
│   │   │   ├── (auth)             # Authenticated routes
│   │   │   │   └── dashboard      # User dashboard
│   │   │   └── (marketing)        # Public marketing pages
│   │   │       ├── page.tsx       # Landing page
│   │   │       ├── about          # About page
│   │   │       └── content        # Content pages
│   │   └── api                    # API routes
│   │       ├── users              # User management API
│   │       └── webhooks           # Webhook handlers
│   ├── components                 # React components
│   │   ├── ui                     # Shadcn/UI components
│   │   ├── audio-demo.tsx         # Audio player demo
│   │   ├── hero.tsx               # Landing page hero
│   │   ├── features.tsx            # Features section
│   │   └── pricing.tsx            # Pricing section
│   ├── libs                       # Third-party library configurations
│   │   ├── Arcjet.ts              # Arcjet security client
│   │   ├── DB.ts                  # Database connection
│   │   ├── Env.ts                 # Environment variables
│   │   ├── Logger.ts              # Logging configuration
│   │   └── Supabase.ts            # Supabase client (if used)
│   ├── locales                    # Translation files
│   │   ├── en.json                # English translations
│   │   └── fr.json                # French translations
│   ├── models                     # Database models
│   │   └── Schema.ts              # DrizzleORM schema
│   ├── styles                     # Global styles
│   ├── templates                  # Page templates
│   ├── types                      # TypeScript type definitions
│   ├── utils                      # Utility functions
│   └── validations                # Zod validation schemas
├── tests
│   ├── e2e                        # End-to-end tests
│   └── integration                # Integration tests
├── next.config.ts                 # Next.js configuration
└── tsconfig.json                  # TypeScript configuration
```

## Database Schema

The project uses DrizzleORM for type-safe database operations. To modify the database schema:

1. Update `src/models/Schema.ts` with your changes
2. Generate a migration: `npm run db:generate`
3. Apply the migration: `npm run db:migrate`

Migrations are automatically applied during Next.js initialization in development mode.

### Database Studio

Explore your database using Drizzle Studio:

```shell
npm run db:studio
```

Then open [https://local.drizzle.studio](https://local.drizzle.studio) in your browser.

## Available Scripts

### Development

- `pnpm run dev` - Start development server with hot reload, PGlite database, and Sentry Spotlight
- `pnpm run dev:next` - Start only the Next.js development server
- `pnpm run dev:spotlight` - Start Sentry Spotlight for local error monitoring
- `pnpm run build` - Build for production
- `pnpm run build-local` - Build with temporary in-memory database
- `pnpm run start` - Start production server

### Code Quality

- `pnpm run lint` - Run ESLint
- `pnpm run lint:fix` - Fix ESLint issues automatically
- `pnpm run check:types` - Type check with TypeScript
- `pnpm run check:deps` - Check for unused dependencies (Knip)
- `pnpm run check:i18n` - Validate translations

### Testing

- `pnpm run test` - Run unit tests with Vitest
- `pnpm run test:e2e` - Run E2E tests with Playwright
- `npx playwright install` - Install Playwright browsers (first time only)

### Database

- `pnpm run db:generate` - Generate database migration
- `pnpm run db:migrate` - Apply database migrations
- `pnpm run db:studio` - Open Drizzle Studio
- `pnpm run db-server:file` - Start PGlite server with file-based database
- `pnpm run db-server:memory` - Start PGlite server with in-memory database

### Other

- `pnpm run build-stats` - Analyze bundle size
- `pnpm run commit` - Interactive commit with Commitizen
- `pnpm run clean` - Remove build artifacts (.next, out, coverage)

## Testing

### Unit Tests

Unit tests are co-located with source files using the `*.spec.ts` or `*.test.ts` naming convention. Run tests with:

```shell
pnpm run test
```

### E2E Tests

E2E tests use Playwright and are located in `tests/e2e/`. Test files use the `*.e2e.ts` extension. Run E2E tests with:

```shell
pnpm run test:e2e
```

Install Playwright browsers first (one-time setup):

```shell
npx playwright install
```

## Deployment

### Production Hosting

The production site [speasy.app](https://speasy.app) is deployed on **Vercel**, leveraging:
- Global edge network for optimal performance
- Automatic deployments from the `main` branch
- Preview deployments for pull requests
- Built-in analytics and performance monitoring
- Serverless functions for API routes

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/richardsimms/Speasy-app)

Or deploy manually:

```shell
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Production Build

Generate a production build locally:

```shell
pnpm run build
```

Database migrations are automatically executed during the build process.

### Required Environment Variables for Production

Configure these in your Vercel project settings:

**Authentication:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLERK_WEBHOOK_SIGNING_SECRET` - Clerk webhook secret

**Database (Supabase):**
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `NEXT_PUBLIC_SUPABASE_URL` - Public Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `DATABASE_URL` - PostgreSQL connection string from Supabase

**Payments (Optional):**
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `STRIPE_PRICE_ID` - Stripe price ID for subscriptions

**Monitoring (Optional):**
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry DSN
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog project key
- `ARCJET_KEY` - Arcjet security key

## Monitoring & Observability

### Error Monitoring (Sentry)

Sentry is configured for error monitoring. In development, errors are captured by Spotlight (local Sentry instance) at `http://localhost:8969`.

For production, configure Sentry environment variables (see [Environment Variables](#environment-variables)).

### Logging

The project uses LogTape for structured logging. In development, logs appear in the console. For production, configure Better Stack (see [Environment Variables](#environment-variables)).

### Analytics

PostHog is integrated for user analytics. Configure `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` in your environment variables.

### Monitoring as Code (Checkly)

Checkly is configured to run E2E tests ending with `*.check.e2e.ts` at regular intervals. Configure `CHECKLY_API_KEY` and `CHECKLY_ACCOUNT_ID` as GitHub repository secrets for the workflow to function properly.

## Security

### Arcjet

Arcjet provides bot detection and WAF (Web Application Firewall) protection. Configure `ARCJET_KEY` in your environment variables.

Features:
- Bot detection (allows search engines, blocks scrapers)
- Shield WAF (blocks SQL injection, XSS, and OWASP Top 10 attacks)

## Internationalization (i18n)

Speasy supports multiple languages using `next-intl`. Currently supported:

- English (en) - default
- French (fr)

### Adding Translations

1. Add translation keys to `src/locales/en.json`
2. Add corresponding translations to `src/locales/fr.json`
3. Validate translations: `pnpm run check:i18n`

### Crowdin Integration (Optional)

For automated translation management, configure Crowdin:

1. Create a Crowdin project
2. Get your `CROWDIN_PROJECT_ID` and `CROWDIN_PERSONAL_TOKEN`
3. Add them to GitHub Actions environment variables

Translations will sync automatically on pushes to `main`.

## Commit Message Format

This project follows [Conventional Commits](https://www.conventionalcommits.org/). Use the interactive CLI:

```shell
pnpm run commit
```

This helps generate properly formatted commit messages and enables automatic versioning and changelog generation.

Commit messages are validated using commitlint. All commits must follow the format:
- `feat(scope): description` - New features
- `fix(scope): description` - Bug fixes
- `docs: description` - Documentation changes
- `chore: description` - Maintenance tasks
- And other conventional types

## Code Quality

### Pre-commit Hooks

Lefthook runs automatically on commit:

- Prettier formatting
- ESLint checks
- TypeScript type checking
- Test execution

### Code Review

The project uses [CodeRabbit](https://www.coderabbit.ai) for AI-powered code reviews on pull requests.

## License

Licensed under the MIT License, Copyright © 2025

See [LICENSE](LICENSE) for more information.

## Contact

For questions, feedback, or support:

- **Email**: hello@speasy.app
- **Website**: [speasy.app](https://www.speasy.app)

---

Made with ♥ by the Speasy team
