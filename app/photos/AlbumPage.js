'use client';

import { motion } from 'framer-motion';
import TornLayers from '../../components/doodles/TornLayers';
import PhotoCell from './PhotoCell';
import styles from './page.module.css';

const PHOTOS_PER_PAGE = 9;
export { PHOTOS_PER_PAGE };

// Real-page-turn feel: pages hinge near the album spine (originX 0 going
// forward, 1 going back) and swing in 3D under the parent's perspective.
const flipVariants = {
  enter: (direction) => ({
    rotateY: direction > 0 ? 60 : -60,
    x: direction > 0 ? 70 : -70,
    opacity: 0,
    originX: direction > 0 ? 0 : 1,
  }),
  center: {
    rotateY: 0,
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 90, damping: 17 },
  },
  exit: (direction) => ({
    rotateY: direction > 0 ? -75 : 75,
    x: direction > 0 ? -90 : 90,
    opacity: 0,
    originX: direction > 0 ? 0 : 1,
    transition: { duration: 0.32, ease: 'easeIn' },
  }),
};

/** One spread of the album: a torn-paper sheet holding a 3×3 photo grid. */
export default function AlbumPage({ pagePhotos, pageIndex, direction, onPhotoClick }) {
  return (
    <motion.div
      className={styles.albumPage}
      custom={direction}
      variants={flipVariants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      <TornLayers backRotate={pageIndex % 2 === 0 ? 1.2 : -1.3} />
      <span className={styles.spineShadow} aria-hidden />

      <div className={styles.photoGrid}>
        {pagePhotos.map((photo, i) => {
          const globalIndex = pageIndex * PHOTOS_PER_PAGE + i;
          return (
            <PhotoCell
              key={globalIndex}
              photo={photo}
              globalIndex={globalIndex}
              onOpen={() => onPhotoClick(globalIndex)}
            />
          );
        })}
      </div>
    </motion.div>
  );
}
