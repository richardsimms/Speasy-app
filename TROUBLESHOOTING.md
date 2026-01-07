# Troubleshooting - Preference Components Not Showing

## Quick Checks

### 1. Are you signed in?
The preference components (sidebar/FAB) **only show for unauthenticated users**. If you're signed in, they won't appear.

**Solution:**
- Sign out: Go to `/dashboard/user-profile` and sign out
- Or use an incognito/private browser window
- Or clear your Clerk session cookies

### 2. Check Browser Console
Open browser DevTools (F12) and check:
- Any JavaScript errors?
- Network tab: Are API calls to `/api/categories` working?
- Console: Any warnings about Clerk or components?

### 3. Check Categories Exist
The components need categories to display. Verify:
```bash
# Check via Supabase dashboard or Drizzle Studio
pnpm run db:studio
```

Or check the API directly:
```bash
curl http://localhost:3000/api/categories
```

### 4. Desktop vs Mobile
- **Desktop (≥1024px)**: Look for sticky sidebar on the **right side** of the page
- **Mobile (<1024px)**: Look for floating action button (✨) in **bottom-right corner**

### 5. Component Visibility Logic
The components check:
- ✅ User is NOT signed in (`useUser().isSignedIn === false`)
- ✅ Categories exist and are loaded
- ✅ Sidebar wasn't dismissed (checks localStorage)
- ✅ Sidebar appears after 1 second delay

## Debug Steps

### Step 1: Verify Categories API
```bash
# Should return JSON with categories array
curl http://localhost:3000/api/categories
```

### Step 2: Check Authentication State
Open browser console and run:
```javascript
// Check if Clerk is loaded
console.log('Clerk loaded:', typeof window !== 'undefined' && window.Clerk);

// Check localStorage for dismissal
console.log('Sidebar dismissed:', localStorage.getItem('speasy_preference_sidebar_dismissed'));
```

### Step 3: Force Show Components (for testing)
Temporarily modify `src/components/preference-integration.tsx`:

```typescript
// Comment out the auth check for testing
// if (isSignedIn) {
//   return null;
// }
```

### Step 4: Check Component Rendering
Add a console log in `PreferenceIntegration`:
```typescript
console.log('PreferenceIntegration render:', {
  isSignedIn,
  isLoaded,
  categoriesCount: categories.length,
});
```

## Common Issues

### Issue: "Components don't show on desktop"
**Check:**
- Browser width is ≥1024px (check DevTools responsive mode)
- Sidebar is positioned `fixed right-0` - should be visible on right edge
- No z-index conflicts (sidebar is z-40)

### Issue: "FAB doesn't show on mobile"
**Check:**
- Browser width is <1024px
- FAB is `fixed bottom-6 right-6 z-50`
- Not hidden by scroll (should reappear after scroll stops)

### Issue: "Sidebar shows but is empty"
**Check:**
- Categories are being passed correctly
- Check browser console for errors in CategoryPicker
- Verify categories have `id` and `name` fields

### Issue: "Components flash then disappear"
**Possible causes:**
- Clerk is still loading (`isLoaded === false`)
- User becomes signed in after initial render
- Component is being unmounted

## Testing Checklist

- [ ] Signed out (or incognito window)
- [ ] Categories API returns data
- [ ] Browser console shows no errors
- [ ] Desktop: Sidebar visible on right (≥1024px)
- [ ] Mobile: FAB visible bottom-right (<1024px)
- [ ] Clicking sidebar/FAB opens preference modal
- [ ] CategoryPicker displays categories
- [ ] Can select categories
- [ ] "Continue" button redirects to sign-up

## Still Not Working?

1. **Check server logs** - Look for errors in terminal running `pnpm run dev`
2. **Verify environment variables** - Ensure Clerk keys are set
3. **Check Supabase connection** - Categories need to be fetched from database
4. **Clear browser cache** - Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
5. **Check React DevTools** - Verify components are mounting
