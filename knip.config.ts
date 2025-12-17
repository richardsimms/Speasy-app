import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // Files to exclude from Knip analysis
  ignore: [
    'checkly.config.ts',
    'src/libs/I18n.ts',
    'src/types/I18n.ts',
    'src/utils/Helpers.ts',
    'src/components/ui/card.tsx', // UI component library - components exported for use
    'src/components/ui/select.tsx', // UI component library - components exported for use
    'src/components/ui/badge.tsx', // UI component library - components exported for use
    'src/components/theme-provider.tsx', // Theme provider - used via layout but knip doesn't detect
    'src/components/content-audio-card.tsx', // Used by dashboard-content.tsx
    'src/utils/DBConnection.ts', // Used by src/libs/DB.ts
    'src/app/[locale]/(marketing)/globals.css', // CSS file - imported via global styles
    'tests/**/*.ts',
  ],
  // Dependencies to ignore during analysis
  ignoreDependencies: [
    'conventional-changelog-conventionalcommits',
    // These are used but knip doesn't detect them properly
    'drizzle-orm', // Used in src/utils/DBConnection.ts and src/libs/DB.ts
    'pg', // Used in src/utils/DBConnection.ts
    '@radix-ui/react-select', // Used in src/components/ui/select.tsx
    'next-themes', // Used in src/components/theme-provider.tsx
    '@hookform/resolvers', // Form validation library, may be used in future forms
    'react-hook-form', // Form library, may be used in future forms
    '@types/pg', // Type definitions for pg package (type-only imports not detected)
    '@faker-js/faker', // May be used for testing or data generation
    'tw-animate-css', // May be used in Tailwind config or CSS
  ],
  // Binaries to ignore during analysis
  ignoreBinaries: [
    'production', // False positive raised with dotenv-cli
  ],
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
  },
};

export default config;
