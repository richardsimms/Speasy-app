import type { Metadata } from 'next';
import { ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/footer';
import { Markdown } from '@/components/markdown';
import { PageHeader } from '@/components/page-header';
import { getBlogPostBySlug, getBlogPostsForStaticGeneration } from '@/libs/blog';
import { formatDate } from '@/libs/utils';

export const dynamic = 'force-dynamic';

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  return {
    title: `${post.title} - Speasy Blog`,
    description: post.excerpt,
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

  return (
    <>
      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            {/* Category badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-sm font-medium tracking-wider text-white/70 uppercase">
                {post.category}
              </span>
            </div>
            <PageHeader title={post.title} />
            <div className="mb-4 flex items-center gap-4 text-sm text-white/60">
              <Calendar className="h-4 w-4" />
              <span>
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              </span>
              <span className="mx-2">•</span>
              <span>{post.author}</span>
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
