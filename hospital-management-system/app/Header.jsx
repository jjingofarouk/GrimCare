import { useState } from 'react';
import { UserCircleIcon, BellIcon, MenuIcon } from '@heroicons/react/24/outline';
import styles from './Header.module.css';
import Link from 'next/link';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <MenuIcon className={styles.icon} />
          <h1 className={styles.title}>Hospital Management System</h1>
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
                <Link href="/auth/logout" className={styles.dropdownItem}>Logout</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}