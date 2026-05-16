import { describe, expect, it } from 'vitest';
import { buildBlogIndexSchemas, buildBlogPostSchemas, getBlogFaqEntries } from './blog-seo';

const basePost = {
  id: '1',
  title: 'Transform your reading list into audio',
  slug: 'transform-articles-to-podcasts',
  content: 'content',
  excerpt: 'Turn newsletter reading into podcast listening.',
  published_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-02T00:00:00.000Z',
  is_published: true,
  author: 'Speasy Team',
  category: 'Productivity',
  image_url: null,
} as const;

describe('buildBlogPostSchemas', () => {
  it('returns blogposting, faqpage, and howto schemas for supported guide slugs', () => {
    const schemas = buildBlogPostSchemas(
      basePost,
      'https://www.speasy.app/blog/transform-articles-to-podcasts',
      'https://www.speasy.app',
    );

    expect(schemas.map(schema => schema['@type'])).toEqual(['BlogPosting', 'FAQPage', 'HowTo']);
  });

  it('returns only blogposting schema for posts without faq/howto mapping', () => {
    const schemas = buildBlogPostSchemas(
      { ...basePost, slug: 'newsletter-overload' },
      'https://www.speasy.app/blog/newsletter-overload',
      'https://www.speasy.app/',
    );

    expect(schemas.map(schema => schema['@type'])).toEqual(['BlogPosting']);
  });
});

describe('buildBlogIndexSchemas', () => {
  it('returns collection and ordered item list schemas', () => {
    const schemas = buildBlogIndexSchemas(
      [
        { ...basePost, slug: 'first-post' },
        { ...basePost, slug: 'second-post' },
      ],
      'https://www.speasy.app/blog',
      'https://www.speasy.app/',
    );

    expect(schemas.map(schema => schema['@type'])).toEqual(['CollectionPage', 'ItemList']);
    expect(schemas[1]?.numberOfItems).toEqual(2);
  });
});

describe('getBlogFaqEntries', () => {
  it('returns faq entries for configured slugs and empty for unknown slugs', () => {
    const knownFaqEntries = getBlogFaqEntries('transform-articles-to-podcasts');
    const unknownFaqEntries = getBlogFaqEntries('not-configured');

    expect(knownFaqEntries.length).toBe(3);
    expect(unknownFaqEntries).toEqual([]);
  });
});
