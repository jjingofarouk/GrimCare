"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HomeIcon, UserIcon, CalendarIcon, CalculatorIcon, CogIcon } from '@heroicons/react/24/outline';
import styles from './Sidebar.module.css';

const navItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Patients', path: '/patient', icon: UserIcon },
  { name: 'Appointments', path: '/appointment', icon: CalendarIcon },
  { name: 'Accounting', path: '/accounting', icon: CalculatorIcon },
  { name: 'Settings', path: '/settings', icon: CogIcon },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="HMS Logo" className={styles.logoImage} />
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`${styles.navLink} ${
                  router.pathname === item.path ? styles.active : ''
                }`}
              >
                <item.icon className={styles.icon} />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}