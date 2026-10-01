'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { photos } from '../../data/photos';
import StickFigure from '../../components/StickFigure';
import { RoughUnderline } from '../../components/doodles/rough';
import AlbumCover from './AlbumCover';
import AlbumPage, { PHOTOS_PER_PAGE } from './AlbumPage';
import Lightbox from './Lightbox';
import { RoughArrowButton } from './RoughIcons';
import styles from './page.module.css';

const AUTO_OPEN_DELAY_MS = 900;

function chunkIntoPages(allPhotos) {
  const pages = [];
  for (let i = 0; i < allPhotos.length; i += PHOTOS_PER_PAGE) {
    pages.push(allPhotos.slice(i, i + PHOTOS_PER_PAGE));
  }
  return pages;
}

export default function PhotosPage() {
  const pages = chunkIntoPages(photos);
  const pageCount = pages.length;

  const [coverOpen, setCoverOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [flipDirection, setFlipDirection] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(null); // index into `photos`, null = closed

  // the cover swings open on its own; clicking it just skips the wait
  useEffect(() => {
    const timer = setTimeout(() => setCoverOpen(true), AUTO_OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const flipPage = useCallback(
    (direction) => {
      setFlipDirection(direction);
      setPageIndex((current) => {
        const next = current + direction;
        return next < 0 || next >= pageCount ? current : next;
      });
    },
    [pageCount]
  );

  const navigateLightbox = useCallback(
    (step) => {
      setLightboxIndex((current) => (current + step + photos.length) % photos.length);
    },
    []
  );

  const closeLightbox = useCallback(() => {
    // land the album on whichever page the viewed photo lives on
    if (lightboxIndex !== null) {
      const targetPage = Math.floor(lightboxIndex / PHOTOS_PER_PAGE);
      if (targetPage !== pageIndex) setFlipDirection(targetPage > pageIndex ? 1 : -1);
      setPageIndex(targetPage);
    }
    setLightboxIndex(null);
  }, [lightboxIndex, pageIndex]);

  // one keyboard handler for the whole page: lightbox first, then album
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && lightboxIndex !== null) {
        closeLightbox();
        return;
      }
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const step = e.key === 'ArrowRight' ? 1 : -1;
      if (lightboxIndex !== null) {
        navigateLightbox(step);
      } else if (coverOpen) {
        flipPage(step);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, coverOpen, flipPage, navigateLightbox, closeLightbox]);

  return (
    <main className={styles.main}>
      <div className={styles.headerRow}>
        <motion.span
          className={styles.sectionLabel}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >

        </motion.span>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 120, damping: 20 }}
        >
          Photo Album
        </motion.h1>
        <RoughUnderline double color="var(--red-pen)" className={styles.titleUnderline} delay={0.4} />
      </div>

      <div className={styles.albumScene}>
        <StickFigure pose="point" size={72} className={styles.sceneFigure} />

        <div className={styles.albumBook}>
          <AnimatePresence custom={flipDirection} mode="popLayout" initial={false}>
            <AlbumPage
              key={pageIndex}
              pagePhotos={pages[pageIndex]}
              pageIndex={pageIndex}
              direction={flipDirection}
              onPhotoClick={setLightboxIndex}
            />
          </AnimatePresence>

          <AnimatePresence>
            {!coverOpen && <AlbumCover onOpen={() => setCoverOpen(true)} />}
          </AnimatePresence>
        </div>

        <div className={styles.pageControls}>
          <RoughArrowButton
            direction="left"
            label="Previous page"
            onClick={() => flipPage(-1)}
            disabled={pageIndex === 0}
          />
          <span className={styles.pageIndicator}>
            page {pageIndex + 1} of {pageCount}
          </span>
          <RoughArrowButton
            direction="right"
            label="Next page"
            onClick={() => flipPage(1)}
            disabled={pageIndex === pageCount - 1}
          />
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photo={photos[lightboxIndex]}
            index={lightboxIndex}
            total={photos.length}
            onNavigate={navigateLightbox}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
