// Sidebar.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserIcon,
  CalendarIcon,
  CalculatorIcon,
  CogIcon,
  BeakerIcon,
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  HeartIcon,
  IdentificationIcon,
  InboxIcon,
  KeyIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  Squares2X2Icon,
  TableCellsIcon,
  UsersIcon,
  WrenchIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider, useTheme } from '@mui/material';
import useAuth from './useAuth';

const roleBasedNavItems = {
  PATIENT: [
    { name: 'Dashboard', path: '/', icon: HomeIcon, category: 'main' },
    { name: 'Appointments', path: '/appointment', icon: CalendarIcon, category: 'health' },
    { name: 'Medical Records', path: '/medical-records', icon: DocumentTextIcon, category: 'health' },
    { name: 'Billing', path: '/billing', icon: TableCellsIcon, category: 'finance' },
  ],
  DOCTOR: [
    { name: 'Dashboard', path: '/', icon: HomeIcon, category: 'main' },
    { name: 'Patients', path: '/patient', icon: UserIcon, category: 'patient-care' },
    { name: 'Appointments', path: '/appointment', icon: CalendarIcon, category: 'patient-care' },
    { name: 'Clinical', path: '/clinical', icon: BeakerIcon, category: 'clinical' },
    { name: 'Operation Theatre', path: '/operation-theatre', icon: BeakerIcon, category: 'clinical' },
  ],
  NURSE: [
    { name: 'Dashboard', path: '/', icon: HomeIcon, category: 'main' },
    { name: 'Patients', path: '/patient', icon: UserIcon, category: 'patient-care' },
    { name: 'Appointments', path: '/appointment', icon: CalendarIcon, category: 'patient-care' },
    { name: 'Nursing', path: '/nursing', icon: HeartIcon, category: 'nursing' },
    { name: 'Maternity', path: '/maternity', icon: HeartIcon, category: 'nursing' },
  ],
  LAB_TECHNICIAN: [
    { name: 'Dashboard', path: '/', icon: HomeIcon, category: 'main' },
    { name: 'Laboratory', path: '/laboratory', icon: BeakerIcon, category: 'lab' },
    { name: 'Radiology', path: '/radiology', icon: BeakerIcon, category: 'lab' },
  ],
  STAFF: [
    { name: 'Dashboard', path: '/', icon: HomeIcon, category: 'main' },
    { name: 'Helpdesk', path: '/helpdesk', icon: UsersIcon, category: 'support' },
    { name: 'Inventory', path: '/inventory', icon: Squares2X2Icon, category: 'operations' },
    { name: 'Procurement', path: '/procurement', icon: ShoppingCartIcon, category: 'operations' },
  ],
  ADMIN: [
    { name: 'Dashboard', path: '/', icon: HomeIcon, category: 'main' },
    { name: 'Patients', path: '/patient', icon: UserIcon, category: 'patient-care' },
    { name: 'Doctor', path: '/doctor', icon: IdentificationIcon, category: 'patient-care' },
    { name: 'Appointments', path: '/appointment', icon: CalendarIcon, category: 'patient-care' },
    { name: 'ADT', path: '/adt', icon: ClipboardDocumentListIcon, category: 'patient-care' },
    { name: 'Emergency', path: '/emergency', icon: XCircleIcon, category: 'patient-care' },
    { name: 'Queue Management', path: '/queue-mgmt', icon: UsersIcon, category: 'patient-care' },
    { name: 'Clinical', path: '/clinical', icon: BeakerIcon, category: 'clinical' },
    { name: 'Laboratory', path: '/laboratory', icon: BeakerIcon, category: 'clinical' },
    { name: 'Radiology', path: '/radiology', icon: BeakerIcon, category: 'clinical' },
    { name: 'Operation Theatre', path: '/operation-theatre', icon: BeakerIcon, category: 'clinical' },
    { name: 'Clinical Settings', path: '/clinical-settings', icon: WrenchIcon, category: 'clinical' },
    { name: 'CSSD', path: '/cssd', icon: ShieldCheckIcon, category: 'clinical' },
    { name: 'Nursing', path: '/nursing', icon: HeartIcon, category: 'nursing' },
    { name: 'Maternity', path: '/maternity', icon: HeartIcon, category: 'nursing' },
    { name: 'Vaccination', path: '/vaccination', icon: HeartIcon, category: 'nursing' },
    { name: 'Pharmacy', path: '/pharmacy', icon: InboxIcon, category: 'pharmacy' },
    { name: 'Dispensary', path: '/dispensary', icon: InboxIcon, category: 'pharmacy' },
    { name: 'Billing', path: '/billing', icon: TableCellsIcon, category: 'finance' },
    { name: 'Accounting', path: '/accounting', icon: CalculatorIcon, category: 'finance' },
    { name: 'Claim Management', path: '/claim-mgmt', icon: DocumentTextIcon, category: 'finance' },
    { name: 'NHIF', path: '/nhif', icon: ShieldCheckIcon, category: 'finance' },
    { name: 'Incentive', path: '/incentive', icon: KeyIcon, category: 'finance' },
    { name: 'Inventory', path: '/inventory', icon: Squares2X2Icon, category: 'operations' },
    { name: 'Procurement', path: '/procurement', icon: ShoppingCartIcon, category: 'operations' },
    { name: 'Substore', path: '/substore', icon: Squares2X2Icon, category: 'operations' },
    { name: 'Fixed Assets', path: '/fixed-assets', icon: BriefcaseIcon, category: 'operations' },
    { name: 'Reports', path: '/reports', icon: TableCellsIcon, category: 'reports' },
    { name: 'Dynamic Report', path: '/dynamic-report', icon: TableCellsIcon, category: 'reports' },
    { name: 'Medical Records', path: '/medical-records', icon: DocumentTextIcon, category: 'reports' },
    { name: 'Helpdesk', path: '/helpdesk', icon: UsersIcon, category: 'support' },
    { name: 'Marketing Referral', path: '/mkt-referral', icon: UsersIcon, category: 'support' },
    { name: 'Social Service', path: '/social-service', icon: UsersIcon, category: 'support' },
    { name: 'Settings', path: '/settings', icon: CogIcon, category: 'admin' },
    { name: 'System Admin', path: '/system-admin', icon: WrenchIcon, category: 'admin' },
    { name: 'Utilities', path: '/utilities', icon: WrenchIcon, category: 'admin' },
    { name: 'Verification', path: '/verification', icon: ShieldCheckIcon, category: 'admin' },
  ],
  GUEST: [
    { name: 'Home', path: '/', icon: HomeIcon, category: 'main' },
    { name: 'Login', path: '/auth/login', icon: KeyIcon, category: 'auth' },
    { name: 'Register', path: '/auth/register', icon: UserIcon, category: 'auth' },
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

export default function Sidebar({ toggleSidebar, isOpen }: { toggleSidebar: () => void; isOpen: boolean }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const theme = useTheme();
  const navItems = user ? roleBasedNavItems[user.role] || roleBasedNavItems.GUEST : roleBasedNavItems.GUEST;

  const groupedNavItems = navItems.reduce((acc, item) => {
    const category = item.category || 'main';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const sidebarStyles = {
    width: { xs: 280, md: 240 },
    height: '100vh',
    backgroundColor: '#1e3a8a',
    color: '#f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    position: { xs: 'fixed', md: 'sticky' },
    top: 0,
    left: 0,
    zIndex: 1200,
    transition: 'transform 0.3s ease',
    transform: { xs: isOpen ? 'translateX(0)' : 'translateX(-100%)', md: 'translateX(0)' },
  };

  const logoStyles = {
    padding: '20px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#172554',
  };

  const navListStyles = {
    padding: '8px 0',
    '& .MuiListItem-root': {
      padding: '4px 16px',
      borderRadius: '8px',
      margin: '2px 12px',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: '#2563eb',
        transform: 'translateX(4px)',
      },
      '&.active': {
        backgroundColor: '#2563eb',
        '& .MuiListItemIcon-root': {
          color: '#ffffff',
        },
        '& .MuiListItemText-primary': {
          color: '#ffffff',
          fontWeight: 600,
        },
      },
    },
    '& .MuiListItemIcon-root': {
      minWidth: '36px',
      color: '#cbd5e1',
    },
    '& .MuiListItemText-primary': {
      fontSize: '0.875rem',
      color: '#f1f5f9',
    },
  };

  const categoryHeaderStyles = {
    padding: '12px 20px',
    color: '#94a3b8',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
  };

  const dividerStyles = {
    margin: '4px 16px',
    backgroundColor: '#334155',
  };

  return (
    <Box
      sx={{
        ...sidebarStyles,
        '@media (max-width: 767px)': {
          boxShadow: isOpen ? '2px 0 8px rgba(0, 0, 0, 0.2)' : 'none',
        },
      }}
    >
      <Box sx={logoStyles}>
        <img src="/logo.png" alt="CareWave Logo" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
          CareWave
        </Typography>
      </Box>

      <Box sx={{ overflowY: 'auto', flex: 1, scrollbarWidth: 'thin', scrollbarColor: '#475569 #1e3a8a' }}>
        {Object.entries(groupedNavItems).map(([category, items], index) => (
          <Box key={category}>
            {index > 0 && <Divider sx={dividerStyles} />}
            <Typography sx={categoryHeaderStyles}>{categoryLabels[category] || category}</Typography>
            <List sx={navListStyles}>
              {items.map(({ name, path, icon: Icon }) => (
                <ListItem
                  key={path}
                  component={Link}
                  href={path}
                  className={pathname === path ? 'active' : ''}
                  onClick={toggleSidebar}
                  sx={{ cursor: 'pointer' }}
                >
                  <ListItemIcon>
                    <Icon style={{ width: '20px', height: '20px' }} />
                  </ListItemIcon>
                  <ListItemText primary={name} />
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>

      {user && (
        <Box sx={{ padding: '16px', borderTop: '1px solid #334155' }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500, display: 'block', mb: '4px' }}>
            Logged in as
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#f1f5f9' }}>
            {user.role?.replace('_', ' ')} User
          </Typography>
        </Box>
      )}
    </Box>
  );
}