import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="relative border-t border-gray-700 px-4 py-20 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl">
        <div className="space-y-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-balance text-3xl font-bold text-white md:text-5xl"
          >
            Don&apos;t just read your newsletters. Live with them.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-gray-200"
          >
            Join early and help us build the next version of Speasy, with inbox
            sync, custom playlists, and AI-powered personalization. Reclaim your
            reading list—One listen at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row"
          >
            <Button size="lg" className="rounded-full px-8 py-6 text-lg">
              Start listening - $5/month
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 py-6 text-lg"
            >
              Join Pro waitlist
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 pt-12 text-gray-200"
          >
            <span className="text-sm">
              Available on your favorite podcast apps
            </span>
            <div className="flex gap-6">
              {["Apple Podcasts", "Spotify", "Overcast", "Pocket Casts"].map(
                (app) => (
                  <div key={app} className="text-xs font-medium">
                    {app}
                  </div>
                ),
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="pt-12 text-sm text-gray-200"
          >
            <p>&copy; 2025 Speasy. All rights reserved.</p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
