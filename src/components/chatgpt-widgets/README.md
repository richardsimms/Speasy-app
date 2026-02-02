# ChatGPT Widgets

React components for the ChatGPT App using the OpenAI Apps SDK.

## Location

These components are **part of the main Next.js app** but built separately for ChatGPT:

```
src/components/chatgpt-widgets/
├── index.tsx         # Entry point - mounts ContentListWidget
├── content-list.tsx  # Main widget component with SDK hooks
└── types.ts          # TypeScript type definitions
```

**Build output**: `public/widgets/content-list.js`

## Why Separate Build?

ChatGPT widgets run in an iframe with different requirements:
- ✅ Self-contained ESM bundle (no Next.js runtime)
- ✅ Direct DOM manipulation (ReactDOM.createRoot)
- ✅ Access to `window.openai` SDK
- ✅ No Next.js routing/features needed

The main Next.js app cannot be used directly because ChatGPT needs a standalone JavaScript bundle.

## Development

### Build Widget

```bash
# From project root
npm run build:chatgpt-widget

# Watch mode (rebuilds on changes)
npm run dev:chatgpt-widget
```

### Project Scripts

Added to main `package.json`:
```json
{
  "scripts": {
    "build:chatgpt-widget": "node scripts/build-chatgpt-widget.js",
    "dev:chatgpt-widget": "node scripts/build-chatgpt-widget.js --watch"
  }
}
```

## How It Works

1. **Build**: esbuild bundles React components → `public/widgets/content-list.js`
2. **Deploy**: Vercel serves the bundle from `https://www.speasy.app/widgets/content-list.js`
3. **Load**: MCP server returns HTML that loads the bundle
4. **Render**: Widget uses `window.openai` SDK API

## Key Features

### OpenAI Apps SDK Integration

```tsx
// Custom hook wrapping window.openai
function useOpenAi() {
  return {
    toolResult, // Data from MCP tool
    widgetState, // Persisted widget state
    theme, // 'light' | 'dark'
    setWidgetState, // Update state
    callTool, // Invoke MCP tool
  };
}

function ContentListWidget() {
  const { toolResult, theme, callTool } = useOpenAi();
  const items = toolResult?.structuredContent?.items || [];

  // User interaction triggers MCP tool call
  const handleFilter = async (category) => {
    await callTool({
      name: 'list_content',
      arguments: { category_slug: category }
    });
  };
}
```

### State Management

Widget state persists across conversation turns:

```tsx
setWidgetState({ selectedCategory: 'ai' });
```

### Theme Support

Automatically adapts to ChatGPT theme:

```tsx
const isDark = theme === 'dark';
```

## MCP Server Integration

Referenced in `supabase/functions/speasy-mcp/index.ts`:

```typescript
const WIDGET_BUNDLE_URL = 'https://www.speasy.app/widgets/content-list.js';

// Returns HTML wrapper that loads bundle
text: `<div id="speasy-root"></div>
       <script type="module" src="${WIDGET_BUNDLE_URL}"></script>`;
```

## Testing

### Local Development

```bash
# Terminal 1: Build widget in watch mode
npm run dev:chatgpt-widget

# Terminal 2: Run Next.js dev server
npm run dev

# Terminal 3: Test MCP server
supabase functions serve speasy-mcp --no-verify-jwt
```

Widget available at: `http://localhost:3000/widgets/content-list.js`

### Production Testing

After deployment:
```bash
# Verify bundle loads
curl -I https://www.speasy.app/widgets/content-list.js

# Test in ChatGPT App
```

## Deployment

Automatic via Vercel:

```bash
# 1. Build widget
npm run build:chatgpt-widget

# 2. Commit
git add src/components/chatgpt-widgets public/widgets
git commit -m "feat(chatgpt): update widget"
git push

# 3. Vercel deploys automatically
# 4. Deploy MCP server
supabase functions deploy speasy-mcp
```

## Architecture

```
┌─────────────────────────────────┐
│  Next.js App (Main Website)    │
│  - Server Components            │
│  - App Router                   │
│  - Serves public/ folder        │
└─────────────────────────────────┘
        │
        ├─ /widgets/content-list.js  ← ChatGPT Widget Bundle
        └─ / (rest of website)       ← Main Next.js app
```

## Related Files

- **Build Script**: `scripts/build-chatgpt-widget.js`
- **MCP Server**: `supabase/functions/speasy-mcp/index.ts`
- **App Manifest**: `public/chatgpt-app.json`
- **Old Implementation**: `src/components/chatkit/speasy-chat.tsx` (legacy)

## Dependencies

Widget uses packages from main project:
- `react` (catalog)
- `react-dom` (catalog)
- `@openai/apps-sdk` (needs to be added to main package.json)

Build tool:
- `esbuild` (devDependency in main package.json)

## Troubleshooting

### Widget not building

Check that esbuild is installed:
```bash
npm install -D esbuild
```

### TypeScript errors

Widget source uses relaxed types for `window.openai` (injected by ChatGPT).
This is expected and safe.

### Bundle too large

Current: ~195KB minified

To optimize:
- Code splitting (future)
- Remove unused dependencies
- Use production React build
