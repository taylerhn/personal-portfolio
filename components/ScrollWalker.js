'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';

/**
 * A little stick figure that walks along the bottom edge of the viewport,
 * pacing the reader's progress through the page. The gait is driven by
 * scroll distance (walks when you scroll, stops when you stop), the lean by
 * scroll velocity, and it turns around when you scroll back up.
 *
 * On mobile it walks down the left edge instead (rotated 90°), since the
 * bottom edge is where thumbs live.
 */

const FIG_W = 64;
const FIG_H = 92;
const SHOULDER_ORIGIN = '50% 33.7%';
const HIP_ORIGIN = '50% 58.7%';

export default function ScrollWalker() {
  const [mode, setMode] = useState(null); // null until mounted → no SSR mismatch
  const travelRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      const vertical = window.innerWidth <= 640;
      travelRef.current = (vertical ? window.innerHeight : window.innerWidth) - FIG_W - 24;
      setMode(vertical ? 'vertical' : 'horizontal');
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollY, scrollYProgress } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { stiffness: 50, damping: 20 });

  const position = useSpring(
    useTransform(scrollYProgress, (p) => p * travelRef.current),
    { stiffness: 350, damping: 42 }
  );

  const legSwing = useTransform(scrollY, (v) => Math.sin(v / 26) * 27);
  const legSwingOpposite = useTransform(legSwing, (v) => -v);
  const armSwing = useTransform(legSwing, (v) => -v * 0.65);
  const armSwingOpposite = useTransform(legSwing, (v) => v * 0.65);
  const bob = useTransform(scrollY, (v) => -Math.abs(Math.sin(v / 26)) * 2.5);
  const lean = useTransform(smoothVelocity, [-2500, 0, 2500], [-9, 0, 9]);
  const facing = useSpring(
    useTransform(smoothVelocity, (v) => (v < -60 ? -1 : 1)),
    { stiffness: 260, damping: 24 }
  );

  if (!mode) return null;

  const containerStyle =
    mode === 'vertical'
      ? // rotating 90° turns "walk right" into "walk down" with feet on the left edge
        { top: 0, left: -14, y: position, rotate: 90 }
      : { bottom: 0, left: 12, x: position };

  return (
    <motion.div
      aria-hidden
      style={{
        position: 'fixed',
        zIndex: 900,
        pointerEvents: 'none',
        ...containerStyle,
      }}
    >
      <motion.svg
        width={FIG_W}
        height={FIG_H}
        viewBox={`0 0 ${FIG_W} ${FIG_H}`}
        fill="none"
        style={{ scaleX: facing, rotate: lean, y: bob, overflow: 'visible' }}
      >
        <ellipse cx="32" cy="88.5" rx="14" ry="2.4" fill="rgba(26, 26, 46, 0.1)" />

        <path
          d="M32 4 C39 3.5 41.5 9 41 13.5 C40.5 19.5 36.5 22.5 31.5 22.2 C26 22 23 17.5 23.3 12.5 C23.6 7 27 4.3 32 4"
          stroke="var(--ink)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="29.5" cy="11.5" r="1.3" fill="var(--ink)" />
        <circle cx="35.5" cy="11.5" r="1.3" fill="var(--ink)" />
        <path d="M29 16.5 Q32.5 19 36 16.5" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />

        <path d="M32 23 Q31 38 32 54" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />

        <motion.g style={{ rotate: armSwing, transformBox: 'view-box', transformOrigin: SHOULDER_ORIGIN }}>
          <path d="M32 31 Q36.5 41 38.5 50" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        </motion.g>
        <motion.g style={{ rotate: armSwingOpposite, transformBox: 'view-box', transformOrigin: SHOULDER_ORIGIN }}>
          <path d="M32 31 Q27.5 41 25.5 50" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        </motion.g>

        <motion.g style={{ rotate: legSwing, transformBox: 'view-box', transformOrigin: HIP_ORIGIN }}>
          <path d="M32 54 Q33.5 69 34.5 85" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        </motion.g>
        <motion.g style={{ rotate: legSwingOpposite, transformBox: 'view-box', transformOrigin: HIP_ORIGIN }}>
          <path d="M32 54 Q30.5 69 29.5 85" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        </motion.g>
      </motion.svg>
    </motion.div>
  );
}
