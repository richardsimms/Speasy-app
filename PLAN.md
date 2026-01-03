# Category Preferences Signup Conversion Plan

## Overview

Convert free users by capturing feed category preferences during signup, providing a personalized "For You" feed based on their selected categories. Similar to the Perplexity flow shown in the reference screenshots.

## Current State Analysis

### Existing Infrastructure
- **Categories**: `categories` table with `name` field
- **Content categorization**: `content_item_tags` junction table links content to categories
- **User preferences storage**: `user_category_subscriptions` table (already exists, used by RSS feed API)
- **Dashboard**: Shows all content grouped by category with "For You", "Latest", and category tabs
- **Authentication**: Clerk + Supabase sync via webhooks

### Key Gaps
1. **No pre-signup category capture**: Current signup uses Clerk's default `<SignUp>` component with no customization
2. **Dashboard not personalized**: "For You" tab shows ALL content, doesn't filter by user preferences
3. **No listen history tracking**: No database table to track listened content
4. **No preferences management UI**: Users cannot change their preferences after signup
5. **No onboarding flow**: Users go directly to dashboard after signup

---

## Implementation Plan

### Phase 1: Database Schema Updates

#### 1.1 Create `listen_history` Table
Track when users have listened to content to hide from feed.

```sql
CREATE TABLE listen_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  listened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completion_percentage INTEGER DEFAULT 0,
  UNIQUE(user_id, content_id)
);

CREATE INDEX idx_listen_history_user ON listen_history(user_id);
CREATE INDEX idx_listen_history_content ON listen_history(content_id);
```

#### 1.2 Verify `user_category_subscriptions` Table
Ensure the existing table has proper structure:

```sql
-- Expected structure (verify exists):
-- user_id UUID NOT NULL REFERENCES users(id)
-- category_id UUID NOT NULL REFERENCES categories(id)
-- created_at TIMESTAMP
-- PRIMARY KEY (user_id, category_id)
```

#### 1.3 Create `pending_preferences` Table
Store preferences for anonymous users before signup (keyed by session/anonymous ID):

```sql
CREATE TABLE pending_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  anonymous_id VARCHAR(255) NOT NULL UNIQUE,
  category_ids UUID[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days'
);

CREATE INDEX idx_pending_preferences_anonymous ON pending_preferences(anonymous_id);
CREATE INDEX idx_pending_preferences_expires ON pending_preferences(expires_at);
```

### Phase 2: Category Selection Component

#### 2.1 Create `CategoryPicker` Component
Location: `src/components/category-picker.tsx`

Features:
- Displays available categories as pill-style buttons (per Perplexity design)
- Multi-select with visual feedback (checkmark icon, color change)
- Optional custom interest input field ("I'm curious about...")
- Responsive grid layout
- Accessible (keyboard navigation, ARIA labels)

Props:
```typescript
type CategoryPickerProps = {
  categories: Array<{ id: string; name: string; icon?: string }>;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  maxSelections?: number;
  showCustomInput?: boolean;
};
```

#### 2.2 Create API Endpoint for Categories
Location: `src/app/api/categories/route.ts`

```typescript
GET /api/categories
Response: { categories: Array<{ id: string; name: string }> }
```

### Phase 3: Pre-Signup Preference Capture

#### 3.1 Create Preference Modal Component
Location: `src/components/preference-modal.tsx`

Triggers:
- After user views 3+ content items (engagement trigger)
- When user clicks "Personalize" button on dashboard
- Manual trigger from marketing page CTA

Modal content:
- "Make it yours" heading
- "Select topics and interests to customize your Discover experience"
- CategoryPicker component
- "Save Interests" button (triggers signup if not authenticated)

#### 3.2 Create Anonymous Preference Storage Hook
Location: `src/hooks/useAnonymousPreferences.ts`

Features:
- Generates/stores anonymous ID in localStorage
- Saves selected categories to `pending_preferences` table
- Retrieves preferences for authenticated users to merge

### Phase 4: Signup Flow Integration

#### 4.1 Create Custom Onboarding Page
Location: `src/app/[locale]/(auth)/onboarding/page.tsx`

Flow:
1. User completes Clerk signup
2. Redirect to `/onboarding` instead of `/dashboard`
3. Display CategoryPicker with any pre-selected preferences (from anonymous session)
4. User confirms/modifies selections
5. Save to `user_category_subscriptions`
6. Redirect to `/dashboard`

#### 4.2 Update Clerk Redirect Configuration
Modify `src/app/[locale]/(auth)/layout.tsx`:

```typescript
signUpFallbackRedirectUrl: `/${locale}/onboarding`
```

#### 4.3 Create Preference Sync Webhook
Location: `src/app/api/webhooks/clerk/route.ts` (extend existing)

On user creation:
1. Check for pending preferences by anonymous ID (from Clerk metadata or cookie)
2. Transfer to `user_category_subscriptions`
3. Delete pending preferences entry

### Phase 5: User Settings Page

#### 5.1 Create Preferences Settings Component
Location: `src/app/[locale]/(auth)/dashboard/settings/preferences/page.tsx`

Features:
- Display current category subscriptions
- CategoryPicker for modification
- Save/cancel buttons
- API integration for updates

#### 5.2 Create Preferences API Endpoints
Location: `src/app/api/user/preferences/route.ts`

```typescript
GET /api/user/preferences
Response: { categoryIds: string[] }

PUT /api/user/preferences
Body: { categoryIds: string[] }
Response: { success: boolean }
```

### Phase 6: Personalized "For You" Feed

#### 6.1 Update Dashboard Page
Location: `src/app/[locale]/(auth)/dashboard/page.tsx`

Changes:
1. Fetch user's category subscriptions
2. Filter "For You" content by subscribed categories
3. Sort by `created_at` descending (newest first)
4. Exclude listened content
5. Pass filtered content to `DiscoverGrid`

Query updates:
```typescript
// Fetch user preferences
const { data: subscriptions } = await supabase
  .from('user_category_subscriptions')
  .select('category_id')
  .eq('user_id', userId);

// Fetch listen history
const { data: listenHistory } = await supabase
  .from('listen_history')
  .select('content_id')
  .eq('user_id', userId);

// Filter content by preferences and exclude listened
const subscribedCategoryIds = subscriptions?.map(s => s.category_id) || [];
const listenedContentIds = listenHistory?.map(l => l.content_id) || [];
```

#### 6.2 Update DiscoverGrid Component
Location: `src/components/discover-grid.tsx`

Props additions:
```typescript
type DiscoverGridProps = {
  // ... existing props
  forYouItems?: ContentItem[]; // Pre-filtered personalized items
  showEmptyState?: boolean;
};
```

Changes:
- Accept pre-filtered `forYouItems` for "For You" tab
- Show empty state with "Add more interests" CTA if no content matches
- Keep other tabs showing all content (unfiltered)

### Phase 7: Listen History Tracking

#### 7.1 Create Listen History API
Location: `src/app/api/user/listen-history/route.ts`

```typescript
POST /api/user/listen-history
Body: { contentId: string; completionPercentage?: number }
Response: { success: boolean }

GET /api/user/listen-history
Response: { contentIds: string[] }
```

#### 7.2 Update Audio Player
Extend `useContentAnalytics` hook or create new `useListenHistory` hook:

Trigger recording:
- When `trackAudioComplete` fires
- When completion percentage reaches threshold (e.g., 80%)

### Phase 8: Marketing Page Integration

#### 8.1 Add Personalization CTA
Location: `src/app/[locale]/(marketing)/page.tsx` (or relevant marketing component)

Add "Personalize your feed" section that:
- Shows CategoryPicker inline or in modal
- Stores preferences anonymously
- CTAs to signup with preferences pre-filled

---

## File Structure Summary

```
src/
├── app/
│   ├── [locale]/
│   │   └── (auth)/
│   │       ├── dashboard/
│   │       │   ├── page.tsx              # Updated: personalized feed
│   │       │   └── settings/
│   │       │       └── preferences/
│   │       │           └── page.tsx      # NEW: preferences settings
│   │       ├── onboarding/
│   │       │   └── page.tsx              # NEW: post-signup onboarding
│   │       └── layout.tsx                # Updated: redirect to onboarding
│   └── api/
│       ├── categories/
│       │   └── route.ts                  # NEW: list categories
│       └── user/
│           ├── preferences/
│           │   └── route.ts              # NEW: GET/PUT preferences
│           └── listen-history/
│               └── route.ts              # NEW: listen tracking
├── components/
│   ├── category-picker.tsx               # NEW: reusable picker
│   ├── preference-modal.tsx              # NEW: modal wrapper
│   └── discover-grid.tsx                 # Updated: personalized For You
├── hooks/
│   ├── useAnonymousPreferences.ts        # NEW: anonymous storage
│   └── useListenHistory.ts               # NEW: listen tracking
└── libs/
    └── Supabase.ts                       # Updated: add preference operations
```

---

## Database Migrations Required

1. `001_create_listen_history.sql`
2. `002_create_pending_preferences.sql`
3. `003_verify_user_category_subscriptions.sql`

---

## Testing Strategy

### Unit Tests
- CategoryPicker selection logic
- Preference storage/retrieval hooks
- Feed filtering logic

### Integration Tests
- Preference API endpoints
- Listen history tracking
- Anonymous to authenticated preference transfer

### E2E Tests
- Complete signup flow with preferences
- Dashboard personalization
- Settings modification flow

---

## Rollout Strategy

1. **Phase 1-2**: Database + CategoryPicker component (foundation)
2. **Phase 3-4**: Signup flow integration (core conversion feature)
3. **Phase 5**: Settings page (user management)
4. **Phase 6**: Personalized feed (value delivery)
5. **Phase 7**: Listen history (feed refinement)
6. **Phase 8**: Marketing integration (acquisition optimization)

---

## Success Metrics

- **Conversion rate**: % of users who select preferences and complete signup
- **Engagement**: Time spent on "For You" tab vs other tabs
- **Retention**: Return visits after preference setup
- **Preference completeness**: Average number of categories selected

---

## Open Questions

1. Should we require a minimum number of category selections?
2. Should "For You" fall back to all content if user has no preferences?
3. How long should we retain anonymous preferences before expiry?
4. Should we show a "customize" prompt on first dashboard visit if no preferences set?
