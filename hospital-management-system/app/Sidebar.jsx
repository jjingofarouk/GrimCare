'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserIcon,
  CalendarIcon,
  CalculatorIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import styles from './Sidebar.module.css';

const navItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Patients', path: '/patient', icon: UserIcon },
  { name: 'Appointments', path: '/appointment', icon: CalendarIcon },
  { name: 'Accounting', path: '/accounting', icon: CalculatorIcon },
  { name: 'Settings', path: '/settings', icon: CogIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="HMS Logo" className={styles.logoImage} />
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map(({ name, path, icon: Icon }) => (
            <li key={path}>
              <Link
                href={path}
                className={`${styles.navLink} ${pathname === path ? styles.active : ''}`}
              >
                <Icon className={styles.icon} />
                <span>{name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}