'use client';

import { motion } from 'framer-motion';

const drawIn = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay, duration: 0.6, ease: 'easeInOut' },
      opacity: { delay, duration: 0.01 },
    },
  }),
};

/** Animated scribble positioned over the word being corrected. */
export function ScratchOut({ width = 100, color = 'var(--red-pen)', delay = 0, className, style, rotate = 0 }) {
  return (
    <motion.svg
      className={className}
      style={{ height: width * 0.26, ...style, rotate }}
      width={width}
      height={width}
      viewBox="0 0 100 26"
      fill="none"
      aria-hidden
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      <motion.path
        d="M2 14 Q26 8 50 12 Q76 16 98 10 Q70 6 40 14 Q18 19 8 15 Q40 10 68 16 Q86 19 96 15"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        variants={drawIn}
        custom={delay}
      />
    </motion.svg>
  );
}
