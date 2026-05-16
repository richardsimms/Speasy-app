- [x] Inspect current blog page metadata and rendering pipeline.
- [x] Implement unique SEO titles, descriptions, and canonicals for blog index and posts.
- [x] Add structured data coverage for Blog index and Blog post AEO (Article, FAQPage, HowTo).
- [x] Improve crawlable blog index intro copy and strengthen internal navigation links.
- [x] Run lint, typecheck, and targeted tests.

## Review

- Added product-aligned metadata for blog index and post routes, including canonical URLs and richer OG/Twitter tags.
- Added JSON-LD generation for CollectionPage + ItemList on `/blog`, and BlogPosting + FAQPage + HowTo on supported guide posts.
- Added visible FAQ sections on mapped guide posts to keep schema and page content aligned.
- Replaced broken cross-post links in markdown guides with valid internal blog routes.
- Verified with `pnpm test`, `pnpm run lint`, and `pnpm run check:types`.
