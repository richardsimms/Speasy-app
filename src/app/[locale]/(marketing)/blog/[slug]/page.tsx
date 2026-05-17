import type { Metadata } from 'next';
import { ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/footer';
import { Markdown } from '@/components/markdown';
import { PageHeader } from '@/components/page-header';
import { getBlogPostBySlug, getBlogPostsForStaticGeneration } from '@/libs/blog';
import {
  buildBlogPostSchemas,
  getBlogFaqEntries,
  getBlogPostDescription,
  getBlogPostTitle,
  parseBlogPostJsonLd,
} from '@/libs/blog-seo';
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
  const title = getBlogPostTitle(post);
  const description = getBlogPostDescription(post);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      publishedTime: post.published_at,
      modifiedTime: post.updated_at ?? post.published_at,
      authors: [post.author],
      ...(post.image_url && { images: [{ url: post.image_url }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(post.image_url && { images: [post.image_url] }),
    },
    keywords: [
      'newsletter to audio',
      'text to speech newsletters',
      'listen to newsletters',
      'article to podcast',
      'speasy',
    ],
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
  const storedJsonLd = parseBlogPostJsonLd(post.json_ld);
  const jsonLdSchemas = storedJsonLd.length > 0
    ? storedJsonLd
    : buildBlogPostSchemas(post, url, getBaseUrl());
  const faqEntries = getBlogFaqEntries(post.slug);

  return (
    <>
      {jsonLdSchemas.map(schema => (
        <script
          key={`blog-post-schema-${String(schema['@type'])}`}
          type="application/ld+json"
          // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
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
            {faqEntries.length > 0 && (
              <section className="mt-12 border-t border-white/10 pt-8">
                <h2 className="mb-4 text-2xl font-bold text-white">FAQ</h2>
                <dl className="space-y-4">
                  {faqEntries.map(entry => (
                    <div key={entry.question} className="space-y-1">
                      <dt className="text-base font-semibold text-white">{entry.question}</dt>
                      <dd className="text-sm leading-relaxed text-white/70">{entry.answer}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <div className="mx-auto max-w-4xl px-4 py-6">
              <Link href="/blog" className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white">
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
