'use client';

import { motion } from 'framer-motion';
import { Mail, Shield } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/footer';
import { ScrollProgress } from '@/components/scroll-progress';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function PrivacyPage() {
  const reducedMotion = useReducedMotion();

  return (
    <>
      <ScrollProgress />
      <main className="relative overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative flex min-h-[40vh] items-center overflow-hidden px-6 md:px-8">
          {/* Subtle gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent" />

          <div className="relative z-10 mx-auto w-full max-w-4xl space-y-6 py-16">
            <motion.div
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
              className="flex items-center gap-3"
            >
              <Shield className="h-8 w-8 text-purple-400" />
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                Privacy Policy
              </h1>
            </motion.div>

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
              className="text-lg text-gray-400"
            >
              Last updated: January 31, 2026
            </motion.p>
          </div>
        </section>

        {/* Introduction */}
        <section className="relative px-6 py-12 md:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <p className="text-lg leading-relaxed text-gray-300">
                At Speasy, we believe in transparency and respect for your privacy.
                This policy explains what data we collect, how we use it, and your
                rights regarding your information.
              </p>
              <p className="text-xl font-semibold text-white">
                The short version: We collect minimal data and never sell it.
              </p>
            </motion.div>
          </div>
        </section>

        {/* What We Collect */}
        <section className="relative px-6 py-12 md:px-8">
          <div className="pointer-events-none absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                What we collect
              </h2>

              <div className="space-y-6 text-lg leading-relaxed text-gray-300">
                <div>
                  <h3 className="mb-2 font-semibold text-white">Account information</h3>
                  <p>
                    When you sign up, we collect your email address and name through
                    our authentication provider, Clerk. This is the only personal
                    information we require.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-white">Content preferences</h3>
                  <p>
                    We store your topic preferences and listening history to personalize
                    your audio feed. This data is associated with your account and used
                    solely to improve your experience.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-white">Payment information</h3>
                  <p>
                    If you subscribe to a paid plan, payment processing is handled
                    entirely by Stripe. We never see or store your full credit card
                    number. We only receive confirmation of your subscription status.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Analytics */}
        <section className="relative px-6 py-12 md:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                Analytics
              </h2>

              <div className="space-y-4 text-lg leading-relaxed text-gray-300">
                <p>
                  We use PostHog for anonymous usage analytics. This helps us understand
                  how people use Speasy so we can make it better.
                </p>

                <p className="font-medium text-white">
                  What PostHog collects:
                </p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>Page views and general navigation patterns</li>
                  <li>Feature usage (which buttons are clicked, which features are popular)</li>
                  <li>Device type and browser (anonymized)</li>
                  <li>General geographic region (country level only)</li>
                </ul>

                <p className="font-medium text-white">
                  What PostHog does not collect:
                </p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>Your name or email address</li>
                  <li>Your listening history or content preferences</li>
                  <li>Any content you submit or save</li>
                  <li>Precise location data</li>
                </ul>

                <p>
                  Analytics data cannot be used to identify you personally. We do not
                  link analytics data to your account information.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="relative px-6 py-12 md:px-8">
          <div className="pointer-events-none absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                Third-party services
              </h2>

              <div className="space-y-4 text-lg leading-relaxed text-gray-300">
                <p>
                  We use trusted third-party services to operate Speasy. Each has their
                  own privacy policy:
                </p>

                <ul className="space-y-3">
                  <li>
                    <span className="font-medium text-white">Clerk</span>
                    {' '}
                    — Authentication and account management
                  </li>
                  <li>
                    <span className="font-medium text-white">Stripe</span>
                    {' '}
                    — Payment processing (for paid subscriptions)
                  </li>
                  <li>
                    <span className="font-medium text-white">PostHog</span>
                    {' '}
                    — Anonymous usage analytics
                  </li>
                  <li>
                    <span className="font-medium text-white">Supabase</span>
                    {' '}
                    — Database and content storage
                  </li>
                  <li>
                    <span className="font-medium text-white">Vercel</span>
                    {' '}
                    — Website hosting
                  </li>
                </ul>

                <p>
                  We only share the minimum data necessary for these services to function.
                  We do not sell your data to any third party.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Cookies */}
        <section className="relative px-6 py-12 md:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                Cookies
              </h2>

              <div className="space-y-4 text-lg leading-relaxed text-gray-300">
                <p>
                  We use only essential cookies required for the service to function:
                </p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <span className="font-medium text-white">Authentication cookies</span>
                    {' '}
                    — To keep you signed in
                  </li>
                  <li>
                    <span className="font-medium text-white">Preference cookies</span>
                    {' '}
                    — To remember your settings (like dark mode)
                  </li>
                </ul>

                <p>
                  We do not use tracking cookies or advertising cookies. PostHog analytics
                  can function without cookies by using anonymous session tracking.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Your Rights */}
        <section className="relative px-6 py-12 md:px-8">
          <div className="pointer-events-none absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                Your rights
              </h2>

              <div className="space-y-4 text-lg leading-relaxed text-gray-300">
                <p>You have the right to:</p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <span className="font-medium text-white">Access</span>
                    {' '}
                    — Request a copy of the data we have about you
                  </li>
                  <li>
                    <span className="font-medium text-white">Correction</span>
                    {' '}
                    — Update or correct your account information
                  </li>
                  <li>
                    <span className="font-medium text-white">Deletion</span>
                    {' '}
                    — Request that we delete your account and associated data
                  </li>
                  <li>
                    <span className="font-medium text-white">Portability</span>
                    {' '}
                    — Request your data in a portable format
                  </li>
                </ul>

                <p>
                  To exercise any of these rights, contact us at the email address below.
                  We will respond within 30 days.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Data Security */}
        <section className="relative px-6 py-12 md:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                Data security
              </h2>

              <div className="space-y-4 text-lg leading-relaxed text-gray-300">
                <p>
                  We take reasonable measures to protect your data, including:
                </p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>Encryption in transit (HTTPS) and at rest</li>
                  <li>Secure authentication through Clerk</li>
                  <li>Regular security updates and monitoring</li>
                  <li>Limited access to production data</li>
                </ul>

                <p>
                  No system is perfectly secure. If we discover a data breach that affects
                  your personal information, we will notify you promptly.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Changes to This Policy */}
        <section className="relative px-6 py-12 md:px-8">
          <div className="pointer-events-none absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                Changes to this policy
              </h2>

              <div className="space-y-4 text-lg leading-relaxed text-gray-300">
                <p>
                  We may update this privacy policy from time to time. If we make significant
                  changes, we will notify you by email or by posting a notice on our website.
                </p>

                <p>
                  The &quot;last updated&quot; date at the top of this page indicates when the policy
                  was last revised.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact */}
        <section className="relative px-6 py-16 md:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                Contact us
              </h2>

              <div className="space-y-4 text-lg leading-relaxed text-gray-300">
                <p>
                  If you have questions about this privacy policy or how we handle your
                  data, please contact us:
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <Mail className="h-5 w-5 text-purple-400" />
                  <a
                    href="mailto:hello@speasy.app"
                    className="font-medium text-white underline decoration-purple-500/50 underline-offset-4 transition-colors hover:decoration-purple-400"
                  >
                    hello@speasy.app
                  </a>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/terms"
                  className="text-gray-400 underline decoration-gray-600 underline-offset-4 transition-colors hover:text-white hover:decoration-gray-400"
                >
                  Read our Terms of Service
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
