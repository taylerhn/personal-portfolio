'use client';

import styles from './header.module.css';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { RoughUnderline } from './doodles/rough';

const navLinks = [
  { href: '/', label: 'home' },
  { href: '/projects', label: 'projects' },
  { href: '/experiences', label: 'experiences' },
  { href: '/photos', label: 'photos' },
  { href: '/coursework', label: 'coursework' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <motion.header
      className={styles.header}
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.1 }}
    >
      <span className={styles.paperStack} aria-hidden>
        <span className={styles.kraftStrip} />
        <span className={styles.paperStrip} />
      </span>

      <Link href="/" className={styles.wordmark}>
        Tayler
        <span className={styles.wordmarkDot}>✎</span>
      </Link>

      <nav className={styles.nav}>
        {navLinks.map(({ href, label }) => {
          const isCurrentPage = pathname === href;
          const isActive = isCurrentPage || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              aria-current={isCurrentPage ? 'page' : undefined}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              {label}
              <RoughUnderline
                className={styles.hoverUnderline}
                color="var(--red-pen)"
                strokeWidth={2}
                drawIn={false}
              />
            </Link>
          );
        })}
      </nav>
    </motion.header>
  );
}
