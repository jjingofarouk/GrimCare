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
  health: '#059669'
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
    background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
    borderRight: '1px solid #e2e8f0',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  };

  const logoStyles = {
    padding: '24px 20px',
    borderBottom: '1px solid #e2e8f0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
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
    filter: 'brightness(1.1)',
  };

  const navListStyles = {
    padding: '16px 0',
    '& .MuiListItem-root': {
      margin: '2px 12px',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        transform: 'translateX(4px)',
      },
      '&.active': {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        borderLeft: `3px solid ${theme.palette.primary.main}`,
        '& .MuiListItemIcon-root': {
          color: theme.palette.primary.main,
        },
        '& .MuiListItemText-primary': {
          color: theme.palette.primary.main,
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
    backgroundColor: '#e2e8f0',
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
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
            CareWave
          </Typography>
        </Box>
      </Box>

      <Box sx={{ overflowY: 'auto', flex: 1 }}>
        {Object.entries(groupedNavItems).map(([category, items], index) => (
          <Box key={category}>
            {index > 0 && <Divider sx={dividerStyles} />}
            
            <Box sx={categoryHeaderStyles}>
              <Chip
                label={categoryLabels[category] || category}
                size="small"
                sx={{
                  backgroundColor: alpha(categoryColors[category] || '#64748b', 0.1),
                  color: categoryColors[category] || '#64748b',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  height: '24px',
                }}
              />
            </Box>

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
                  <ListItemIcon sx={{ minWidth: '40px' }}>
                    <Icon style={{ width: '20px', height: '20px' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={name}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>

      {user && (
        <Box sx={{ 
          padding: '16px 20px', 
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc'
        }}>
          <Typography variant="caption" sx={{ 
            color: '#64748b', 
            fontWeight: 500,
            display: 'block',
            marginBottom: '4px'
          }}>
            Logged in as
          </Typography>
          <Typography variant="body2" sx={{ 
            fontWeight: 600,
            color: '#1e293b'
          }}>
            {user.role?.replace('_', ' ')} User
          </Typography>
        </Box>
      )}
    </Drawer>
  );
}