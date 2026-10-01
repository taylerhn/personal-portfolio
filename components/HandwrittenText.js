'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './handwritten.module.css';

/**
 * Text that writes itself in, letter by letter, like a pen tracing each
 * glyph — SVG text with a staggered stroke-dashoffset animation, then the
 * ink "fills" behind the stroke.
 *
 * SVG can't auto-layout per-letter <text> elements, so we first render the
 * full string invisibly, measure cumulative letter offsets with
 * getSubStringLength, then render one positioned <text> per letter.
 */
export default function HandwrittenText({
  text,
  fontSize = 96,
  color = 'var(--ink)',
  delay = 0,
  letterDuration = 0.55,
  className,
}) {
  const measureRef = useRef(null);
  const [layout, setLayout] = useState(null); // { letters: [{char, x}], width }

  useEffect(() => {
    let cancelled = false;
    // Caveat must be loaded before measuring, or offsets come from the fallback
    // font. fonts.ready alone can resolve before the @import kicks off the load,
    // so request the face explicitly.
    document.fonts.load('700 100px Caveat').then(() => document.fonts.ready).then(() => {
      const el = measureRef.current;
      if (cancelled || !el) return;
      const letters = text.split('').map((char, i) => ({
        char,
        x: el.getSubStringLength(0, i),
      }));
      setLayout({ letters, width: Math.ceil(el.getComputedTextLength()) });
    });
    return () => {
      cancelled = true;
    };
  }, [text]);

  const height = fontSize * 1.25;
  const baseline = fontSize * 0.92;
  const width = layout ? layout.width + 8 : fontSize * text.length * 0.45;

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ maxWidth: '100%', height: 'auto', overflow: 'visible' }}
      role="img"
      aria-label={text}
    >
      <text
        ref={measureRef}
        x="0"
        y={baseline}
        fontSize={fontSize}
        className={styles.measure}
      >
        {text}
      </text>
      {layout?.letters.map(({ char, x }, i) => {
        const strokeDelay = delay + i * 0.13;
        return (
          <text
            key={i}
            x={x}
            y={baseline}
            fontSize={fontSize}
            className={styles.letter}
            style={{
              stroke: color,
              fill: color,
              animationDuration: `${letterDuration}s, 0.4s`,
              animationDelay: `${strokeDelay}s, ${strokeDelay + letterDuration * 0.7}s`,
            }}
          >
            {char}
          </text>
        );
      })}
    </svg>
  );
}
