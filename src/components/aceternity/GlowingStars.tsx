'use client';

import React from 'react';

type Star = {
  id: number;
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
};

/**
 * Glowing Stars Background inspired by Aceternity UI.
 * Subtle twinkling star effect.
 */
export default function GlowingStars({
  number = 50,
  className = '',
}: {
  number?: number;
  className?: string;
}) {
  const [stars, setStars] = React.useState<Star[]>([]);

  React.useEffect(() => {
    setStars(
      [...Array(number)].map((_, idx) => ({
        id: idx,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
        duration: Math.random() * 2 + 2,
      }))
    );
  }, [number]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.5)`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
