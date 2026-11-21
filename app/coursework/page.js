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
    takeaway: "I learned to use recursion in Python and Scheme and got to see how an interpreter works by building one. Working in both languages made me pay more attention to how I break up a program and what each function needs to know.",
  },
  {
    code: 'CS 61B',
    name: 'Data Structures',
    semester: 'Spring 2025',
    takeaway: "I spent a lot of time writing Java and figuring out when to reach for a tree, a graph, or a hash table. The projects gave me a chance to put those decisions into practice, including in Gitlet, where I built a small version control system.",
  },
  {
    code: 'EECS 16A',
    name: 'Designing Information Devices and Systems I',
    semester: 'Fall 2024',
    takeaway: "This was my introduction to linear algebra and circuits. The imaging examples helped the math click for me. It was easier to see why something like eigendecomposition mattered when we were talking about measurements from real sensors.",
  },
  {
    code: 'EECS 16B',
    name: 'Designing Information Devices and Systems II',
    semester: 'Spring 2025',
    takeaway: "We went from differential equations and feedback to building a car that responds to voice commands. Seeing SVD go from something we learned in class to a way for the car to tell commands apart was the part that stuck with me.",
  },
  {
    code: 'CS 70',
    name: 'Discrete Mathematics and Probability Theory',
    semester: 'Fall 2025',
    takeaway: "CS 70 made me slow down and explain why an answer was true. That came up in proofs, graph theory, and modular arithmetic, then again in probability when we had to be precise about what we were assuming.",
  },
  {
    code: 'CS 61C',
    name: 'Great Ideas in Computer Architecture',
    semester: 'Spring 2026',
    takeaway: "I went from writing C and RISC-V assembly to building a CPU and trying to speed up matrix multiplication with SIMD. Caches and pipelining made more sense once I could connect them to what the code was asking the machine to do.",
  },
  {
    code: 'CS 186',
    name: 'Introduction to Database Systems',
    semester: 'Spring 2026',
    takeaway: "I’d used SQL before this class, but building a query executor made me think about what happens after I hit run. B-trees, query plans, and concurrency control gave me more context for the database decisions I run into on backend projects.",
  },
  {
    code: 'CS 188',
    name: 'Introduction to Artificial Intelligence',
    semester: 'Fall 2025',
    takeaway: "I built Pacman agents with minimax and Q-learning. It was fun to watch the agents play the same game and see how differently they made decisions. The projects helped me connect the search and reinforcement learning we covered in class to something I could watch play out.",
  },
];

const activities = [
  {
    name: 'Codebase',
    role: 'Internal Vice President, Client Developer (two projects), Mentored Developer',
    period: '2025 — Present',
    description: "I came to Codebase to work on projects and ended up staying for the people. After three projects, I wanted to give back as IVP. I planned retreats, pumpkin carving, cross-club socials, yacht parties, and celebrations. A lot of it came down to giving people more chances to meet each other and feel like part of the club.",
    tape: 'yellow',
  },
  {
    name: 'Berkeleytime',
    role: 'Infrastructure Pod Lead, Infrastructure Pod Developer, Learning Pod',
    period: '2025 — Present',
    description: "I used Berkeleytime to build my own schedule, so I already knew how much I relied on it before I joined. I started in the Learning Pod, joined the Infra Pod, and now lead it. That’s where I’ve gotten to explore production engineering and make decisions about keeping the site running for the students who use it.",
    tape: 'blue',
  },
  {
    name: 'PREP',
    role: 'Ambassador, Alumni, Scholar',
    period: '2024 — Present',
    description: "PREP is a community I hold near and dear to my heart. I went through the program in summer 2024 and came back as an ambassador. I put together the weekly newsletter, filmed student interviews, and helped plan workshops and activities for the wider PREP community.",
    tape: 'red',
  },
  {
    name: 'Lambda Phi Epsilon',
    role: 'External Vice President, Technology Chair',
    period: '2025 — Present',
    description: "I helped recharter Lambda Phi Epsilon at Berkeley, working with the national organization and the university. I handle external affairs and social media, and I built the chapter website. There’s also a member dashboard where we can find resources and meeting notes, get reminders about what’s coming up, and customize our profiles.",
    tape: 'plain',
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

      {activity.photos?.length > 0 && (
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
      )}
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
          className="page-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          B.S. Electrical Engineering and Computer Sciences
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
      <section id="activities-and-societies" className={styles.section}>
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.sectionHeader}
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
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
