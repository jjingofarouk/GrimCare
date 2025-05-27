import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Navbar.module.css';

const navItems = [
  { name: 'Dashboard', path: '/', icon: 'home' },
  { name: 'Patients', path: '/patient', icon: 'user' },
  { name: 'Appointments', path: '/appointment', icon: 'calendar' },
  { name: 'Accounting', path: '/accounting', icon: 'calculator' },
  { name: 'Settings', path: '/settings', icon: 'cog' },
];

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.path} className={styles.navItem}>
            <Link
              href={item.path}
              className={`${styles.navLink} ${
                router.pathname === item.path ? styles.active : ''
              }`}
            >
              <span className={`material-icons ${styles.icon}`}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}