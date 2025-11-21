# Database Migration Guide

This guide explains how to configure your existing Supabase database and run database migrations in different environments.

## Overview

This Next.js app uses a database for:
- **Demo Counter Feature**: A simple counter table (part of the boilerplate) - you can remove this if not needed
- **Your Backend**: Your existing Supabase database that contains your app's backend data

Database migrations are **not** run during the Vercel build process. Instead, they should be run separately after deployment to ensure your production database schema stays up to date.

## Using Your Existing Supabase Database

Since you already have a Supabase database, you can use it for this Next.js app. You have two options:

### Option 1: Use the Same Supabase Database (Recommended)

Use your existing Supabase database for both the demo counter and your backend:

1. **Get your Supabase Connection String:**
   - Go to your Supabase project dashboard
   - Navigate to `Settings` > `Database`
   - Find the connection string (URI format)
   - It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
   - Or use the connection pooling string for better performance: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres`

2. **Add to Vercel Environment Variables:**
   - Go to your Vercel project
   - Navigate to `Settings` > `Environment Variables`
   - Add `DATABASE_URL` with your Supabase connection string
   - Make sure to select all environments (Production, Preview, Development)

3. **Add to GitHub Secrets (for migrations):**
   - Go to your repository on GitHub
   - Navigate to `Settings` > `Secrets and variables` > `Actions`
   - Add `DATABASE_URL` secret with your Supabase connection string

4. **Run Initial Migrations:**
   - The migration will create the `counter` table in your Supabase database
   - Go to GitHub Actions → Database Migration workflow
   - Click "Run workflow" to create the demo tables

### Option 2: Remove Demo Counter (If Not Needed)

If you don't need the demo counter feature, you can remove it:

1. Delete or comment out the counter-related code:
   - `src/models/Schema.ts` - Remove `counterSchema`
   - `src/app/[locale]/api/counter/route.ts` - Remove this API route
   - `src/components/CounterForm.tsx` - Remove this component
   - `src/components/CurrentCount.tsx` - Remove this component
   - Any pages/components that use the counter

2. Update your schema to only include your backend tables

3. Generate new migrations: `npm run db:generate`

## Setting Up a New Production PostgreSQL Database (If Needed)

If you prefer to use a separate database for this Next.js app, here are recommended providers:

### Option 1: Neon (Recommended - Free Tier Available)

[Neon](https://neon.tech) offers a serverless PostgreSQL with a generous free tier.

**Setup Steps:**
1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string from the dashboard
4. Format: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`

**Free Tier Includes:**
- 0.5 GB storage
- Shared CPU
- Perfect for development and small projects

### Option 2: Supabase (Free Tier Available)

[Supabase](https://supabase.com) provides PostgreSQL with additional features like real-time subscriptions.

**Setup Steps:**
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Go to `Settings` > `Database`
4. Copy the connection string (URI format)
5. Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

**Free Tier Includes:**
- 500 MB database space
- 2 GB bandwidth
- Great for getting started

### Option 3: Vercel Postgres (Integrated with Vercel)

If you're deploying on Vercel, you can use [Vercel Postgres](https://vercel.com/storage/postgres).

**Setup Steps:**
1. In your Vercel project, go to `Storage` tab
2. Click `Create Database` > `Postgres`
3. Choose a plan (Hobby plan is free)
4. The `DATABASE_URL` will be automatically added to your environment variables

**Free Tier Includes:**
- 256 MB storage
- 60 hours compute time per month
- Seamless integration with Vercel

### Option 4: Railway (Free Tier Available)

[Railway](https://railway.app) offers PostgreSQL with easy setup.

**Setup Steps:**
1. Go to [railway.app](https://railway.app) and sign up
2. Create a new project
3. Add a PostgreSQL service
4. Copy the connection string from the service variables

**Free Tier Includes:**
- $5 credit per month
- Pay-as-you-go pricing

### Option 5: Render (Free Tier Available)

[Render](https://render.com) provides managed PostgreSQL databases.

**Setup Steps:**
1. Go to [render.com](https://render.com) and sign up
2. Create a new PostgreSQL database
3. Copy the connection string from the database dashboard

**Free Tier Includes:**
- 90-day free trial
- 1 GB storage
- Good for development

### Option 6: Prisma Data Platform (Recommended in README)

As mentioned in your README, [Prisma Data Platform](https://www.prisma.io/data-platform) offers free PostgreSQL.

**Setup Steps:**
1. Go to [prisma.io/data-platform](https://www.prisma.io/data-platform)
2. Create an account
3. Create a new database
4. Get the connection string from the dashboard

### After Setting Up Your Database

Once you have your database connection string:

1. **Add to Vercel Environment Variables:**
   - Go to your Vercel project
   - Navigate to `Settings` > `Environment Variables`
   - Add `DATABASE_URL` with your connection string
   - Make sure to select all environments (Production, Preview, Development)

2. **Add to GitHub Secrets (for migrations):**
   - Go to your repository on GitHub
   - Navigate to `Settings` > `Secrets and variables` > `Actions`
   - Add `DATABASE_URL` secret with your connection string

3. **Test the Connection:**
   ```bash
   # Set the connection string locally (temporarily)
   export DATABASE_URL="your_connection_string_here"

   # Test the connection
   npm run db:studio
   # This should open Drizzle Studio and show your database
   ```

4. **Run Initial Migrations:**
   - Use the GitHub Actions workflow (see below)
   - Or run manually: `DATABASE_URL="your_url" npm run db:migrate`

## Migration Methods

### 1. GitHub Actions Workflow (Recommended)

The easiest and most automated way to run migrations is using the GitHub Actions workflow.

#### Setup

1. **Add DATABASE_URL to GitHub Secrets:**
   - Go to your repository on GitHub
   - Navigate to `Settings` > `Secrets and variables` > `Actions`
   - Click `New repository secret`
   - Name: `DATABASE_URL`
   - Value: Your production database connection string
   - Click `Add secret`

2. **Run migrations manually:**
   - Go to `Actions` tab in your GitHub repository
   - Select `Database Migration` workflow
   - Click `Run workflow`
   - Choose the environment (production/staging)
   - Click `Run workflow`

#### Automatic Migration (Optional)

To automatically run migrations after each deployment:

1. **Set up Vercel Deploy Hook:**
   - In Vercel, go to your project settings
   - Navigate to `Git` > `Deploy Hooks`
   - Create a new deploy hook that triggers on successful deployments
   - Copy the webhook URL

2. **Configure GitHub Webhook:**
   - Go to your repository on GitHub
   - Navigate to `Settings` > `Webhooks`
   - Click `Add webhook`
   - Payload URL: Your Vercel deploy hook URL
   - Content type: `application/json`
   - Events: Select `Repository dispatch`
   - Active: ✅

3. **Update the workflow** (`.github/workflows/migrate.yml`):
   - Uncomment the `push` trigger section if you want migrations on every push to main
   - Or keep the `repository_dispatch` trigger for webhook-based migrations

### 2. Manual Migration via CLI

You can run migrations manually from your local machine or a server:

```bash
# Set your production database URL
export DATABASE_URL="postgresql://user:password@host:port/database"

# Run migrations
npm run db:migrate
```

**⚠️ Security Note:** Never commit your production `DATABASE_URL` to version control. Use environment variables or secrets management.

### 3. Vercel Post-Deploy Script (Alternative)

If you prefer to run migrations directly from Vercel, you can create a serverless function:

1. Create `src/app/api/migrate/route.ts` (see example below)
2. Protect it with authentication/authorization
3. Call it after deployment via a webhook or manually

**⚠️ Warning:** This approach requires careful security considerations to prevent unauthorized access.

## Migration Workflow

### Development

Migrations run automatically during local development when you start the database server:

```bash
npm run dev
```

This starts the local database and runs migrations automatically.

### Production

1. **Generate migration files** (when schema changes):
   ```bash
   npm run db:generate
   ```

2. **Commit and push** migration files to your repository

3. **Deploy to Vercel** (migrations are NOT run during build)

4. **Run migrations** using one of the methods above:
   - GitHub Actions workflow (recommended)
   - Manual CLI command
   - Post-deploy script

## Troubleshooting

### Migration fails with "connection refused"

- Ensure `DATABASE_URL` is correctly set
- Verify your database is accessible from the network where migrations are running
- Check firewall rules and IP whitelist settings

### Migration fails with "schema already exists"

- This is usually safe to ignore if the schema already exists
- Drizzle uses `CREATE SCHEMA IF NOT EXISTS`, so this shouldn't cause issues

### Need to rollback a migration

Drizzle doesn't provide automatic rollbacks. You'll need to:
1. Create a new migration that reverses the changes
2. Run the new migration

## Best Practices

1. **Always test migrations locally** before running in production
2. **Backup your database** before running migrations in production
3. **Run migrations during low-traffic periods** when possible
4. **Monitor migration execution** and verify success
5. **Keep migration files in version control** for audit trail

## Security Considerations

- Never expose `DATABASE_URL` in logs or error messages
- Use GitHub Secrets for storing production database credentials
- Restrict database access to only necessary IPs/networks
- Use read-only database users for migrations if possible (though Drizzle may need write access)
- Consider using connection pooling and connection limits

## Additional Resources

- [Drizzle ORM Migration Docs](https://orm.drizzle.team/docs/migrations)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
