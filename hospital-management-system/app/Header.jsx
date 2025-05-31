"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import Sidebar from './Sidebar';
import useAuth from './useAuth';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = async () => {
    await logout();
    handleMenuClose();
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
        <Toolbar className={styles.toolbar}>
          <Box
            className={styles.logoContainer}
            onClick={toggleSidebar}
            role="button"
            aria-label="Toggle sidebar"
          >
            <img src="/logo.png" alt="GrimCare Logo" className={styles.logoImage} />
            <Typography className={styles.headerTitle}>GrimCare</Typography>
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
          <Box className={styles.userInfo}>
            {user && (
              <Typography className={styles.userName}>
                {user.name || user.email}
              </Typography>
            )}
            <IconButton onClick={handleMenuOpen} className={styles.menuIcon}>
              {user ? (
                <Avatar className={styles.userAvatar}>
                  {user.name ? user.name[0] : 'U'}
                </Avatar>
              ) : (
                <AccountCircle />
              )}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              classes={{ paper: styles.menu }}
            >
              {navItems.map(({ name, path, onClick }) => (
                <MenuItem
                  key={path}
                  onClick={onClick || handleMenuClose}
                  component={onClick ? 'div' : Link}
                  href={onClick ? undefined : path}
                  className={styles.menuItem}
                >
                  {name}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}