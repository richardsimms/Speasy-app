'use client';

import type { BlogPostSummary } from '@/libs/blog';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { MOTION } from '@/libs/motion-config';
import { formatDate } from '@/libs/utils';

type BlogPostListProps = {
  posts: BlogPostSummary[];
};

export function BlogPostList({ posts }: BlogPostListProps) {
  const reducedMotion = useReducedMotion();

  if (posts.length === 0) {
    return (
      <motion.div
        initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
        whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={reducedMotion ? { duration: 0 } : { duration: MOTION.duration.slow }}
        className="py-12 text-center"
      >
        <h3 className="text-lg font-medium text-white">No posts found</h3>
        <p className="mt-2 text-white/50">Check back soon for updates.</p>
      </motion.div>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <div className="space-y-6">
      {/* Featured post — full-width hero card */}
      {featured && (
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          whileTap={reducedMotion ? undefined : { scale: 0.99 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={reducedMotion ? { duration: 0 } : { duration: MOTION.duration.slow, ease: MOTION.easing.default }}
          className="group relative"
        >
          <Link
            href={`/blog/${featured.slug}`}
            className="relative block overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] transition-[border-color,box-shadow] duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-white/5"
          >
            <div className="p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium tracking-wider text-blue-400 uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {featured.category}
                </span>
                <span className="text-xs text-white/40">Featured</span>
              </div>
              <h2 className="mb-3 text-2xl leading-snug font-bold text-white transition-colors group-hover:text-white/90 md:text-3xl">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="mb-6 line-clamp-3 text-base leading-relaxed text-white/60">
                  {featured.excerpt}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-white/40">
                <time dateTime={featured.published_at}>{formatDate(featured.published_at)}</time>
                <span>·</span>
                <span>{featured.author}</span>
              </div>
            </div>
            <div className="absolute top-0 right-4 left-4 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 group-hover:scale-x-100" />
          </Link>
        </motion.div>
      )}

      {/* Remaining posts — 2-col grid on md+ */}
      {rest.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {rest.map((post, index) => (
            <motion.div
              key={post.id}
              initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              whileTap={reducedMotion ? undefined : { scale: 0.98 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: MOTION.duration.slow, delay: index * MOTION.stagger.cards, ease: MOTION.easing.default }
              }
              className="group relative"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] transition-[border-color,box-shadow] duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-white/5"
              >
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 inline-flex items-center gap-2 self-start rounded-full bg-white/5 px-3 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium tracking-wider text-white/70 uppercase">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="mb-2 line-clamp-2 text-lg font-bold text-white transition-colors group-hover:text-white/90">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-white/60">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-auto flex items-center gap-3 text-xs text-white/40">
                    <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                  </div>
                </div>
                <div className="absolute top-0 right-4 left-4 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
