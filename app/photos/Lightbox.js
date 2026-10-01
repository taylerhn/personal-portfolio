'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RoughArrowButton, RoughCloseButton } from './RoughIcons';
import styles from './page.module.css';

/**
 * Full-screen viewer for a single photo, with prev/next browsing across the
 * whole album (wrapping at the ends). Arrow keys and Escape are handled by
 * the page so navigation works whether or not a button has focus.
 */
export default function Lightbox({ photo, index, total, onNavigate, onClose }) {
  // freeze the page behind the overlay
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <motion.div
      className={styles.lightboxOverlay}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${total}`}
    >
      <RoughCloseButton onClick={onClose} />

      <div className={styles.lightboxNavLeft} onClick={(e) => e.stopPropagation()}>
        <RoughArrowButton direction="left" label="Previous photo" onClick={() => onNavigate(-1)} />
      </div>

      <motion.figure
        key={index}
        className={styles.lightboxFrame}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, rotate: -1.5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      >
        <div className={styles.lightboxImage}>
          <Image src={photo.src} alt={photo.alt} fill sizes="90vw" style={{ objectFit: 'contain' }} />
        </div>
        <figcaption className={styles.lightboxCaption}>
          {photo.caption || photo.alt}
          <span className={styles.lightboxCount}>{index + 1} / {total}</span>
        </figcaption>
      </motion.figure>

      <div className={styles.lightboxNavRight} onClick={(e) => e.stopPropagation()}>
        <RoughArrowButton direction="right" label="Next photo" onClick={() => onNavigate(1)} />
      </div>
    </motion.div>
  );
}
