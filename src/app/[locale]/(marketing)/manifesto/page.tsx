"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const manifestoItems = [
  {
    title: "Time matters",
    description:
      "Time is the one thing you never get back. Speasy exists to respect it.",
    icon: Clock,
    color: "from-violet-500/20 to-purple-500/20",
  },
  {
    title: "Knowledge should fit your life",
    description:
      "Learning should work around your day, not fight it. If reading does not fit, listening should.",
    icon: Compass,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "No guilt, no backlog",
    description:
      "Saved articles are not a failure. They are good intent stuck in the wrong format.",
    icon: Heart,
    color: "from-pink-500/20 to-rose-500/20",
  },
  {
    title: "Listen when it suits you",
    description: "Walking, commuting, cooking, resting. Speasy moves with you.",
    icon: Ear,
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    title: "Simple over clever",
    description:
      "Clear audio. Few steps. No clutter. If it takes effort, it is wrong.",
    icon: Zap,
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    title: "Quality earns trust",
    description:
      "Audio should sound calm and human. Sources should be clear. Nothing hidden.",
    icon: Shield,
    color: "from-indigo-500/20 to-violet-500/20",
  },
  {
    title: "You stay in control",
    description:
      "Your interests. Your pace. Your feed. Speasy does not decide for you.",
    icon: Target,
    color: "from-rose-500/20 to-pink-500/20",
  },
  {
    title: "Learning without pressure",
    description:
      "No chasing streaks. No noise. Just steady progress, your way.",
    icon: Lightbulb,
    color: "from-cyan-500/20 to-blue-500/20",
  },
  {
    title: "Reclaim your time",
    description:
      "Not to do more work, but to think, grow, and live a bit better.",
    icon: Sparkles,
    color: "from-purple-500/20 to-violet-500/20",
  },
];

function PlaceholderImage({
  className,
  variant = "hero",
}: {
  className?: string;
  variant?: "hero" | "section";
}) {
  const gradients = {
    hero: "from-purple-600/30 via-blue-600/20 to-cyan-600/30",
    section: "from-violet-500/20 via-purple-500/10 to-blue-500/20",
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
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm" />
      </div>
    </div>
  );
}

export default function ManifestoPage() {
  return (
    <>
      <ScrollProgress />
      <main className="relative overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4">
          {/* Subtle gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent" />

          {/* Grid pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "80px 80px",
              }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl space-y-8 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mb-6"
            >
              <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300">
                Our Manifesto
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="pb-2 text-4xl leading-[1.1] font-bold tracking-tighter text-balance text-white md:text-6xl lg:text-7xl"
            >
              What we{" "}
              <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                believe in
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mx-auto max-w-2xl text-lg leading-relaxed text-balance text-gray-200 md:text-xl"
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
        <section className="relative px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-12 md:grid-cols-2 md:items-center"
            >
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight text-balance text-white md:text-4xl">
                  Time matters
                </h2>
                <p className="text-xl leading-relaxed text-balance text-gray-200">
                  Time is the one thing you never get back.
                </p>
                <p className="text-2xl leading-relaxed font-semibold text-balance text-white">
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
        <section className="relative px-4 py-20">
          {/* Decorative gradient line */}
          <div className="pointer-events-none absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {manifestoItems.slice(1).map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
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
                      <Card className="relative h-full overflow-hidden border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-900/30 p-8 shadow-2xl shadow-purple-500/5 backdrop-blur-sm transition-all duration-500 hover:border-gray-700 hover:shadow-purple-500/10">
                        {/* Animated glow effect on hover */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                          initial={false}
                        />

                        {/* Content */}
                        <div className="relative z-10">
                          <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className="mb-4 inline-block rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-800/60 to-gray-900/40 p-3 shadow-lg shadow-purple-500/10"
                          >
                            <item.icon className="h-6 w-6 text-white" />
                          </motion.div>

                          <h3 className="mb-3 text-xl font-bold text-white">
                            {item.title}
                          </h3>
                          <p className="leading-relaxed text-gray-200">
                            {item.description}
                          </p>
                        </div>

                        {/* Subtle grid pattern */}
                        <div
                          className="pointer-events-none absolute inset-0 opacity-[0.02]"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
                            backgroundSize: "24px 24px",
                          }}
                        />
                      </Card>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Section - Simple Over Clever */}
        <section className="relative px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="group relative overflow-hidden border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-900/30 p-8 shadow-2xl shadow-purple-500/5 backdrop-blur-sm transition-all duration-500 hover:border-gray-700 hover:shadow-purple-500/10 md:p-12">
                <div className="grid gap-8 md:grid-cols-2 md:items-center">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5">
                      <Zap className="h-4 w-4 text-amber-400" />
                      <span className="text-sm font-medium text-amber-300">
                        Core principle
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-balance text-white md:text-4xl">
                      Simple over clever
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-200">
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
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Control Section */}
        <section className="relative px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
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
                <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5">
                  <Target className="h-4 w-4 text-rose-400" />
                  <span className="text-sm font-medium text-rose-300">
                    Your choice
                  </span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-balance text-white md:text-4xl">
                  You stay in control
                </h2>
                <div className="space-y-4 text-lg leading-relaxed text-gray-200">
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
        <section className="relative px-4 py-32">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Sparkles className="mx-auto h-12 w-12 text-purple-400" />
              </motion.div>

              <h2 className="text-3xl font-bold tracking-tight text-balance text-white md:text-5xl">
                That is Speasy.
              </h2>

              <p className="mx-auto max-w-2xl text-xl leading-relaxed text-balance text-gray-200">
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
                className="flex flex-col items-center gap-4 pt-8 sm:flex-row sm:justify-center"
              >
                <Link href="/">
                  <Button
                    size="lg"
                    className="group rounded-full px-8 py-6 text-lg"
                  >
                    Start listening
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-gray-700 px-8 py-6 text-lg hover:bg-white/5"
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
