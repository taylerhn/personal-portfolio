'use client';

import styles from './page.module.css';
import { motion } from 'framer-motion';
import StickFigure from '../../components/StickFigure';
import WashiTape from '../../components/doodles/WashiTape';
import TornLayers from '../../components/doodles/TornLayers';
import { RoughDot, RoughLine, RoughUnderline } from '../../components/doodles/rough';

/* ─── DATA ─────────────────────────────────────────────────── */
const experiences = [
  {
    id: 1,
    company: 'BlackRock',
    role: 'SWE Summer Analyst',
    team: 'Portfolio Management',
    dates: 'Jun 2026 – Present',
    description: 'Fixed Income.',
    tape: 'yellow',
  },
  {
    id: 2,
    company: 'Berkeleytime',
    role: 'Lead Software Engineer',
    team: 'Infrastructure',
    dates: 'Aug 2026 – Present',
    description: 'Infrastructure for 50,000+ Monthly Active Users.',
    tape: 'blue',
  },
  {
    id: 3,
    company: 'Google × Codebase',
    dates: 'Sep 2025 – Present',
    tape: 'red',
    roles: [
      {
        title: 'AlloyDB Developer Experience',
        team: 'AlloyDB',
        dates: 'Sep 2025 – Present',
        description: 'Building tools to identify developer pain points in AlloyDB workflows.',
      },
      {
        title: 'PostgreSQL Traffic Replay',
        team: 'AlloyDB',
        dates: 'Sep 2025 – Present',
        description: 'PostgreSQL traffic recording and replay for database benchmarking.',
      },
    ],
  },
  {
    id: 4,
    company: 'Lotus Bloom × Codebase',
    role: 'Software Engineer',
    team: 'Dashboard',
    dates: 'Sep 2025 – Present',
    description: 'Building a community forum and dashboard for a nonprofit family resource center.',
    tape: 'plain',
  },
  {
    id: 5,
    company: 'UC Berkeley',
    dates: 'Sep 2025 – Present',
    tape: 'yellow',
    roles: [
      {
        title: 'Peer Advisor',
        team: 'College of Engineering',
        dates: 'Sep 2025 – Present',
        description: 'Supporting engineering students through advising, mentorship, and resource referrals.',
      },
      {
        title: 'PREP Ambassador',
        team: 'College of Engineering',
        description: 'Supporting engineering students from underrepresented backgrounds.',
      },
      {
        title: 'ITCS Student Technician',
        team: 'IT Client Services',
        description: 'Supporting staff, faculty, and students with campus technology.',
      },
    ],
  },
];

/* ─── TIMELINE ITEM ─────────────────────────────────────────── */
function TimelineItem({ exp, index }) {
  const isGrouped = Boolean(exp.roles);

  return (
    <motion.div
      className={styles.item}
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: index * 0.05 }}
    >
      <div className={styles.itemLeft}>
        <motion.div
          className={styles.dotWrap}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 300, damping: 16, delay: index * 0.08 + 0.15 }}
        >
          <RoughDot size={22} color="var(--ink)" fillColor="var(--red-pen)" seed={index * 17 + 3} />
        </motion.div>
        <span className={styles.dates}>{exp.dates}</span>
      </div>

      <div
        className={styles.card}
        style={{ rotate: index % 2 === 0 ? 'var(--tilt-3)' : 'var(--tilt-2)' }}
      >
        <TornLayers
          backRotate={index % 2 === 0 ? 1.4 : -1.5}
          back={index % 2 === 0 ? 'var(--kraft)' : 'var(--kraft-dark)'}
        />
        <WashiTape tint={exp.tape} rotate={index % 2 === 0 ? -5 : 4} width={94} style={{ top: -13, left: '50%', marginLeft: -47 }} />

        {isGrouped ? (
          <>
            <h2 className={styles.company}>{exp.company}</h2>
            <div className={styles.roleList}>
              {exp.roles.map((r, i) => (
                <div key={i} className={styles.roleRow}>
                  <div className={styles.roleRowHeader}>
                    <span className={styles.roleTitle}>{r.title}</span>
                    <span className={styles.team}>{r.team}</span>
                    {r.dates && <span className={styles.roleDates}>{r.dates}</span>}
                  </div>
                  <p className={styles.desc}>{r.description}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className={styles.cardHeader}>
              <h2 className={styles.company}>{exp.company}</h2>
              <span className={styles.team}>{exp.team}</span>
            </div>
            <h3 className={styles.role}>{exp.role}</h3>
            <p className={styles.desc}>{exp.description}</p>
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ─── PAGE ──────────────────────────────────────────────────── */
export default function ExperiencesPage() {
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
          Experiences
        </motion.h1>
        <RoughUnderline double color="var(--red-pen)" className={styles.titleUnderline} delay={0.4} />
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          
        </motion.p>
      </div>

      <div className={styles.timeline}>
        <div className={styles.lineColumn}>
          <RoughLine vertical color="var(--ink)" strokeWidth={2.5} />
          {/* sticky, so the little guy climbs down the rope as you scroll */}
          <div className={styles.climberTrack}>
            <StickFigure pose="climb" size={54} strokeWidth={4.5} className={styles.climber} />
          </div>
        </div>

        <div className={styles.items}>
          {experiences.map((exp, i) => (
            <TimelineItem key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
