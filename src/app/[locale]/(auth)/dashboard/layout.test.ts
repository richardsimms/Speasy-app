import type { ReactNode } from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import DashboardLayout from './layout';

const { mockSetRequestLocale } = vi.hoisted(() => ({
  mockSetRequestLocale: vi.fn(),
}));

vi.mock('next-intl/server', () => ({
  setRequestLocale: mockSetRequestLocale,
}));

vi.mock('@/components/dashboard-sidebar', () => ({
  DashboardSidebar: () =>
    createElement('aside', { 'data-testid': 'dashboard-sidebar' }),
}));

vi.mock('@/components/sidebar-context', () => ({
  SidebarProvider: ({ children }: { children: ReactNode }) =>
    createElement('div', { 'data-testid': 'sidebar-provider' }, children),
}));

describe('DashboardLayout', () => {
  it('wraps content in SidebarProvider and sets locale', async () => {
    const element = await DashboardLayout({
      children: createElement('section', null, 'Dashboard content'),
      params: Promise.resolve({ locale: 'en' }),
    });

    const html = renderToStaticMarkup(element);

    expect(mockSetRequestLocale).toHaveBeenCalledWith('en');
    expect(html).toContain('data-testid="sidebar-provider"');
    expect(html).toContain('data-testid="dashboard-sidebar"');
    expect(html).toContain('Dashboard content');
  });
});
