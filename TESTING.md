# Testing Guide - Category Preferences Feature

This guide explains how to test the new category preferences signup conversion flow.

## Prerequisites

1. **Clerk Account Setup**
   - Ensure you have Clerk credentials in your `.env.local`:
     ```bash
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
     CLERK_SECRET_KEY=sk_test_...
     ```

2. **Supabase Configuration** (for full functionality)
   ```bash
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
   ```

3. **Start Development Server**
   ```bash
   pnpm run dev
   ```
   This starts:
   - PGlite database on port 5433
   - Next.js dev server on http://localhost:3000
   - Sentry Spotlight (optional)

## Testing the Complete Flow

### Option 1: Test with Existing Account

If you already have a Clerk account:

1. **Sign In**
   - Navigate to: http://localhost:3000/sign-in
   - Or: http://localhost:3000/en/sign-in (for English)
   - Sign in with your existing credentials

2. **Check Current State**
   - After sign-in, you'll be redirected to `/dashboard`
   - If you have no preferences, you'll see all content in "For You" tab
   - If you have preferences, you'll see personalized content

3. **Test Preferences Settings**
   - Navigate to: http://localhost:3000/dashboard/settings/preferences
   - Select/deselect categories
   - Click "Save Preferences"
   - Go back to dashboard and check "For You" tab is personalized

### Option 2: Test New User Flow (Recommended)

To test the complete onboarding flow:

1. **Use Incognito/Private Browser**
   - Open a new incognito/private window
   - This ensures you start fresh without existing cookies

2. **Visit Landing Page**
   - Navigate to: http://localhost:3000
   - You should see the marketing page with content

3. **Test Pre-Signup Preference Capture** (Phase 3)
   - **Desktop**: Look for a sticky sidebar on the right with "Make it yours" card
   - **Mobile**: Look for a floating action button (✨) in bottom-right
   - Click to open preference selection
   - Select some categories
   - Click "Continue" → redirects to sign-up

4. **Sign Up**
   - Complete Clerk signup form
   - After signup, you should be redirected to `/onboarding` (not dashboard)

5. **Test Onboarding Page** (Phase 4)
   - Should see "Make it yours" page
   - Categories should be pre-selected (from step 3)
   - You can modify selections
   - Click "Continue to Dashboard"
   - Preferences are saved and you're redirected to dashboard

6. **Test Personalized Feed** (Phase 6)
   - On dashboard, check "For You" tab
   - Should only show content from your selected categories
   - Should exclude any content you've listened to (if listen history exists)

## Testing Individual Features

### Test Category Picker Component

1. Navigate to any page with CategoryPicker:
   - `/onboarding`
   - `/dashboard/settings/preferences`
   - Or create a test page

2. Verify:
   - ✅ Multi-select works (click multiple categories)
   - ✅ Selected items show checkmark and primary color
   - ✅ Minimum 1 selection required (can't deselect last one)
   - ✅ Validation message shows if 0 selected
   - ✅ Responsive grid layout (2-5 columns based on screen size)

### Test Preferences API

```bash
# Get current preferences
curl http://localhost:3000/api/user/preferences \
  -H "Cookie: __clerk_db_jwt=..." # You'll need to get this from browser

# Update preferences
curl -X PUT http://localhost:3000/api/user/preferences \
  -H "Content-Type: application/json" \
  -H "Cookie: __clerk_db_jwt=..." \
  -d '{"categoryIds": ["category-id-1", "category-id-2"]}'
```

### Test Anonymous Preferences

1. **Without Signing In**
   - Visit landing page
   - Open preference sidebar/FAB
   - Select categories
   - Check browser cookies: `speasy_pending_prefs` should exist
   - Check database: `pending_preferences` table should have entry

2. **Cookie Expiry**
   - Cookie expires after 1 hour
   - Preferences in database expire after 1 hour
   - Test by manually setting cookie expiry in browser dev tools

### Test Database Tables

Check that tables exist and have correct structure:

```bash
# Open Drizzle Studio
pnpm run db:studio

# Or query directly via Supabase dashboard
```

Verify:
- ✅ `listen_history` table exists
- ✅ `pending_preferences` table exists
- ✅ `user_category_subscriptions` table has correct structure

## Testing Scenarios

### Scenario 1: New User with Preferences
1. Visit site (anonymous)
2. Select preferences via sidebar/FAB
3. Sign up
4. ✅ Should see onboarding with pre-selected categories
5. ✅ Should see personalized "For You" feed after onboarding

### Scenario 2: Existing User Without Preferences
1. Sign in with existing account
2. ✅ Should see all content in "For You" tab
3. Go to settings → preferences
4. Select categories
5. ✅ "For You" tab should update immediately

### Scenario 3: User Updates Preferences
1. Sign in
2. Go to settings → preferences
3. Change selections
4. Save
5. ✅ Dashboard "For You" tab should reflect changes

### Scenario 4: Empty "For You" Feed
1. Sign in
2. Select very specific categories (that have no content)
3. ✅ Should see "Add more interests" CTA
4. Click CTA → should go to preferences settings

## Debugging Tips

### Check Browser Console
- Look for errors in console
- Check network tab for API calls
- Verify cookies are being set/read

### Check Server Logs
- Terminal running `pnpm run dev` shows server logs
- Look for errors from Supabase queries
- Check for authentication issues

### Check Database
```bash
# View database in Drizzle Studio
pnpm run db:studio

# Or use Supabase dashboard
# Check these tables:
# - users
# - user_category_subscriptions
# - pending_preferences
# - listen_history
# - categories
```

### Common Issues

1. **"User not found in database"**
   - Clerk user exists but not synced to Supabase
   - Solution: Webhook should handle this, or manually call `/api/users/sync`

2. **Preferences not saving**
   - Check API response in network tab
   - Verify user is authenticated
   - Check Supabase connection

3. **"For You" shows all content**
   - User might not have preferences set
   - Check `user_category_subscriptions` table
   - Verify filtering logic in dashboard page

4. **Onboarding not showing**
   - Check Clerk redirect configuration
   - Verify `signUpFallbackRedirectUrl` points to `/onboarding`
   - Check if user already has preferences (skips onboarding)

## Quick Test Checklist

- [ ] Can sign in with existing account
- [ ] Can sign up as new user
- [ ] New users redirected to onboarding (not dashboard)
- [ ] Onboarding page shows CategoryPicker
- [ ] Preferences can be saved
- [ ] Dashboard "For You" tab is personalized
- [ ] Settings page allows preference updates
- [ ] Anonymous preferences stored in cookie
- [ ] Preferences sync from cookie to database on signup
- [ ] Empty state shows CTA when no content matches

## Testing with Different Locales

The app supports multiple locales. Test with:
- English: http://localhost:3000/en
- French: http://localhost:3000/fr

All routes should work with locale prefix:
- `/en/sign-in`
- `/en/dashboard`
- `/en/onboarding`
- `/en/dashboard/settings/preferences`
