"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-progress";

export default function AboutPage() {
  return (
    <>
      <ScrollProgress />
      <main className="relative overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">
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
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="pb-2 text-4xl font-bold leading-[1.1] tracking-tighter text-balance text-white md:text-6xl lg:text-7xl"
            >
              Reclaim your time. <br />
              <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                Rewrite your story.
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
              className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-gray-200 md:text-xl"
            >
              Speasy helps you keep learning without needing more hours in the
              day. We turn written content into audio so knowledge can move with
              you, not sit unread.
            </motion.p>
          </div>

          {/* Floating gradient orbs for depth */}
          <div className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        </section>

        {/* Problem Statement */}
        <section className="relative px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 text-center"
            >
              <p className="text-balance text-xl leading-relaxed text-gray-200 md:text-2xl">
                Work is busy. Life is full. Your reading list keeps growing.
              </p>
              <p className="text-balance text-2xl font-semibold leading-relaxed text-white md:text-3xl">
                Speasy exists to fix that.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Story */}
        <section className="relative px-4 py-20">
          {/* Decorative gradient line */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <h2 className="text-balance text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
                Our story
              </h2>

              <div className="space-y-6 text-lg leading-relaxed text-gray-200">
                <p>Speasy started with a familiar problem.</p>

                <div className="space-y-2 pl-6">
                  <p>The inbox was full.</p>
                  <p>The newsletter list was long.</p>
                  <p>Articles were saved with good intent, then forgotten.</p>
                </div>

                <p className="font-medium text-white">
                  The issue was never the content. It was the format.
                </p>

                <p>
                  Reading needs stillness, focus, and a screen. Most days do not
                  offer that.{" "}
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
        <section className="relative px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              <h2 className="text-balance text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
                What Speasy does
              </h2>

              <Card className="group relative border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-900/30 p-8 shadow-2xl shadow-purple-500/5 backdrop-blur-sm transition-all duration-500 hover:border-gray-700 hover:shadow-purple-500/10 md:p-12">
                <p className="text-balance mb-8 text-lg leading-relaxed text-gray-200">
                  Speasy transforms selected newsletters and top articles into
                  short, clear audio.
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    {
                      icon: Target,
                      text: "Fresh content from the topics you choose",
                    },
                    { icon: Zap, text: "Clean, studio-quality voices" },
                    {
                      icon: BookOpen,
                      text: "Delivered through a simple web player and podcast feeds",
                    },
                    {
                      icon: Sparkles,
                      text: "Works with Apple Podcasts, Overcast, and more",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="flex items-start gap-3"
                    >
                      <item.icon className="mt-1 h-5 w-5 flex-shrink-0 text-white" />
                      <span className="leading-relaxed text-gray-200">
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <p className="mt-8 text-center text-lg text-gray-200">
                  You listen when it fits. We handle the rest.
                </p>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="relative px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <h2 className="text-balance text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
                Our mission
              </h2>

              <p className="text-balance text-center text-xl leading-relaxed text-white">
                We help people stay informed without falling behind.
              </p>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  "Turn written content into audio you can use anywhere",
                  "Save time without lowering quality",
                  "Respect your attention, privacy, and pace",
                ].map((mission, index) => (
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
                  >
                    <Card className="relative h-full border border-gray-800/50 bg-gradient-to-br from-gray-900/40 to-gray-900/20 p-6 shadow-lg shadow-purple-500/5 backdrop-blur-sm transition-all duration-300 hover:border-gray-700 hover:shadow-purple-500/10">
                      <p className="text-center leading-relaxed text-gray-200">
                        {mission}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <p className="text-balance text-center text-xl font-medium leading-relaxed text-white">
                Learning should not feel like extra work. It should feel useful.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="relative px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <h2 className="text-balance text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
                Who Speasy is for
              </h2>

              <Card className="group relative border border-gray-800/50 bg-gradient-to-br from-gray-900/50 to-gray-900/30 p-8 shadow-2xl shadow-purple-500/5 backdrop-blur-sm transition-all duration-500 hover:border-gray-700 hover:shadow-purple-500/10 md:p-12">
                <p className="text-balance mb-8 text-center text-lg leading-relaxed text-gray-200">
                  Speasy is built for people who care about learning but lack
                  spare time.
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    { icon: Users, text: "Busy professionals aged 25–45" },
                    {
                      icon: Brain,
                      text: "Founders, makers, and knowledge workers",
                    },
                    {
                      icon: BookOpen,
                      text: "People who already listen to podcasts",
                    },
                    {
                      icon: Clock,
                      text: "Anyone with a growing backlog of saved reads",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="flex items-start gap-3"
                    >
                      <item.icon className="mt-1 h-5 w-5 flex-shrink-0 text-white" />
                      <span className="leading-relaxed text-gray-200">
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <p className="text-balance mt-8 text-center text-lg font-medium leading-relaxed text-white">
                  If you value progress and calm focus, Speasy is for you.
                </p>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Why It Works */}
        <section className="relative px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <h2 className="text-balance text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
                Why Speasy works
              </h2>

              <div className="space-y-4">
                {[
                  {
                    q: "Does it save time?",
                    a: "Yes. You use time that already exists.",
                  },
                  {
                    q: "Is the audio good?",
                    a: "Yes. Clear, natural voices designed for long listening.",
                  },
                  { q: "Is it simple?", a: "Yes. Choose topics. Press play." },
                  {
                    q: "Is my data safe?",
                    a: "Yes. Your feed is private and yours alone.",
                  },
                  {
                    q: "Will it stay useful?",
                    a: "Yes. You control what goes in.",
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
                  >
                    <Card className="relative border border-gray-800/50 bg-gradient-to-br from-gray-900/40 to-gray-900/20 p-6 shadow-lg shadow-purple-500/5 backdrop-blur-sm transition-all duration-300 hover:border-gray-700 hover:shadow-purple-500/10">
                      <p className="mb-2 text-lg font-semibold text-white">
                        {item.q}
                      </p>
                      <p className="leading-relaxed text-gray-200">{item.a}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="relative px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              <h2 className="text-balance text-center text-3xl font-bold tracking-tight text-white md:text-4xl">
                Our values
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                {[
                  {
                    icon: Zap,
                    title: "Simplicity",
                    description: "The best tools stay out of the way.",
                    color: "from-violet-500/20 to-purple-500/20",
                  },
                  {
                    icon: Heart,
                    title: "Respect",
                    description: "Your time and focus matter.",
                    color: "from-pink-500/20 to-rose-500/20",
                  },
                  {
                    icon: Sparkles,
                    title: "Care",
                    description: "Quality over noise, always.",
                    color: "from-blue-500/20 to-cyan-500/20",
                  },
                  {
                    icon: Target,
                    title: "Growth",
                    description: "Learning should support life, not crowd it.",
                    color: "from-emerald-500/20 to-teal-500/20",
                  },
                ].map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
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
                          className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                          initial={false}
                        />

                        {/* Content */}
                        <div className="relative z-10">
                          <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className="mb-4 inline-block rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-800/60 to-gray-900/40 p-3 shadow-lg shadow-purple-500/10"
                          >
                            <value.icon className="h-6 w-6 text-white" />
                          </motion.div>

                          <h3 className="mb-2 text-2xl font-bold text-white">
                            {value.title}
                          </h3>
                          <p className="leading-relaxed text-gray-200">
                            {value.description}
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

        {/* Final CTA */}
        <section className="relative px-4 py-32">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 text-center"
            >
              <h2 className="text-balance text-3xl font-bold tracking-tight text-white md:text-5xl">
                Start listening
              </h2>

              <div className="space-y-6">
                <p className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-gray-200 md:text-xl">
                  You are not trying to read more. <br />
                  You are trying to live well and stay sharp.
                </p>

                <p className="text-xl font-medium text-white">
                  Speasy helps with that.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="pt-4"
              >
                <Link href="/">
                  <Button
                    size="lg"
                    className="group rounded-full px-8 py-6 text-lg"
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
