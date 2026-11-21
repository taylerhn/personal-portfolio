'use client';

import { motion } from 'framer-motion';
import StickFigure from '../../components/StickFigure';
import WashiTape from '../../components/doodles/WashiTape';
import { RoughBox } from '../../components/doodles/rough';
import styles from './page.module.css';

/**
 * The kraft scrapbook cover sitting over the first album page. Swings open
 * on a left hinge (3D rotateY under the album's perspective) — automatically
 * shortly after mount, or immediately on click. Unmounted via AnimatePresence
 * once open.
 */
export default function AlbumCover({ onOpen }) {
  return (
    <motion.button
      type="button"
      className={styles.albumCover}
      onClick={onOpen}
      aria-label="Open the photo album"
      initial={{ rotateY: 0 }}
      exit={{
        rotateY: -108,
        transition: { duration: 1.05, ease: [0.645, 0.045, 0.355, 1] },
      }}
    >
      <RoughBox color="var(--ink)" strokeWidth={2.5} inset={10} roughness={2.2} />
      <WashiTape tint="plain" rotate={-42} width={110} style={{ top: 6, left: -24 }} />
      <WashiTape tint="yellow" rotate={44} width={110} style={{ bottom: 6, right: -24, top: 'auto' }} />

      <span className={styles.coverTitle}>Photos</span>
      <span className={styles.coverSubtitle}>a few photos from my life</span>

      <StickFigure pose="present" size={92} strokeWidth={4} className={styles.coverFigure} />

      <span className={styles.coverHint}>tap to open →</span>
    </motion.button>
  );
}
