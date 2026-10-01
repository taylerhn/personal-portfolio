'use client';

import Image from 'next/image';
import WashiTape from '../../components/doodles/WashiTape';
import styles from './page.module.css';

const TAPE_TINTS = ['yellow', 'blue', 'red', 'plain'];

/** Deterministic pseudo-random tilt in the ±2° range, stable across renders. */
function tiltForIndex(index) {
  return ((index * 37) % 5) - 2;
}

/** A mounted album photo that opens the lightbox. */
export default function PhotoCell({ photo, globalIndex, onOpen }) {
  const usesTape = globalIndex % 2 === 0;

  return (
    <button
      type="button"
      className={styles.photoCell}
      style={{ transform: `rotate(${tiltForIndex(globalIndex)}deg)` }}
      onClick={onOpen}
      aria-label={`View photo: ${photo.caption || photo.alt}`}
    >
      {usesTape ? (
        <WashiTape tint={TAPE_TINTS[globalIndex % TAPE_TINTS.length]} rotate={tiltForIndex(globalIndex) * -2} width={64} style={{ top: -9, left: '50%', marginLeft: -32 }} />
      ) : (
        <>
          <span className={`${styles.cornerMount} ${styles.cornerTL}`} aria-hidden />
          <span className={`${styles.cornerMount} ${styles.cornerTR}`} aria-hidden />
          <span className={`${styles.cornerMount} ${styles.cornerBL}`} aria-hidden />
          <span className={`${styles.cornerMount} ${styles.cornerBR}`} aria-hidden />
        </>
      )}
      <span className={styles.photoFrame}>
        <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 700px) 30vw, 220px" style={{ objectFit: 'cover' }} />
      </span>
      {photo.caption && <span className={styles.photoCaption}>{photo.caption}</span>}
    </button>
  );
}
