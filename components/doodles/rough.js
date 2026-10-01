'use client';

import { useEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import { motion } from 'framer-motion';

/**
 * Shared roughjs generator — produces SVG path data without touching the DOM,
 * so we can render rough shapes as plain <path> elements inside React.
 */
const generator = rough.generator();

const drawInVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay, duration: 0.7, ease: 'easeInOut' },
      opacity: { delay, duration: 0.01 },
    },
  }),
};

/** Measures an element with ResizeObserver. Returns [ref, { width, height }]. */
export function useElementSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: Math.round(entry.contentRect.width),
        height: Math.round(entry.contentRect.height),
      });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, size];
}

/** Stable random seed per component instance, so shapes don't jitter on re-render. */
function useSeed(seedProp) {
  const [seed] = useState(() => seedProp ?? Math.ceil(Math.random() * 2 ** 31));
  return seed;
}

function RoughPaths({ drawable, color, fillColor, strokeWidth, drawIn, delay }) {
  return generator.toPaths(drawable).map((p, i) => {
    const isFillPath = p.stroke === 'none';
    const props = {
      d: p.d,
      fill: isFillPath ? fillColor : 'none',
      stroke: isFillPath ? 'none' : color,
      strokeWidth: isFillPath ? p.strokeWidth : strokeWidth,
      strokeLinecap: 'round',
    };
    if (!drawIn || isFillPath) return <path key={i} {...props} />;
    return (
      <motion.path
        key={i}
        {...props}
        variants={drawInVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        custom={delay}
      />
    );
  });
}

/**
 * Hand-drawn rectangle border that hugs its parent. Parent needs
 * position: relative. Fill the whole element behind its content by
 * passing fillColor (rendered as a solid rough fill).
 */
export function RoughBox({
  color = 'var(--ink)',
  fillColor,
  strokeWidth = 2,
  roughness = 1.8,
  bowing = 1.5,
  seed,
  inset = 3,
  drawIn = false,
  delay = 0,
}) {
  const [ref, { width, height }] = useElementSize();
  const stableSeed = useSeed(seed);

  const drawable =
    width > 0 && height > 0
      ? generator.rectangle(inset, inset, width - inset * 2, height - inset * 2, {
          roughness,
          bowing,
          seed: stableSeed,
          fill: fillColor ? 'solid-placeholder' : undefined,
          fillStyle: 'solid',
        })
      : null;

  return (
    <div ref={ref} aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {drawable && (
        <svg width={width} height={height} style={{ overflow: 'visible', display: 'block' }}>
          <RoughPaths
            drawable={drawable}
            color={color}
            fillColor={fillColor}
            strokeWidth={strokeWidth}
            drawIn={drawIn}
            delay={delay}
          />
        </svg>
      )}
    </div>
  );
}

/**
 * Hand-drawn underline (red pen by default). Renders as a block element —
 * place it directly under a heading. `double` adds the second stroke of a
 * classic notebook heading.
 */
export function RoughUnderline({
  color = 'var(--red-pen)',
  strokeWidth = 2.5,
  double = false,
  seed,
  drawIn = true,
  delay = 0,
  className,
}) {
  const [ref, { width }] = useElementSize();
  const stableSeed = useSeed(seed);
  const height = double ? 14 : 8;

  return (
    <div ref={ref} aria-hidden className={className} style={{ width: '100%', height }}>
      {width > 0 && (
        <svg width={width} height={height} style={{ overflow: 'visible', display: 'block' }}>
          <RoughPaths
            drawable={generator.line(2, 4, width - 2, 3, { roughness: 1.6, bowing: 3, seed: stableSeed })}
            color={color}
            strokeWidth={strokeWidth}
            drawIn={drawIn}
            delay={delay}
          />
          {double && (
            <RoughPaths
              drawable={generator.line(5, 10, width - 8, 10, { roughness: 1.6, bowing: 3, seed: stableSeed + 7 })}
              color={color}
              strokeWidth={strokeWidth * 0.8}
              drawIn={drawIn}
              delay={delay + 0.15}
            />
          )}
        </svg>
      )}
    </div>
  );
}

/**
 * Rough ellipse scribbled around its parent's content, like circling a word
 * on a page. Parent needs position: relative.
 */
export function RoughCircleMark({
  color = 'var(--red-pen)',
  strokeWidth = 2,
  seed,
  drawIn = true,
  delay = 0,
}) {
  const [ref, { width, height }] = useElementSize();
  const stableSeed = useSeed(seed);
  // The ellipse overshoots the content box so it reads as a loose scribble.
  const padX = width * 0.16 + 6;
  const padY = height * 0.28 + 2;

  return (
    <div ref={ref} aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          style={{ overflow: 'visible', display: 'block' }}
        >
          <RoughPaths
            drawable={generator.ellipse(width / 2, height / 2, width + padX, height + padY, {
              roughness: 1.4,
              bowing: 2,
              seed: stableSeed,
            })}
            color={color}
            strokeWidth={strokeWidth}
            drawIn={drawIn}
            delay={delay}
          />
        </svg>
      )}
    </div>
  );
}

/**
 * Wobbly hand-drawn line that fills its parent — vertical for timelines,
 * horizontal for dividers. Parent controls the length via width/height.
 */
export function RoughLine({
  vertical = false,
  color = 'var(--ink)',
  strokeWidth = 2.5,
  seed,
  drawIn = false,
}) {
  const [ref, { width, height }] = useElementSize();
  const stableSeed = useSeed(seed);
  const length = vertical ? height : width;

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ width: vertical ? strokeWidth * 4 : '100%', height: vertical ? '100%' : strokeWidth * 4 }}
    >
      {length > 0 && (
        <svg
          width={vertical ? strokeWidth * 4 : width}
          height={vertical ? height : strokeWidth * 4}
          style={{ overflow: 'visible', display: 'block' }}
        >
          <RoughPaths
            drawable={
              vertical
                ? generator.line(strokeWidth * 2, 2, strokeWidth * 2, height - 2, {
                    roughness: 2,
                    bowing: 4,
                    seed: stableSeed,
                  })
                : generator.line(2, strokeWidth * 2, width - 2, strokeWidth * 2, {
                    roughness: 2,
                    bowing: 4,
                    seed: stableSeed,
                  })
            }
            color={color}
            strokeWidth={strokeWidth}
            drawIn={drawIn}
          />
        </svg>
      )}
    </div>
  );
}

/** Small rough circle, e.g. a timeline dot. */
export function RoughDot({ size = 18, color = 'var(--ink)', fillColor, strokeWidth = 2, seed }) {
  const stableSeed = useSeed(seed);
  const drawable = generator.circle(size / 2, size / 2, size - strokeWidth * 2, {
    roughness: 1.2,
    seed: stableSeed,
    fill: fillColor ? 'solid-placeholder' : undefined,
    fillStyle: 'solid',
  });

  return (
    <svg width={size} height={size} aria-hidden style={{ overflow: 'visible', display: 'block' }}>
      <RoughPaths drawable={drawable} color={color} fillColor={fillColor} strokeWidth={strokeWidth} />
    </svg>
  );
}
