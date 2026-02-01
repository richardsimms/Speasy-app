'use client';

import { motion } from 'framer-motion';
import { FileText, Mail } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '@/components/footer';
import { ScrollProgress } from '@/components/scroll-progress';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function TermsPage() {
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
              <FileText className="h-8 w-8 text-purple-400" />
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
                Terms of Service
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
              Effective: January 31, 2026
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
                Welcome to Speasy. By using our service, you agree to these terms.
                Please read them carefully.
              </p>
              <p className="text-xl font-semibold text-white">
                These terms are straightforward. We want you to understand them.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Service Description */}
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
                What Speasy does
              </h2>

              <div className="space-y-4 text-lg leading-relaxed text-gray-300">
                <p>
                  Speasy converts newsletters and articles into audio format. We use
                  AI-powered text-to-speech technology to create podcast-style content
                  from written material.
                </p>

                <p>Our service includes:</p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>Converting selected newsletters and articles to audio</li>
                  <li>A web-based audio player</li>
                  <li>RSS feeds compatible with podcast apps</li>
                  <li>Content personalization based on your preferences</li>
                </ul>

                <p>
                  We reserve the right to modify, suspend, or discontinue any part of
                  the service at any time. We will provide reasonable notice when possible.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Account Terms */}
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
                Your account
              </h2>

              <div className="space-y-4 text-lg leading-relaxed text-gray-300">
                <p>To use Speasy, you need to create an account. When you do:</p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>You must provide accurate information</li>
                  <li>You are responsible for maintaining your account security</li>
                  <li>One person or entity per account</li>
                  <li>You must be at least 13 years old to use the service</li>
                </ul>

                <p>
                  Account authentication is handled by Clerk. By creating an account,
                  you also agree to their terms of service.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Acceptable Use */}
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
                Acceptable use
              </h2>

              <div className="space-y-4 text-lg leading-relaxed text-gray-300">
                <p className="font-medium text-white">You agree to:</p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>Use Speasy for personal, non-commercial purposes</li>
                  <li>Respect the intellectual property rights of content creators</li>
                  <li>Not share your account credentials with others</li>
                  <li>Not attempt to access other users&apos; accounts or data</li>
                </ul>

                <p className="font-medium text-white">You agree not to:</p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>Redistribute or resell audio content generated by Speasy</li>
                  <li>Use automated tools to scrape or download content in bulk</li>
                  <li>Attempt to reverse engineer or exploit our systems</li>
                  <li>Use the service for any illegal purpose</li>
                  <li>Interfere with or disrupt the service</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content & Intellectual Property */}
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
                Content and intellectual property
              </h2>

              <div className="space-y-4 text-lg leading-relaxed text-gray-300">
                <p>
                  <span className="font-medium text-white">Original content ownership:</span>
                  {' '}
                  The newsletters and articles converted by Speasy remain the property
                  of their original creators. We do not claim ownership of third-party content.
                </p>

                <p>
                  <span className="font-medium text-white">Your content:</span>
                  {' '}
                  Any content you submit or create through Speasy (such as preferences
                  and playlists) remains yours. You grant us a license to use this
                  content to provide the service.
                </p>

                <p>
                  <span className="font-medium text-white">Speasy&apos;s content:</span>
                  {' '}
                  The Speasy service, including our website, apps, and generated audio,
                  is protected by intellectual property laws. You may not copy or
                  redistribute our service without permission.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Payment Terms */}
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
                Payment terms
              </h2>

              <div className="space-y-4 text-lg leading-relaxed text-gray-300">
                <p>
                  Some features of Speasy may require a paid subscription. If you
                  choose to subscribe:
                </p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>Payment is processed securely through Stripe</li>
                  <li>Subscriptions renew automatically unless cancelled</li>
                  <li>You can cancel at any time from your account settings</li>
                  <li>Refunds are handled on a case-by-case basis</li>
                </ul>

                <p>
                  Prices may change. We will notify you of any price changes before
                  they affect your subscription.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Termination */}
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
                Termination
              </h2>

              <div className="space-y-4 text-lg leading-relaxed text-gray-300">
                <p>
                  <span className="font-medium text-white">By you:</span>
                  {' '}
                  You can close your account at any time by contacting us. Upon closure,
                  we will delete your account data as described in our Privacy Policy.
                </p>

                <p>
                  <span className="font-medium text-white">By us:</span>
                  {' '}
                  We may suspend or terminate your account if you violate these terms
                  or if we believe your use harms other users or the service. We will
                  provide notice when possible.
                </p>

                <p>
                  After termination, some provisions of these terms will continue to apply,
                  including sections on intellectual property and limitation of liability.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Disclaimers */}
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
                Disclaimers
              </h2>

              <div className="space-y-4 text-lg leading-relaxed text-gray-300">
                <p>
                  Speasy is provided &quot;as is&quot; and &quot;as available&quot; without warranties of
                  any kind, either express or implied.
                </p>

                <p>We do not guarantee that:</p>

                <ul className="list-disc space-y-2 pl-6">
                  <li>The service will be uninterrupted or error-free</li>
                  <li>Audio conversions will be perfectly accurate</li>
                  <li>The service will meet all your requirements</li>
                </ul>

                <p>
                  We are not responsible for the accuracy or quality of third-party
                  content converted through our service. The original content creators
                  are responsible for their content.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Limitation of Liability */}
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
                Limitation of liability
              </h2>

              <div className="space-y-4 text-lg leading-relaxed text-gray-300">
                <p>
                  To the maximum extent permitted by law, Speasy and its operator shall
                  not be liable for any indirect, incidental, special, consequential, or
                  punitive damages, including but not limited to loss of profits, data,
                  or use.
                </p>

                <p>
                  Our total liability for any claim arising from these terms or your use
                  of the service is limited to the amount you paid us in the 12 months
                  before the claim, or $100, whichever is greater.
                </p>

                <p>
                  Some jurisdictions do not allow these limitations. In such cases, our
                  liability is limited to the maximum extent permitted by law.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Changes to Terms */}
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
                Changes to these terms
              </h2>

              <div className="space-y-4 text-lg leading-relaxed text-gray-300">
                <p>
                  We may update these terms from time to time. If we make significant
                  changes, we will notify you by email or by posting a notice on our
                  website at least 30 days before the changes take effect.
                </p>

                <p>
                  Continued use of Speasy after changes become effective constitutes
                  acceptance of the updated terms.
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
                  If you have questions about these terms, please contact us:
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
                  href="/privacy"
                  className="text-gray-400 underline decoration-gray-600 underline-offset-4 transition-colors hover:text-white hover:decoration-gray-400"
                >
                  Read our Privacy Policy
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
