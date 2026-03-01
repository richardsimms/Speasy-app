import type { ReactNode } from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { AudioPlayerLayout } from './audio-player-layout';

const { mockUsePathname } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(() => '/'),
}));

vi.mock('next/navigation', () => ({
  usePathname: mockUsePathname,
}));

vi.mock('next/dynamic', () => ({
  default: () => () => null,
}));

vi.mock('./playback-provider', () => ({
  PlaybackProvider: ({ children }: { children: ReactNode }) =>
    createElement('div', { 'data-testid': 'playback-provider' }, children),
}));

describe('AudioPlayerLayout', () => {
  const renderAtPath = (pathname: string): string => {
    mockUsePathname.mockImplementation(() => pathname);

    return renderToStaticMarkup(
      createElement(
        AudioPlayerLayout,
        null,
        createElement('main', null, 'Page content'),
      ),
    );
  };

  it('keeps PlaybackProvider mounted on discover pages', () => {
    const html = renderAtPath('/');

    expect(html).toContain('data-testid="playback-provider"');
    expect(html).toContain('Page content');
  });

  it('keeps PlaybackProvider mounted on non-discover pages', () => {
    const html = renderAtPath('/blog');

    expect(html).toContain('data-testid="playback-provider"');
    expect(html).toContain('Page content');
  });
});
