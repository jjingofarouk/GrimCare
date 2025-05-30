'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
  Button,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';
import { ROLE_PERMISSIONS } from './lib/auth';

const AUTH_MENU_ITEMS = [
  { label: 'Dashboard', route: '/dashboard', permission: 'Dashboard' },
  { label: 'Patients', route: '/patient', permission: 'Patients' },
  { label: 'Appointments', route: '/appointment', permission: 'Appointments' },
  { label: 'Clinical', route: '/clinical', permission: 'Clinical' },
  { label: 'System Admin', route: '/system-admin', permission: 'System Admin' },
  { label: 'Nursing', route: '/nursing', permission: 'Nursing' },
  { label: 'Helpdesk', route: '/helpdesk', permission: 'Helpdesk' },
  { label: 'Laboratory', route: '/laboratory', permission: 'Laboratory' },
  { label: 'Settings', route: '/settings', permission: 'Settings' },
];

const GUEST_MENU_ITEMS = [
  { label: 'Home', route: '/' },
  { label: 'About', route: '/about' },
  { label: 'Login', route: '/auth' },
];

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = user
    ? AUTH_MENU_ITEMS.filter((item) =>
        ROLE_PERMISSIONS[user.role]?.includes(item.permission)
      )
    : GUEST_MENU_ITEMS;

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleProfileMenuClose();
    router.push('/auth');
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuItemClick = (route) => {
    router.push(route);
    setMobileMenuOpen(false);
  };

  const mobileMenu = (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      sx={{ '& .MuiDrawer-paper': { width: 250, bgcolor: '#1e3a8a', color: '#fff' } }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Menu
        </Typography>
        <Divider sx={{ bgcolor: '#fff', mb: 2 }} />
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.route}
              onClick={() => handleMenuItemClick(item.route)}
              sx={{
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                cursor: 'pointer',
              }}
            >
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: '#1e3a8a',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open menu"
              edge="start"
              onClick={handleMobileMenuToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <IconButton
            color="inherit"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{ fontWeight: 600, cursor: 'pointer' }}
            onClick={() => router.push(user ? '/dashboard' : '/')}
          >
            HMS
          </Typography>
        </Box>
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.route}
                color="inherit"
                onClick={() => router.push(item.route)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <>
              <Typography
                variant="body2"
                sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}
              >
                {user.name}
              </Typography>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="profile-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                sx={{ mt: 1 }}
              >
                <MenuItem
                  onClick={() => {
                    router.push('/profile');
                    handleProfileMenuClose();
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Tooltip title="Log in to unlock features">
              <IconButton
                size="large"
                edge="end"
                aria-label="log in"
                onClick={() => router.push('/auth')}
                color="inherit"
                sx={{
                  animation: 'pulse 2s infinite',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                <LockIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
      {isMobile && mobileMenu}
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </AppBar>
  );
}