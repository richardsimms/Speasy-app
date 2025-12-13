import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/footer';
import { Markdown } from '@/components/markdown';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
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
      <PageHeader title={post.title} />
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex items-center justify-between">
              <Badge variant="secondary">{post.category}</Badge>
              <div className="text-sm text-white">
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                <span className="mx-2">•</span>
                <span>{post.author}</span>
              </div>
            </div>

            <Markdown content={post.content} />

            <div className="mt-12 border-t pt-6">
              <Link href="/blog/" className="inline-flex items-center text-white hover:underline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1 h-4 w-4"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
                Back to all posts
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>

  );
}
