'use client';

import type { BlogPost } from '@/libs/blog';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatDateShort } from '@/libs/utils';

type BlogPostListProps = {
  posts: BlogPost[];
};

function truncateExcerpt(excerpt: string | null | undefined, maxLength: number = 280): string {
  if (!excerpt) {
    return '';
  }
  if (excerpt.length <= maxLength) {
    return excerpt;
  }
  return `${excerpt.slice(0, maxLength).trim()}...`;
}

export function BlogPostList({ posts }: BlogPostListProps) {
  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-12 text-center"
      >
        <h3 className="text-lg font-medium text-white">No posts found</h3>
        <p className="text-muted-foreground mt-2">
          Check back soon for updates!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="group"
        >
          <div className="relative block overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 transition-all duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-white/5">
            {/* Hover indicator */}
            <div className="absolute top-0 right-4 left-4 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 group-hover:scale-x-100" />

            {/* Header with badge and date */}
            <div className="mb-4 flex items-center justify-between">
              <Badge
                variant="secondary"
                className="border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              >
                {post.category}
              </Badge>
              <time className="text-sm text-white/50">
                {formatDateShort(post.published_at)}
              </time>
            </div>

            {/* Title */}
            <h2 className="mb-3 text-2xl font-bold text-white transition-colors group-hover:text-white/90">
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mb-4 leading-relaxed text-white/60">
                {truncateExcerpt(post.excerpt, 280)}
              </p>
            )}

            {/* Read more link */}
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors group-hover:text-white"
            >
              Read more
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
