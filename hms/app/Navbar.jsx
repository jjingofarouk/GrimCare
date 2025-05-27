'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const navItems = [
  { name: 'Dashboard', path: '/', icon: 'home' },
  { name: 'Patients', path: '/patient', icon: 'person' },
  { name: 'Appointments', path: '/appointment', icon: 'calendar_month' },
  { name: 'Accounting', path: '/accounting', icon: 'calculate' },
  { name: 'Settings', path: '/settings', icon: 'settings' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.path} className={styles.navItem}>
            <Link href={item.path}>
              <a
                className={`${styles.navLink} ${
                  pathname === item.path ? styles.active : ''
                }`}
              >
                <span className={`material-icons ${styles.icon}`}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}