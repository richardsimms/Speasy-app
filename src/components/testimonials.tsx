'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const testimonials = [
  {
    quote: 'I finally caught up on every newsletter I\'ve ignored for 6 months—in one walk.',
    author: 'Alex Chen',
    role: 'Product Designer',
    avatar: 'AC',
  },
  {
    quote: 'I listen while cooking dinner. It\'s become my learning hour.',
    author: 'Sarah Johnson',
    role: 'Startup Founder',
    avatar: 'SJ',
  },
  {
    quote: 'Every train ride now includes 3 newsletters I used to skip.',
    author: 'Michael Torres',
    role: 'Marketing Director',
    avatar: 'MT',
  },
];

export function Testimonials() {
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
            How others are listening smarter
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="bg-card/80 hover:border-primary/50 h-full border-2 p-6 backdrop-blur-sm transition-all duration-500">
                <p className="mb-6 text-lg leading-relaxed">
                  &ldquo;
                  {testimonial.quote}
                  &rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/20 text-primary flex h-12 w-12 items-center justify-center rounded-full font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
