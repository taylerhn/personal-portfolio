'use client';

import Link from 'next/link';
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
    description: "I work on software for the indexed fixed-income portfolio management team.",
    tape: 'yellow',
  },
  {
    id: 2,
    company: 'Berkeleytime',
    role: 'Lead Software Engineer',
    team: 'Infrastructure',
    dates: 'Aug 2026 – Present',
    description: "I lead the infrastructure pod that keeps Berkeleytime running for 50,000+ monthly active users.",
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
        description: "I’m building tools to help pinpoint where developers get stuck when working with AlloyDB.",
      },
      {
        title: 'PostgreSQL Traffic Replay',
        team: 'AlloyDB',
        description: "I helped build PGRR so engineers can record PostgreSQL traffic and replay the same workload when comparing benchmark runs.",
        project: { slug: 'pgrr', title: 'PGRR' },
      },
    ],
  },
  {
    id: 4,
    company: 'Lotus Bloom × Codebase',
    role: 'Software Engineer',
    team: 'Dashboard',
    dates: 'Sep 2025 – Present',
    description: "I’m working on a forum and dashboard for Lotus Bloom, a nonprofit family resource center.",
    project: { slug: 'lotus-bloom', title: 'Lotus Bloom' },
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
        description: "I meet with engineering students, talk through their questions, and help them find the right campus resources.",
      },
      {
        title: 'PREP Ambassador',
        team: 'College of Engineering',
        description: "I help put together the PREP newsletter, film student interviews, and plan workshops and activities.",
      },
      {
        title: 'ITCS Student Technician',
        team: 'IT Client Services',
        description: "I help students, staff, and faculty troubleshoot campus technology.",
      },
    ],
  },
];

/* ─── TIMELINE ITEM ─────────────────────────────────────────── */
function TimelineItem({ exp, index }) {
  const roles = exp.roles ?? [{ ...exp, title: exp.role }];

  return (
    <motion.article
      className={styles.item}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.25 }}
    >
      <div className={styles.dotWrap} aria-hidden="true">
        <RoughDot size={22} color="var(--ink)" fillColor="var(--red-pen)" seed={index * 17 + 3} />
      </div>

      <div className={styles.card}>
        <TornLayers backRotate={1} />
        <WashiTape tint={exp.tape} rotate={-3} width={94} style={{ top: -13, left: '50%', marginLeft: -47 }} />

        <div className={styles.titleRow}>
          <h2 className={styles.company}>{exp.company}</h2>
          {exp.dates && <span className={styles.dates}>{exp.dates}</span>}
        </div>

        <div className={styles.roleList}>
          {roles.map((role) => (
            <div key={role.title} className={styles.roleRow}>
              <div className={styles.titleRow}>
                <h3 className={styles.roleTitle}>{role.title}</h3>
                {exp.roles && role.dates && <span className={styles.dates}>{role.dates}</span>}
              </div>
              <p className={styles.roleMeta}>{role.team}</p>
              <p className={styles.desc}>{role.description}</p>
              {role.project && (
                <Link href={`/projects/${role.project.slug}`} className={styles.projectLink}>
                  View {role.project.title} project →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

/* ─── PAGE ──────────────────────────────────────────────────── */
export default function ExperiencesPage() {
  return (
    <main className={styles.main}>
      <div className={styles.headerRow}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 120, damping: 20 }}
        >
          Experiences
        </motion.h1>
        <RoughUnderline double color="var(--red-pen)" className={styles.titleUnderline} delay={0.4} />
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
