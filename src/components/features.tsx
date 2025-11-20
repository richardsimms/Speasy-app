'use client';

import { motion } from 'framer-motion';
import { Brain, CheckCircle2, Globe, Rss, Shield, Sparkles, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: Brain,
    title: 'Advanced AI Models',
    description: 'Natural-sounding voices powered by cutting-edge neural networks',
    details: [
      'OpenAI TTS & ElevenLabs integration',
      '50+ premium voices in 30+ languages',
      'Context-aware summarization with GPT-4',
    ],
    badge: 'AI-Powered',
    color: 'from-violet-500/20 to-purple-500/20',
    glowColor: 'rgba(139, 92, 246, 0.3)',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and privacy protection for your data',
    details: [
      'OAuth 2.0 secure authentication',
      'End-to-end encrypted storage',
      'SOC 2 Type II compliant infrastructure',
    ],
    badge: 'Secure',
    color: 'from-emerald-500/20 to-teal-500/20',
    glowColor: 'rgba(16, 185, 129, 0.3)',
  },
  {
    icon: Rss,
    title: 'Universal Compatibility',
    description: 'Works seamlessly with every major podcast platform',
    details: [
      'Apple Podcasts, Spotify, Overcast',
      'Private RSS feeds per user',
      'Offline listening with automatic sync',
    ],
    badge: 'Compatible',
    color: 'from-blue-500/20 to-cyan-500/20',
    glowColor: 'rgba(59, 130, 246, 0.3)',
  },
  {
    icon: TrendingUp,
    title: 'Smart Prioritization',
    description: 'AI learns your preferences to curate your daily briefing',
    details: [
      'Adaptive learning algorithms',
      'Custom topic filtering',
      'Intelligent content ranking',
    ],
    badge: 'Smart',
    color: 'from-orange-500/20 to-amber-500/20',
    glowColor: 'rgba(249, 115, 22, 0.3)',
  },
];

const trustedBy = [
  { name: 'TechCrunch', users: '50K+' },
  { name: 'Product Hunt', users: '25K+' },
  { name: 'The Hustle', users: '100K+' },
  { name: 'Morning Brew', users: '75K+' },
];

export function Features() {
  return (
    <section className="relative overflow-hidden px-4 py-32">
      {/* Background accent */}
      <div className="from-background via-muted/30 to-background pointer-events-none absolute inset-0 bg-gradient-to-b" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-primary/10 border-primary/20 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2"
          >
            <Sparkles className="text-primary h-4 w-4" />
            <span className="text-sm font-medium">Enterprise-grade infrastructure</span>
          </motion.div>

          <h2 className="mb-6 text-4xl font-bold tracking-tight text-balance md:text-6xl">
            Built with cutting-edge technology
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed text-balance">
            The same infrastructure trusted by Fortune 500 companies, now powering your daily audio briefings
          </p>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border-border/50 mb-20 flex flex-wrap justify-center gap-8 border-b pb-16"
        >
          {trustedBy.map((source, i) => (
            <motion.div
              key={source.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <Globe className="text-muted-foreground/60 h-5 w-5" />
              <div>
                <div className="text-foreground/90 text-sm font-semibold">{source.name}</div>
                <div className="text-muted-foreground font-mono text-xs">
                  {source.users}
                  {' '}
                  readers
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
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
                <Card className="bg-card/50 border-border/50 hover:border-primary/30 relative h-full overflow-hidden border p-8 backdrop-blur-sm transition-all duration-500">
                  {/* Animated glow effect on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                    initial={false}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon and badge */}
                    <div className="mb-6 flex items-start justify-between">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="bg-primary/10 border-primary/20 rounded-xl border p-3"
                      >
                        <feature.icon className="text-primary h-7 w-7" />
                      </motion.div>
                      <Badge variant="outline" className="font-mono text-xs">
                        {feature.badge}
                      </Badge>
                    </div>

                    {/* Title and description */}
                    <h3 className="group-hover:text-primary mb-3 text-2xl font-bold transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Technical details */}
                    <div className="space-y-3">
                      {feature.details.map((detail, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: index * 0.08 + i * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                          <span className="text-muted-foreground text-sm leading-relaxed">
                            {detail}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Subtle grid pattern */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.02]"
                    style={{
                      backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                      backgroundSize: '24px 24px',
                    }}
                  />
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border-border/50 mt-16 border-t pt-16 text-center"
        >
          <p className="text-muted-foreground mb-4 font-mono text-sm">
            Powered by AWS • Monitored 24/7 • 99.99% uptime SLA
          </p>
          <div className="text-muted-foreground flex justify-center gap-6 text-xs">
            <span>• GDPR Compliant</span>
            <span>• CCPA Compliant</span>
            <span>• ISO 27001 Certified</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
