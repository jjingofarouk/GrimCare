'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserIcon,
  CalendarIcon,
  CalculatorIcon,
  CogIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  BeakerIcon,
  TruckIcon,
  BellAlertIcon,
  BanknotesIcon,
  ArchiveBoxIcon,
  HeartIcon,
  DocumentMagnifyingGlassIcon,
  BuildingStorefrontIcon,
  UserCircleIcon,
  QueueListIcon,
  ChartBarIcon,
  UserPlusIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import styles from './Sidebar.module.css';

const navItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  {
    name: 'Patients',
    path: '/patient',
    icon: UserIcon,
    subItems: [
      { name: 'Patient Records', path: '/patient/records' },
      { name: 'Patient Admissions', path: '/patient/admissions' },
    ],
  },
  {
    name: 'Appointments',
    path: '/appointment',
    icon: CalendarIcon,
    subItems: [
      { name: 'Schedule', path: '/appointment/schedule' },
      { name: 'Bookings', path: '/appointment/bookings' },
    ],
  },
  {
    name: 'Accounting',
    path: '/accounting',
    icon: CalculatorIcon,
    subItems: [
      { name: 'Ledger', path: '/accounting/ledger' },
      { name: 'Reports', path: '/accounting/reports' },
    ],
  },
  { name: 'ADT', path: '/adt', icon: DocumentTextIcon },
  {
    name: 'Billing',
    path: '/billing',
    icon: CurrencyDollarIcon,
    subItems: [
      { name: 'Invoices', path: '/billing/invoices' },
      { name: 'Payments', path: '/billing/payments' },
    ],
  },
  { name: 'Claim Management', path: '/claim-mgmt', icon: ShieldCheckIcon },
  {
    name: 'Clinical',
    path: '/clinical',
    icon: BeakerIcon,
    subItems: [
      { name: 'Patient Charts', path: '/clinical/charts' },
      { name: 'Treatment Plans', path: '/clinical/plans' },
    ],
  },
  { name: 'CSSD', path: '/cssd', icon: TruckIcon },
  { name: 'Dispensary', path: '/dispensary', icon: BuildingStorefrontIcon },
  { name: 'Doctor', path: '/doctor', icon: UserCircleIcon },
  { name: 'Emergency', path: '/emergency', icon: BellAlertIcon },
  { name: 'Fixed Assets', path: '/fixed-assets', icon: ArchiveBoxIcon },
  { name: 'Helpdesk', path: '/helpdesk', icon: WrenchScrewdriverIcon },
  { name: 'Incentive', path: '/incentive', icon: BanknotesIcon },
  {
    name: 'Inventory',
    path: '/inventory',
    icon: CubeIcon,
    subItems: [
      { name: 'Stock', path: '/inventory/stock' },
      { name: 'Supplies', path: '/inventory/supplies' },
    ],
  },
  { name: 'Laboratory', path: '/laboratory', icon: BeakerIcon },
  { name: 'Maternity', path: '/maternity', icon: HeartIcon },
  { name: 'Medical Records', path: '/medical-records', icon: DocumentMagnifyingGlassIcon },
  { name: 'Marketing Referral', path: '/mkt-referral', icon: UserPlusIcon },
  { name: 'NHIF', path: '/nhif', icon: ShieldCheckIcon },
  { name: 'Nursing', path: '/nursing', icon: UserPlusIcon },
  { name: 'Operation Theatre', path: '/operation-theatre', icon: BeakerIcon },
  { name: 'Pharmacy', path: '/pharmacy', icon: BuildingStorefrontIcon },
  { name: 'Procurement', path: '/procurement', icon: TruckIcon },
  { name: 'Queue Management', path: '/queue-mngmt', icon: QueueListIcon },
  { name: 'Radiology', path: '/radiology', icon: ChartBarIcon },
  { name: 'Reports', path: '/reports', icon: ChartBarIcon },
  { name: 'Social Service', path: '/social-service', icon: UserPlusIcon },
  { name: 'Substore', path: '/substore', icon: CubeIcon },
  { name: 'System Admin', path: '/system-admin', icon: CogIcon },
  { name: 'Utilities', path: '/utilities', icon: WrenchScrewdriverIcon },
  { name: 'Vaccination', path: '/vaccination', icon: BeakerIcon },
  { name: 'Settings', path: '/settings', icon: CogIcon },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const pathname = usePathname();
  const [openSubMenus, setOpenSubMenus] = React.useState({});

  const toggleSubMenu = (name) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="HMS Logo" className={styles.logoImage} />
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map(({ name, path, icon: Icon, subItems }) => (
            <li key={path}>
              <div className={styles.navItem}>
                <Link
                  href={path}
                  className={`${styles.navLink} ${pathname === path ? styles.active : ''}`}
                  onClick={() => {
                    if (subItems) {
                      toggleSubMenu(name);
                    } else {
                      toggleSidebar();
                    }
                  }}
                >
                  <Icon className={styles.icon} />
                  <span>{name}</span>
                  {subItems && (
                    <ChevronDownIcon
                      className={`${styles.chevron} ${openSubMenus[name] ? styles.rotate : ''}`}
                    />
                  )}
                </Link>
                {subItems && openSubMenus[name] && (
                  <ul className={styles.subNavList}>
                    {subItems.map((subItem) => (
                      <li key={subItem.path}>
                        <Link
                          href={subItem.path}
                          className={`${styles.subNavLink} ${pathname === subItem.path ? styles.active : ''}`}
                          onClick={toggleSidebar}
                        >
                          <span>{subItem.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}