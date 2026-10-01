'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { motion } from 'framer-motion';
import { projects } from './data';
import StickFigure from '../../components/StickFigure';
import WashiTape from '../../components/doodles/WashiTape';
import { RoughBox, RoughUnderline } from '../../components/doodles/rough';

// A different little guy presents each card so the page feels populated
const cardPoses = ['point', 'present', 'wave', 'think'];
const tapeTints = ['yellow', 'blue', 'red', 'plain'];

export default function ProjectsPage() {
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
          Projects
        </motion.h1>
        <RoughUnderline double color="var(--red-pen)" className={styles.titleUnderline} delay={0.4} />

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          things I&apos;ve built
        </motion.p>
      </div>

      <div className={styles.grid}>
        {projects.map((project, index) => (
          <Link key={project.slug} href={`/projects/${project.slug}`} className={styles.cardLink}>
            <motion.article
              className={styles.card}
              style={{ rotate: index % 2 === 0 ? 'var(--tilt-3)' : 'var(--tilt-2)' }}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: (index % 3) * 0.09, type: 'spring', stiffness: 120, damping: 20 }}
              whileHover={{ y: -7, rotate: 0 }}
            >
              <span className={styles.cardBacking} aria-hidden />
              <div className={styles.cardPaper}>
                <RoughBox color="var(--ink)" strokeWidth={1.8} inset={13} drawIn delay={(index % 3) * 0.12} />
                <span className={styles.marginLine} aria-hidden />

                <StickFigure
                  pose={cardPoses[index % cardPoses.length]}
                  size={46}
                  strokeWidth={5}
                  className={styles.cardFigure}
                />

                {/* polaroid preview — drops in automatically once project.image is set */}
                <div
                  className={styles.cardPolaroid}
                  style={{ transform: `rotate(${index % 2 === 0 ? -2 : 1.6}deg)` }}
                >
                  <WashiTape
                    tint={tapeTints[index % tapeTints.length]}
                    rotate={index % 2 === 0 ? -5 : 4}
                    width={72}
                    style={{ top: -11, left: '50%', marginLeft: -36 }}
                  />
                  <div className={styles.cardPolaroidPhoto}>
                    {project.image ? (
                      <Image src={project.image} alt={project.title} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div className={styles.cardPolaroidEmpty}>
                        <span>screenshot soon</span>
                      </div>
                    )}
                  </div>
                </div>

                <h2 className={styles.cardTitle}>{project.title}</h2>
                <p className={styles.cardDesc}>{project.description}</p>

                <div className={styles.stackRow}>
                  {project.tech.map((tech) => (
                    <span key={tech} className={styles.tag}>{tech}</span>
                  ))}
                </div>

                <span className={styles.readMore}>read the full page →</span>
              </div>
            </motion.article>
          </Link>
        ))}
      </div>
    </main>
  );
}
