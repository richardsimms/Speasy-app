import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

const {
  mockCreateAdminClient,
  mockGenerateRssFeedAsync,
  mockLogger,
  mockMaybeSingle,
} = vi.hoisted(() => ({
  mockCreateAdminClient: vi.fn(),
  mockGenerateRssFeedAsync: vi.fn(),
  mockLogger: {
    debug: vi.fn(),
    error: vi.fn(),
  },
  mockMaybeSingle: vi.fn(),
}));

vi.mock('next/cache', () => ({
  unstable_cache: (callback: (...args: any[]) => any) => callback,
}));

vi.mock('@/libs/feed-generator', () => ({
  generateRssFeedAsync: mockGenerateRssFeedAsync,
}));

vi.mock('@/libs/Logger', () => ({
  logger: mockLogger,
}));

vi.mock('@/libs/server-only', () => ({
  createAdminClient: mockCreateAdminClient,
}));

describe('GET /api/feeds/[userId]/[feedId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const feedQuery = {
      select: vi.fn(),
      eq: vi.fn(),
      ilike: vi.fn(),
      maybeSingle: mockMaybeSingle,
    };
    feedQuery.select.mockReturnValue(feedQuery);
    feedQuery.eq.mockReturnValue(feedQuery);
    feedQuery.ilike.mockReturnValue(feedQuery);

    mockCreateAdminClient.mockReturnValue({
      from: vi.fn(() => feedQuery),
    });
  });

  it('returns 404 without logging a server error when the default feed is missing', async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const response = await GET(
      {} as any,
      { params: Promise.resolve({ userId: 'user-without-feed', feedId: 'default' }) },
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toBe('Feed not found');
    expect(mockMaybeSingle).toHaveBeenCalledOnce();
    expect(mockLogger.debug).toHaveBeenCalledWith('Feed not found', {
      userId: 'user-without-feed',
      feedId: 'default',
    });
    expect(mockLogger.error).not.toHaveBeenCalled();
    expect(mockGenerateRssFeedAsync).not.toHaveBeenCalled();
  });
});
