'use client';

import styles from './page.module.css';
import Image from 'next/image';
import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import StickFigure from '../components/StickFigure';
import HandwrittenText from '../components/HandwrittenText';
import WashiTape from '../components/doodles/WashiTape';
import TornLayers from '../components/doodles/TornLayers';
import { RoughBox, RoughLine, RoughUnderline } from '../components/doodles/rough';
import { ScratchOut } from '../components/doodles/Doodles';

/* ─── DATA ─────────────────────────────────────────────────── */
const polaroids = [
  { src: '/herophoto.jpg', caption: 'the bay', rotation: -5, tape: 'yellow' },
  { src: '/herophoto2.jpg', caption: 'build night', rotation: 4, tape: 'blue' },
  { src: '/herophoto3.jpg', caption: 'field work', rotation: -3, tape: 'red' },
  { src: '/herophoto.jpg', caption: 'golden hour', rotation: 5, tape: 'plain' },
  // empty frames — swap in real photos later, same object shape with a src
];

const funFacts = [
  {
    text: 'Mentors first-gen students — someone did it for me, so I pay it forward.',
    color: 'var(--sticky-yellow)',
    pose: 'wave',
    rotate: -2.5,
  },
  {
    text: 'Self-appointed scout of every coffee shop within biking distance of campus.',
    color: 'var(--sticky-tan)',
    pose: 'think',
    rotate: 1.5,
  },
  {
    text: 'Has never once taken lecture notes without doodling in the margins. Exhibit A: this website.',
    color: 'var(--sticky-blue)',
    pose: 'point',
    rotate: -1,
  },
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

/** Notebook-style section heading: handwritten label + double red underline. */
function SectionHeading({ label, title }) {
  return (
    <motion.div
      className={styles.sectionHeader}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      <span className={styles.sectionLabel}>{label}</span>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <RoughUnderline double color="var(--red-pen)" strokeWidth={2.5} />
    </motion.div>
  );
}

/** Occasional idle wiggle so the paper scraps feel restless, not static. */
function useShake(controls) {
  useEffect(() => {
    const t = setTimeout(() => {
      // x-only wiggle: animating rotate here would stomp each note's base tilt
      controls.start({
        x: [0, -3, 3, -2, 2, 0],
        transition: { duration: 1, ease: 'easeInOut', repeat: Infinity, repeatDelay: 4 },
      });
    }, 600 + Math.random() * 1200);
    return () => clearTimeout(t);
  }, [controls]);
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
        {photo.placeholder ? (
          <div className={styles.polaroidEmpty}>
          </div>
        ) : (
          <Image
            src={photo.src}
            alt={photo.caption}
            fill
            draggable={false}
            style={{ objectFit: 'cover', pointerEvents: 'none', userSelect: 'none' }}
          />
        )}
      </div>
      <span className={styles.polaroidCaption}>{photo.caption}</span>
    </motion.div>
  );
}

/* ─── STICKY NOTE ──────────────────────────────────────────── */
function StickyNote({ fact, index }) {
  const controls = useAnimationControls();
  useShake(controls);

  return (
    <motion.div
      className={styles.stickyNote}
      style={{ background: fact.color, rotate: fact.rotate }}
      animate={controls}
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.12, type: 'spring', stiffness: 200, damping: 18 }}
      whileHover={{ scale: 1.05, rotate: 0 }}
    >
      <p className={styles.stickyText}>{fact.text}</p>
      <StickFigure pose={fact.pose} size={40} strokeWidth={5} className={styles.stickyFigure} drawIn={false} />
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
            <motion.span
              className={styles.heyNote}
              initial={{ opacity: 0, rotate: -6 }}
              animate={{ opacity: 1, rotate: -3 }}
              transition={{ delay: 0.15 }}
            >
              hi, my name is
            </motion.span>

            <HandwrittenText text="Tayler" fontSize={112} delay={0.4} className={styles.nameLine} />
            <HandwrittenText text="Nguyen" fontSize={112} delay={1.4} className={styles.nameLine} />

            <motion.p
              className={styles.heroSub}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.3 }}
            >
              <span className="highlight">EECS @ UC Berkeley</span> — I build{' '}
              <span className={styles.scratchWrap}>
                homework
                <ScratchOut width={96} className={styles.scratchLine} delay={2.7} />
              </span>{' '}
              software for real communities, and I draw stick figures in every margin
              I&apos;m given.
            </motion.p>

            <motion.div
              className={styles.heroBtns}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6 }}
            >
              <a href="#about" className={styles.sketchBtn}>
                About Me ↓
                <RoughBox color="var(--red-pen)" strokeWidth={2} inset={2} />
              </a>
              <a href="#contact" className={`${styles.sketchBtn} ${styles.sketchBtnBlue}`}>
                Contact Me →
                <RoughBox color="var(--blue-pen)" strokeWidth={2} inset={2} />
              </a>
            </motion.div>
          </div>

          <div className={styles.heroFigureCol}>
            <StickFigure pose="wave" photoSrc="/headshot.png" size={270} strokeWidth={3} />
            <div className={styles.thisIsMe}>
              <span>Hey there :)<br />Have a good day!</span>
            </div>
          </div>
        </div>

        <motion.div
          className={styles.scrollHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2 }}
        >
          <span>scroll!</span>
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>↓</motion.span>
        </motion.div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────── */}
      <section id="about" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.headingRow}>
            <SectionHeading label="" title="About Me" />
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
                Hello! I&apos;m Tayler — a community leader and aspiring software engineer
                studying Electrical Engineering and Computer Sciences at UC Berkeley.
              </p>
              <p>
                I believe tech is at its best when it bridges gaps and creates opportunities
                for people who weren&apos;t handed any. When I&apos;m not building, I&apos;m
                mentoring first-gen students, hunting down new coffee spots, or filling
                notebook margins with little guys like the ones on this page.
              </p>
              <span className={styles.aboutMarginNote}></span>
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

          <div className={styles.stickyRow}>
            {funFacts.map((fact, i) => (
              <StickyNote key={i} fact={fact} index={i} />
            ))}
          </div>
        </div>
      </section>

      <div className={styles.sketchDivider} aria-hidden>
        <RoughLine color="rgba(26, 26, 46, 0.3)" strokeWidth={2} drawIn />
      </div>

      {/* ── TOOLBOX ──────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <SectionHeading label="" title="Skills and Tools" />

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
          <SectionHeading label="" title="Contact Me" />

          <motion.p
            className={styles.contactSub}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            (these are draggable, by the way. go ahead, make a mess.)
          </motion.p>

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
