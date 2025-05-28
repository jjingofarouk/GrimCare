'use client';

import React, { useState } from 'react';
import { UserCircleIcon, BellIcon, Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Bars3Icon className={styles.icon} />
          <h1 className={styles.title}>HMS</h1>
        </div>
        <div className={styles.right}>
          <BellIcon className={styles.icon} />
          <div className={styles.profile}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={styles.profileButton}
            >
              <UserCircleIcon className={styles.icon} />
              <span className={styles.userName}>Admin</span>
            </button>
            {isProfileOpen && (
              <div className={styles.dropdown}>
                <Link href="/profile" className={styles.dropdownItem}>Profile</Link>
                <Link href="/settings" className={styles.dropdownItem}>Settings</Link>
                <Link href="/clinical-settings" className={styles.dropdownItem}>Clinical Settings</Link>
                <Link href="/system-admin" className={styles.dropdownItem}>System Admin</Link>
                <Link href="/auth/logout" className={styles.dropdownItem}>Logout</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}