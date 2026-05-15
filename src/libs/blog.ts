import fs from 'node:fs/promises';
import path from 'node:path';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import { logger } from '@/libs/Logger';
import { getSupabaseAdmin } from '@/libs/Supabase';
import 'server-only';

const BLOG_DIR = path.join(process.cwd(), 'src', 'blog');

export function resolveSafeBlogPath(slug: string): string | null {
  const blogDir = path.resolve(BLOG_DIR);
  const fullPath = path.resolve(blogDir, `${slug}.md`);
  const relativePath = path.relative(blogDir, fullPath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    logger.warn('Path traversal attempt detected for markdown blog fallback', { slug, fullPath });
    return null;
  }

  return fullPath;
}

async function parseMarkdownFile(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = resolveSafeBlogPath(slug);
    if (!fullPath) {
      return null;
    }

    const raw = await fs.readFile(fullPath, 'utf8');
    const lines = raw.split('\n').filter(l => !l.startsWith('| '));
    const title = lines[0]?.replace(/^#\s*/, '').trim() || slug;
    const content = lines.join('\n');
    const excerpt = lines.slice(1).join(' ').replace(/\s+/g, ' ').slice(0, 160);
    const stat = await fs.stat(fullPath);
    const date = stat.mtime.toISOString();
    return {
      id: slug,
      title,
      slug,
      content,
      excerpt,
      published_at: date,
      updated_at: date,
      is_published: true,
      author: 'Speasy Team',
      category: 'Blog',
      image_url: null,
    };
  } catch {
    return null;
  }
}

async function getPostsFromFiles(): Promise<BlogPostSummary[]> {
  try {
    const files = await fs.readdir(BLOG_DIR);
    const posts = await Promise.all(
      files
        .filter(f => f.endsWith('.md'))
        .map(f => parseMarkdownFile(f.replace(/\.md$/, ''))),
    );
    return posts
      .filter((p): p is BlogPost => Boolean(p))
      .map(({ content: _content, ...rest }) => rest)
      .sort((a, b) => (a.published_at < b.published_at ? 1 : -1));
  } catch {
    return [];
  }
}

async function getPostFromFile(slug: string): Promise<BlogPost | null> {
  return parseMarkdownFile(slug);
}

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published_at: string;
  updated_at: string;
  is_published: boolean;
  author: string;
  category: string;
  image_url: string | null;
};

export type BlogPostSummary = Omit<BlogPost, 'content'>;

const SUMMARY_COLUMNS = 'id, title, slug, excerpt, published_at, updated_at, is_published, author, category, image_url';

async function fetchBlogPosts(): Promise<BlogPostSummary[]> {
  try {
    const client = getSupabaseAdmin();
    const { data, error } = await client
      .from('blog_posts')
      .select(SUMMARY_COLUMNS)
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) {
      throw error;
    }
    if (data && data.length > 0) {
      return data as BlogPostSummary[];
    }
  } catch (error) {
    logger.error('Error fetching blog posts from Supabase', { error });
  }

  return getPostsFromFiles();
}

async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const client = getSupabaseAdmin();
    const { data, error } = await client
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (!error && data) {
      return data as BlogPost;
    }
  } catch (error) {
    logger.error('Error fetching blog post by slug from Supabase', { error, slug });
  }

  return getPostFromFile(slug);
}

export const getBlogPosts: () => Promise<BlogPostSummary[]> = unstable_cache(
  fetchBlogPosts,
  ['blog-posts'],
  { revalidate: 3600, tags: ['blog'] },
);

export const getBlogPostsForStaticGeneration = getBlogPosts;

export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
  const cached = unstable_cache(
    fetchBlogPostBySlug,
    ['blog-post', slug],
    { revalidate: 3600, tags: ['blog', `blog-post-${slug}`] },
  );
  const post = await cached(slug);
  if (!post) {
    notFound();
  }
  return post;
}
