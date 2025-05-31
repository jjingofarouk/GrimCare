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
  TruckIcon,
  UsersIcon,
  WrenchIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import useAuth from './auth/useAuth';
import styles from './Sidebar.module.css';

const roleBasedNavItems = {
  PATIENT: [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Appointments', path: '/appointment', icon: CalendarIcon },
    { name: 'Medical Records', path: '/medical-records', icon: DocumentTextIcon },
    { name: 'Billing', path: '/billing', icon: TableCellsIcon },
  ],
  DOCTOR: [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Patients', path: '/patient', icon: UserIcon },
    { name: 'Appointments', path: '/appointment', icon: CalendarIcon },
    { name: 'Clinical', path: '/clinical', icon: BeakerIcon },
    { name: 'Operation Theatre', path: '/operation-theatre', icon: BeakerIcon },
  ],
  NURSE: [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Patients', path: '/patient', icon: UserIcon },
    { name: 'Appointments', path: '/appointment', icon: CalendarIcon },
    { name: 'Nursing', path: '/nursing', icon: HeartIcon },
    { name: 'Maternity', path: '/maternity', icon: HeartIcon },
  ],
  LAB_TECHNICIAN: [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Laboratory', path: '/laboratory', icon: BeakerIcon },
    { name: 'Radiology', path: '/radiology', icon: BeakerIcon },
  ],
  STAFF: [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Helpdesk', path: '/helpdesk', icon: UsersIcon },
    { name: 'Inventory', path: '/inventory', icon: Squares2X2Icon },
    { name: 'Procurement', path: '/procurement', icon: ShoppingCartIcon },
  ],
  ADMIN: [
    { name: 'Dashboard', path: '/', icon: HomeIcon },
    { name: 'Patients', path: '/patient', icon: UserIcon },
    { name: 'Appointments', path: '/appointment', icon: CalendarIcon },
    { name: 'Accounting', path: '/accounting', icon: CalculatorIcon },
    { name: 'ADT', path: '/adt', icon: ClipboardDocumentListIcon },
    { name: 'Billing', path: '/billing', icon: TableCellsIcon },
    { name: 'Claim Management', path: '/claim-mgmt', icon: DocumentTextIcon },
    { name: 'Clinical', path: '/clinical', icon: BeakerIcon },
    { name: 'Clinical Settings', path: '/clinical-settings', icon: WrenchIcon },
    { name: 'CSSD', path: '/cssd', icon: ShieldCheckIcon },
    { name: 'Dispensary', path: '/dispensary', icon: InboxIcon },
    { name: 'Doctor', path: '/doctor', icon: IdentificationIcon },
    { name: 'Dynamic Report', path: '/dynamic-report', icon: TableCellsIcon },
    { name: 'Emergency', path: '/emergency', icon: XCircleIcon },
    { name: 'Fixed Assets', path: '/fixed-assets', icon: BriefcaseIcon },
    { name: 'Helpdesk', path: '/helpdesk', icon: UsersIcon },
    { name: 'Incentive', path: '/incentive', icon: KeyIcon },
    { name: 'Inventory', path: '/inventory', icon: Squares2X2Icon },
    { name: 'Laboratory', path: '/laboratory', icon: BeakerIcon },
    { name: 'Maternity', path: '/maternity', icon: HeartIcon },
    { name: 'Medical Records', path: '/medical-records', icon: DocumentTextIcon },
    { name: 'Marketing Referral', path: '/mkt-referral', icon: UsersIcon },
    { name: 'NHIF', path: '/nhif', icon: ShieldCheckIcon },
    { name: 'Nursing', path: '/nursing', icon: HeartIcon },
    { name: 'Operation Theatre', path: '/operation-theatre', icon: BeakerIcon },
    { name: 'Pharmacy', path: '/pharmacy', icon: InboxIcon },
    { name: 'Procurement', path: '/procurement', icon: ShoppingCartIcon },
    { name: 'Queue Management', path: '/queue-mgmt', icon: UsersIcon },
    { name: 'Radiology', path: '/radiology', icon: BeakerIcon },
    { name: 'Reports', path: '/reports', icon: TableCellsIcon },
    { name: 'Settings', path: '/settings', icon: CogIcon },
    { name: 'Social Service', path: '/social-service', icon: UsersIcon },
    { name: 'Substore', path: '/substore', icon: Squares2X2Icon },
    { name: 'System Admin', path: '/system-admin', icon: WrenchIcon },
    { name: 'Utilities', path: '/utilities', icon: WrenchIcon },
    { name: 'Vaccination', path: '/vaccination', icon: HeartIcon },
    { name: 'Verification', path: '/verification', icon: ShieldCheckIcon },
  ],
  GUEST: [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Login', path: '/auth/login', icon: KeyIcon },
    { name: 'Register', path: '/auth/register', icon: UserIcon },
  ],
};

export default function Sidebar({ toggleSidebar, isOpen }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const navItems = user ? roleBasedNavItems[user.role] || roleBasedNavItems.GUEST : roleBasedNavItems.GUEST;

  return (
    <Drawer
      variant="temporary"
      open={isOpen}
      onClose={toggleSidebar}
      classes={{ paper: styles.sidebar }}
      ModalProps={{ keepMounted: true }}
    >
      <div className={styles.logo} onClick={toggleSidebar}>
        <div className={styles.logoContainer}>
          <img src="/logo.png" alt="HMS Logo" className={styles.logoImage} />
        </div>
      </div>
      <List className={styles.nav}>
        {navItems.map(({ name, path, icon: Icon }) => (
          <ListItem
            key={path}
            component={Link}
            href={path}
            className={`${styles.navLink} ${pathname === path ? styles.active : ''}`}
            onClick={toggleSidebar}
          >
            <ListItemIcon>
              <Icon className={styles.icon} />
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}