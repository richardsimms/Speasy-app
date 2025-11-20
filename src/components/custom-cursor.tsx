'use client';

import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      // Smooth follow effect
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * 0.15;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
      }

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${mouseRef.current.x}px, ${mouseRef.current.y}px)`;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor hidden md:block"
        style={{
          width: '40px',
          height: '40px',
          border: '2px solid rgba(128, 90, 213, 0.5)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div
        ref={cursorDotRef}
        className="custom-cursor hidden md:block"
        style={{
          width: '8px',
          height: '8px',
          background: 'rgba(128, 90, 213, 0.8)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </>
  );
}
