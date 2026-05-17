import { routing } from '@/libs/I18nRouting';

const PRODUCTION_SITE_URL = 'https://www.speasy.app';

function isBoilerplateDemoUrl(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith('nextjs-boilerplate.com');
  } catch {
    return false;
  }
}

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/$/, '');
}

function getConfiguredSiteUrl(): string | undefined {
  for (const candidate of [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
  ]) {
    if (!candidate || isBoilerplateDemoUrl(candidate)) {
      continue;
    }
    return normalizeSiteUrl(candidate);
  }
  return undefined;
}

export const getBaseUrl = () => {
  const configuredUrl = getConfiguredSiteUrl();
  if (configuredUrl) {
    return configuredUrl;
  }

  if (
    process.env.VERCEL_ENV === 'production'
    && process.env.VERCEL_PROJECT_PRODUCTION_URL
  ) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NODE_ENV === 'production') {
    return PRODUCTION_SITE_URL;
  }

  return 'http://localhost:3000';
};

export const getI18nPath = (url: string, locale: string) => {
  if (locale === routing.defaultLocale) {
    return url;
  }

  return `/${locale}${url}`;
};

export const isServer = () => {
  return typeof window === 'undefined';
};
