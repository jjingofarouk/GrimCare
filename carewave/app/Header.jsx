"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  Badge,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  Home,
} from 'lucide-react';
import { AccountCircle, Notifications } from '@mui/icons-material';
import Sidebar from './Sidebar';
import useAuth from './useAuth';

const roleColors = {
  PATIENT: '#059669',
  DOCTOR: '#7c3aed',
  NURSE: '#dc2626',
  LAB_TECHNICIAN: '#ea580c',
  STAFF: '#0891b2',
  ADMIN: '#64748b',
  GUEST: '#374151',
};

const roleDisplayNames = {
  PATIENT: 'Patient',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  LAB_TECHNICIAN: 'Lab Tech',
  STAFF: 'Staff',
  ADMIN: 'Administrator',
  GUEST: 'Guest',
};

export default function Header() {
  const pathname = usePathname();
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => setNotificationAnchor(event.currentTarget);
  const handleNotificationClose = () => setNotificationAnchor(null);

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
  };

  const userMenuItems = user
    ? [
        { name: 'Profile', path: '/profile', icon: User, description: 'View and edit your profile' },
        { name: 'Settings', path: '/settings', icon: Settings, description: 'Application preferences' },
        {
          name: 'Logout',
          path: '#',
          onClick: handleLogout,
          icon: LogOut,
          description: 'Sign out of your account',
          danger: true,
        },
      ]
    : [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Login', path: '/auth/login', icon: User },
        { name: 'Register', path: '/auth/register', icon: User },
      ];

  const notifications = [
    { id: 1, title: 'New appointment scheduled', time: '5 min ago', unread: true },
    { id: 2, title: 'Lab results available', time: '1 hour ago', unread: true },
    { id: 3, title: 'System maintenance tonight', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const headerStyles = {
    display: { xs: 'block', md: 'none' },
    backgroundColor: '#1e3a8a',
    color: '#f1f5f9',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '& .MuiToolbar-root': {
      minHeight: '64px',
      padding: '0 16px',
    },
  };

  const logoContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: '#2563eb',
    },
  };

  const logoImageStyles = {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
  };

  const headerTitleStyles = {
    fontWeight: 600,
    fontSize: '1.25rem',
    color: '#f1f5f9',
  };

  const userInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const userNameStyles = {
    fontWeight: 600,
    color: '#f1f5f9',
    display: { xs: 'none', sm: 'block' },
  };

  const avatarStyles = {
    width: 32,
    height: 32,
    fontSize: '0.875rem',
    fontWeight: 600,
    backgroundColor: user ? roleColors[user.role] || '#64748b' : '#64748b',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  };

  const notificationStyles = {
    color: '#cbd5e1',
    '&:hover': {
      color: '#ffffff',
    },
  };

  const menuStyles = {
    '& .MuiPaper-root': {
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
      backgroundColor: '#1e3a8a',
      color: '#f1f5f9',
      minWidth: '240px',
      marginTop: '8px',
    },
  };

  const menuItemStyles = {
    padding: '10px 16px',
    borderRadius: '8px',
    margin: '2px 8px',
    '&:hover': {
      backgroundColor: '#2563eb',
    },
    '&.danger:hover': {
      backgroundColor: '#ef4444',
    },
  };

  return (
    <>
      <AppBar position="fixed" sx={headerStyles} elevation={0}>
        <Toolbar>
          <Box sx={logoContainerStyles} onClick={toggleSidebar}>
            <IconButton sx={{ p: 0, color: '#f1f5f9', '&:hover': { backgroundColor: 'transparent' } }}>
              <Menu size={20} />
            </IconButton>
            <img src="/logo.png" alt="CareWave Logo" style={logoImageStyles} />
            <Typography sx={headerTitleStyles}>CareWave</Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={userInfoStyles}>
            {user && (
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={userNameStyles}>{user.name || user.email}</Typography>
                <Chip
                  label={roleDisplayNames[user.role] || 'User'}
                  size="small"
                  sx={{
                    backgroundColor: '#2563eb',
                    color: '#f1f5f9',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    height: '20px',
                  }}
                />
              </Box>
            )}

            {user && (
              <IconButton onClick={handleNotificationOpen} sx={notificationStyles}>
                <Badge badgeContent={unreadCount} color="error">
                  <Bell size={20} />
                </Badge>
              </IconButton>
            )}

            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              {user ? (
                <Avatar sx={avatarStyles}>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</Avatar>
              ) : (
                <AccountCircle sx={{ fontSize: 32, color: '#cbd5e1' }} />
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={menuStyles}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {user && (
          <Box sx={{ padding: '12px 16px', borderBottom: '1px solid #334155' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#f1f5f9' }}>
              {user.name || user.email}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
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
            sx={{ ...menuItemStyles, ...(danger && { '&:hover': { backgroundColor: '#ef4444' } }) }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              {Icon && <Icon size={18} />}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: '#f1f5f9' }}>
                  {name}
                </Typography>
                {description && (
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                    {description}
                  </Typography>
                )}
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {user && (
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          sx={menuStyles}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ padding: '12px 16px', borderBottom: '1px solid #334155' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#f1f5f9' }}>
              Notifications
            </Typography>
          </Box>

          {notifications.map((notification, index) => (
            <MenuItem
              key={notification.id}
              sx={{
                ...menuItemStyles,
                backgroundColor: notification.unread ? '#2563eb' : 'transparent',
                borderLeft: notification.unread ? '3px solid #ffffff' : '3px solid transparent',
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: notification.unread ? 600 : 400, color: '#f1f5f9' }}>
                  {notification.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}

          <Divider sx={{ margin: '4px 0', backgroundColor: '#334155' }} />
          <MenuItem sx={menuItemStyles}>
            <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500 }}>
              View all notifications
            </Typography>
          </MenuItem>
        </Menu>
      )}

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}