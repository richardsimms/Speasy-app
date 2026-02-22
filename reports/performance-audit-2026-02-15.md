# Performance audit — 2026-02-15

## Scope
- Website overall: `/en`
- Homepage: `/en`
- Dashboard: `/en/dashboard`
- Articles:
  - `/en/blog/newsletter-overload`
  - `/en/blog/transform-articles-to-podcasts`
  - `/en/blog/reading-overload-career`
  - `/en/blog/blog-post-template`
  - `/en/blog/getting-started-with-speasy`
  - `/en/blog/email-overwhelm`

## Result summary
- **Lighthouse performance score**: unavailable in this environment.
- **Speed Index**: unavailable in this environment.
- **Reason**: `lighthouse` cannot be installed due registry policy (`npm ERR! 403 Forbidden`).

## Collected load metrics (Playwright fallback)
| Route | Status | Final URL | DCL (ms) | Load (ms) | FCP (ms) | LCP (ms) | Skeleton nodes found |
|---|---:|---|---:|---:|---:|---:|---:|
| website overall (`/en`) | 200 | `/` | 251.9 | 594.2 | 252 | 252 | 0 |
| homepage (`/en`) | 200 | `/` | 402.4 | 583.4 | 224 | 224 | 0 |
| dashboard (`/en/dashboard`) | 500 | `/en/dashboard` | 39.2 | 39.6 | 60 | 60 | 0 |
| article: newsletter-overload | 200 | `/blog/newsletter-overload` | 168.1 | 666.1 | 168 | 320 | 0 |
| article: transform-articles-to-podcasts | 200 | `/blog/transform-articles-to-podcasts` | 139.4 | 671.1 | 320 | 320 | 0 |
| article: reading-overload-career | 200 | `/blog/reading-overload-career` | 137.9 | 700.8 | 328 | 328 | 0 |
| article: blog-post-template | 200 | `/blog/blog-post-template` | 134.5 | 660.6 | 288 | 288 | 0 |
| article: getting-started-with-speasy | 200 | `/blog/getting-started-with-speasy` | 140.1 | 670.4 | 144 | 300 | 0 |
| article: email-overwhelm | 200 | `/blog/email-overwhelm` | 121.6 | 692.2 | 320 | 320 | 0 |

## Skeleton/loading-state verification
- No App Router route-level loading files are present (`loading.tsx` not found under `src/app`).
- Skeleton components exist in `src/components/ui/skeleton.tsx` and `src/components/skeleton-loader.tsx`.
- Home/blog/article route files do not currently wire route-level skeleton fallbacks.
- Runtime DOM probe found **0 skeleton nodes** on all tested routes.

## Baseline comparison (Vercel “25%”)
- Could not compare against a historical baseline within this environment.
- We have no previous Lighthouse artifact in this repo and cannot currently run Lighthouse due npm registry restrictions.
- Recommendation: run the same route list in CI with Lighthouse CI (or Vercel Analytics export) and store JSON artifacts for trend comparison.
