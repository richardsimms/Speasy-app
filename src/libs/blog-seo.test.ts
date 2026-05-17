import { describe, expect, it } from 'vitest';
import {
  buildBlogIndexSchemas,
  buildBlogPostSchemas,
  getBlogFaqEntries,
  getBlogPostDescription,
  getBlogPostTitle,
  parseBlogPostJsonLd,
} from './blog-seo';

const basePost = {
  id: '1',
  title: 'Transform your reading list into audio',
  slug: 'transform-articles-to-podcasts',
  content: 'content',
  excerpt: 'Turn newsletter reading into podcast listening.',
  published_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-02T00:00:00.000Z',
  is_published: true,
  author: 'Richard Simms',
  category: 'Productivity',
  image_url: null,
} as const;

describe('buildBlogPostSchemas', () => {
  it('uses person author with profile url and publisher sameAs links', () => {
    const schemas = buildBlogPostSchemas(
      basePost,
      'https://www.speasy.app/blog/transform-articles-to-podcasts',
      'https://www.speasy.app',
    );
    const articleSchema = schemas[0]!;

    expect(articleSchema.author).toEqual({
      '@type': 'Person',
      'name': 'Richard Simms',
      'url': 'https://rsimms.com',
      'sameAs': [
        'https://rsimms.com',
        'https://www.linkedin.com/in/richardsimms',
      ],
    });
    expect(articleSchema.publisher).toMatchObject({
      '@type': 'Organization',
      'name': 'Speasy',
      'sameAs': [
        'https://www.speasy.app',
        'https://www.linkedin.com/in/richardsimms',
      ],
    });
  });

  it('maps legacy speasy team author to richard simms in schema', () => {
    const schemas = buildBlogPostSchemas(
      { ...basePost, author: 'Speasy Team' },
      'https://www.speasy.app/blog/transform-articles-to-podcasts',
      'https://www.speasy.app',
    );

    expect(schemas[0]?.author).toEqual({
      '@type': 'Person',
      'name': 'Richard Simms',
      'url': 'https://rsimms.com',
      'sameAs': [
        'https://rsimms.com',
        'https://www.linkedin.com/in/richardsimms',
      ],
    });
  });

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

describe('getBlogPostTitle', () => {
  it('prefers seo_title when set and falls back to title', () => {
    expect(getBlogPostTitle({
      ...basePost,
      seo_title: 'Article to Audio Conversion: Complete Guide (2026)',
    })).toBe('Article to Audio Conversion: Complete Guide (2026)');

    expect(getBlogPostTitle({ ...basePost, seo_title: null })).toBe(basePost.title);
    expect(getBlogPostTitle({ ...basePost, seo_title: '   ' })).toBe(basePost.title);
  });
});

describe('getBlogPostDescription', () => {
  it('prefers meta_description when set and falls back to excerpt', () => {
    expect(getBlogPostDescription({
      ...basePost,
      meta_description: 'Article-to-audio conversion turns written content into spoken audio.',
    })).toBe('Article-to-audio conversion turns written content into spoken audio.');

    expect(getBlogPostDescription({ ...basePost, meta_description: null })).toBe(basePost.excerpt);
    expect(getBlogPostDescription({ ...basePost, meta_description: '' })).toBe(basePost.excerpt);
  });
});

describe('parseBlogPostJsonLd', () => {
  const articleSchema = { '@type': 'Article', headline: 'Test' };
  const faqSchema = { '@type': 'FAQPage', mainEntity: [] };

  it('returns empty array for null, undefined, empty string, and invalid json', () => {
    expect(parseBlogPostJsonLd(null)).toEqual([]);
    expect(parseBlogPostJsonLd(undefined)).toEqual([]);
    expect(parseBlogPostJsonLd('')).toEqual([]);
    expect(parseBlogPostJsonLd('   ')).toEqual([]);
    expect(parseBlogPostJsonLd('not-json')).toEqual([]);
  });

  it('parses json string, single object, and array of schemas', () => {
    expect(parseBlogPostJsonLd(JSON.stringify(articleSchema))).toEqual([articleSchema]);
    expect(parseBlogPostJsonLd(articleSchema)).toEqual([articleSchema]);
    expect(parseBlogPostJsonLd([articleSchema, faqSchema])).toEqual([articleSchema, faqSchema]);
  });

  it('filters non-object entries from arrays', () => {
    const mixedArray = [articleSchema, null, 'invalid', faqSchema];
    expect(parseBlogPostJsonLd(mixedArray as unknown as typeof articleSchema[])).toEqual([
      articleSchema,
      faqSchema,
    ]);
  });
});
