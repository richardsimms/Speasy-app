'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Footer() {
  const reducedMotion = useReducedMotion();

  return (
    <footer className="relative border-t border-gray-700 px-4 py-20 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl">
        <div className="space-y-8 text-center">
          <motion.h2
            initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.6 }}
            className="text-3xl font-bold text-balance text-white md:text-5xl"
          >
            Don&apos;t just read your newsletters. Live with them.
          </motion.h2>
          <motion.p
            initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-balance text-gray-200"
          >
            Join early and help us build the next version of Speasy, with inbox
            sync, custom playlists, and AI-powered personalization. Reclaim your
            reading list—One listen at a time.
          </motion.p>

          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0 }}
            whileInView={reducedMotion ? undefined : { opacity: 0.6 }}
            viewport={{ once: true }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 pt-12 text-gray-200"
          >
            <span className="text-sm">
              Available on your favorite podcast apps
            </span>
            <div className="flex gap-6">
              {['Apple Podcasts', 'Overcast', 'Pocket Casts'].map(
                app => (
                  <div key={app} className="text-xs font-medium">
                    {app}
                  </div>
                ),
              )}
            </div>
          </motion.div>

          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0 }}
            whileInView={reducedMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.8 }}
            className="pt-12 text-sm text-gray-200"
          >
            <p>&copy; 2025 Speasy. All rights reserved.</p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
