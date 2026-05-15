import { BlogPostList } from '@/components/blog-post-list';
import { getBlogPosts } from '@/libs/blog';

export const revalidate = 3600;

export const metadata = {
  title: 'Digests - Speasy',
  description: 'Latest news, updates, and insights from the Speasy team',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="mb-2 font-serif text-5xl leading-tight text-white">Digests</h1>
        <p className="text-white/50">
          {posts.length}
          {' '}
          {posts.length === 1 ? 'article' : 'articles'}
        </p>
      </div>
      <BlogPostList posts={posts} />
    </div>
  );
}
