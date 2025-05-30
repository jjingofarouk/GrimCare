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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';
import { ROLE_PERMISSIONS } from './lib/auth';

// Define menu items with corresponding routes and required permissions
const MENU_ITEMS = [
  { label: 'Dashboard', route: '/dashboard', permission: 'Dashboard' },
  { label: 'Patients', route: '/patient', permission: 'Patients' },
  { label: 'Appointments', route: '/appointment', permission: 'Appointments' },
  { label: 'Clinical', route: '/clinical', permission: 'Clinical' },
  { label: 'System Admin', route: '/system-admin', permission: 'System Admin' },
  { label: 'Nursing', route: '/nursing', permission: 'Nursing' },
  { label: 'Helpdesk', route: '/helpdesk', permission: 'Helpdesk' },
  { label: 'Laboratory', route: '/laboratory', permission: 'Laboratory' },
  { label: 'Settings', route: '/settings', permission: 'Settings' },
  // Add more items as needed, matching ROLE_PERMISSIONS keys
];

export default function Header({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Mobile: < 900px
  const [anchorEl, setAnchorEl] = useState(null); // For user profile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // For mobile drawer

  // Filter menu items based on user's role permissions
  const allowedMenuItems = user
    ? MENU_ITEMS.filter((item) =>
        ROLE_PERMISSIONS[user.role]?.includes(item.permission)
      )
    : [];

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
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

  // Render mobile menu as a drawer
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
          {allowedMenuItems.map((item) => (
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
        {/* Left Side: Hamburger (mobile) and Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
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
            sx={{ mr: 2, display: { xs: 'block', md: 'block' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            sx={{ fontWeight: 600, cursor: 'pointer' }}
            onClick={() => router.push(user ? getRoleRedirect(user.role) : '/auth')}
          >
            HMS
          </Typography>
        </Box>

        {/* Center: Navigation Links (Desktop) */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {allowedMenuItems.map((item) => (
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

        {/* Right Side: User Profile */}
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
          </Box>
        )}
      </Toolbar>
      {isMobile && mobileMenu}
    </AppBar>
  );
}