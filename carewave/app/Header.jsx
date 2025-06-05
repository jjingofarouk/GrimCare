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
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Bars3Icon,
  BellIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
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
  GUEST: '#374151'
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
  const theme = useTheme();
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
      icon: UserIcon,
      description: 'View and edit your profile'
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: CogIcon,
      description: 'Application preferences'
    },
    { 
      name: 'Logout', 
      path: '#', 
      onClick: handleLogout, 
      icon: ArrowRightOnRectangleIcon,
      description: 'Sign out of your account',
      danger: true
    },
  ] : [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Login', path: '/auth/login', icon: UserIcon },
    { name: 'Register', path: '/auth/register', icon: UserIcon },
  ];

  // Mock notifications - in real app, these would come from your notification system
  const notifications = [
    { id: 1, title: 'New appointment scheduled', time: '5 min ago', unread: true },
    { id: 2, title: 'Lab results available', time: '1 hour ago', unread: true },
    { id: 3, title: 'System maintenance tonight', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const headerStyles = {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    color: '#1e293b',
    '& .MuiToolbar-root': {
      minHeight: '72px',
      padding: '0 24px',
    }
  };

  const logoContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    padding: '8px 16px',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
      transform: 'scale(1.02)',
    }
  };

  const logoImageStyles = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  };

  const headerTitleStyles = {
    fontWeight: 700,
    fontSize: '1.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: { xs: 'none', sm: 'block' }
  };

  const navButtonStyles = {
    borderRadius: '10px',
    padding: '8px 16px',
    fontWeight: 500,
    textTransform: 'none',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
      transform: 'translateY(-1px)',
    },
    '&.active': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      color: theme.palette.primary.main,
    }
  };

  const userInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  };

  const userNameStyles = {
    fontWeight: 600,
    color: '#1e293b',
    display: { xs: 'none', md: 'block' }
  };

  const menuStyles = {
    '& .MuiPaper-root': {
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      border: '1px solid #e2e8f0',
      minWidth: '280px',
      marginTop: '8px',
    }
  };

  const menuItemStyles = {
    padding: '12px 20px',
    borderRadius: '8px',
    margin: '4px 8px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
    '&.danger:hover': {
      backgroundColor: alpha('#ef4444', 0.08),
      color: '#ef4444',
    }
  };

  const avatarStyles = {
    width: 36,
    height: 36,
    fontSize: '1rem',
    fontWeight: 600,
    backgroundColor: user ? roleColors[user.role] || '#64748b' : '#64748b',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    }
  };

  const notificationStyles = {
    color: '#64748b',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: theme.palette.primary.main,
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={headerStyles} elevation={0}>
        <Toolbar>
          {/* Logo and Menu Toggle */}
          <Box sx={logoContainerStyles} onClick={toggleSidebar}>
            <IconButton 
              sx={{ 
                p: 0.5, 
                color: '#64748b',
                '&:hover': { backgroundColor: 'transparent' }
              }}
            >
              <Bars3Icon style={{ width: '20px', height: '20px' }} />
            </IconButton>
            <img src="/logo.png" alt="CareWave Logo" style={logoImageStyles} />
            <Typography sx={headerTitleStyles}>
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
                  sx={{
                    ...navButtonStyles,
                    ...(pathname === path && { 
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                      color: theme.palette.primary.main 
                    })
                  }}
                >
                  {name}
                </Button>
              ))}
            </Box>
          )}

          {/* User Info Section */}
          <Box sx={userInfoStyles}>
            {/* User Name and Role */}
            {user && (
              <Box sx={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                <Typography sx={userNameStyles}>
                  {user.name || user.email}
                </Typography>
                <Chip
                  label={roleDisplayNames[user.role] || 'User'}
                  size="small"
                  sx={{
                    backgroundColor: alpha(roleColors[user.role] || '#64748b', 0.1),
                    color: roleColors[user.role] || '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    height: '20px',
                  }}
                />
              </Box>
            )}

            {/* Notifications */}
            {user && (
              <IconButton 
                onClick={handleNotificationOpen}
                sx={notificationStyles}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <BellIcon style={{ width: '20px', height: '20px' }} />
                </Badge>
              </IconButton>
            )}

            {/* User Avatar/Menu */}
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              {user ? (
                <Avatar sx={avatarStyles}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              ) : (
                <AccountCircle sx={{ fontSize: 36, color: '#64748b' }} />
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
        sx={menuStyles}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {user && (
          <Box sx={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
              {user.name || user.email}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
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
            sx={{
              ...menuItemStyles,
              ...(danger && { '&:hover': { backgroundColor: alpha('#ef4444', 0.08), color: '#ef4444' } })
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              {Icon && <Icon style={{ width: '18px', height: '18px' }} />}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {name}
                </Typography>
                {description && (
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
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
          sx={menuStyles}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
          </Box>
          
          {notifications.map((notification, index) => (
            <MenuItem
              key={notification.id}
              sx={{
                ...menuItemStyles,
                backgroundColor: notification.unread ? alpha(theme.palette.primary.main, 0.02) : 'transparent',
                borderLeft: notification.unread ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: notification.unread ? 600 : 400 }}>
                  {notification.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
          
          <Divider sx={{ margin: '8px 0' }} />
          <MenuItem sx={menuItemStyles}>
            <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 500 }}>
              View all notifications
            </Typography>
          </MenuItem>
        </Menu>
      )}

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
}