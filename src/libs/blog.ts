import fs from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { logger } from '@/libs/Logger';
import { getSupabaseAdmin } from '@/libs/Supabase';
import 'server-only';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return null;
  }
  return createClient(url, key);
}

const BLOG_DIR = path.join(process.cwd(), 'src', 'blog');

async function parseMarkdownFile(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(BLOG_DIR, `${slug}.md`);
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

async function getPostsFromFiles(): Promise<BlogPost[]> {
  try {
    const files = await fs.readdir(BLOG_DIR);
    const posts = await Promise.all(
      files
        .filter(f => f.endsWith('.md'))
        .map(f => parseMarkdownFile(f.replace(/\.md$/, ''))),
    );
    return posts.filter((p): p is BlogPost => Boolean(p)).sort((a, b) => (a.published_at < b.published_at ? 1 : -1));
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

// Use this for client requests (when cookies are available)
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const client = getSupabaseClient();
    if (client) {
      const { data: posts, error } = await client
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) {
        throw error;
      }
      if (posts) {
        return posts as BlogPost[];
      }
    }
  } catch (error) {
    logger.error('Error fetching blog posts from Supabase', { error });
    logger.error('Blog posts Supabase error, falling back to files', { error });
  }

  logger.debug('Falling back to markdown files for blog posts');
  return getPostsFromFiles();
}

// Use this for static site generation (where cookies aren't available)
export async function getBlogPostsForStaticGeneration(): Promise<BlogPost[]> {
  try {
    const client = getSupabaseClient() || getSupabaseAdmin();
    if (client) {
      const { data, error } = await client
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) {
        throw error;
      }
      if (data) {
        return data as BlogPost[];
      }
    }
  } catch (error) {
    logger.error('Error fetching blog posts for static generation', { error });
  }
  return getPostsFromFiles();
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
  try {
    const client = getSupabaseClient();
    if (client) {
      const { data: post, error } = await client
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (!error && post) {
        return post as BlogPost;
      }
    }
  } catch (error) {
    logger.error('Error fetching blog post by slug from Supabase', { error, slug });
    logger.error(`Blog post ${slug} Supabase error, falling back to file`, { error, slug });
  }

  logger.debug(`Falling back to markdown file for blog post: ${slug}`);
  const fallback = await getPostFromFile(slug);
  if (fallback) {
    logger.debug(`Successfully loaded blog post ${slug} from markdown file`);
    return fallback;
  }

  logger.error(`Blog post ${slug} not found in database or files`);
  notFound();
}

export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const client = getSupabaseClient();
    if (client) {
      const { data: posts, error } = await client
        .from('blog_posts')
        .select('slug')
        .eq('is_published', true);

      if (!error && posts) {
        return posts.map(post => post.slug);
      }
    }
  } catch (error) {
    logger.error('Error fetching slugs from Supabase', { error });
  }
  const files = await getPostsFromFiles();
  return files.map(p => p.slug);
}
