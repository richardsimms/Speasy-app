import path from 'node:path';
import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

let resolveSafeBlogPath: (slug: string) => string | null;

beforeAll(async () => {
  ({ resolveSafeBlogPath } = await import('./blog'));
});

describe('resolveSafeBlogPath', () => {
  it('returns a path for a normal slug within the blog directory', () => {
    const result = resolveSafeBlogPath('hello-world');

    expect(result).toBe(path.resolve(process.cwd(), 'src', 'blog', 'hello-world.md'));
  });

  it('returns null for traversal attempts', () => {
    expect(resolveSafeBlogPath('../../README')).toBeNull();
    expect(resolveSafeBlogPath('../blog-post')).toBeNull();
  });
});
