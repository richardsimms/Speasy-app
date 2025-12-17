import { BlogPostList } from '@/components/blog-post-list';
import { getBlogPosts } from '@/libs/blog';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Digests - Speasy',
  description: 'Latest news, updates, and insights from the Speasy team',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-2">
          <h1 className="mb-3 font-serif text-5xl leading-tight text-white">Digests</h1>
          <p className="text-lg text-white/70">
            Stay up to date with the latest news from Speasy.
          </p>
        </div>

        {/* Blog Posts */}
        <div className="mx-0 max-w-3xl">
          <BlogPostList posts={posts} />
        </div>
      </div>
    </div>
  );
}
