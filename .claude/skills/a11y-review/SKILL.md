# Accessibility Review

1. Read all component files in the specified directory
2. Check for: missing aria labels, keyboard navigation, color contrast, focus states, screen reader support
3. Create a markdown report of all issues found with severity ratings
4. Apply all fixes automatically
5. Run `npx tsc --noEmit` and `npx eslint .` to verify no regressions
6. Summarize what was fixed
