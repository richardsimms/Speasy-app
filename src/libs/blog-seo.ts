import type { BlogPost, BlogPostJsonLd, BlogPostSummary } from '@/libs/blog';

type JsonLd = Record<string, unknown>;

function isJsonLdObject(value: unknown): value is JsonLd {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeJsonLdToArray(value: unknown): JsonLd[] {
  if (Array.isArray(value)) {
    return value.filter(isJsonLdObject);
  }
  if (isJsonLdObject(value)) {
    return [value];
  }
  return [];
}

export function getBlogPostTitle(post: BlogPost): string {
  const seoTitle = post.seo_title?.trim();
  return seoTitle || post.title;
}

export function getBlogPostDescription(post: BlogPost): string {
  const metaDescription = post.meta_description?.trim();
  return metaDescription || post.excerpt;
}

export function parseBlogPostJsonLd(raw: BlogPostJsonLd | null | undefined): JsonLd[] {
  if (raw == null) {
    return [];
  }

  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) {
      return [];
    }
    try {
      return normalizeJsonLdToArray(JSON.parse(trimmed));
    } catch {
      return [];
    }
  }

  return normalizeJsonLdToArray(raw);
}

type BlogFaqEntry = {
  question: string;
  answer: string;
};

type BlogHowToEntry = {
  name: string;
  steps: readonly string[];
};

const BLOG_FAQ_BY_SLUG: Record<string, readonly BlogFaqEntry[]> = {
  'getting-started-with-speasy': [
    {
      question: 'How long does Speasy article conversion take?',
      answer: 'Most articles are converted to audio in 5 to 10 minutes after you add them to Speasy.',
    },
    {
      question: 'Can I listen to newsletters in my podcast app?',
      answer: 'Yes. Speasy creates a personal RSS feed that works with podcast apps that support private feeds.',
    },
    {
      question: 'Is Speasy useful for technical articles?',
      answer: 'Yes, although highly visual technical content can still be easier to review in its original written format.',
    },
  ],
  'transform-articles-to-podcasts': [
    {
      question: 'What is article-to-audio conversion?',
      answer: 'Article-to-audio conversion turns written articles and newsletters into spoken audio you can listen to on the go.',
    },
    {
      question: 'Can I listen to newsletters while commuting?',
      answer: 'Yes. Speasy helps you convert newsletter reading time into commute listening time through a podcast-style feed.',
    },
    {
      question: 'Do I need a special player for converted articles?',
      answer: 'No. You can use most podcast players that support personal RSS feeds.',
    },
  ],
};

const BLOG_HOW_TO_BY_SLUG: Record<string, BlogHowToEntry> = {
  'getting-started-with-speasy': {
    name: 'How to get started with Speasy',
    steps: [
      'Create your Speasy account and connect your reading and newsletter sources.',
      'Set your voice, playback speed, and content organization preferences.',
      'Add your private Speasy RSS feed to your preferred podcast app.',
      'Start listening and refine your setup based on your routine.',
    ],
  },
  'transform-articles-to-podcasts': {
    name: 'How to convert articles into a personal podcast feed',
    steps: [
      'Select long-form articles from your reading list that are worth listening to.',
      'Use a reliable text-to-speech workflow that preserves structure and readability.',
      'Publish converted content to a personal RSS feed and open it in your podcast app.',
      'Optimize playback speed, playlists, and offline downloads for your routine.',
    ],
  },
};

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, '');
}

const DEFAULT_AUTHOR = {
  name: 'Richard Simms',
  url: 'https://rsimms.com',
} as const;

const PUBLISHER_SAME_AS = [
  'https://www.linkedin.com/in/richardsimms',
] as const;

function resolveAuthorName(author: string): string {
  const trimmed = author.trim();
  if (!trimmed || trimmed === 'Speasy Team') {
    return DEFAULT_AUTHOR.name;
  }
  return trimmed;
}

function createAuthorSchema(author: string): JsonLd {
  const name = resolveAuthorName(author);
  const schema: JsonLd = {
    '@type': 'Person',
    'name': name,
  };

  if (name === DEFAULT_AUTHOR.name) {
    schema.url = DEFAULT_AUTHOR.url;
  }

  return schema;
}

function createPublisherSchema(baseUrl: string): JsonLd {
  return {
    '@type': 'Organization',
    'name': 'Speasy',
    'url': baseUrl,
    'sameAs': [baseUrl, ...PUBLISHER_SAME_AS],
    'logo': {
      '@type': 'ImageObject',
      'url': `${baseUrl}/apple-touch-icon.png`,
    },
  };
}

export function getBlogFaqEntries(slug: string): readonly BlogFaqEntry[] {
  return BLOG_FAQ_BY_SLUG[slug] ?? [];
}

export function buildBlogPostSchemas(post: BlogPost, postUrl: string, baseUrl: string): JsonLd[] {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const articleSchema: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.excerpt,
    'author': createAuthorSchema(post.author),
    'datePublished': post.published_at,
    'dateModified': post.updated_at ?? post.published_at,
    'url': postUrl,
    'mainEntityOfPage': { '@type': 'WebPage', '@id': postUrl },
    'publisher': createPublisherSchema(normalizedBaseUrl),
    'articleSection': post.category,
  };

  if (post.image_url) {
    articleSchema.image = post.image_url;
  }

  const schemas: JsonLd[] = [articleSchema];
  const faqEntries = getBlogFaqEntries(post.slug);
  if (faqEntries.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqEntries.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer,
        },
      })),
    });
  }

  const howTo = BLOG_HOW_TO_BY_SLUG[post.slug];
  if (howTo) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      'name': howTo.name,
      'description': post.excerpt,
      'step': howTo.steps.map((step, index) => ({
        '@type': 'HowToStep',
        'position': index + 1,
        'name': `Step ${index + 1}`,
        'text': step,
      })),
    });
  }

  return schemas;
}

export function buildBlogIndexSchemas(posts: BlogPostSummary[], blogUrl: string, baseUrl: string): JsonLd[] {
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  const itemListElements = posts.slice(0, 12).map((post, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': post.title,
    'url': `${normalizedBaseUrl}/blog/${post.slug}`,
  }));

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Speasy Blog',
      'description': 'Guides and product updates about turning newsletters and articles into podcast-style audio.',
      'url': blogUrl,
      'inLanguage': 'en',
      'isPartOf': {
        '@type': 'WebSite',
        'name': 'Speasy',
        'url': normalizedBaseUrl,
      },
      'publisher': createPublisherSchema(normalizedBaseUrl),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'itemListOrder': 'https://schema.org/ItemListOrderDescending',
      'numberOfItems': itemListElements.length,
      'itemListElement': itemListElements,
    },
  ];
}
