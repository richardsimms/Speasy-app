# ChatGPT Apps SDK: Gaps & Improvements Analysis

**Date**: 2026-02-02
**Current Implementation**: Speasy ChatGPT App with MCP Server + Custom Widget Renderer

> **📝 Note**: This document analyzes the gaps in the original implementation and recommends solutions. The recommendations have been implemented with a modified architecture:
> - Widget source integrated into main Next.js app at `src/components/chatgpt-widgets/`
> - See [chatgpt-widget-restructure.md](./chatgpt-widget-restructure.md) for the final implementation
> - File paths in this document reference the planned structure, not the final integrated structure

---

## Executive Summary

Your current implementation has a **functional MCP server** and **custom widget rendering**, but is **not using the official OpenAI Apps SDK APIs**. This analysis identifies critical gaps, architectural issues, and recommended improvements based on OpenAI's official documentation.

**Impact**: 🔴 High Priority | 🟡 Medium Priority | 🟢 Low Priority

---

## 1. Critical Gaps 🔴

### 1.1 Not Using `window.openai` API Bridge

**Current State:**
```typescript
// ChatGPTAppUI component - speasy-chat.tsx:770
const handleMessage = (event: MessageEvent) => {
  // Manual postMessage handling
  if (data?.type === 'mcp_tool_result') {
    // Custom parsing
  }
}
window.addEventListener('message', handleMessage);
```

**OpenAI Requirement:**
> "The `window.openai` API serves as the fundamental connection between your UI component and ChatGPT"

**Impact**: Your app is bypassing the official SDK, which means:
- Missing automatic state hydration
- No access to theme/display mode APIs
- Manual message parsing (error-prone)
- Not future-proof for SDK updates

**Recommendation:**
```typescript
// Use the official SDK API
import { useOpenAi } from '@openai/apps-sdk';

function ChatGPTAppUI() {
  const { toolResult, widgetState, theme } = useOpenAi();

  // Automatically receives structured content
  // No manual postMessage handling needed
}
```

---

### 1.2 No Widget State Management

**Current State:**
- No use of `setWidgetState()`
- State stored in React component state only
- Widget state doesn't persist across conversation turns

**OpenAI Requirement:**
> "Anything you pass to `setWidgetState` will be shown to the model, and hydrated into `window.openai.widgetState`"

**Impact**:
- Model can't reason about widget state
- User selections/filters don't persist
- Can't handle multi-turn interactions with stateful UI

**Recommendation:**
```typescript
// When user filters by category
const handleCategoryFilter = (categorySlug: string) => {
  window.openai.setWidgetState({
    selectedCategory: categorySlug,
    filteredItems: getFilteredItems(categorySlug)
  });
};
```

---

### 1.3 No Interactive Tool Invocation

**Current State:**
- Widgets only open URLs via `window.open()`
- No ability to trigger MCP tools from UI

**OpenAI Requirement:**
> "Components can directly trigger MCP tool calls via `window.openai.callTool()`"

**Impact**:
- Limited interactivity (can only navigate away)
- Can't refresh/filter content without new conversation turn
- Missing "inline actions" UX pattern

**Recommendation:**
```typescript
// In widget click handler
const handlePlaylistRefresh = async () => {
  const result = await window.openai.callTool({
    name: 'list_content',
    arguments: {
      category_slug: selectedCategory,
      limit: 20
    }
  });
  // Widget automatically updates with new structured content
};
```

---

### 1.4 Missing SDK Components

**Current State:**
- Custom `WidgetRenderer` with 11 component types (Card, ListView, Row, Col, etc.)
- All implemented from scratch

**OpenAI SDK Provides:**
- Pre-built **List, Map, Album, Carousel, Shop** components
- Standardized UX patterns
- Optimized for ChatGPT environment

**Impact**:
- Higher maintenance burden
- UX inconsistency with other ChatGPT apps
- Missing accessibility features from SDK components

**Recommendation:**
```typescript
// Use SDK components instead of custom renderer
import { List, Card } from '@openai/apps-sdk/components';

function ContentWidget({ items }) {
  return (
    <List
      items={items}
      renderItem={(item) => (
        <Card
          title={item.title}
          subtitle={item.source_name}
          image={item.image_url}
          onAction={() => handlePlay(item.id)}
        />
      )}
    />
  );
}
```

---

## 2. Architecture Issues 🟡

### 2.1 Widget Template Approach

**Current State:**
```typescript
// MCP server returns HTML template
const WIDGET_TEMPLATE = `<!DOCTYPE html>
<html>
  <script src="https://www.speasy.app/chatgpt-widget.js"></script>
</html>`;
```

**OpenAI Pattern:**
- SDK apps use **React components** directly
- No HTML templates
- Components bundled as ESM modules

**Recommendation:**
- Remove HTML template approach
- Build React components as ESM bundle with esbuild
- Serve bundle from your domain
- MCP server returns `structuredContent` (JSON data), not HTML

---

### 2.2 No Theme/Display Mode Support

**Current State:**
- Hardcoded dark theme styles
- No response to user theme preference

**OpenAI Requirement:**
> "Components respond to host-emitted `openai:set_globals` events for theme and display mode"

**Impact**:
- Poor UX in light mode
- Doesn't respect user preferences

**Recommendation:**
```typescript
const { theme, displayMode } = useOpenAi();

<div className={cn(
  theme === 'light' ? 'bg-white text-black' : 'bg-black text-white',
  displayMode === 'fullscreen' && 'h-screen'
)}>
```

---

### 2.3 No Follow-Up Message Support

**Current State:**
- No use of `sendFollowUpMessage()`
- User must type new messages manually

**OpenAI Pattern:**
> "Use `window.openai.sendFollowUpMessage()` to insert user-initiated messages"

**Use Case:**
```typescript
// After user clicks "Play All", auto-send confirmation
window.openai.sendFollowUpMessage({
  content: "Playing all Business stories"
});
```

---

### 2.4 structuredContent Token Efficiency

**Current State:**
```typescript
// Sending large objects with all data
structuredContent: {
  items: data || [], // Could be 10+ items with full details
  count: data?.length || 0,
  category: categoryName,
  total_duration_minutes: Math.round(totalDuration / 60),
}
```

**OpenAI Guideline:**
> "Keep widget state payloads under 4,000 tokens for optimal performance"

**Recommendation:**
- Send minimal data in `structuredContent`
- Use IDs instead of full objects
- Widget fetches details on-demand

```typescript
structuredContent: {
  item_ids: data.map(d => d.id),
  category: categoryName,
  total_items: data.length
}
```

---

## 3. MCP Server Improvements 🟡

### 3.1 Tool Metadata Missing

**Current State:**
```typescript
{
  name: 'list_content',
  _meta: {
    'openai/outputTemplate': 'ui://widget/speasy-content.html',
    'openai/toolInvocation/invoking': 'Fetching content…',
    'openai/toolInvocation/invoked': 'Content ready',
  }
}
```

**Missing:**
- `openai/widgetPrefersBorder` ✗
- `openai/widgetDomain` ✗
- `openai/widgetCSP` ✗
- Tool descriptions could be more conversational

**Recommendation:**
Add more metadata for better UX:
```typescript
_meta: {
  'openai/outputTemplate': 'https://www.speasy.app/widgets/content-list.js',
  'openai/widgetPrefersBorder': true,
  'openai/widgetDomain': 'https://www.speasy.app',
  'openai/widgetCSP': {
    connect_domains: ['https://www.speasy.app', 'https://lmmobnqmxkcdwdhhpwwd.supabase.co'],
    resource_domains: ['https://www.speasy.app', 'https://images.unsplash.com']
  },
  'openai/toolInvocation/invoking': 'Browsing audio stories…',
  'openai/toolInvocation/invoked': '{{count}} stories found'
}
```

---

### 3.2 Error Handling

**Current State:**
```typescript
if (error) {
  throw error; // Generic error
}
```

**Recommendation:**
- Return user-friendly error messages
- Include recovery suggestions
- Log errors server-side

```typescript
if (error) {
  return {
    content: [{
      type: 'text',
      text: `⚠️ Couldn't load ${categoryName} content. Try refreshing or selecting a different category.`
    }],
    isError: true
  };
}
```

---

### 3.3 Resources vs Tools Confusion

**Current State:**
- Both `resources/list` AND `tools/list` return similar data
- Unclear when to use resources vs tools

**OpenAI Pattern:**
- **Resources**: Static reference content (docs, schemas)
- **Tools**: Dynamic actions (list, search, create)

**Recommendation:**
- Remove resources for dynamic content
- Keep only widget templates as resources
- Move content discovery to tools only

---

## 4. UX Principle Alignment 🟢

### 4.1 Conversational Leverage ✅

**Current**: Good
- Tools support natural language
- Multi-turn dialogue works
- Context maintained in thread

### 4.2 Native Fit ⚠️

**Current**: Partial
- Custom widgets feel different from ChatGPT
- Not using SDK components
- Manual styling vs. ChatGPT design system

**Improvement:**
- Adopt SDK components for consistency
- Use ChatGPT color palette
- Follow ChatGPT spacing/typography

### 4.3 Composability ✅

**Current**: Good
- Tools are atomic (list, search, get_detail)
- Can be combined by model
- Don't require complex multi-step workflows

### 4.4 Design for ChatGPT Environment ⚠️

**Current**: Mixed
- Good: Minimal UI, conversation-first
- Bad: Long widget lists (should paginate)
- Bad: No inline actions (only external links)

**Improvement:**
```typescript
// Instead of "Play All" → external link
// Add inline preview + action
<Button onClick={() => {
  window.openai.callTool({ name: 'get_playlist_preview' });
}}>
  Preview Playlist
</Button>
```

---

## 5. Implementation Roadmap

### Phase 1: SDK Integration (Week 1) 🔴

**Priority**: Critical

1. **Install OpenAI Apps SDK**
   ```bash
   npm install @openai/apps-sdk
   ```

2. **Replace postMessage with SDK API**
   - Remove `window.addEventListener('message')`
   - Use `useOpenAi()` hook
   - Access `toolResult`, `widgetState`, `theme`

3. **Add State Management**
   - Implement `setWidgetState()` for filters
   - Hydrate state on widget load
   - Persist user selections

4. **Add Tool Invocation**
   - Replace `window.open()` with `callTool()`
   - Implement inline refresh/filter actions
   - Add loading states

**Files to modify:**
- `src/components/chatkit/speasy-chat.tsx` (ChatGPTAppUI component)
- `public/chatgpt-app.json` (update widget URL)

---

### Phase 2: Component Migration (Week 2) 🟡

**Priority**: High

1. **Replace Custom Components**
   - Use SDK `List` component
   - Use SDK `Card` component
   - Remove custom `WidgetRenderer`

2. **Add Theme Support**
   - Listen to `openai:set_globals`
   - Apply light/dark theme styles
   - Use ChatGPT design tokens

3. **Optimize structuredContent**
   - Reduce payload size (<4000 tokens)
   - Send IDs instead of full objects
   - Add pagination

**Files to modify:**
- `src/components/chatkit/speasy-chat.tsx` (component rendering)
- Create new `src/components/chatkit/content-list.tsx` (SDK-based)
- Create new `src/components/chatkit/content-card.tsx` (SDK-based)

---

### Phase 3: MCP Server Polish (Week 3) 🟢

**Priority**: Medium

1. **Improve Tool Metadata**
   - Add all OpenAI metadata fields
   - Better descriptions
   - Token estimation

2. **Better Error Handling**
   - User-friendly error messages
   - Recovery suggestions
   - Server-side logging

3. **Clean Up Resources**
   - Remove dynamic resources
   - Keep only widget templates
   - Update resource URLs

**Files to modify:**
- `supabase/functions/speasy-mcp/index.ts` (all handlers)

---

### Phase 4: Bundle Optimization (Week 4) 🟢

**Priority**: Low

1. **Switch to ESM Bundle**
   - Remove HTML template approach
   - Build React components with esbuild
   - Serve from CDN

2. **Add Hot Reloading**
   - Development mode support
   - Fast refresh during dev

3. **Performance Optimization**
   - Code splitting
   - Lazy loading
   - Bundle size analysis

**New files:**
- `web/build.js` (esbuild config)
- `web/src/index.tsx` (entry point)
- `web/package.json` (web-only deps)

---

## 6. Example: Before & After

### Before (Current Implementation)

```typescript
// Manual postMessage handling
const handleMessage = (event: MessageEvent) => {
  if (data?.type === 'mcp_tool_result') {
    if (data?.result?.ui) {
      setWidgets(prev => [...prev, data.result.ui]);
    }
  }
};
window.addEventListener('message', handleMessage);

// Custom renderer
function WidgetRenderer({ widget }) {
  switch (node.type) {
    case 'Card': return <CustomCard {...node} />;
    case 'ListView': return <CustomList {...node} />;
    // ... 11 custom components
  }
}
```

### After (SDK-Based)

```typescript
import { useOpenAi, List, Card } from '@openai/apps-sdk';

function SpeasyContentWidget() {
  const { toolResult, theme, widgetState, setWidgetState, callTool } = useOpenAi();

  // Automatic data from tool result
  const items = toolResult?.structuredContent?.items || [];
  const selectedCategory = widgetState?.selectedCategory || 'all';

  const handleFilter = async (category: string) => {
    // Update widget state (persisted, visible to model)
    setWidgetState({ selectedCategory: category });

    // Trigger tool call (inline, no page navigation)
    await callTool({
      name: 'list_content',
      arguments: { category_slug: category }
    });
  };

  return (
    <List
      theme={theme} // Auto-handles light/dark
      items={items}
      onFilter={handleFilter}
      renderItem={(item) => (
        <Card
          title={item.title}
          subtitle={item.source_name}
          image={item.image_url}
          badge={item.category?.name}
          onAction={() => window.open(item.play_url)}
        />
      )}
    />
  );
}
```

---

## 7. Testing Checklist

Before submitting to ChatGPT App Store:

### Functional Testing
- [ ] Widget receives tool results correctly
- [ ] State persists across conversation turns
- [ ] Theme switching works (light/dark)
- [ ] Tool invocation from UI works
- [ ] Error handling displays user-friendly messages
- [ ] Loading states show during async operations
- [ ] Display mode changes work (inline → fullscreen)

### UX Testing
- [ ] Follows OpenAI UX principles
- [ ] Atomic, composable actions
- [ ] Conversation-first design
- [ ] Minimal UI (no clutter)
- [ ] Fast response times (<2s)
- [ ] Clear action buttons
- [ ] No ads or promotional content

### Performance Testing
- [ ] structuredContent < 4000 tokens
- [ ] Widget bundle < 500KB
- [ ] Initial load < 1s
- [ ] No memory leaks on repeated renders
- [ ] Works on mobile viewports

### Security Testing
- [ ] CSP headers configured
- [ ] No XSS vulnerabilities
- [ ] HTTPS only
- [ ] No sensitive data in widget state
- [ ] Rate limiting on MCP server

---

## 8. Resources

### Official Documentation
- [Apps SDK Overview](https://developers.openai.com/apps-sdk)
- [Component Reference](https://developers.openai.com/apps-sdk/plan/components)
- [ChatGPT UI Guide](https://developers.openai.com/apps-sdk/build/chatgpt-ui)
- [UX Principles](https://developers.openai.com/apps-sdk/concepts/ux-principles)

### Code Examples
- [OpenAI Apps SDK Examples](https://github.com/openai/openai-apps-sdk-examples)

### Tools
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) - Test MCP server
- [esbuild](https://esbuild.github.io/) - Bundle React components

---

## 9. Summary

**Immediate Action Items:**
1. 🔴 Install `@openai/apps-sdk` package
2. 🔴 Replace postMessage with `useOpenAi()` hook
3. 🔴 Add `setWidgetState()` for state persistence
4. 🔴 Implement `callTool()` for inline actions
5. 🟡 Migrate to SDK List/Card components
6. 🟡 Add theme support
7. 🟡 Optimize structuredContent payload size

**Expected Outcomes:**
- ✅ Pass ChatGPT App Store review
- ✅ Consistent UX with other ChatGPT apps
- ✅ Better performance (smaller payloads)
- ✅ More interactive widgets (inline actions)
- ✅ Future-proof (using official SDK)

**Estimated Effort:** 3-4 weeks for full migration

---

**Questions?** Review the [official docs](https://developers.openai.com/apps-sdk) or check [example implementations](https://github.com/openai/openai-apps-sdk-examples).
