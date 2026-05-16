import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogPostList } from '@/components/blog-post-list';
import { getBlogPosts } from '@/libs/blog';
import { buildBlogIndexSchemas } from '@/libs/blog-seo';
import { getBaseUrl } from '@/utils/Helpers';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Newsletter to audio guides and updates',
  description: 'Learn how to turn newsletters and saved articles into podcast-style audio with Speasy guides, tutorials, and product updates.',
  alternates: {
    canonical: `${getBaseUrl()}/blog`,
  },
  openGraph: {
    type: 'website',
    url: `${getBaseUrl()}/blog`,
    title: 'Speasy blog: newsletter to audio guides',
    description: 'Actionable guides for listening to newsletters and articles as podcast-style audio.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Speasy blog: newsletter to audio guides',
    description: 'Actionable guides for listening to newsletters and articles as podcast-style audio.',
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const blogUrl = `${getBaseUrl()}/blog`;
  const jsonLdSchemas = buildBlogIndexSchemas(posts, blogUrl, getBaseUrl());

  return (
    <>
      {jsonLdSchemas.map(schema => (
        <script
          key={`blog-schema-${String(schema['@type'])}`}
          type="application/ld+json"
          // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 lg:px-8">
        <div className="mb-10 space-y-4">
          <h1 className="font-serif text-5xl leading-tight text-white">Speasy Blog</h1>
          <p className="max-w-3xl text-white/80">
            Practical guides on how to listen to newsletters while commuting, convert articles into
            audio, and stay informed without adding more screen time.
          </p>
          <p className="text-white/60">
            {posts.length}
            {' '}
            {posts.length === 1 ? 'article' : 'articles'}
            {' '}
            •
            {' '}
            <Link href="/latest" className="text-white/80 underline underline-offset-4 transition-colors hover:text-white">
              listen to the latest audio feed
            </Link>
            {' '}
            •
            {' '}
            <Link href="/" className="text-white/80 underline underline-offset-4 transition-colors hover:text-white">
              try Speasy
            </Link>
          </p>
        </div>
        <BlogPostList posts={posts} />
      </div>
    </>
  );
}
