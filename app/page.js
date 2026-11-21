'use client';

import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import StickFigure from '../components/StickFigure';
import HandwrittenText from '../components/HandwrittenText';
import WashiTape from '../components/doodles/WashiTape';
import TornLayers from '../components/doodles/TornLayers';
import { RoughBox, RoughLine, RoughUnderline } from '../components/doodles/rough';

/* ─── DATA ─────────────────────────────────────────────────── */
const polaroids = [
  { src: '/home/infront_of_blackrock.png', caption: 'at BlackRock', rotation: -5, tape: 'yellow' },
  { src: '/home/fishing_with_dad.png', caption: 'fishing with Dad', rotation: 4, tape: 'blue' },
  { src: '/home/peer_advising.JPG', caption: 'peer advising', rotation: -3, tape: 'red' },
  { src: '/home/sunglasses_smiling.JPG', caption: 'in shades', rotation: 5, tape: 'plain' },
];

const skills = {
  'languages & frameworks': {
    pen: 'var(--blue-pen)',
    tape: 'blue',
    items: [
      'Python', 'Java', 'C', 'C++', 'JavaScript', 'TypeScript',
      'SQL', 'Ruby', 'Scheme', 'React', 'Next.js', 'Node.js',
      'Express', 'Ruby on Rails', 'NumPy',
    ],
  },
  'tools & infra': {
    pen: 'var(--red-pen)',
    tape: 'red',
    items: [
      'Git', 'Docker', 'Kubernetes', 'Helm', 'GitHub Actions',
      'CI/CD', 'GraphQL', 'Auth0', 'PostgreSQL', 'MongoDB',
      'Google Cloud', 'AWS', 'AlloyDB', 'Neon',
    ],
  },
};

const contacts = [
  { id: 'email', label: 'email', value: 'tayler@berkeley.edu', href: 'mailto:tayler@berkeley.edu', tape: 'yellow', rotate: -2 },
  { id: 'github', label: 'github', value: 'github.com/taylerhn', href: 'https://github.com/taylerhn', tape: 'plain', rotate: 1.5 },
  { id: 'linkedin', label: 'linkedin', value: 'linkedin.com/in/taylerhn', href: 'https://linkedin.com/in/taylerhn/', tape: 'blue', rotate: -3 },
  { id: 'instagram', label: 'instagram', value: 'instagram.com/taqler', href: 'https://instagram.com/taqler', tape: 'red', rotate: 2.5 },
];

const contactPoses = ['wave', 'present', 'point', 'think'];

/* ─── SHARED BITS ──────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } },
};

function SectionHeading({ title }) {
  return (
    <motion.div
      className={styles.sectionHeader}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <h2 className={styles.sectionTitle}>{title}</h2>
      <RoughUnderline double color="var(--red-pen)" strokeWidth={2.5} />
    </motion.div>
  );
}

/* ─── POLAROID ─────────────────────────────────────────────── */
function PolaroidPhoto({ photo, zIndex, onDragStart }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      className={styles.polaroid}
      drag
      dragMomentum={false}
      dragElastic={0.08}
      onPointerDown={() => onDragStart?.()}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
      initial={{ opacity: 0, y: 24, rotate: photo.rotation }}
      whileInView={{ opacity: 1, y: 0, rotate: photo.rotation }}
      viewport={{ once: true, amount: 0.1 }}
      whileDrag={{ scale: 1.06, rotate: 0, boxShadow: '0 18px 40px rgba(26,26,46,0.2)' }}
      whileHover={
        !isDragging
          ? { scale: 1.04, rotate: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
          : {}
      }
      style={{ zIndex, cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <WashiTape tint={photo.tape} rotate={photo.rotation * -1.5} width={86} style={{ top: -12, left: '50%', marginLeft: -43 }} />
      <div className={styles.polaroidPhoto}>
        <Image
          src={photo.src}
          alt={photo.caption}
          fill
          sizes="156px"
          draggable={false}
          style={{ objectFit: 'cover', pointerEvents: 'none', userSelect: 'none' }}
        />
      </div>
      <span className={styles.polaroidCaption}>{photo.caption}</span>
    </motion.div>
  );
}

/* ─── CONTACT SCRAP ────────────────────────────────────────── */
function ContactScrap({ contact, pose, zIndex, onDragStart }) {
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (contact.href.startsWith('mailto:')) {
      window.location.href = contact.href;
    } else {
      window.open(contact.href, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const text = contact.href.startsWith('mailto:') ? contact.href.replace('mailto:', '') : contact.href;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <motion.div
      className={styles.contactScrap}
      drag
      dragMomentum={false}
      dragElastic={0.08}
      onPointerDown={() => onDragStart(contact.id)}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
      style={{ zIndex, rotate: contact.rotate, cursor: isDragging ? 'grabbing' : 'grab' }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileDrag={{ scale: 1.06 }}
      whileHover={!isDragging ? { scale: 1.03 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
    >
      <TornLayers backRotate={contact.rotate * -0.8} backOffset={6} />
      <WashiTape tint={contact.tape} rotate={contact.rotate * -2} width={90} style={{ top: -13, left: '50%', marginLeft: -45 }} />

      <div className={styles.scrapFigure}>
        <span className={styles.speechBubble}>{contact.label}</span>
        <StickFigure pose={pose} size={52} strokeWidth={4.5} drawIn={false} />
      </div>

      <div className={styles.scrapBody}>
        <span className={styles.scrapValue}>{contact.value}</span>
        <div className={styles.scrapButtons}>
          <button type="button" className={styles.scrapBtn} onPointerDown={(e) => e.stopPropagation()} onClick={handleOpen}>
            open ↗
          </button>
          <button type="button" className={styles.scrapBtn} onPointerDown={(e) => e.stopPropagation()} onClick={handleCopy}>
            {copied ? 'copied!' : 'copy'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── HOME PAGE ────────────────────────────────────────────── */
export default function Home() {
  const [scrapZ, setScrapZ] = useState(Object.fromEntries(contacts.map((c, i) => [c.id, i + 1])));
  const topScrapZ = useRef(contacts.length + 1);
  const bringScrapToFront = useCallback((id) => {
    topScrapZ.current += 1;
    setScrapZ((prev) => ({ ...prev, [id]: topScrapZ.current }));
  }, []);

  const [polaroidZ, setPolaroidZ] = useState(Object.fromEntries(polaroids.map((_, i) => [i, i + 1])));
  const topPolaroidZ = useRef(polaroids.length + 1);
  const bringPolaroidToFront = useCallback((i) => {
    topPolaroidZ.current += 1;
    setPolaroidZ((prev) => ({ ...prev, [i]: topPolaroidZ.current }));
  }, []);

  return (
    <main className={styles.main}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <HandwrittenText text="Tayler" fontSize={112} delay={0.4} className={styles.nameLine} />
            <HandwrittenText text="Nguyen" fontSize={112} delay={1.4} className={styles.nameLine} />

            <p className={styles.heroSub}>
              I study EECS at UC Berkeley and build web apps for communities and tools for developers.
            </p>

            <motion.div
              className={styles.heroBtns}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6 }}
            >
              <Link href="/projects" className={`${styles.sketchBtn} ${styles.sketchBtnBlack}`}>
                View Projects →
                <RoughBox color="currentColor" strokeWidth={2} inset={2} />
              </Link>
              <a href="#about" className={styles.sketchBtn}>
                About Me ↓
                <RoughBox color="var(--red-pen)" strokeWidth={2} inset={2} />
              </a>
              <a href="#contact" className={`${styles.sketchBtn} ${styles.sketchBtnBlue}`}>
                Contact Me ↓
                <RoughBox color="var(--blue-pen)" strokeWidth={2} inset={2} />
              </a>
            </motion.div>
          </div>

          <div className={styles.heroFigureCol}>
            <StickFigure pose="wave" photoSrc="/headshot.png" size={270} strokeWidth={3} />
            <div className={styles.thisIsMe}>
              <span>Hey there :)<br />Welcome to my website!</span>
            </div>
          </div>
        </div>

        <motion.div
          className={styles.scrollHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2 }}
        >
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>↓</motion.span>
        </motion.div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────── */}
      <section id="about" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.headingRow}>
            <SectionHeading title="About Me" />
            <StickFigure pose="think" size={96} className={styles.headingFigure} />
          </div>

          <div className={styles.aboutLayout}>
            <motion.div
              className={styles.aboutCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            >
              <TornLayers backRotate={-1.6} />
              <RoughBox color="var(--ink)" strokeWidth={2} inset={12} drawIn />
              <p>
                Hey, I&apos;m Tayler! I study EECS at Berkeley. I like working on software people can use,
                and I&apos;m curious about everything from machine learning to what it takes to keep a site running.
              </p>
              <p>
                Outside of class, I like mentoring other students, taking photos, and trying new sandwich spots.
              </p>
            </motion.div>

            <div className={styles.polaroidWall}>
              {polaroids.map((photo, i) => (
                <PolaroidPhoto
                  key={i}
                  photo={photo}
                  zIndex={polaroidZ[i]}
                  onDragStart={() => bringPolaroidToFront(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.sketchDivider} aria-hidden>
        <RoughLine color="rgba(26, 26, 46, 0.3)" strokeWidth={2} drawIn />
      </div>

      {/* ── TOOLBOX ──────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <SectionHeading title="Skills and Tools" />

          <div className={styles.toolboxGrid}>
            {Object.entries(skills).map(([category, group], ci) => (
              <motion.div
                key={category}
                className={styles.toolGroup}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: ci * 0.15, type: 'spring', stiffness: 120, damping: 20 }}
                style={{ rotate: ci % 2 === 0 ? 'var(--tilt-3)' : 'var(--tilt-2)' }}
              >
                <TornLayers backRotate={ci % 2 === 0 ? 1.6 : -1.4} back={ci % 2 === 0 ? 'var(--kraft)' : 'var(--kraft-dark)'} />
                <WashiTape tint={group.tape} rotate={ci % 2 === 0 ? -5 : 4} width={100} style={{ top: -14, left: 24 }} />
                <h3 className={styles.toolTitle} style={{ color: group.pen }}>{category}</h3>
                <div className={styles.tagRow}>
                  {group.items.map((skill, i) => (
                    <motion.span
                      key={skill}
                      className={styles.tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: ci * 0.1 + i * 0.03, type: 'spring', stiffness: 220, damping: 18 }}
                      whileHover={{ scale: 1.1, rotate: i % 2 === 0 ? -2 : 2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.sketchDivider} aria-hidden>
        <RoughLine color="rgba(26, 26, 46, 0.3)" strokeWidth={2} drawIn />
      </div>

      {/* ── CONTACT ──────────────────────────────────────── */}
      <section id="contact" className={styles.section}>
        <div className={styles.sectionInner}>
          <SectionHeading title="Contact Me" />

          <div className={styles.contactStage}>
            {contacts.map((contact, i) => (
              <ContactScrap
                key={contact.id}
                contact={contact}
                pose={contactPoses[i % contactPoses.length]}
                zIndex={scrapZ[contact.id]}
                onDragStart={bringScrapToFront}
              />
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
