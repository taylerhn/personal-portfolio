'use client';

import styles from './footer.module.css';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StickFigure from './StickFigure';

const PEN_COLORS = ['#e63946', '#457b9d', '#1a1a2e', '#ffd166', '#e63946'];

export default function Footer() {
  const [logoClicks, setLogoClicks] = useState(0);
  const [burst, setBurst] = useState(false);

  const handleWordmarkClick = useCallback(() => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 5) {
      setBurst(true);
      setLogoClicks(0);
      setTimeout(() => setBurst(false), 2000);
    }
  }, [logoClicks]);

  return (
    <footer className={styles.footer}>
      <span className={styles.paperStack} aria-hidden>
        <span className={styles.kraftStrip} />
        <span className={styles.paperStrip} />
      </span>

      <div className={styles.inner}>
        <div className={styles.left}>
          <button type="button" className={styles.wordmark} onClick={handleWordmarkClick}>
            Tayler
            <AnimatePresence>
              {burst && (
                <motion.span
                  className={styles.burstRing}
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              )}
            </AnimatePresence>
            {burst && (
              <span className={styles.confettiContainer}>
                {Array.from({ length: 18 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className={styles.confettiDot}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos((i / 18) * Math.PI * 2) * (60 + Math.random() * 60),
                      y: Math.sin((i / 18) * Math.PI * 2) * (60 + Math.random() * 60),
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    style={{ background: PEN_COLORS[i % PEN_COLORS.length] }}
                  />
                ))}
              </span>
            )}
          </button>
          <p className={styles.name}>Tayler Hau Nguyen (he/him)</p>
          <p className={styles.meta}>B.S. Electrical Engineering &amp; Computer Sciences</p>
          <p className={styles.meta}>University of California, Berkeley</p>
          {logoClicks > 0 && (
            <p className={styles.easterHint}>
              {5 - logoClicks} more click{5 - logoClicks !== 1 ? 's' : ''}...
            </p>
          )}
        </div>

        <div className={styles.center}>
          <span className={styles.centerLabel}>table of contents</span>
          <Link href="/#about" className={styles.footerLink}>about me</Link>
          <Link href="/#contact" className={styles.footerLink}>contact me</Link>
          <Link href="/projects" className={styles.footerLink}>projects</Link>
          <Link href="/experiences" className={styles.footerLink}>experiences</Link>
        </div>

        <div className={styles.right}>
          <StickFigure pose="wave" size={72} trackCursor={false} />
          <p className={styles.tagline}>thanks for stopping by!</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <span className={styles.copyright}>© {new Date().getFullYear()} Tayler Hau Nguyen</span>
        <span className={styles.builtWith}>:P</span>
      </div>
    </footer>
  );
}
