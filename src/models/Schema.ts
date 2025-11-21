// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the Next.js initialization process through `instrumentation.ts`.
// Simply restart your Next.js server to apply the database changes.
// Alternatively, if your database is running, you can run `npm run db:migrate` and there is no need to restart the server.

// Add your database schema here
// Example:
// import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
//
// export const usersSchema = pgTable('users', {
//   id: serial('id').primaryKey(),
//   email: varchar('email', { length: 255 }).notNull(),
//   createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
// });

// Export empty schema object to satisfy type imports
// This will be replaced when you add actual schema definitions
export const schema = {};
