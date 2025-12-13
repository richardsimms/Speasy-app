"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContentAnalytics } from "@/hooks/useContentAnalytics";

type ContentGridCardProps = {
  id: string;
  title: string;
  summary?: string | null;
  imageUrl?: string | null;
  category: string;
  duration?: number | null;
  index?: number;
  locale: string;
  surface?: "home" | "dashboard";
  userId?: string;
  experimentVariant?: string;
};

export function ContentGridCard({
  id,
  title,
  summary,
  imageUrl,
  category,
  duration,
  index = 0,
  locale,
  surface = "home",
  userId,
  experimentVariant,
}: ContentGridCardProps) {
  const { trackContentViewed } = useContentAnalytics();

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number | null | undefined): string => {
    if (!seconds) {
      return "0:00";
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClick = () => {
    trackContentViewed({
      user_id: userId,
      content_name: title,
      content_category: category,
      content_id: id,
      surface,
      experiment_variant: experimentVariant,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative"
    >
      <Link
        href={`/${locale}/content/${id}`}
        onClick={handleClick}
        className="relative block overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] transition-all duration-300 hover:border-white/30 hover:shadow-lg hover:shadow-white/5"
      >
        {/* Image Section */}
        {imageUrl ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />

            {/* Duration badge on image */}
            {duration && (
              <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-lg bg-black/80 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <Clock className="h-3 w-3" />
                {formatDuration(duration)}
              </div>
            )}
          </div>
        ) : (
          <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-white/5 to-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white/20">
                {title.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Duration badge */}
            {duration && (
              <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-lg bg-black/80 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <Clock className="h-3 w-3" />
                {formatDuration(duration)}
              </div>
            )}
          </div>
        )}
        {/* Content Section */}
        <div className="p-6">
          {/* Category Tag */}
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="text-xs font-medium tracking-wider text-white/70 uppercase">
              {category}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-xl font-bold text-white transition-colors group-hover:text-white/90">
            {title}
          </h3>

          {/* Summary */}
          {summary && (
            <p className="line-clamp-3 text-sm leading-relaxed text-white/60">
              {summary}
            </p>
          )}
        </div>

        {/* Hover indicator */}
        <div className="absolute top-0 right-4 left-4 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-300 group-hover:scale-x-100" />
      </Link>
    </motion.div>
  );
}
