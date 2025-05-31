// app/components/Header.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import styles from './Header.module.css';

const navItems = [
  { name: 'Profile', path: '/profile' },
  { name: 'Logout', path: '/auth/logout' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <AppBar position="fixed" className={styles.header}>
      <Toolbar>
        <div className={styles.headerLogo}>
          <img src="/logo.png" alt="HMS Logo" className={styles.headerLogoImage} />
          <Typography variant="h6" className={styles.headerTitle}>
            GrimCare
          </Typography>
        </div>
        <div className={styles.headerNav}>
          {navItems.map(({ name, path }) => (
            <Button
              key={path}
              component={Link}
              href={path}
              className={`${styles.headerNavLink} ${pathname === path ? styles.active : ''}`}
            >
              {name}
            </Button>
          ))}
        </div>
      </Toolbar>
    </AppBar>
  );
}