"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem, 
  IconButton,
  Chip,
  Badge,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Bell,
  User,
  Settings,
  LogOut,
  Home,
  UserCircle
} from 'lucide-react';
import Sidebar from './Sidebar';
import useAuth from './useAuth';
import './hospital-header-styles.css';

const roleColors = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  LAB_TECHNICIAN: 'lab',
  STAFF: 'staff',
  ADMIN: 'admin',
  GUEST: 'guest'
};

const roleDisplayNames = {
  PATIENT: 'Patient',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  LAB_TECHNICIAN: 'Lab Tech',
  STAFF: 'Staff',
  ADMIN: 'Administrator',
  GUEST: 'Guest'
};

export default function Header() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const { user, logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotificationOpen = (event) => setNotificationAnchor(event.currentTarget);
  const handleNotificationClose = () => setNotificationAnchor(null);
  
  const handleLogout = async () => {
    await logout();
    handleMenuClose();
  };

  const userMenuItems = user ? [
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: User,
      description: 'View and edit your profile'
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: Settings,
      description: 'Application preferences'
    },
    { 
      name: 'Logout', 
      path: '#', 
      onClick: handleLogout, 
      icon: LogOut,
      description: 'Sign out of your account',
      danger: true
    },
  ] : [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Login', path: '/auth/login', icon: User },
    { name: 'Register', path: '/auth/register', icon: User },
  ];

  // Mock notifications
  const notifications = [
    { id: 1, title: 'New appointment scheduled', time: '5 min ago', unread: true },
    { id: 2, title: 'Lab results available', time: '1 hour ago', unread: true },
    { id: 3, title: 'System maintenance tonight', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <AppBar position="fixed" className="hospital-header" elevation={0}>
        <Toolbar>
          {/* Logo and Menu Toggle */}
          <Box className="hospital-logo-container" onClick={toggleSidebar}>
            <IconButton className="hospital-menu-toggle">
              <MenuIcon size={20} />
            </IconButton>
            <img src="/logo.png" alt="CareWave Logo" className="hospital-logo-image" />
            <Typography className="hospital-title hospital-title-mobile">
              CareWave
            </Typography>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation Items (for non-authenticated users) */}
          {!user && (
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              {userMenuItems.slice(0, -1).map(({ name, path }) => (
                <Button
                  key={path}
                  component={Link}
                  href={path}
                  className={`hospital-nav-button ${pathname === path ? 'active' : ''}`}
                >
                  {name}
                </Button>
              ))}
            </Box>
          )}

          {/* User Info Section */}
          <Box className="hospital-user-info">
            {/* User Name and Role */}
            {user && (
              <Box sx={{ textAlign: 'right' }} className="hospital-user-name-mobile">
                <Typography className="hospital-user-name">
                  {user.name || user.email}
                </Typography>
                <Chip
                  label={roleDisplayNames[user.role] || 'User'}
                  size="small"
                  className={`hospital-role-chip hospital-role-${roleColors[user.role] || 'guest'}`}
                />
              </Box>
            )}

            {/* Notifications */}
            {user && (
              <IconButton 
                onClick={handleNotificationOpen}
                className="hospital-notification-btn"
              >
                <Badge badgeContent={unreadCount} color="error">
                  <Bell size={20} />
                </Badge>
              </IconButton>
            )}

            {/* User Avatar/Menu */}
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              {user ? (
                <Avatar className={`hospital-avatar hospital-avatar-${roleColors[user.role] || 'guest'}`}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              ) : (
                <UserCircle size={34} color="white" />
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className="hospital-menu"
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {user && (
          <Box className="hospital-menu-header">
            <Typography className="hospital-user-title">
              {user.name || user.email}
            </Typography>
            <Typography className="hospital-user-subtitle">
              {roleDisplayNames[user.role]} Account
            </Typography>
          </Box>
        )}
        
        {userMenuItems.map(({ name, path, onClick, icon: Icon, description, danger }) => (
          <MenuItem
            key={path}
            onClick={onClick || handleMenuClose}
            component={onClick ? 'div' : Link}
            href={onClick ? undefined : path}
            className={`hospital-menu-item ${danger ? 'danger' : ''}`}
          >
            <Box className="hospital-menu-item-content">
              {Icon && <Icon size={18} />}
              <Box className="hospital-menu-item-text">
                <Typography className="hospital-menu-item-title">
                  {name}
                </Typography>
                {description && (
                  <Typography className="hospital-menu-item-desc">
                    {description}
                  </Typography>
                )}
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* Notifications Menu */}
      {user && (
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          className="hospital-menu"
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box className="hospital-menu-header">
            <Typography className="hospital-user-title">
              Notifications
            </Typography>
          </Box>
          
          {notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              className={`hospital-notification-item ${notification.unread ? 'unread' : ''}`}
            >
              <Box>
                <Typography className={`hospital-notification-title ${notification.unread ? 'unread' : ''}`}>
                  {notification.title}
                </Typography>
                <Typography className="hospital-notification-time">
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
          
          <Divider className="hospital-divider" />
          <MenuItem className="hospital-notification-footer">
            <Typography className="hospital-notification-footer-text">
              View all notifications
            </Typography>
          </MenuItem>
        </Menu>
      )}

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}