"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  User,
  Calendar,
  Calculator,
  Settings,
  TestTube2,
  Briefcase,
  ClipboardList,
  FileText,
  Heart,
  UserCircle,
  Inbox,
  Key,
  ShieldCheck,
  ShoppingCart,
  LayoutGrid,
  Table,
  Users,
  Wrench,
  XCircle,
} from 'lucide-react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import useAuth from './useAuth';
import styles from './Sidebar.module.css';

const roleBasedNavItems = {
  PATIENT: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Appointments', path: '/appointment', icon: Calendar, category: 'health' },
    { name: 'Medical Records', path: '/medical-records', icon: FileText, category: 'health' },
    { name: 'Billing', path: '/billing', icon: Table, category: 'finance' },
  ],
  DOCTOR: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Patients', path: '/patient', icon: User, category: 'patient-care' },
    { name: 'Appointments', path: '/appointment', icon: Calendar, category: 'patient-care' },
    { name: 'Clinical', path: '/clinical', icon: TestTube2, category: 'clinical' },
    { name: 'Operation Theatre', path: '/operation-theatre', icon: TestTube2, category: 'clinical' },
  ],
  NURSE: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Patients', path: '/patient', icon: User, category: 'patient-care' },
    { name: 'Appointments', path: '/appointment', icon: Calendar, category: 'patient-care' },
    { name: 'Nursing', path: '/nursing', icon: Heart, category: 'nursing' },
    { name: 'Maternity', path: '/maternity', icon: Heart, category: 'nursing' },
  ],
  LAB_TECHNICIAN: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Laboratory', path: '/laboratory', icon: TestTube2, category: 'lab' },
    { name: 'Radiology', path: '/radiology', icon: TestTube2, category: 'lab' },
  ],
  STAFF: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Helpdesk', path: '/helpdesk', icon: Users, category: 'support' },
    { name: 'Inventory', path: '/inventory', icon: LayoutGrid, category: 'operations' },
    { name: 'Procurement', path: '/procurement', icon: ShoppingCart, category: 'operations' },
  ],
  ADMIN: [
    { name: 'Dashboard', path: '/', icon: Home, category: 'main' },
    { name: 'Patients', path: '/patient', icon: User, category: 'patient-care' },
    { name: 'Doctor', path: '/doctor', icon: UserCircle, category: 'patient-care' },
    { name: 'Appointments', path: '/appointment', icon: Calendar, category: 'patient-care' },
    { name: 'ADT', path: '/adt', icon: ClipboardList, category: 'patient-care' },
    { name: 'Emergency', path: '/emergency', icon: XCircle, category: 'patient-care' },
    { name: 'Queue Management', path: '/queue-mgmt', icon: Users, category: 'patient-care' },
    { name: 'Clinical', path: '/clinical', icon: TestTube2, category: 'clinical' },
    { name: 'Laboratory', path: '/laboratory', icon: TestTube2, category: 'clinical' },
    { name: 'Radiology', path: '/radiology', icon: TestTube2, category: 'clinical' },
    { name: 'Operation Theatre', path: '/operation-theatre', icon: TestTube2, category: 'clinical' },
    { name: 'Clinical Settings', path: '/clinical-settings', icon: Wrench, category: 'clinical' },
    { name: 'CSSD', path: '/cssd', icon: ShieldCheck, category: 'clinical' },
    { name: 'Nursing', path: '/nursing', icon: Heart, category: 'nursing' },
    { name: 'Maternity', path: '/maternity', icon: Heart, category: 'nursing' },
    { name: 'Vaccination', path: '/vaccination', icon: Heart, category: 'nursing' },
    { name: 'Pharmacy', path: '/pharmacy', icon: Inbox, category: 'pharmacy' },
    { name: 'Dispensary', path: '/dispensary', icon: Inbox, category: 'pharmacy' },
    { name: 'Billing', path: '/billing', icon: Table, category: 'finance' },
    { name: 'Accounting', path: '/accounting', icon: Calculator, category: 'finance' },
    { name: 'Claim Management', path: '/claim-mgmt', icon: FileText, category: 'finance' },
    { name: 'NHIF', path: '/nhif', icon: ShieldCheck, category: 'finance' },
    { name: 'Incentive', path: '/incentive', icon: Key, category: 'finance' },
    { name: 'Inventory', path: '/inventory', icon: LayoutGrid, category: 'operations' },
    { name: 'Inventory', path: '/inventory', icon: LayoutGrid, category: 'operations' },
    { name: 'Procurement', path: '/procurement', icon: ShoppingCart, category: 'operations' },
    { name: 'Substore', path: '/substore', icon: LayoutGrid, category: 'operations' },
    { name: 'Fixed Assets', path: '/fixed-assets', icon: Briefcase, category: 'operations' },
    { name: 'Reports', path: '/reports', icon: Table, category: 'reports' },
    { name: 'Dynamic Report', path: '/dynamic-report', icon: Table, category: 'reports' },
    { name: 'Medical Records', path: '/medical-records', icon: FileText, category: 'reports' },
    { name: 'Helpdesk', path: '/helpdesk', icon: Users, category: 'support' },
    { name: 'Marketing Referral', path: '/mkt-referral', icon: Users, category: 'support' },
    { name: 'Social Service', path: '/social-service', icon: Users, category: 'support' },
    { name: 'Settings', path: '/settings', icon: Settings, category: 'admin' },
    { name: 'System Admin', path: '/system-admin', icon: Wrench, category: 'admin' },
    { name: 'Utilities', path: '/utilities', icon: Wrench, category: 'admin' },
    { name: 'Verification', path: '/verification', icon: ShieldCheck, category: 'admin' },
  ],
  GUEST: [
    { name: 'Home', path: '/', icon: Home, category: 'main' },
    { name: 'Login', path: '/auth/login', icon: Key, category: 'auth' },
    { name: 'Register', path: '/auth/register', icon: User, category: 'auth' },
  ],
};

const categoryLabels = {
  main: 'Overview',
  'patient-care': 'Patient Care',
  clinical: 'Clinical Services',
  nursing: 'Nursing Care',
  lab: 'Laboratory',
  pharmacy: 'Pharmacy',
  finance: 'Finance & Billing',
  operations: 'Operations',
  reports: 'Reports & Analytics',
  support: 'Support Services',
  admin: 'Administration',
  auth: 'Authentication',
  health: 'Health Services',
};

const categoryColors = {
  main: '#2563eb',
  'patient-care': '#059669',
  clinical: '#7c3aed',
  nursing: '#dc2626',
  lab: '#ea580c',
  pharmacy: '#0891b2',
  finance: '#16a34a',
  operations: '#9333ea',
  reports: '#0d9488',
  support: '#4338ca',
  admin: '#64748b',
  auth: '#374151',
  health: '#059669',
};

export default function Sidebar({ toggleSidebar, isOpen }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const theme = useTheme();
  const navItems = user ? roleBasedNavItems[user.role] || roleBasedNavItems.GUEST : roleBasedNavItems.GUEST;

  // Group navigation items by category
  const groupedNavItems = navItems.reduce((acc, item) => {
    const category = item.category || 'main';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <Drawer
      variant="temporary"
      open={isOpen}
      onClose={toggleSidebar}
      PaperProps={{
        className: styles['hospital-sidebar'],
      }}
      ModalProps={{ keepMounted: true }}
    >
      <Box className={styles['hospital-sidebar-header']} onClick={toggleSidebar}>
        <Box className={styles['hospital-sidebar-logo-container']}>
          <img
            src="/logo.png"
            alt="CareWave Logo"
            className={styles['hospital-sidebar-logo']}
          />
          <Typography variant="h6" className={styles['hospital-sidebar-title']}>
            CareWave
          </Typography>
        </Box>
      </Box>

      <Box className={styles['hospital-sidebar-content']}>
        {Object.entries(groupedNavItems).map(([category, items], index) => (
          <Box key={category}>
            {index > 0 && <Divider className={styles['hospital-section-divider']} />}
            <Box className={styles['hospital-category-header']}>
              <Chip
                label={categoryLabels[category] || category}
                size="small"
                className={`${styles['hospital-category-chip']} ${styles[`hospital-category-${category}`]}`}
                sx={{
                  backgroundColor: alpha(categoryColors[category] || '#64748b', 0.1),
                  color: categoryColors[category] || '#64748b',
                }}
              />
            </Box>
            <List className={styles['hospital-nav-list']}>
              {items.map(({ name, path, icon: Icon }) => (
                <ListItem
                  key={path}
                  component={Link}
                  href={path}
                  className={`${styles['hospital-nav-list']} ${pathname === path ? 'active' : ''}`}
                  onClick={toggleSidebar}
                >
                  <ListItemIcon sx={{ minWidth: '36px' }}>
                    <Icon size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={name}
                    primaryTypographyProps={{
                      className: styles['hospital-nav-list'],
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>

      {user && (
        <Box className={styles['hospital-sidebar-footer']}>
          <Typography
            variant="caption"
            className={styles['hospital-footer-caption']}
          >
            Logged in as
          </Typography>
          <Typography
            variant="body2"
            className={styles['hospital-footer-user']}
          >
            {user.role?.replace('_', ' ')} User
          </Typography>
        </Box>
      )}
    </Drawer>
  );
}