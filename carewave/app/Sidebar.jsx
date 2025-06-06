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
  alpha
} from '@mui/material';
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
  health: 'Health Services'
};

const categoryColors = {
  main: '#115e59',
  'patient-care': '#0d9488',
  clinical: '#5b21b6',
  nursing: '#b91c1c',
  lab: '#c2410c',
  pharmacy: '#0e7490',
  finance: '#15803d',
  operations: '#7e22ce',
  reports: '#0f766e',
  support: '#3730a3',
  admin: '#4b5563',
  auth: '#1f2937',
  health: '#0d9488'
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

  const sidebarStyles = {
    width: 280,
    background: '#0f766e', // Dark teal background
    color: '#ffffff', // White text
    borderRight: '1px solid #115e59',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
  };

  const logoStyles = {
    padding: '24px 20px',
    borderBottom: '1px solid #115e59',
    background: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)', // Dark teal gradient
    color: '#ffffff', // White text
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #0e7490 0%, #134e4a 100%)', // Slightly different teal gradient on hover
    }
  };

  const logoContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const logoImageStyles = {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    filter: 'brightness(1.2)',
  };

  const navListStyles = {
    padding: '16px 0',
    '& .MuiListItem-root': {
      margin: '2px 12px',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
      color: '#ffffff', // White text for nav items
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
        transform: 'translateX(4px)',
      },
      '&.active': {
        backgroundColor: alpha(theme.palette.primary.main, 0.3),
        borderLeft: `3px solid ${theme.palette.primary.main}`,
        '& .MuiListItemIcon-root': {
          color: '#ffffff', // White icons for active items
        },
        '& .MuiListItemText-primary': {
          color: '#ffffff', // White text for active items
          fontWeight: 600,
        }
      }
    }
  };

  const categoryHeaderStyles = {
    padding: '16px 20px 8px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const dividerStyles = {
    margin: '8px 16px',
    backgroundColor: '#115e59', // Darker teal divider
  };

  return (
    <Drawer
      variant="temporary"
      open={isOpen}
      onClose={toggleSidebar}
      PaperProps={{
        sx: sidebarStyles
      }}
      ModalProps={{ keepMounted: true }}
    >
      <Box sx={logoStyles} onClick={toggleSidebar}>
        <Box sx={logoContainerStyles}>
          <img 
            src="/logo.png" 
            alt="CareWave Logo" 
            style={logoImageStyles}
          />