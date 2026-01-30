'use client';

import React from 'react';
import { motion } from 'motion/react';

type Card = {
  title: string;
  description: string;
  tag?: string;
};

/**
 * "Apple Cards"-style horizontal carousel inspired by Aceternity.
 * Lightweight implementation (no extra deps) using CSS scroll snapping.
 */
export default function AppleCardsCarousel({ cards }: { cards: Card[] }) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight text-white">Featured</h3>
        <div className="text-xs text-zinc-400">Scroll →</div>
      </div>

      <div className="mt-4 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch]">
        <div className="flex min-w-max snap-x snap-mandatory gap-4 pr-4">
          {cards.map((c) => (
            <motion.div
              key={c.title}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="snap-start"
            >
              <div className="relative h-[220px] w-[320px] overflow-hidden rounded-3xl border border-zinc-800/70 bg-zinc-950/60 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
                <div className="pointer-events-none absolute inset-0 opacity-70">
                  <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
                  <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                </div>

                <div className="relative">
                  {c.tag ? (
                    <div className="inline-flex items-center rounded-full border border-zinc-800 bg-black/40 px-2.5 py-1 text-[11px] text-zinc-300">
                      {c.tag}
                    </div>
                  ) : null}

                  <div className="mt-3 text-xl font-semibold text-white">{c.title}</div>
                  <div className="mt-2 text-sm text-zinc-400">{c.description}</div>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm text-orange-400">
                    Learn more
                    <span className="opacity-80">→</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
