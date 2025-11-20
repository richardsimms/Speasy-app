'use client';

import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / totalHeight) * 100;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-secondary fixed top-0 left-0 z-50 h-1 w-full">
      <div
        className="bg-primary h-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
