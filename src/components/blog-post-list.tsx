'use client';

import type { BlogPost } from '@/libs/blog';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { MOTION } from '@/libs/motion-config';

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
  const reducedMotion = useReducedMotion();

  if (posts.length === 0) {
    return (
      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        exit={reducedMotion ? undefined : { opacity: 0, y: -20 }}
        viewport={{ once: true }}
        transition={reducedMotion ? { duration: 0 } : { duration: MOTION.duration.slow }}
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
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          whileTap={reducedMotion ? undefined : { scale: 0.98 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -20 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  duration: MOTION.duration.slow,
                  delay: index * MOTION.stagger.cards,
                  ease: MOTION.easing.default,
                }
          }
          className="group relative"
        >
          <Link
            href={`/blog/${post.slug}`}
            className="relative block overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] transition-[border-color,box-shadow] duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-white/5"
          >
            {/* Content Section */}
            <div className="p-6">
              {/* Category Tag */}
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span className="text-xs font-medium tracking-wider text-white/70 uppercase">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="mb-2 line-clamp-2 text-xl font-bold text-white transition-colors group-hover:text-white/90">
                {post.title}
              </h3>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="line-clamp-3 text-sm leading-relaxed text-white/60">
                  {truncateExcerpt(post.excerpt, 280)}
                </p>
              )}
            </div>

            {/* Hover indicator */}
            <div className="absolute top-0 right-4 left-4 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 group-hover:scale-x-100" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
