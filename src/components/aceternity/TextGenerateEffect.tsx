'use client';

import React from 'react';
import { motion, stagger, useAnimate, useInView } from 'motion/react';

/**
 * Text Generate Effect inspired by Aceternity UI.
 * Words appear one by one with a fade-in blur effect.
 */
export default function TextGenerateEffect({
  words,
  className = '',
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true });
  const wordsArray = words.split(' ');

  React.useEffect(() => {
    if (isInView) {
      animate(
        'span',
        {
          opacity: 1,
          filter: filter ? 'blur(0px)' : 'none',
        },
        {
          duration: duration,
          delay: stagger(0.1),
        }
      );
    }
  }, [isInView, animate, duration, filter]);

  return (
    <div className={className}>
      <div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="opacity-0 inline-block mr-[0.25em]"
            style={{
              filter: filter ? 'blur(10px)' : 'none',
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
