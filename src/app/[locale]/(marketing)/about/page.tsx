'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Clock,
  Heart,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/footer';
import { ScrollProgress } from '@/components/scroll-progress';
import { Button } from '@/components/ui/button';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function AboutPage() {
  const reducedMotion = useReducedMotion();

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
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={reducedMotion ? false : { opacity: 1, y: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : {
                      duration: 0.7,
                      delay: 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }
              }
              className="text-4xl leading-[1.1] font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
            >
              Reclaim your time.
              {' '}
              <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                Rewrite your story.
              </span>
            </motion.h1>

            <motion.p
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={reducedMotion ? false : { opacity: 1, y: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : {
                      duration: 0.6,
                      delay: 0.25,
                      ease: [0.16, 1, 0.3, 1],
                    }
              }
              className="max-w-xl text-lg leading-relaxed text-gray-300 md:text-xl"
            >
              Speasy helps you keep learning without needing more hours in the
              day. We turn written content into audio so knowledge can move with
              you, not sit unread.
            </motion.p>
          </div>

          {/* Floating gradient orbs for depth */}
          <div className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        </section>

        {/* Problem Statement */}
        <section className="relative px-6 py-16 md:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <p className="text-xl leading-relaxed text-gray-300 md:text-2xl">
                Work is busy. Life is full. Your reading list keeps growing.
              </p>
              <p className="text-2xl font-semibold text-white md:text-3xl">
                Speasy exists to fix that.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Story */}
        <section className="relative px-6 py-16 md:px-8">
          <div className="pointer-events-none absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Our story
              </h2>

              <div className="space-y-6 text-lg leading-relaxed text-gray-300">
                <p>Speasy started with a familiar problem.</p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>The inbox was full.</li>
                  <li>The newsletter list was long.</li>
                  <li>Articles were saved with good intent, then forgotten.</li>
                </ul>

                <p className="font-medium text-white">
                  The issue was never the content. It was the format.
                </p>

                <p>
                  Reading needs stillness, focus, and a screen. Most days do not
                  offer that.
                  {' '}
                  <span className="font-medium text-white">
                    Listening does.
                  </span>
                </p>

                <p>
                  Commutes. Walks. Chores. Gym time. Quiet gaps between
                  meetings. These moments add up, but reading cannot use them.
                </p>

                <p className="text-xl font-semibold text-white">
                  So we built Speasy.
                </p>

                <p>
                  Speasy turns newsletters and articles into audio you can
                  listen to when it suits you. No catching up. No guilt. No
                  pressure.
                </p>

                <p className="font-medium text-white">
                  Just learning that fits real life.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What Speasy Does */}
        <section className="relative px-6 py-16 md:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                What Speasy does
              </h2>

              <p className="text-lg leading-relaxed text-gray-300">
                Speasy transforms selected newsletters and top articles into
                short, clear audio.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: Target,
                    text: 'Fresh content from the topics you choose',
                  },
                  { icon: Zap, text: 'Clean, studio-quality voices' },
                  {
                    icon: BookOpen,
                    text: 'Delivered through a simple web player and podcast feeds',
                  },
                  {
                    icon: Sparkles,
                    text: 'Works with Apple Podcasts, Overcast, and more',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-start gap-3"
                  >
                    <item.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    <span className="leading-relaxed text-gray-300">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              <p className="text-lg text-gray-300">
                You listen when it fits. We handle the rest.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="relative px-6 py-16 md:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Our mission
              </h2>

              <p className="text-xl leading-relaxed text-white">
                We help people stay informed without falling behind.
              </p>

              <ul className="space-y-3 text-lg text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                  Turn written content into audio you can use anywhere
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                  Save time without lowering quality
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                  Respect your attention, privacy, and pace
                </li>
              </ul>

              <p className="text-xl font-medium text-white">
                Learning should not feel like extra work. It should feel useful.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="relative px-6 py-16 md:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Who Speasy is for
              </h2>

              <p className="text-lg leading-relaxed text-gray-300">
                Speasy is built for people who care about learning but lack
                spare time.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Users, text: 'Busy professionals aged 25–45' },
                  {
                    icon: Brain,
                    text: 'Founders, makers, and knowledge workers',
                  },
                  {
                    icon: BookOpen,
                    text: 'People who already listen to podcasts',
                  },
                  {
                    icon: Clock,
                    text: 'Anyone with a growing backlog of saved reads',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-start gap-3"
                  >
                    <item.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
                    <span className="leading-relaxed text-gray-300">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              <p className="text-lg font-medium text-white">
                If you value progress and calm focus, Speasy is for you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Why It Works */}
        <section className="relative px-6 py-16 md:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Why Speasy works
              </h2>

              <div className="space-y-4">
                {[
                  {
                    q: 'Does it save time?',
                    a: 'Yes. You use time that already exists.',
                  },
                  {
                    q: 'Is the audio good?',
                    a: 'Yes. Clear, natural voices designed for long listening.',
                  },
                  { q: 'Is it simple?', a: 'Yes. Choose topics. Press play.' },
                  {
                    q: 'Is my data safe?',
                    a: 'Yes. Your feed is private and yours alone.',
                  },
                  {
                    q: 'Will it stay useful?',
                    a: 'Yes. You control what goes in.',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="border-b border-gray-800 pb-4"
                  >
                    <p className="mb-1 font-medium text-white">{item.q}</p>
                    <p className="text-gray-300">{item.a}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* About the Maker */}
        <section className="relative px-6 py-16 md:px-8">
          <div className="pointer-events-none absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                About the maker
              </h2>

              <div className="space-y-6 text-lg leading-relaxed text-gray-300">
                <p>
                  Speasy is made by
                  {' '}
                  <a
                    href="https://rsimms.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-white underline decoration-purple-500/50 underline-offset-4 transition-colors hover:decoration-purple-400"
                  >
                    Richard Simms
                  </a>
                  .
                </p>

                <p>
                  I&apos;ve spent years designing digital products used by
                  millions of people. Along the way, I ran into the same issue
                  as everyone else around me: more to read, less time to think.
                </p>

                <p className="font-medium text-white">
                  Speasy started as something I built for myself.
                </p>

                <p>
                  A quiet fix to a real problem.
                  <br />
                  A tool that respects time, focus, and everyday life.
                </p>

                <p>
                  If you want to understand the thinking behind Speasy — how I
                  approach learning, tools, and building things that last — you
                  can read the manifesto.
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="pt-2"
                >
                  <Link
                    href="/manifesto"
                    className="group inline-flex items-center gap-2 font-medium text-white transition-colors hover:text-purple-300"
                  >
                    Read the manifesto
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="relative px-6 py-16 md:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Our values
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  {
                    icon: Zap,
                    title: 'Simplicity',
                    description: 'The best tools stay out of the way.',
                  },
                  {
                    icon: Heart,
                    title: 'Respect',
                    description: 'Your time and focus matter.',
                  },
                  {
                    icon: Sparkles,
                    title: 'Care',
                    description: 'Quality over noise, always.',
                  },
                  {
                    icon: Target,
                    title: 'Growth',
                    description: 'Learning should support life, not crowd it.',
                  },
                ].map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <value.icon className="h-5 w-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">
                        {value.title}
                      </h3>
                    </div>
                    <p className="text-gray-300">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative px-6 py-20 md:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Start listening
              </h2>

              <p className="max-w-xl text-lg leading-relaxed text-gray-300">
                You are not trying to read more. You are trying to live well and
                stay sharp. Speasy helps with that.
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
                className="pt-2"
              >
                <Link href="/">
                  <Button
                    size="lg"
                    className="group rounded-full bg-white px-8 py-6 text-lg text-gray-900 hover:bg-gray-100"
                  >
                    Get started
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
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
