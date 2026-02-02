#!/usr/bin/env node

/**
 * Build ChatGPT widget using esbuild
 * Bundles React components into ESM module for ChatGPT App iframe
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const watch = process.argv.includes('--watch');

const config = {
  entryPoints: [join(rootDir, 'src/components/chatgpt-widgets/index.tsx')],
  bundle: true,
  outfile: join(rootDir, 'public/widgets/content-list.js'),
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  minify: !watch,
  sourcemap: watch ? 'inline' : false,
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
  },
  logLevel: 'info',
};

async function build() {
  try {
    if (watch) {
      const ctx = await esbuild.context(config);
      await ctx.watch();
      console.log('👀 Watching ChatGPT widget for changes...');
    } else {
      await esbuild.build(config);
      console.log('✅ ChatGPT widget built successfully');
    }
  } catch (error) {
    console.error('❌ ChatGPT widget build failed:', error);
    process.exit(1);
  }
}

build();
