import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { page } from 'vitest/browser';
import { BaseTemplate } from './BaseTemplate';

describe('Base template', () => {
  describe('Render method', () => {
    it('should render children inside main element', () => {
      render(
        <BaseTemplate leftNav={<li>nav</li>}>
          <div>Test content</div>
        </BaseTemplate>,
      );

      const main = page.getByRole('main');
      const childContent = page.getByText('Test content');

      expect(main).toBeDefined();
      expect(childContent).toBeDefined();
    });
  });
});
