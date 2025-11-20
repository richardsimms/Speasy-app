'use client';

import { motion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="mx-auto max-w-5xl space-y-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-accent/10 border-accent/20 inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm"
        >
          <Sparkles className="text-accent h-4 w-4" />
          <span className="text-accent text-sm font-medium">Turn newsletters into podcasts</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-foreground pb-2 text-4xl leading-[1.1] font-bold tracking-tighter text-balance md:text-6xl lg:text-7xl xl:text-8xl"
        >
          Turn your newsletter backlog
          {' '}
          <br className="hidden lg:block" />
          <span className="from-primary to-primary/50 bg-gradient-to-r bg-clip-text text-transparent">
            into daily podcasts
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed text-balance md:text-xl"
        >
          Stop feeling guilty about unread newsletters. Speasy converts them into audio summaries you can absorb while commuting, exercising, or doing chores.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row"
        >
          <Button size="lg" className="group rounded-full px-8 py-6 text-lg">
            Start listening - $5/month
            <Play className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg">
            Join Pro waitlist
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-muted-foreground pt-8 text-sm"
        >
          Available on Apple Podcasts, Spotify, Overcast & more
        </motion.div>
      </div>
    </section>
  );
}
