import styles from './doodles.module.css';

const TAPE_TINTS = {
  yellow: 'rgba(255, 209, 102, 0.55)',
  red: 'rgba(230, 57, 70, 0.32)',
  blue: 'rgba(69, 123, 157, 0.32)',
  plain: 'rgba(233, 230, 218, 0.75)',
};

/**
 * Translucent washi tape strip. Absolutely positioned by the caller —
 * typically straddling the top edge or a corner of a paper scrap.
 */
export default function WashiTape({ tint = 'plain', rotate = -4, width = 92, style, className }) {
  return (
    <span
      aria-hidden
      className={`${styles.washiTape} ${className || ''}`}
      style={{
        width,
        transform: `rotate(${rotate}deg)`,
        backgroundColor: TAPE_TINTS[tint] || TAPE_TINTS.plain,
        ...style,
      }}
    />
  );
}
