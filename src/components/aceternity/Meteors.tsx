'use client';

import React from 'react';

type Meteor = {
  id: number;
  top: number;
  left: number;
  delay: number;
  duration: number;
};

/**
 * Meteors effect inspired by Aceternity UI.
 * Animated shooting stars/meteors falling diagonally.
 */
export default function Meteors({
  number = 20,
  className = '',
}: {
  number?: number;
  className?: string;
}) {
  const [meteors, setMeteors] = React.useState<Meteor[]>([]);

  React.useEffect(() => {
    setMeteors(
      [...Array(number)].map((_, idx) => ({
        id: idx,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: Math.random() * 2 + 2,
      }))
    );
  }, [number]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="absolute h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-full bg-zinc-400 shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
          style={{
            top: `${meteor.top}%`,
            left: `${meteor.left}%`,
            animationDelay: `${meteor.delay}s`,
            animationDuration: `${meteor.duration}s`,
          }}
        >
          <span
            className="absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2"
            style={{
              background: 'linear-gradient(to right, rgba(249,115,22,0.6), transparent)',
            }}
          />
        </span>
      ))}

      <style jsx>{`
        @keyframes meteor {
          0% {
            transform: rotate(215deg) translateX(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: rotate(215deg) translateX(-500px);
            opacity: 0;
          }
        }
        .animate-meteor {
          animation: meteor linear infinite;
        }
      `}</style>
    </div>
  );
}
