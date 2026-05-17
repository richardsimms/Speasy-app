import { afterEach, describe, expect, it } from 'vitest';
import { routing } from '@/libs/I18nRouting';
import { getBaseUrl, getI18nPath } from './Helpers';

describe('Helpers', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('getBaseUrl function', () => {
    it('returns configured app url when set', () => {
      process.env.NEXT_PUBLIC_APP_URL = 'https://www.speasy.app';
      delete process.env.NEXT_PUBLIC_SITE_URL;

      expect(getBaseUrl()).toBe('https://www.speasy.app');
    });

    it('ignores boilerplate demo urls and falls back to production site', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_APP_URL = 'https://demo.nextjs-boilerplate.com';
      delete process.env.VERCEL_ENV;
      delete process.env.VERCEL_URL;
      delete process.env.VERCEL_PROJECT_PRODUCTION_URL;

      expect(getBaseUrl()).toBe('https://www.speasy.app');
    });

    it('strips trailing slash from configured urls', () => {
      process.env.NEXT_PUBLIC_APP_URL = 'https://www.speasy.app/';

      expect(getBaseUrl()).toBe('https://www.speasy.app');
    });
  });

  describe('getI18nPath function', () => {
    it('should not change the path for default language', () => {
      const url = '/random-url';
      const locale = routing.defaultLocale;

      expect(getI18nPath(url, locale)).toBe(url);
    });
  });
});
