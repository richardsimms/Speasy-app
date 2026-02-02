# ChatGPT Apps SDK Setup - Complete ✅

**Date**: 2026-02-02
**Status**: Phase 1 Complete - Widget Built & Ready for Testing

---

## What Was Built

### 1. Widget Build System (Integrated into Main App)

```
src/components/chatgpt-widgets/
├── README.md              # Widget documentation
├── index.tsx              # Entry point (mounts to DOM)
├── content-list.tsx       # Main widget component
└── types.ts               # Type definitions

scripts/
└── build-chatgpt-widget.js # esbuild configuration

package.json               # Main package.json with build scripts
```

**Built artifact**: `public/widgets/content-list.js` (195KB)

**Key difference**: Widget source is **part of the main Next.js app** at `src/components/chatgpt-widgets/`, not a separate project. This allows shared dependencies and cleaner architecture while maintaining a separate build process for ChatGPT's requirements.

### 2. React Widget Features

✅ **OpenAI Apps SDK Integration**
- `useOpenAi()` hook for SDK access
- `toolResult` - receives MCP data
- `widgetState` - persisted state management
- `callTool()` - trigger MCP tools from UI
- `theme` - light/dark mode support

✅ **Interactive Features**
- Category filters (All, AI, Business, Design, etc.)
- Click to play individual items
- "Play All" button for playlists
- Loading states during async operations
- Theme-aware styling

✅ **State Management**
- Selected category persists across conversation turns
- Widget state visible to ChatGPT model
- Inline tool invocation (no page navigation)

### 3. MCP Edge Function Updates

Updated `supabase/functions/speasy-mcp/index.ts`:

```typescript
// Before: HTML template with hardcoded script URLs
const WIDGET_TEMPLATE = `<script src="..."></script>`;

// After: Reference to ESM bundle
const WIDGET_BUNDLE_URL = 'https://www.speasy.app/widgets/content-list.js';

// Returns HTML that loads the bundle
text: `<div id="speasy-root"></div>
       <script type="module" src="${WIDGET_BUNDLE_URL}"></script>`
```

---

## How It Works

### Architecture Flow

```
┌──────────────────────────────────────────────────────────┐
│ 1. User in ChatGPT: "Show me AI content"                │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 2. ChatGPT calls MCP tool                                │
│    POST /speasy-mcp                                      │
│    { name: "list_content", arguments: { ... } }          │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 3. Supabase Edge Function (Deno)                         │
│    - Queries database                                    │
│    - Returns structuredContent                           │
│    - Points to widget bundle                             │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 4. ChatGPT loads widget iframe                           │
│    GET https://www.speasy.app/widgets/content-list.js   │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 5. React Widget (Browser)                                │
│    - Mounts to #speasy-root                              │
│    - Accesses window.openai SDK                          │
│    - Receives toolResult.structuredContent               │
│    - Renders content list                                │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 6. User clicks "Business" filter                         │
│    - setWidgetState({ selectedCategory: 'business' })   │
│    - callTool({ name: 'list_content', ... })            │
│    - Back to step 2 →                                    │
└──────────────────────────────────────────────────────────┘
```

---

## Next Steps

### Immediate (Before Testing)

1. **Add widget to .gitignore** (optional - it's build output):
   ```bash
   echo "public/widgets/*.js" >> .gitignore
   ```

2. **Commit changes**:
   ```bash
   git add src/components/chatgpt-widgets/ scripts/ supabase/functions/speasy-mcp/index.ts docs/ package.json
   git commit -m "feat(chatgpt): implement OpenAI Apps SDK widget system

   - Integrate widget into main app at src/components/chatgpt-widgets/
   - Create build script in scripts/build-chatgpt-widget.js
   - Implement React widget with useOpenAi() hook
   - Add category filters and inline tool invocation
   - Update MCP Edge Function to reference ESM bundle
   - Support light/dark themes
   - Add state persistence across conversation turns"

   git push
   ```

3. **Deploy to Vercel** (automatic on push):
   - Vercel will serve `public/widgets/content-list.js`
   - Verify at: `https://www.speasy.app/widgets/content-list.js`

4. **Deploy MCP Edge Function**:
   ```bash
   supabase functions deploy speasy-mcp
   ```

### Testing Locally

1. **Build widget in watch mode**:
   ```bash
   # From project root
   npm run dev:chatgpt-widget  # Auto-rebuilds on changes
   ```

2. **Run Next.js dev server** (in separate terminal):
   ```bash
   npm run dev  # Serves public/ folder at http://localhost:3000
   ```

3. **Test widget loads**:
   - Open: `http://localhost:3000/widgets/content-list.js`
   - Should see bundled JavaScript

4. **Test MCP server locally**:
   ```bash
   # Update WIDGET_BUNDLE_URL to localhost:3000 in Edge Function
   # Then run:
   supabase functions serve speasy-mcp --no-verify-jwt
   ```

5. **Test in ChatGPT**:
   - Update `public/chatgpt-app.json` if needed
   - Load app in ChatGPT developer mode
   - Try: "Show me the latest content"

### Testing in Production

After deploying:

1. **Verify widget bundle**:
   ```bash
   curl -I https://www.speasy.app/widgets/content-list.js
   # Should return 200 OK with JavaScript content-type
   ```

2. **Test MCP endpoint**:
   ```bash
   curl -X POST "https://lmmobnqmxkcdwdhhpwwd.supabase.co/functions/v1/speasy-mcp" \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
   ```

3. **Check in ChatGPT**:
   - Open ChatGPT
   - Load Speasy app
   - Try: "Show me AI content"
   - Widget should render with filters and content

---

## Troubleshooting

### Widget not loading in ChatGPT

**Check:**
1. Bundle exists: `https://www.speasy.app/widgets/content-list.js`
2. CORS headers allow ChatGPT domains
3. Browser console for errors (F12 in Chrome)
4. Verify `WIDGET_BUNDLE_URL` in Edge Function

**Fix:**
- Check Vercel deployment logs
- Verify public/ directory is served correctly
- Test bundle URL directly in browser

### `window.openai` is undefined

**Cause**: Widget not running in ChatGPT App context

**Solution**:
- Use standalone chat mode (`/chat`)
- Or wait for ChatGPT App review/approval
- Widget has fallback for development

### State not persisting

**Check:**
1. `setWidgetState()` called before tool invocation
2. State object is JSON-serializable
3. State size < 4000 tokens

**Debug:**
```typescript
console.log('Setting state:', newState);
setWidgetState(newState);
```

### TypeScript errors in Edge Function

**Note**: Deno modules show errors in VSCode but work fine in Deno runtime

**Ignore these errors:**
- `Cannot find module 'https://deno.land/...'`
- `Cannot find name 'Deno'`

These are expected for Deno Edge Functions.

---

## File Changes Summary

### New Files

- `src/components/chatgpt-widgets/README.md` - Widget documentation
- `src/components/chatgpt-widgets/index.tsx` - Entry point (mounts to DOM)
- `src/components/chatgpt-widgets/content-list.tsx` - Main widget component
- `src/components/chatgpt-widgets/types.ts` - Type definitions
- `scripts/build-chatgpt-widget.js` - esbuild build script
- `public/widgets/content-list.js` - Built widget bundle (195KB)
- `docs/chatgpt-sdk-gaps-analysis.md` - Gap analysis
- `docs/chatgpt-sdk-implementation-plan.md` - Implementation plan
- `docs/chatgpt-widget-restructure.md` - Restructure documentation
- `docs/chatgpt-sdk-setup-complete.md` - This file

### Modified Files

- `package.json`:
  - Added `build:chatgpt-widget` script
  - Added `dev:chatgpt-widget` script (watch mode)
  - Updated `build` to run widget build first
  - Updated `clean` to remove widget builds

- `supabase/functions/speasy-mcp/index.ts`:
  - Changed `WIDGET_TEMPLATE` to `WIDGET_BUNDLE_URL`
  - Updated HTML to load ESM bundle
  - Kept all other MCP logic unchanged

### Deprecated (Not Removed Yet)

- `src/components/chatkit/speasy-chat.tsx` - Old ChatGPTAppUI component
  - Still contains `SpeasyChat` for standalone mode
  - `ChatGPTAppUI` will be replaced by new widget
  - Keep for now as reference

---

## Comparison: Before vs After

### Before (Manual postMessage)

```typescript
// src/components/chatkit/speasy-chat.tsx
const handleMessage = (event: MessageEvent) => {
  if (data?.type === 'mcp_tool_result') {
    setWidgets([...widgets, data.result.ui]);
  }
};
window.addEventListener('message', handleMessage);

// Custom renderer with 11 component types
function WidgetRenderer({ widget }) {
  switch (node.type) {
    case 'Card': return <CustomCard />;
    case 'ListView': return <CustomList />;
    // ...
  }
}
```

**Issues:**
- ❌ Manual message parsing (error-prone)
- ❌ No state persistence
- ❌ No theme support
- ❌ Can't trigger tools from UI
- ❌ Custom components (high maintenance)

### After (SDK-based)

```typescript
// src/components/chatgpt-widgets/content-list.tsx
import { useOpenAi } from '@openai/apps-sdk';

function ContentListWidget() {
  const {
    toolResult,      // ✅ Auto-parsed data
    widgetState,     // ✅ Persisted state
    theme,           // ✅ Light/dark mode
    setWidgetState,  // ✅ Update state
    callTool,        // ✅ Trigger MCP tools
  } = useOpenAi();

  // Direct access to structured content
  const items = toolResult?.structuredContent?.items || [];

  // Inline filtering
  const handleFilter = async (category) => {
    setWidgetState({ selectedCategory: category });
    await callTool({ name: 'list_content', ... });
  };
}
```

**Benefits:**
- ✅ Official SDK (future-proof)
- ✅ State persists across conversation
- ✅ Theme-aware styling
- ✅ Inline tool invocation
- ✅ Standard React patterns

---

## Development Workflow

### Daily Development

```bash
# 1. Make changes to widget
vim src/components/chatgpt-widgets/content-list.tsx

# 2. Build in watch mode (from project root)
npm run dev:chatgpt-widget

# 3. Test changes
# Widget auto-rebuilds on save
# Refresh ChatGPT to see changes

# 4. Commit when ready
git add src/components/chatgpt-widgets/
git commit -m "feat(widget): add XYZ feature"
git push
```

### Production Deployment

```bash
# 1. Build widget (from project root)
npm run build:chatgpt-widget

# 2. Commit build output
git add public/widgets/content-list.js
git commit -m "build(widget): update bundle"

# 3. Push to Vercel
git push

# 4. Deploy Edge Function
supabase functions deploy speasy-mcp

# 5. Verify in production
curl https://www.speasy.app/widgets/content-list.js
```

---

## Resources

### Documentation Created
- [chatgpt-sdk-gaps-analysis.md](./chatgpt-sdk-gaps-analysis.md) - Detailed gap analysis
- [chatgpt-sdk-implementation-plan.md](./chatgpt-sdk-implementation-plan.md) - 4-week roadmap
- [chatgpt-widget-restructure.md](./chatgpt-widget-restructure.md) - Architecture restructure explanation
- [src/components/chatgpt-widgets/README.md](../src/components/chatgpt-widgets/README.md) - Widget development docs

### External Resources
- [OpenAI Apps SDK](https://developers.openai.com/apps-sdk)
- [ChatGPT UI Guide](https://developers.openai.com/apps-sdk/build/chatgpt-ui)
- [UX Principles](https://developers.openai.com/apps-sdk/concepts/ux-principles)
- [Component Reference](https://developers.openai.com/apps-sdk/plan/components)

---

## What's Next (Future Phases)

### Phase 2: Enhanced Widgets
- [ ] Detail view widget for single content items
- [ ] Search results widget
- [ ] Category browser widget
- [ ] Loading skeletons
- [ ] Error boundaries

### Phase 3: Optimizations
- [ ] Code splitting (reduce bundle size)
- [ ] Lazy loading for images
- [ ] Virtual scrolling for long lists
- [ ] Optimize structuredContent payloads (<4000 tokens)
- [ ] Bundle size analysis and optimization

### Phase 4: Polish
- [ ] Accessibility improvements (ARIA labels)
- [ ] Keyboard navigation
- [ ] Animation polish (respect prefers-reduced-motion)
- [ ] Analytics tracking
- [ ] Error reporting (Sentry integration)

### Phase 5: ChatGPT App Store
- [ ] Complete UX review checklist
- [ ] Performance audit
- [ ] Security review
- [ ] Submit to ChatGPT App Store
- [ ] Address review feedback

---

## Summary

✅ **Completed:**
1. Integrated widget into main Next.js app at `src/components/chatgpt-widgets/`
2. Created build script in `scripts/build-chatgpt-widget.js`
3. Installed `@openai/apps-sdk` (note: using `window.openai` directly for now)
4. Built React widget with SDK integration
5. Added interactive features (filters, play, state)
6. Updated MCP Edge Function to serve widget bundle
7. Built production bundle (195KB)
8. Documented architecture and workflow

🚀 **Ready for:**
- Local testing
- Production deployment
- ChatGPT App integration testing

📝 **Next Action:**
```bash
# Commit and deploy
git add src/components/chatgpt-widgets/ scripts/ supabase/ docs/ public/widgets/ package.json
git commit -m "feat(chatgpt): implement OpenAI Apps SDK widget system"
git push

# Deploy Edge Function
supabase functions deploy speasy-mcp
```

**Questions?** Check:
- [Widget README](../src/components/chatgpt-widgets/README.md) - Widget development
- [Restructure Explanation](./chatgpt-widget-restructure.md) - Architecture decisions
- [Implementation Plan](./chatgpt-sdk-implementation-plan.md) - Full roadmap
- [Gap Analysis](./chatgpt-sdk-gaps-analysis.md) - Detailed comparison
