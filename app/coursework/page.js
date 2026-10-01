'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import StickFigure from '../../components/StickFigure';
import WashiTape from '../../components/doodles/WashiTape';
import TornLayers from '../../components/doodles/TornLayers';
import { RoughUnderline } from '../../components/doodles/rough';

/* ─── DATA ───────────────────────────────────────────────────── */
const courses = [
  {
    code: 'CS 61A',
    name: 'Structure and Interpretation of Computer Programs',
    semester: 'Fall 2024',
    takeaway: 'Fundamentals of functional and object-oriented programming through Python and Scheme. Built interpreters, studied recursion, higher-order functions, and abstraction. This course fundamentally changed how I think about program structure and the relationship between data and procedures.',
  },
  {
    code: 'CS 61B',
    name: 'Data Structures',
    semester: 'Spring 2025',
    takeaway: 'Deep dive into Java and core data structures — trees, graphs, hash tables, heaps, tries. Built a full file-sharing system (Gitlet) from scratch. The project-heavy format pushed me to write clean, testable code and reason carefully about time/space complexity.',
  },
  {
    code: 'EECS 16A',
    name: 'Designing Information Devices and Systems I',
    semester: 'Fall 2024',
    takeaway: 'Introduced linear algebra and circuit design with applications to imaging, tomography, and machine learning. Bridging math and physical systems was eye-opening — seeing how eigendecomposition applies to real sensor arrays made abstract concepts concrete.',
  },
  {
    code: 'EECS 16B',
    name: 'Designing Information Devices and Systems II',
    semester: 'Spring 2025',
    takeaway: 'Continued into differential equations, feedback control, and signal processing. Built a voice-controlled car using SVD-based classification. This course solidified my understanding of how software and hardware co-design enables smart systems.',
  },
  {
    code: 'CS 70',
    name: 'Discrete Mathematics and Probability Theory',
    semester: 'Fall 2025',
    takeaway: 'Covered proofs, graph theory, modular arithmetic, Markov chains, and probability. Strengthened my mathematical maturity and my ability to construct rigorous arguments — skills that show up every time I reason about algorithm correctness or system reliability.',
  },
  {
    code: 'CS 61C',
    name: 'Great Ideas in Computer Architecture',
    semester: 'Spring 2026',
    takeaway: 'C, RISC-V assembly, pipelining, caches, virtual memory, and parallelism. Writing a CPU in hardware description language and optimizing matrix multiplication with SIMD was humbling and empowering — understanding the machine makes me a better programmer at every layer of the stack.',
  },
  {
    code: 'CS 186',
    name: 'Introduction to Database Systems',
    semester: 'Spring 2026',
    takeaway: 'Relational databases, query optimization, B-trees, concurrency control, and recovery. Implementing a full query executor from scratch gave me deep respect for the engineering behind systems I had been using casually. Directly applicable to every backend project I build.',
  },
  {
    code: 'CS 188',
    name: 'Introduction to Artificial Intelligence',
    semester: 'Fall 2025',
    takeaway: 'Search algorithms, constraint satisfaction, Bayesian networks, reinforcement learning, and neural networks. Implemented Pacman agents that outperform rule-based approaches using minimax and Q-learning. Grounded my understanding of AI in principled algorithmic thinking.',
  },
];

const activities = [
  {
    name: 'Activity / Society Name',
    role: 'Your Role',
    period: '2024 — Present',
    description: 'Add a brief description of your involvement, what you do in this organization, and why it matters to you. This is a great place to highlight leadership, community impact, or technical contributions.',
    tape: 'yellow',
    photos: [
      { src: '/herophoto.jpg', caption: 'caption one' },
      { src: '/herophoto2.jpg', caption: 'caption two' },
      { src: '/herophoto3.jpg', caption: 'caption three' },
    ],
  },
  {
    name: 'Activity / Society Name',
    role: 'Your Role',
    period: '2025 — Present',
    description: 'Add a brief description of your involvement, what you do in this organization, and why it matters to you. This is a great place to highlight leadership, community impact, or technical contributions.',
    tape: 'blue',
    photos: [
      { src: '/herophoto2.jpg', caption: 'caption one' },
      { src: '/herophoto3.jpg', caption: 'caption two' },
    ],
  },
];

/* ─── COURSE ACCORDION ITEM ─────────────────────────────────── */
function CourseItem({ course, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className={`${styles.courseItem} ${open ? styles.courseItemOpen : ''}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 120, damping: 20 }}
    >
      <button
        className={styles.courseHeader}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={styles.courseCode}>{course.code}</span>
        <span className={styles.courseName}>{course.name}</span>
        <span className={styles.courseSem}>{course.semester}</span>
        <motion.span
          className={styles.courseChevron}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        >
          ↓
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 38 }}
            style={{ overflow: 'hidden' }}
          >
            <div className={styles.courseBody}>
              <p>{course.takeaway}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── ACTIVITY CARD ─────────────────────────────────────────── */
function ActivityCard({ activity, index }) {
  return (
    <motion.div
      className={styles.activityCard}
      style={{ rotate: index % 2 === 0 ? 'var(--tilt-3)' : 'var(--tilt-2)' }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 110, damping: 20 }}
    >
      <TornLayers
        backRotate={index % 2 === 0 ? -1.5 : 1.3}
        back={index % 2 === 0 ? 'var(--kraft)' : 'var(--kraft-dark)'}
      />
      <WashiTape tint={activity.tape} rotate={index % 2 === 0 ? -5 : 4} width={100} style={{ top: -14, left: 30 }} />

      <span className={styles.activityPeriod}>{activity.period}</span>
      <h3 className={styles.activityName}>{activity.name}</h3>
      <span className={styles.activityRole}>{activity.role}</span>

      <p className={styles.activityDesc}>{activity.description}</p>

      <div className={styles.activityPhotos}>
        {activity.photos.map((photo, i) => (
          <div
            key={i}
            className={styles.activityPhotoWrap}
            style={{ transform: `rotate(${i % 2 === 0 ? -2.5 : 2}deg)` }}
          >
            <div className={styles.activityPhoto}>
              <Image src={photo.src} alt={photo.caption} fill style={{ objectFit: 'cover' }} />
            </div>
            <span className={styles.activityPhotoCaption}>{photo.caption}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── PAGE ───────────────────────────────────────────────────── */
const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } },
};

export default function CourseworkPage() {
  return (
    <main className={styles.main}>

      {/* ── HERO ───────────────────────────────────────── */}
      <section className={styles.hero}>
        <motion.span
          className={styles.eyebrow}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          UC Berkeley · College of Engineering · Class of 2028
        </motion.span>

        <motion.h1
          className={styles.pageTitle}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 120, damping: 20 }}
        >
          Coursework
        </motion.h1>
        <RoughUnderline double color="var(--red-pen)" className={styles.titleUnderline} delay={0.4} />

        <motion.p
          className={styles.pageSubtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <span className="highlight">B.S. Electrical Engineering and Computer Sciences</span>
        </motion.p>
      </section>

      {/* ── COURSES ────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.sectionHeader}
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <span className={styles.sectionLabel}></span>
            <h2 className={styles.sectionTitle}>What I&apos;ve studied</h2>
            <RoughUnderline double color="var(--red-pen)" />
          </motion.div>

          <div className={styles.courseList}>
            {courses.map((course, i) => (
              <CourseItem key={course.code} course={course} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ACTIVITIES ─────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.sectionHeader}
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <span className={styles.sectionLabel}>outside the lecture hall</span>
            <h2 className={styles.sectionTitle}>Activities &amp; Societies</h2>
            <RoughUnderline double color="var(--red-pen)" />
          </motion.div>

          <div className={styles.activityGrid}>
            {activities.map((activity, i) => (
              <ActivityCard key={i} activity={activity} index={i} />
            ))}
          </div>

          <div className={styles.pageEndFigure}>
            <StickFigure pose="wave" size={80} />
            <span>that&apos;s everything (for now)</span>
          </div>
        </div>
      </section>
    </main>
  );
}
