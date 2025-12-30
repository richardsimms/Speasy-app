'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Clock,
  Compass,
  Ear,
  Heart,
  Lightbulb,
  Shield,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/footer';
import { ScrollProgress } from '@/components/scroll-progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const manifestoItems = [
  {
    title: 'Time matters',
    description:
      'Time is the one thing you never get back. Speasy exists to respect it.',
    icon: Clock,
    color: 'from-violet-500/20 to-purple-500/20',
  },
  {
    title: 'Knowledge should fit your life',
    description:
      'Learning should work around your day, not fight it. If reading does not fit, listening should.',
    icon: Compass,
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    title: 'No guilt, no backlog',
    description:
      'Saved articles are not a failure. They are good intent stuck in the wrong format.',
    icon: Heart,
    color: 'from-pink-500/20 to-rose-500/20',
  },
  {
    title: 'Listen when it suits you',
    description: 'Walking, commuting, cooking, resting. Speasy moves with you.',
    icon: Ear,
    color: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    title: 'Simple over clever',
    description:
      'Clear audio. Few steps. No clutter. If it takes effort, it is wrong.',
    icon: Zap,
    color: 'from-amber-500/20 to-orange-500/20',
  },
  {
    title: 'Quality earns trust',
    description:
      'Audio should sound calm and human. Sources should be clear. Nothing hidden.',
    icon: Shield,
    color: 'from-indigo-500/20 to-violet-500/20',
  },
  {
    title: 'You stay in control',
    description:
      'Your interests. Your pace. Your feed. Speasy does not decide for you.',
    icon: Target,
    color: 'from-rose-500/20 to-pink-500/20',
  },
  {
    title: 'Learning without pressure',
    description:
      'No chasing streaks. No noise. Just steady progress, your way.',
    icon: Lightbulb,
    color: 'from-cyan-500/20 to-blue-500/20',
  },
  {
    title: 'Reclaim your time',
    description:
      'Not to do more work, but to think, grow, and live a bit better.',
    icon: Sparkles,
    color: 'from-purple-500/20 to-violet-500/20',
  },
];

/**
 * Render a decorative gradient placeholder used as a visual stand-in for images or illustrations.
 *
 * The `variant` controls the gradient palette and overall tint; `className` is appended to the root container for sizing or positioning.
 *
 * @param className - Optional additional Tailwind CSS classes applied to the root element
 * @param variant - Visual style to use; `"hero"` for a richer hero gradient, `"section"` for a subtler section gradient
 * @returns The placeholder JSX element to display in place of an image or illustration
 */
function PlaceholderImage({
  className,
  variant = 'hero',
}: {
  className?: string;
  variant?: 'hero' | 'section';
}) {
  const gradients = {
    hero: 'from-purple-600/30 via-blue-600/20 to-cyan-600/30',
    section: 'from-violet-500/20 via-purple-500/10 to-blue-500/20',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradients[variant]} ${className}`}
    >
      <div className="absolute inset-0 opacity-30">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm" />
      </div>
    </div>
  );
}

/**
 * Render the Manifesto marketing page for the app.
 *
 * Renders a multi-section page describing the product manifesto, including
 * an animated hero, opening statement, a responsive grid of manifesto items,
 * feature and control sections, a closing call-to-action, and the site footer.
 *
 * @returns The React element for the Manifesto marketing page.
 */
export default function ManifestoPage() {
  return (
    <>
      <ScrollProgress />
      <main className="relative overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative flex min-h-[60vh] items-center overflow-hidden px-6 md:px-8">
          {/* Subtle gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent" />

          {/* Grid pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                backgroundSize: '80px 80px',
              }}
            />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-4xl space-y-6 py-16">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-4xl leading-[1.1] font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
            >
              What we
              {' '}
              <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                believe in
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="max-w-xl text-lg leading-relaxed text-gray-300 md:text-xl"
            >
              These are the principles that guide everything we build. Every
              feature, every decision, every line of code is measured against
              them.
            </motion.p>
          </div>

          {/* Floating gradient orbs for depth */}
          <div className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        </section>

        {/* Opening Statement */}
        <section className="relative px-6 py-16 md:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-12 md:grid-cols-2 md:items-center"
            >
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Time matters
                </h2>
                <p className="text-xl leading-relaxed text-gray-300">
                  Time is the one thing you never get back.
                </p>
                <p className="text-2xl font-semibold text-white">
                  Speasy exists to respect it.
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <PlaceholderImage
                  className="aspect-square w-full"
                  variant="hero"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Manifesto Items Grid */}
        <section className="relative px-6 py-16 md:px-8">
          <div className="pointer-events-none absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                {manifestoItems.slice(1).map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <motion.div
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="group h-full"
                    >
                      <Card className="relative h-full overflow-hidden border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-900/30 p-6 shadow-lg backdrop-blur-sm transition-all duration-500 hover:border-gray-700">
                        {/* Animated glow effect on hover */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                          initial={false}
                        />

                        {/* Content */}
                        <div className="relative z-10">
                          <div className="mb-4 inline-block rounded-lg bg-gray-800/60 p-2">
                            <item.icon className="h-5 w-5 text-gray-300" />
                          </div>

                          <h3 className="mb-2 text-lg font-semibold text-white">
                            {item.title}
                          </h3>
                          <p className="text-sm leading-relaxed text-gray-300">
                            {item.description}
                          </p>
                        </div>
                      </Card>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Section - Simple Over Clever */}
        <section className="relative px-6 py-16 md:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-12 md:grid-cols-2 md:items-center"
            >
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Simple over clever
                </h2>
                <p className="text-lg leading-relaxed text-gray-300">
                  Clear audio. Few steps. No clutter.
                </p>
                <p className="text-xl font-medium text-white">
                  If it takes effort, it is wrong.
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <PlaceholderImage
                  className="aspect-video w-full"
                  variant="section"
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Control Section */}
        <section className="relative px-6 py-16 md:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-12 md:grid-cols-2 md:items-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-2 md:order-1"
              >
                <PlaceholderImage
                  className="aspect-square w-full"
                  variant="section"
                />
              </motion.div>
              <div className="order-1 space-y-6 md:order-2">
                <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                  You stay in control
                </h2>
                <div className="space-y-2 text-lg leading-relaxed text-gray-300">
                  <p>Your interests.</p>
                  <p>Your pace.</p>
                  <p>Your feed.</p>
                </div>
                <p className="text-xl font-medium text-white">
                  Speasy does not decide for you.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Closing Statement */}
        <section className="relative px-6 py-20 md:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-purple-400" />
                <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                  That is Speasy.
                </h2>
              </div>

              <p className="max-w-xl text-xl leading-relaxed text-gray-300">
                Not to do more work, but to think, grow, and live a bit better.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col gap-4 pt-4 sm:flex-row"
              >
                <Link href="/">
                  <Button
                    size="lg"
                    className="group rounded-full bg-white px-8 py-6 text-lg text-gray-900 hover:bg-gray-100"
                  >
                    Start listening
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-gray-600 px-8 py-6 text-lg text-white hover:bg-white/10"
                  >
                    Learn about us
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}