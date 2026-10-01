'use client';

import { useEffect, useId, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * The site's personality engine: a wobbly hand-drawn stick figure.
 *
 * - Draws itself in stroke-by-stroke when scrolled into view
 * - Breathes constantly (subtle scaleY loop from the feet)
 * - Head rotates to follow the cursor
 * - Poses swap out the arm/leg paths; the "wave" pose also loops an arm wave
 * - Optionally wears a real photo as its face (circular crop)
 */

const VIEW_W = 120;
const VIEW_H = 164;
const HEAD_CX = 60;
const HEAD_CY = 30;
const NECK_Y = 47;
const SHOULDER = { x: 60, y: 59 };
const HIP = { x: 60, y: 104 };

// Wobbly head — deliberately not a perfect circle.
const HEAD_PATH =
  'M60 13 C73 12 77.5 22 76.5 30 C75.5 41 68 47 59.5 46.5 C49 46 43.5 38 44 28 C44.5 17.5 50 13.5 60 13';

const BODY_PATH = 'M60 47 Q58 76 60 104';

const STANDING_LEGS = ['M60 104 Q53 130 47 156', 'M60 104 Q68 130 74 156'];

const POSES = {
  wave: {
    arms: ['M59 60 Q46 73 36 87'],
    wavingArm: 'M61 59 Q75 48 84 33',
    legs: STANDING_LEGS,
  },
  think: {
    headTilt: -9,
    // hand up to the chin, other arm tucked behind the back
    arms: ['M61 61 Q74 57 69 45', 'M59 61 Q50 79 53 96'],
    legs: STANDING_LEGS,
  },
  present: {
    // both arms out to the right, ta-da style
    arms: ['M59 59 Q78 57 93 51', 'M61 64 Q79 70 92 75'],
    legs: STANDING_LEGS,
  },
  point: {
    arms: ['M61 58 Q79 47 96 37', 'M59 60 Q52 78 54 96'],
    legs: STANDING_LEGS,
  },
  climb: {
    arms: ['M59 57 Q50 38 46 21', 'M61 57 Q70 37 74 20'],
    legs: ['M60 104 Q44 116 48 139', 'M60 104 Q75 111 70 135'],
  },
};

const drawVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (order) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: order * 0.18, duration: 0.45, ease: 'easeInOut' },
      opacity: { delay: order * 0.18, duration: 0.01 },
    },
  }),
};

const popVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: (order) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: order * 0.18, type: 'spring', stiffness: 300, damping: 18 },
  }),
};

/** Head tilts toward wherever the cursor is on screen. */
function useHeadTracking(svgRef, enabled) {
  const target = useMotionValue(0);
  const rotate = useSpring(target, { stiffness: 90, damping: 14 });

  useEffect(() => {
    if (!enabled) return;
    const handleMove = (e) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0) return;
      const headX = rect.left + rect.width * (HEAD_CX / VIEW_W);
      const dx = e.clientX - headX;
      target.set(Math.max(-16, Math.min(16, dx / 28)));
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [enabled, svgRef, target]);

  return rotate;
}

function Stroke({ d, order, color, strokeWidth }) {
  return (
    <motion.path
      d={d}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      fill="none"
      variants={drawVariants}
      custom={order}
    />
  );
}

export default function StickFigure({
  pose = 'wave',
  size = 140,
  color = 'var(--ink)',
  strokeWidth = 3.5,
  photoSrc,
  trackCursor = true,
  drawIn = true,
  flip = false,
  className,
  style,
}) {
  const svgRef = useRef(null);
  const clipId = useId();
  const headRotate = useHeadTracking(svgRef, trackCursor);
  const { arms, wavingArm, legs, headTilt = 0 } = POSES[pose] || POSES.wave;

  // transform-origin values are % of the viewBox (transformBox: 'view-box'),
  // otherwise SVG groups rotate around the canvas origin.
  const neckOrigin = `${(HEAD_CX / VIEW_W) * 100}% ${(NECK_Y / VIEW_H) * 100}%`;
  const shoulderOrigin = `${(SHOULDER.x / VIEW_W) * 100}% ${(SHOULDER.y / VIEW_H) * 100}%`;

  return (
    <motion.svg
      ref={svgRef}
      className={className}
      style={{ ...style, scaleX: flip ? -1 : 1, overflow: 'visible' }}
      width={size}
      height={(size * VIEW_H) / VIEW_W}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      fill="none"
      initial={drawIn ? 'hidden' : 'visible'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      aria-hidden
    >
      {/* breathing: the whole figure gently expands from the feet */}
      <motion.g
        animate={{ scaleY: [1, 1.025, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
      >
        <motion.g
          style={{ rotate: headRotate, transformBox: 'view-box', transformOrigin: neckOrigin }}
        >
          <g transform={headTilt ? `rotate(${headTilt} ${HEAD_CX} ${NECK_Y})` : undefined}>
            {photoSrc ? (
              <>
                <clipPath id={clipId}>
                  <circle cx={HEAD_CX} cy={HEAD_CY} r="15.5" />
                </clipPath>
                <motion.image
                  href={photoSrc}
                  x={HEAD_CX - 16}
                  y={HEAD_CY - 16}
                  width="32"
                  height="32"
                  clipPath={`url(#${clipId})`}
                  preserveAspectRatio="xMidYMid slice"
                  variants={popVariants}
                  custom={0}
                />
                <Stroke d={HEAD_PATH} order={0} color={color} strokeWidth={strokeWidth} />
              </>
            ) : (
              <>
                <Stroke d={HEAD_PATH} order={0} color={color} strokeWidth={strokeWidth} />
                <motion.circle cx="54" cy="27" r="1.9" fill={color} variants={popVariants} custom={1} />
                <motion.circle cx="66" cy="27" r="1.9" fill={color} variants={popVariants} custom={1.2} />
                <Stroke d="M53 35 Q60 40.5 67 35" order={1.4} color={color} strokeWidth={strokeWidth * 0.7} />
              </>
            )}
          </g>
        </motion.g>

        <Stroke d={BODY_PATH} order={1.8} color={color} strokeWidth={strokeWidth} />

        {arms.map((d, i) => (
          <Stroke key={d} d={d} order={2.2 + i * 0.4} color={color} strokeWidth={strokeWidth} />
        ))}

        {wavingArm && (
          <motion.g
            animate={{ rotate: [0, -14, 9, -14, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.4, ease: 'easeInOut' }}
            style={{ transformBox: 'view-box', transformOrigin: shoulderOrigin }}
          >
            <Stroke d={wavingArm} order={2.6} color={color} strokeWidth={strokeWidth} />
          </motion.g>
        )}

        {legs.map((d, i) => (
          <Stroke key={d} d={d} order={3 + i * 0.4} color={color} strokeWidth={strokeWidth} />
        ))}
      </motion.g>
    </motion.svg>
  );
}
