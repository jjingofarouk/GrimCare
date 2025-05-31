"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Bars3Icon as MenuIcon } from '@heroicons/react/24/outline'; // Corrected import
import Sidebar from './Sidebar';
import useAuth from './useAuth';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = async () => {
    await logout();
  };

  const navItems = user
    ? [
        { name: 'Profile', path: '/profile' },
        { name: 'Logout', path: '#', onClick: handleLogout },
      ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Login', path: '/auth' },
        { name: 'Register', path: '/auth' },
      ];

  return (
    <>
      <AppBar position="fixed" className={styles.header}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            className={styles.menuButton}
          >
            <MenuIcon className={styles.menuIcon} />
          </IconButton>
          <div className={styles.headerLogo}>
            <div className={styles.headerLogoContainer}>
              <img src="/logo.png" alt="HMS Logo" className={styles.headerLogoImage} />
            </div>
            <Typography variant="h6" className={styles.headerTitle}>
              GrimCare
            </Typography>
          </div>
          <div className={styles.headerNav}>
            {navItems.map(({ name, path, onClick }) => (
              <Button
                key={path}
                component={onClick ? 'button' : Link}
                href={onClick ? undefined : path}
                onClick={onClick}
                className={`${styles.headerNavLink} ${pathname === path ? styles.active : ''}`}
              >
                {name}
              </Button>
            ))}
          </div>
        </Toolbar>
      </AppBar>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}