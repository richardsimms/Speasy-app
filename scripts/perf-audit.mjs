import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';

const baseUrl = process.env.AUDIT_BASE_URL || 'http://localhost:3000';
const routes = [
  { name: 'website_overall', path: '/en' },
  { name: 'homepage', path: '/en' },
  { name: 'dashboard', path: '/en/dashboard' },
  { name: 'article_newsletter-overload', path: '/en/blog/newsletter-overload' },
  { name: 'article_transform-articles-to-podcasts', path: '/en/blog/transform-articles-to-podcasts' },
  { name: 'article_reading-overload-career', path: '/en/blog/reading-overload-career' },
  { name: 'article_blog-post-template', path: '/en/blog/blog-post-template' },
  { name: 'article_getting-started-with-speasy', path: '/en/blog/getting-started-with-speasy' },
  { name: 'article_email-overwhelm', path: '/en/blog/email-overwhelm' },
];

const browser = await chromium.launch({ headless: true });
const results = [];

for (const route of routes) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__lcp = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const last = entries[entries.length - 1];
      if (last) {
        window.__lcp = last.startTime;
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  });

  const url = `${baseUrl}${route.path}`;
  let response = null;
  let error = null;

  try {
    response = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(1000);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  const metrics = error
    ? null
    : await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null;
        const lcp = window.__lcp || null;
        const skeletonSelectors = ['.animate-pulse', '[class*="skeleton"]', '[data-skeleton]'];
        const skeletonNodeCount = skeletonSelectors
          .map(selector => document.querySelectorAll(selector).length)
          .reduce((sum, count) => sum + count, 0);

        return {
          domContentLoadedMs: nav ? nav.domContentLoadedEventEnd : null,
          loadEventMs: nav ? nav.loadEventEnd : null,
          firstContentfulPaintMs: fcp,
          largestContentfulPaintMs: lcp,
          skeletonNodeCount,
          title: document.title,
        };
      });

  results.push({
    name: route.name,
    url,
    status: response?.status() ?? null,
    finalUrl: page.url(),
    error,
    metrics,
    lighthousePerformanceScore: null,
    speedIndex: null,
    notes: 'Lighthouse unavailable in this environment (npm E403 for lighthouse package).',
  });

  await context.close();
}

await browser.close();
await fs.writeFile('reports/perf-audit.json', JSON.stringify({ generatedAt: new Date().toISOString(), baseUrl, results }, null, 2));

console.log('Wrote reports/perf-audit.json');
