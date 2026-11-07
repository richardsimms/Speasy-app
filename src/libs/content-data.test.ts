import { beforeEach, describe, expect, it, vi } from 'vitest';

const getSupabaseAdmin = vi.fn();

vi.mock('next/cache', () => ({
  unstable_cache: (callback: (...args: any[]) => unknown) => callback,
}));
vi.mock('@/libs/Env', () => ({
  Env: {
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
  },
}));
vi.mock('@/libs/Logger', () => ({
  logger: { error: vi.fn() },
}));
vi.mock('@/libs/Supabase', () => ({ getSupabaseAdmin }));

describe('fetchContentDetail', () => {
  beforeEach(() => {
    getSupabaseAdmin.mockClear();
  });

  it.each(['2700.jpg', 'ibe0kpng290h1.png'])('does not query Supabase for invalid content ID %s', async (id) => {
    const { fetchContentDetail } = await import('./content-data');

    await expect(fetchContentDetail(id)).resolves.toBeNull();
    expect(getSupabaseAdmin).not.toHaveBeenCalled();
  });
});
