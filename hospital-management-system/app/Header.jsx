"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
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
          <Box
            className={styles.headerLogo}
            onClick={toggleSidebar}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            role="button"
            aria-label="Toggle sidebar"
          >
            <Box className={styles.headerLogoContainer}>
              <img src="/logo.png" alt="HMS Logo" className={styles.headerLogoImage} />
            </Box>
            <Typography variant="h6" className={styles.headerTitle}>
              GrimCare
            </Typography>
          </Box>
          <Box className={styles.headerNav}>
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
          </Box>
          {user && (
            <Box className={styles.userInfo}>
              <Avatar>{user.name ? user.name[0] : 'U'}</Avatar>
              <Typography variant="body2" sx={{ ml: 1, color: 'white' }}>
                {user.name || user.email}
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}