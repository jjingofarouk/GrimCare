// app/components/Sidebar.jsx
'use client';

import React, { useState } from 'react';
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
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import styles from './Sidebar.module.css';

const navItems = [
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
  { name: 'Queue Management', path: '/queue-mngmt', icon: UsersIcon },
  { name: 'Radiology', path: '/radiology', icon: BeakerIcon },
  { name: 'Reports', path: '/reports', icon: TableCellsIcon },
  { name: 'Settings', path: '/settings', icon: CogIcon },
  { name: 'Social Service', path: '/social-service', icon: UsersIcon },
  { name: 'Substore', path: '/substore', icon: Squares2X2Icon },
  { name: 'System Admin', path: '/system-admin', icon: WrenchIcon },
  { name: 'Utilities', path: '/utilities', icon: WrenchIcon },
  { name: 'Vaccination', path: '/vaccination', icon: HeartIcon },
  { name: 'Verification', path: '/verification', icon: ShieldCheckIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen(!open);

  return (
    <>
      <IconButton onClick={toggleSidebar} className={styles.hamburger}>
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleSidebar}
        classes={{ paper: styles.sidebar }}
        ModalProps={{ keepMounted: true }}
      >
        <div className={styles.logo}>
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
    </>
  );
}