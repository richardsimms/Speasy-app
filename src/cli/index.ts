#!/usr/bin/env node
import { program } from 'commander';

import dotenv from 'dotenv';

import { gapsCommand } from './commands/gaps';
import { healthCommand } from './commands/health';
import { statusCommand } from './commands/status';

// Load environment variables from .env.local (Next.js convention)
// Use quiet mode to suppress informational messages
dotenv.config({ path: '.env.local', quiet: true });
// Also try .env as fallback
dotenv.config({ path: '.env', quiet: true });

program
  .name('speasy')
  .description('Speasy content management CLI')
  .version('0.1.0');

program
  .command('status')
  .description('Show content counts by status')
  .option('--json', 'Output as JSON')
  .action(statusCommand);

program
  .command('gaps')
  .description('Find content with missing audio, metadata, or stuck processing')
  .option('--json', 'Output as JSON')
  .option('-c, --category <name>', 'Filter by category name')
  .option('-l, --limit <number>', 'Maximum number of items to show', '50')
  .action((options) => {
    gapsCommand({
      json: options.json,
      category: options.category,
      limit: Number.parseInt(options.limit, 10),
    });
  });

program
  .command('health')
  .description('Check database connection and show summary statistics')
  .option('--json', 'Output as JSON')
  .action(healthCommand);

program.parse();
