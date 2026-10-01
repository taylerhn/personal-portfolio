import styles from './doodles.module.css';

/**
 * Layered ripped-paper backdrop: a kraft-paper rip sticking out behind a
 * torn front sheet. Absolutely fills its parent — the parent needs
 * position: relative, and its content should sit above (position: relative
 * or z-index > 0) since these layers replace the parent's own background.
 */
export default function TornLayers({
  front = 'var(--paper-warm)',
  back = 'var(--kraft)',
  backRotate = 1.4,
  backOffset = 7,
}) {
  return (
    <span aria-hidden className={styles.tornLayers}>
      <span
        className={styles.tornBack}
        style={{ background: back, inset: -backOffset, transform: `rotate(${backRotate}deg)` }}
      />
      <span className={styles.tornFront} style={{ background: front }} />
    </span>
  );
}
