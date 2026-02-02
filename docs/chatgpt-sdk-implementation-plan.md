# ChatGPT SDK Implementation Plan
## Supabase Edge Function Architecture

**Date**: 2026-02-02
**Architecture**: ChatGPT → Supabase Edge Function (MCP) → Supabase DB

> **📝 Note**: This document describes the original implementation plan. The actual implementation differs in structure:
> - Original plan: Separate `web/` folder with its own package.json
> - **Actual implementation**: Widget integrated into main Next.js app at `src/components/chatgpt-widgets/`
> - See [chatgpt-widget-restructure.md](./chatgpt-widget-restructure.md) for the final architecture
> - Code examples below use the old `web/` structure but the concepts remain the same

---

## Current Architecture (Correct)

```
┌─────────────────────────────────────────────────────────────┐
│                     ChatGPT Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User asks: "Show me AI content"                        │
│  2. ChatGPT calls MCP tool: list_content({category: 'ai'}) │
│                                                             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│           Supabase Edge Function (Deno Runtime)             │
│   supabase/functions/speasy-mcp/index.ts                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  3. MCP server receives tool call                           │
│  4. Queries Supabase DB for content                         │
│  5. Returns structuredContent + content                     │
│                                                             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     ChatGPT Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  6. ChatGPT shows widget iframe from outputTemplate        │
│  7. Loads: https://www.speasy.app/widgets/content-list.js  │
│                                                             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              React Widget (Browser Environment)              │
│         src/components/chatkit/speasy-chat.tsx              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  8. Widget loads with SDK: useOpenAi()                      │
│  9. Receives toolResult.structuredContent                   │
│  10. Renders List with items                                │
│  11. User clicks "Filter by Business"                       │
│  12. Widget calls: callTool({ name: 'list_content', ... })│
│  13. Back to step 3 →                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Widget Bundle Setup (Week 1)

### 1.1 Create Widget Build System

**New files to create:**

```bash
web/
├── package.json
├── tsconfig.json
├── esbuild.config.js
└── src/
    ├── index.tsx          # Entry point
    ├── content-list.tsx   # Main widget
    └── content-card.tsx   # Card component
```

**web/package.json:**
```json
{
  "name": "speasy-chatgpt-widgets",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node esbuild.config.js",
    "dev": "node esbuild.config.js --watch"
  },
  "dependencies": {
    "@openai/apps-sdk": "^1.0.0",
    "react": "^19.2.3",
    "react-dom": "^19.2.3"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "esbuild": "^0.24.0",
    "typescript": "^5.7.0"
  }
}
```

**web/esbuild.config.js:**
```javascript
import esbuild from 'esbuild';

const watch = process.argv.includes('--watch');

const config = {
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outfile: '../public/widgets/content-list.js',
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  minify: !watch,
  sourcemap: watch,
  external: [], // Bundle everything
};

if (watch) {
  const ctx = await esbuild.context(config);
  await ctx.watch();
  console.log('Watching for changes...');
} else {
  await esbuild.build(config);
  console.log('Build complete');
}
```

**web/src/index.tsx:**
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ContentListWidget } from './content-list';

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  const root = document.getElementById('speasy-root');
  if (root) {
    ReactDOM.createRoot(root).render(<ContentListWidget />);
  }
}
```

**web/src/content-list.tsx:**
```tsx
import React from 'react';
import { useOpenAi } from '@openai/apps-sdk';
import { ContentCard } from './content-card';

export function ContentListWidget() {
  const {
    toolResult,
    widgetState,
    setWidgetState,
    callTool,
    theme
  } = useOpenAi();

  // Get data from MCP tool result
  const items = toolResult?.structuredContent?.items || [];
  const category = toolResult?.structuredContent?.category || 'Latest';

  // Get persisted state
  const selectedCategory = widgetState?.selectedCategory || 'all';

  const handleCategoryFilter = async (categorySlug: string) => {
    // Persist state (shown to model)
    setWidgetState({ selectedCategory: categorySlug });

    // Trigger new tool call
    await callTool({
      name: 'list_content',
      arguments: { category_slug: categorySlug === 'all' ? undefined : categorySlug }
    });
  };

  const handlePlayAll = () => {
    const url = category === 'Latest'
      ? 'https://www.speasy.app/latest?autoplay=true'
      : `https://www.speasy.app/category/${category.toLowerCase()}?autoplay=true`;
    window.open(url, '_blank');
  };

  return (
    <div className={theme === 'dark' ? 'dark-theme' : 'light-theme'}>
      <div className="widget-header">
        <h3>{category} Content</h3>
        <p>{items.length} stories available</p>
      </div>

      <div className="category-filters">
        {['all', 'ai', 'business', 'design', 'technology', 'productivity'].map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryFilter(cat)}
            className={selectedCategory === cat ? 'active' : ''}
          >
            {cat === 'all' ? 'All' : cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="content-list">
        {items.map(item => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>

      <button onClick={handlePlayAll} className="play-all-button">
        ▶ Play All
      </button>
    </div>
  );
}
```

**web/src/content-card.tsx:**
```tsx
import React from 'react';

interface ContentItem {
  id: string;
  title: string;
  summary?: string;
  source_name: string;
  image_url?: string;
  category?: { name: string; slug: string };
  audio_files?: Array<{ duration: number }>;
}

export function ContentCard({ item }: { item: ContentItem }) {
  const handlePlay = () => {
    window.open(`https://www.speasy.app/content/${item.id}`, '_blank');
  };

  const durationMin = item.audio_files?.[0]?.duration
    ? Math.round(item.audio_files[0].duration / 60)
    : null;

  return (
    <div className="content-card" onClick={handlePlay}>
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.title}
          className="card-thumbnail"
        />
      )}
      <div className="card-content">
        <div className="card-header">
          {item.category?.name && (
            <span className="badge">{item.category.name}</span>
          )}
          {durationMin && (
            <span className="duration">⏱️ {durationMin} min</span>
          )}
        </div>
        <h4 className="card-title">{item.title}</h4>
        <p className="card-source">{item.source_name}</p>
      </div>
    </div>
  );
}
```

### 1.2 Build and Deploy Widget

```bash
# From project root
cd web
pnpm install
pnpm run build

# Output: public/widgets/content-list.js
```

### 1.3 Update MCP Server to Reference Widget Bundle

**supabase/functions/speasy-mcp/index.ts:**

```typescript
// ❌ REMOVE: HTML template approach
const WIDGET_TEMPLATE = `<!DOCTYPE html>...`;

// ✅ UPDATE: Point to ESM bundle
async function handleResourceRead(supabase: any, params: any) {
  const uri = params.uri;

  if (uri === 'ui://widget/speasy-content.html') {
    // Return the widget bundle URL instead of HTML
    return {
      contents: [{
        uri,
        mimeType: 'text/javascript+module',
        // Point to your hosted bundle
        url: 'https://www.speasy.app/widgets/content-list.js',
        _meta: {
          'openai/widgetPrefersBorder': true,
          'openai/widgetDomain': 'https://www.speasy.app',
          'openai/widgetDescription': 'Browse and play Speasy audio content',
          'openai/widgetCSP': {
            connect_domains: [
              'https://www.speasy.app',
              'https://lmmobnqmxkcdwdhhpwwd.supabase.co'
            ],
            resource_domains: [
              'https://www.speasy.app',
              'https://images.unsplash.com'
            ],
          },
        },
      }],
    };
  }
  // ... rest of function
}
```

**Update tool metadata:**

```typescript
function handleToolsList() {
  return {
    tools: [
      {
        name: 'list_content',
        // ... other fields
        _meta: {
          // ✅ Point to ESM bundle, not HTML
          'openai/outputTemplate': 'https://www.speasy.app/widgets/content-list.js',
          'openai/toolInvocation/invoking': 'Browsing stories…',
          'openai/toolInvocation/invoked': '{{count}} stories ready',
        },
      },
      // ... other tools
    ],
  };
}
```

---

## Phase 2: Optimize MCP Server (Week 2)

### 2.1 Reduce structuredContent Size

**Current (potentially large):**
```typescript
// Sending full objects (could be 10+ items with all fields)
structuredContent: {
  items: data || [], // ❌ Large payload
  count: data?.length || 0,
  category: categoryName,
  total_duration_minutes: Math.round(totalDuration / 60),
}
```

**Optimized (minimal):**
```typescript
// Send minimal data, let widget fetch details
structuredContent: {
  item_ids: (data || []).map(d => d.id), // ✅ Just IDs
  count: data?.length || 0,
  category: categoryName,
  total_duration_minutes: Math.round(totalDuration / 60),
}

// Move full data to _meta (not sent to model)
_meta: {
  items: data || [], // Widget can access this
  category_name: categoryName,
  total_duration_seconds: totalDuration,
}
```

### 2.2 Better Error Handling

```typescript
async function handleToolCall(supabase: any, params: any) {
  const { name, arguments: args = {} } = params;

  try {
    if (name === 'list_content') {
      // ... existing logic

      const { data, error } = await query;

      if (error) {
        // ✅ User-friendly error
        return {
          content: [{
            type: 'text',
            text: `⚠️ Couldn't load ${categoryName} content right now. Try selecting a different category or refreshing.`
          }],
          isError: true,
          _meta: {
            error_code: error.code,
            error_message: error.message,
          }
        };
      }

      // ... rest of function
    }
  } catch (error) {
    // Log server-side
    console.error(`Tool error [${name}]:`, error);

    // Return friendly message
    return {
      content: [{
        type: 'text',
        text: `Something went wrong. Please try again or contact support if the issue persists.`
      }],
      isError: true,
    };
  }
}
```

### 2.3 Add Token Estimation

```typescript
// Helper to estimate token count
function estimateTokens(obj: any): number {
  const str = JSON.stringify(obj);
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(str.length / 4);
}

// Before returning structuredContent
const payload = {
  item_ids: (data || []).map(d => d.id),
  count: data?.length || 0,
  category: categoryName,
};

const tokenCount = estimateTokens(payload);
if (tokenCount > 4000) {
  console.warn(`structuredContent too large: ${tokenCount} tokens`);
  // Reduce payload
  payload.item_ids = payload.item_ids.slice(0, 10);
}
```

---

## Phase 3: Remove Unused Code (Week 2)

### 3.1 Clean Up Resources

**Remove dynamic resources** (they should be tools):

```typescript
async function handleResourcesList(supabase: any, _params: any) {
  const resources = [];

  // ✅ Keep: Widget template
  resources.push({
    uri: 'ui://widget/speasy-content.html',
    name: 'Speasy Content Widget',
    description: 'Interactive widget for displaying Speasy audio content',
    mimeType: 'text/javascript+module',
  });

  // ❌ Remove: Dynamic content as resources
  // These should be accessed via tools, not resources
  /*
  resources.push({
    uri: 'speasy://latest',
    name: 'Latest Mix',
    ...
  });
  */

  return { resources };
}
```

### 3.2 Remove Old Widget Components

**Delete or deprecate:**
- `src/components/chatkit/speasy-chat.tsx` (the old `ChatGPTAppUI` component)
- Move to `src/components/chatkit/speasy-chat-legacy.tsx` for reference

**Keep:**
- `SpeasyChat` component (standalone chat mode)
- New `web/src/` widgets for ChatGPT App mode

---

## Phase 4: Testing & Deployment (Week 3)

### 4.1 Local Testing

**Test widget locally:**

```bash
# Terminal 1: Watch mode for widget
cd web
pnpm run dev

# Terminal 2: Serve public folder
npx http-server public -p 8080 --cors

# Terminal 3: Test MCP server
curl -X POST "http://localhost:54321/functions/v1/speasy-mcp" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_content","arguments":{}}}'
```

**Test in ChatGPT:**
1. Update `public/chatgpt-app.json` to point to `http://localhost:8080`
2. Load in ChatGPT App (developer mode)
3. Test tool invocations

### 4.2 Deploy to Production

**Deploy widget:**
```bash
# Build production bundle
cd web
pnpm run build

# Deploy to Vercel (already serving public/)
git add public/widgets/content-list.js
git commit -m "feat(chatgpt): add SDK-based widget bundle"
git push
```

**Deploy MCP server:**
```bash
# Deploy Supabase Edge Function
supabase functions deploy speasy-mcp
```

**Update manifest:**
```json
// public/chatgpt-app.json
{
  "ui": {
    "url": "https://www.speasy.app/chat?mode=chatgpt",
    "height": "tall"
  },
  "mcp": {
    "servers": [{
      "url": "https://lmmobnqmxkcdwdhhpwwd.supabase.co/functions/v1/speasy-mcp",
      "transport": "sse"
    }]
  }
}
```

---

## Summary: What Changes Where

### ✅ Keep As-Is
- **Supabase Edge Function** (`supabase/functions/speasy-mcp/index.ts`)
  - MCP protocol implementation ✅
  - Tool handlers ✅
  - SSE transport ✅

### 🔄 Modify
- **MCP Server** (`supabase/functions/speasy-mcp/index.ts`)
  - Remove HTML template
  - Update `outputTemplate` to point to ESM bundle
  - Optimize `structuredContent` payloads
  - Better error handling
  - Remove dynamic resources

### ➕ Add New
- **Widget Build System** (`web/`)
  - esbuild configuration
  - React components using `@openai/apps-sdk`
  - Build to `public/widgets/content-list.js`

### ❌ Remove/Deprecate
- `src/components/chatkit/speasy-chat.tsx` (ChatGPTAppUI)
- Manual postMessage handling
- Custom WidgetRenderer (move to SDK components)

---

## Development Workflow

```bash
# 1. Install widget dependencies
cd web
pnpm install

# 2. Start widget dev server
pnpm run dev

# 3. Deploy changes
pnpm run build
cd ..
git add public/widgets web
git commit -m "feat(chatgpt): implement SDK-based widgets"
git push

# 4. Deploy Edge Function
supabase functions deploy speasy-mcp
```

---

## Questions?

- **Q: Can I use TypeScript in the Edge Function?**
  - A: Yes, Deno supports TypeScript natively

- **Q: Do I need to bundle the Edge Function?**
  - A: No, Supabase handles that automatically

- **Q: Where should the widget CSS live?**
  - A: Either inline in the React components or in `public/widgets/content-list.css`

- **Q: How do I test MCP locally?**
  - A: Use `supabase functions serve speasy-mcp --no-verify-jwt`
