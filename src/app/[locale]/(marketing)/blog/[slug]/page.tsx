import type { Metadata } from 'next';
import { ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/footer';
import { Markdown } from '@/components/markdown';
import { PageHeader } from '@/components/page-header';
import { getBlogPostBySlug, getBlogPostsForStaticGeneration } from '@/libs/blog';
import { formatDate } from '@/libs/utils';
import { getBaseUrl } from '@/utils/Helpers';

export const revalidate = 3600;

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  const url = `${getBaseUrl()}/blog/${slug}`;

  return {
    title: `${post.title} - Speasy Blog`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.published_at,
      modifiedTime: post.updated_at ?? post.published_at,
      authors: [post.author],
      ...(post.image_url && { images: [{ url: post.image_url }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      ...(post.image_url && { images: [post.image_url] }),
    },
  };
}

export async function generateStaticParams() {
  const posts = await getBlogPostsForStaticGeneration();

  return posts.map(post => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  const url = `${getBaseUrl()}/blog/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.excerpt,
    'author': { '@type': 'Person', 'name': post.author },
    'datePublished': post.published_at,
    'dateModified': post.updated_at ?? post.published_at,
    'url': url,
    'publisher': {
      '@type': 'Organization',
      'name': 'Speasy',
      'url': getBaseUrl(),
    },
    ...(post.image_url && { image: post.image_url }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <PageHeader title={post.title} />
            <div className="mb-4 flex items-center gap-4 text-sm text-white/60">
              <Calendar className="h-4 w-4" />
              <span>
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              </span>
              <span className="mx-2">•</span>
              <span>{post.category}</span>
            </div>

            <Markdown content={post.content} />

            <div className="mx-auto max-w-4xl px-4 py-6">
              <Link href="/blog/" className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to all posts</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>

  );
}
