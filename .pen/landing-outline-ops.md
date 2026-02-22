# Landing page outline for `.pen/landing.pen`

This matches the structure of `src/app/[locale]/(marketing)/page.tsx` and its main child `ContentGridDiscover`.

## Page structure (from code)

1. **Page wrapper** — `max-w-7xl`, horizontal padding (px-4 md:px-6 lg:px-8), vertical padding (py-8)
2. **ContentGridDiscover** (`space-y-8`):
   - **Header** — single heading "Discover" (font-serif text-5xl)
   - **Tab navigation** — horizontal scroll, tablist: "Latest" + category tabs (icon + label each)
   - **Content area** — either empty state message or grid:
     - Grid: `gap-6`, `sm:grid-cols-2 lg:grid-cols-4`
     - Pattern: first 2 items in each group of 6 are featured (col-span-2), next 4 are regular (col-span-1)
     - Each item = ContentGridCard (image, title, summary, category, duration, play button)

## Pencil batch_design operations

Run these in Pencil (e.g. via MCP `batch_design`) **after** opening `.pen/landing.pen` and ensuring the document has a root. If the file is empty, create the page frame first; the guidelines use `document` as the root binding.

**Step 1 — Create page and main sections (max 25 ops):**

```javascript
page = I(document, { type: 'frame', name: 'Landing Page (Speasy Home)', placeholder: true, layout: 'vertical', width: 1440, height: 'fit_content(2000)', padding: [32, 48], gap: 32, fill: '#0A0A0A' });
headerSection = I(page, { type: 'frame', name: 'Header', layout: 'vertical', gap: 12 });
title = I(headerSection, { type: 'text', content: 'Discover', fontSize: 48, fontWeight: 'bold', textColor: '#FFFFFF' });
tabBar = I(page, { type: 'frame', name: 'Tab navigation', layout: 'horizontal', gap: 32 });
tabLatest = I(tabBar, { type: 'text', content: 'Latest', fontSize: 16, textColor: '#FFFFFF' });
tabCat1 = I(tabBar, { type: 'text', content: 'Category', fontSize: 16, textColor: '#B3B3B3' });
contentGrid = I(page, { type: 'frame', name: 'Content grid', placeholder: true, layout: 'vertical', gap: 24 });
rowFeatured = I(contentGrid, { type: 'frame', name: 'Row (2 featured cards)', layout: 'horizontal', gap: 24 });
featured1 = I(rowFeatured, { type: 'frame', name: 'Featured card 1', width: 'fill_container', height: 280, cornerRadius: 12, fill: '#1A1A1A' });
featured2 = I(rowFeatured, { type: 'frame', name: 'Featured card 2', width: 'fill_container', height: 280, cornerRadius: 12, fill: '#1A1A1A' });
rowRegular = I(contentGrid, { type: 'frame', name: 'Row (4 regular cards)', layout: 'horizontal', gap: 24 });
card1 = I(rowRegular, { type: 'frame', name: 'Card 1', width: 'fill_container', height: 200, cornerRadius: 12, fill: '#1A1A1A' });
card2 = I(rowRegular, { type: 'frame', name: 'Card 2', width: 'fill_container', height: 200, cornerRadius: 12, fill: '#1A1A1A' });
card3 = I(rowRegular, { type: 'frame', name: 'Card 3', width: 'fill_container', height: 200, cornerRadius: 12, fill: '#1A1A1A' });
card4 = I(rowRegular, { type: 'frame', name: 'Card 4', width: 'fill_container', height: 200, cornerRadius: 12, fill: '#1A1A1A' });
```

## Outline summary

| Section           | Purpose                                      |
|------------------|-----------------------------------------------|
| Page             | Max-width container, dark bg (#0A0A0A)       |
| Header           | "Discover" title (serif, 5xl)                  |
| Tab bar          | Latest + category tabs (horizontal)           |
| Row (featured)   | 2 wide cards (col-span-2 pattern)             |
| Row (regular)    | 4 standard cards (col-span-1 pattern)         |

The real page uses `ContentGridCard` per item; this outline uses placeholder frames. Add more category tab labels or card rows with additional `I(tabBar, ...)` and `I(contentGrid, ...)` operations as needed.
