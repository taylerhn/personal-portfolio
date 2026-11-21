'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import StickFigure from '../../../components/StickFigure';
import WashiTape from '../../../components/doodles/WashiTape';
import { RoughBox, RoughUnderline } from '../../../components/doodles/rough';

const SECTIONS = [
  { id: 'overview', label: 'overview' },
  { id: 'technical-features', label: 'technical features' },
  { id: 'takeaways', label: 'takeaways' },
];

const STICKY_COLORS = ['var(--sticky-yellow)', 'var(--sticky-tan)', 'var(--sticky-blue)'];

export default function ProjectDetail({ project }) {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const observers = SECTIONS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-20% 0px -65% 0px' }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);

  return (
    <main className={styles.main}>

      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className={styles.backRow}
      >
        <Link href="/projects" className={styles.backLink}>
          ← back
        </Link>
      </motion.div>

      {/* Hero */}
      <section className={styles.hero}>
        <motion.h1
          className={styles.projectTitle}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 120, damping: 20 }}
        >
          {project.title}
        </motion.h1>
        <RoughUnderline double color="var(--red-pen)" className={styles.titleUnderline} delay={0.4} />

        <motion.p
          className={styles.projectSubtitle}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 22 }}
        >
          <span className="highlight">{project.subtitle || project.description}</span>
        </motion.p>

        <motion.div
          className={styles.heroMeta}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className={styles.stackRow}>
            {project.tech.map((tech) => (
              <span key={tech} className={styles.tag}>{tech}</span>
            ))}
          </div>

          {[
            [project.link, 'View on GitHub'],
            [project.devpost, 'View on Devpost'],
          ].filter(([href]) => href).map(([href, label]) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.projectLink}
            >
              {label} ↗
              <RoughBox color="var(--blue-pen)" strokeWidth={2} inset={2} />

            </a>
          ))}
        </motion.div>
      </section>

      <div className={styles.layout}>

        {/* Margin tabs */}
        <aside className={styles.sideNav}>
          <span className={styles.sideNavLabel}>contents:</span>
          {SECTIONS.map(({ id, label }, i) => {
            const isActive = activeSection === id;
            return (
              <motion.a
                key={id}
                href={`#${id}`}
                className={`${styles.sideNavLink} ${isActive ? styles.sideNavActive : ''}`}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.07 }}
              >
                <span className={styles.sideNavArrow}>{isActive ? '→' : ''}</span>
                {label}
              </motion.a>
            );
          })}

          <StickFigure pose="point" size={80} className={styles.sideNavFigure} />
        </aside>

        <article className={styles.content}>

          {/* Overview */}
          <section id="overview" className={styles.section}>
            <SectionHeading>Overview</SectionHeading>

            {project.overviewTitle && (
              <motion.h3
                className={styles.sectionSubheading}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.07, type: 'spring', stiffness: 120, damping: 20 }}
              >
                {project.overviewTitle}
              </motion.h3>
            )}

            <motion.p
              className={styles.sectionText}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12, type: 'spring', stiffness: 120, damping: 20 }}
            >
              {project.overview || project.description}
            </motion.p>

            {project.presentationId && (
              <figure className={styles.presentation}>
                <iframe
                  className={styles.presentationFrame}
                  src={`https://docs.google.com/presentation/d/${project.presentationId}/embed`}
                  title={`${project.title} presentation`}
                  loading="lazy"
                  allowFullScreen
                />
                <figcaption className={styles.presentationCaption}>
                  <a
                    href={`https://docs.google.com/presentation/d/${project.presentationId}/edit?usp=sharing`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Google Slides ↗
                  </a>
                </figcaption>
              </figure>
            )}

            {!project.presentationId && <div className={styles.imageBox}>
              <WashiTape tint="yellow" rotate={-4} width={100} style={{ top: -14, left: '50%', marginLeft: -50 }} />

              {project.image ? (
                <img src={project.image} alt={project.title} />
              ) : (
                <div className={styles.imageEmpty}>
                  <StickFigure pose="think" size={64} />

                  <span>Photo coming soon</span>
                </div>
              )}
              {project.image && <span className={styles.imageCaption}>{project.title}</span>}
            </div>}
          </section>

          {/* Technical Features */}
          <section id="technical-features" className={styles.section}>
            <SectionHeading>Technical Features</SectionHeading>

            {project.technicalFeatures?.length > 0 ? (
              <div className={styles.featureGrid}>
                {project.technicalFeatures.map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    className={styles.featureCard}
                    style={{
                      background: STICKY_COLORS[i % STICKY_COLORS.length],
                      rotate: i % 2 === 0 ? 'var(--tilt-3)' : 'var(--tilt-2)',
                    }}
                    initial={{ opacity: 0, scale: 0.88 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: i * 0.09, type: 'spring', stiffness: 180, damping: 18 }}
                    whileHover={{ rotate: 0, scale: 1.02 }}
                  >
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDesc}>{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={styles.placeholderBox}>
                <span>notes coming soon</span>
              </div>
            )}
          </section>

          {/* Takeaways */}
          <section id="takeaways" className={styles.section}>
            <SectionHeading>Takeaways</SectionHeading>

            <motion.p
              className={styles.sectionText}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.07, type: 'spring', stiffness: 120, damping: 20 }}
            >
              {project.takeaways || 'Takeaways coming soon.'}
            </motion.p>
          </section>

        </article>
      </div>
    </main>
  );
}

function SectionHeading({ children }) {
  return (
    <motion.div
      className={styles.sectionHeadingWrap}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <h2 className={styles.sectionHeading}>{children}</h2>
      <RoughUnderline color="var(--red-pen)" strokeWidth={2.2} />
    </motion.div>
  );
}
