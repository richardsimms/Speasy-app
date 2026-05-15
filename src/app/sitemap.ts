import type { MetadataRoute } from 'next';
import { getBlogPosts } from '@/libs/blog';
import { getBaseUrl } from '@/utils/Helpers';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();
  const base = getBaseUrl();

  const blogEntries: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at ?? post.published_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    {
      url: `${base}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${base}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogEntries,
  ];
}
