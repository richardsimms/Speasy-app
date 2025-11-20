'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function Pricing() {
  return (
    <section className="relative px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-balance md:text-5xl">
            Start with curated. Upgrade to personal.
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <Card className="bg-card/80 hover:border-primary/50 h-full border-2 p-8 backdrop-blur-sm transition-all duration-500">
              <h3 className="mb-2 text-2xl font-bold">Start listening</h3>
              <div className="mb-4 text-4xl font-bold">
                $5
                <span className="text-muted-foreground text-lg">/month</span>
              </div>
              <p className="text-muted-foreground mb-6">Get started with curated content</p>

              <ul className="mb-8 space-y-3">
                {[
                  'Access to top curated newsletter summaries',
                  'Categories: Tech, Design, Business, AI',
                  'Private podcast feed',
                  'Listen in any podcast app',
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <Check className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Button className="w-full rounded-full" size="lg">
                Start listening
              </Button>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <Card className="bg-accent/10 border-accent hover:border-accent/80 relative h-full overflow-hidden border-2 p-8 backdrop-blur-sm transition-all duration-500">
              <div className="bg-accent text-accent-foreground absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-semibold">
                Coming Soon
              </div>

              <h3 className="mb-2 text-2xl font-bold">Pro Plan</h3>
              <p className="text-muted-foreground mb-6">Personalized for your inbox</p>

              <ul className="mb-8 space-y-3">
                {[
                  'Everything in Free, plus:',
                  'Connect Gmail or Outlook',
                  'Summarized feed from your own newsletters',
                  'Filter by topic, tags, tone',
                  'Smart playlist: "Morning Brief," "End of Day Recap"',
                  'Custom summary lengths and tone',
                  'Transcripts + follow-up Q&A',
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <Check className="text-accent mt-0.5 h-5 w-5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <Button variant="outline" className="border-accent w-full rounded-full" size="lg">
                Join Pro waitlist
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
