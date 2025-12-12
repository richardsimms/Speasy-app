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
          <div className="mx-auto max-w-5xl space-y-8 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-accent/10 border-accent/20 inline-flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-sm"
            >
              <Sparkles className="text-primary h-4 w-4" />
              <span className="text-primary text-sm font-medium">
                About Speasy
              </span>
            </motion.div>

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
              <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
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
              className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed text-balance md:text-xl"
            >
              Speasy helps you keep learning without needing more hours in the
              day. We turn written content into audio so knowledge can move with
              you, not sit unread.
            </motion.p>
          </div>
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
              <p className="text-muted-foreground text-xl leading-relaxed text-balance md:text-2xl">
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

              <div className="text-muted-foreground space-y-6 text-lg leading-relaxed">
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

              <Card className="bg-card/50 border-border/50 border p-8 backdrop-blur-sm md:p-12">
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed text-balance">
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
                      <item.icon className="text-primary mt-1 h-5 w-5 flex-shrink-0" />
                      <span className="leading-relaxed">{item.text}</span>
                    </motion.div>
                  ))}
                </div>

                <p className="text-muted-foreground mt-8 text-center text-lg">
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
                    <Card className="bg-card/30 border-border/50 h-full border p-6 backdrop-blur-sm">
                      <p className="text-muted-foreground text-center leading-relaxed">
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

              <Card className="bg-card/50 border-border/50 border p-8 backdrop-blur-sm md:p-12">
                <p className="text-muted-foreground mb-8 text-center text-lg leading-relaxed text-balance">
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
                      <item.icon className="text-primary mt-1 h-5 w-5 flex-shrink-0" />
                      <span className="leading-relaxed">{item.text}</span>
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
                    <Card className="border-border/50 bg-card/30 border p-6 backdrop-blur-sm">
                      <p className="mb-2 text-lg font-semibold text-white">
                        {item.q}
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.a}
                      </p>
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
                      <Card className="bg-card/50 border-border/50 hover:border-primary/30 relative h-full overflow-hidden border p-8 backdrop-blur-sm transition-all duration-500">
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
                            className="bg-primary/10 border-primary/20 mb-4 inline-block rounded-xl border p-3"
                          >
                            <value.icon className="text-primary h-6 w-6" />
                          </motion.div>

                          <h3 className="group-hover:text-primary mb-2 text-2xl font-bold text-white transition-colors duration-300">
                            {value.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
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
                <p className="text-muted-foreground mx-auto max-w-2xl text-balance text-lg leading-relaxed md:text-xl">
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
