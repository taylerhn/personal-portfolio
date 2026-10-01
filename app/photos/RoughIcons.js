'use client';

import { useMemo, useState } from 'react';
import rough from 'roughjs';
import styles from './page.module.css';

const generator = rough.generator();

function useRoughPathData(buildShapes) {
  // stable random seed so the strokes don't rewobble on every render
  const [seed] = useState(() => Math.ceil(Math.random() * 2 ** 31));
  return useMemo(
    () =>
      buildShapes({ roughness: 1.5, bowing: 2, seed }).flatMap((drawable) =>
        generator.toPaths(drawable).map((p) => p.d)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed]
  );
}

/** Hand-drawn arrow button for flipping album pages. */
export function RoughArrowButton({ direction = 'right', onClick, disabled = false, label }) {
  const pathData = useRoughPathData((opts) => [
    generator.line(7, 16, 41, 16, opts),
    generator.line(31, 7, 42, 16, opts),
    generator.line(31, 25, 42, 16, opts),
  ]);

  return (
    <button
      type="button"
      className={styles.arrowBtn}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      <svg
        width="48"
        height="32"
        viewBox="0 0 48 32"
        style={{ transform: direction === 'left' ? 'scaleX(-1)' : undefined, overflow: 'visible' }}
        aria-hidden
      >
        {pathData.map((d, i) => (
          <path key={i} d={d} stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        ))}
      </svg>
    </button>
  );
}

/** Hand-drawn X for closing the lightbox. */
export function RoughCloseButton({ onClick }) {
  const pathData = useRoughPathData((opts) => [
    generator.line(7, 7, 29, 29, opts),
    generator.line(29, 7, 7, 29, opts),
  ]);

  return (
    <button type="button" className={styles.closeBtn} onClick={onClick} aria-label="Close lightbox" autoFocus>
      <svg width="36" height="36" viewBox="0 0 36 36" style={{ overflow: 'visible' }} aria-hidden>
        {pathData.map((d, i) => (
          <path key={i} d={d} stroke="currentColor" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        ))}
      </svg>
    </button>
  );
}
