'use client';

import { AudioDemo } from '@/components/audio-demo';
import { Features } from '@/components/features';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/hero';
import { Pricing } from '@/components/pricing';
import { ScrollProgress } from '@/components/scroll-progress';
import { Testimonials } from '@/components/testimonials';
import { WebGLBackground } from '@/components/webgl-background';

export default function Home() {
  return (
    <>
      <WebGLBackground />
      <ScrollProgress />
      <main className="relative z-10 overflow-x-hidden">
        <Hero />
        <AudioDemo />
        <Features />
        <Pricing />
        <Testimonials />
        <Footer />
      </main>
    </>
  );
}
