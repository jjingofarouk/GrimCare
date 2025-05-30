'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { hasPermission } from './lib/auth';
import { useAuth } from './useAuth';
import styles from './Sidebar.module.css';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GavelIcon from '@mui/icons-material/Gavel';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import PersonIcon from '@mui/icons-material/Person';
import EmergencyIcon from '@mui/icons-material/Emergency';
import InventoryIcon from '@mui/icons-material/Inventory';
import HelpIcon from '@mui/icons-material/Help';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ScienceIcon from '@mui/icons-material/Science';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import FolderIcon from '@mui/icons-material/Folder';
import CampaignIcon from '@mui/icons-material/Campaign';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import QueueIcon from '@mui/icons-material/Queue';
import RadiologyIcon from '@mui/icons-material/Biotech';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import StorageIcon from '@mui/icons-material/Storage';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BuildIcon from '@mui/icons-material/Build';
import VaccinesIcon from '@mui/icons-material/Vaccines';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { user } = useAuth();

  const menuItems = useMemo(
    () => [
      { name: 'Dashboard', path: '/dashboard', permission: 'Dashboard', icon: <DashboardIcon /> },
      { name: 'Patients', path: '/patient', permission: 'Patients', icon: <PeopleIcon /> },
      { name: 'Appointments', path: '/appointment', permission: 'Appointments', icon: <EventIcon /> },
      { name: 'Accounting', path: '/accounting', permission: 'Accounting', icon: <AccountBalanceIcon /> },
      { name: 'ADT', path: '/adt', permission: 'ADT', icon: <LocalHospitalIcon /> },
      { name: 'Billing', path: '/billing', permission: 'Billing', icon: <ReceiptIcon /> },
      { name: 'Claim Management', path: '/claim-mgmt', permission: 'Claim Management', icon: <GavelIcon /> },
      { name: 'Clinical', path: '/clinical', permission: 'Clinical', icon: <MedicalServicesIcon /> },
      { name: 'CSSD', path: '/cssd', permission: 'CSSD', icon: <CleaningServicesIcon /> },
      { name: 'Dispensary', path: '/dispensary', permission: 'Dispensary', icon: <LocalPharmacyIcon /> },
      { name: 'Doctor', path: '/doctor', permission: 'Doctor', icon: <PersonIcon /> },
      { name: 'Emergency', path: '/emergency', permission: 'Emergency', icon: <EmergencyIcon /> },
      { name: 'Fixed Assets', path: '/fixed-assets', permission: 'Fixed Assets', icon: <InventoryIcon /> },
      { name: 'Helpdesk', path: '/helpdesk', permission: 'Helpdesk', icon: <HelpIcon /> },
      { name: 'Incentive', path: '/incentive', permission: 'Incentive', icon: <CardGiftcardIcon /> },
      { name: 'Inventory', path: '/inventory', permission: 'Inventory', icon: <InventoryIcon /> },
      { name: 'Laboratory', path: '/laboratory', permission: 'Laboratory', icon: <ScienceIcon /> },
      { name: 'Maternity', path: '/maternity', permission: 'Maternity', icon: <PregnantWomanIcon /> },
      { name: 'Medical Records', path: '/medical-records', permission: 'Medical Records', icon: <FolderIcon /> },
      { name: 'Marketing Referral', path: '/mkt-referral', permission: 'Marketing Referral', icon: <CampaignIcon /> },
      { name: 'NHIF', path: '/nhif', permission: 'NHIF', icon: <HealthAndSafetyIcon /> },
      { name: 'Nursing', path: '/nursing', permission: 'Nursing', icon: <MonitorHeartIcon /> },
      { name: 'Operation Theatre', path: '/operation-theatre', permission: 'Operation Theatre', icon: <TheaterComedyIcon /> },
      { name: 'Pharmacy', path: '/pharmacy', permission: 'Pharmacy', icon: <LocalPharmacyIcon /> },
      { name: 'Procurement', path: '/procurement', permission: 'Procurement', icon: <ShoppingCartIcon /> },
      { name: 'Queue Management', path: '/queue-mgmt', permission: 'Queue Management', icon: <QueueIcon /> },
      { name: 'Radiology', path: '/radiology', permission: 'Radiology', icon: <RadiologyIcon /> },
      { name: 'Reports', path: '/reports', permission: 'Reports', icon: <AssessmentIcon /> },
      { name: 'Social Service', path: '/social-service', permission: 'Social Service', icon: <VolunteerActivismIcon /> },
      { name: 'Substore', path: '/substore', permission: 'Substore', icon: <StorageIcon /> },
      { name: 'System Admin', path: '/system-admin', permission: 'System Admin', icon: <AdminPanelSettingsIcon /> },
      { name: 'Utilities', path: '/utilities', permission: 'Utilities', icon: <BuildIcon /> },
      { name: 'Vaccination', path: '/vaccination', permission: 'Vaccination', icon: <VaccinesIcon /> },
    ],
    []
  );

  return (
    <Box
      component="aside"
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
      sx={{ display: { xs: isOpen ? 'block' : 'none', md: isOpen ? 'block' : 'none' } }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: '#fff' }}>
          {user?.name || 'Menu'}
        </Typography>
        <IconButton onClick={toggleSidebar} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List className={styles.nav}>
        {menuItems
          .filter(({ permission }) => user?.role && hasPermission(user.role, permission))
          .map(({ name, path, icon }) => (
            <ListItem
              key={path}
              component={Link}
              href={path}
              onClick={toggleSidebar}
              className={styles.navItem}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>{icon}</ListItemIcon>
              <ListItemText primary={name} sx={{ color: '#fff' }} />
            </ListItem>
          ))}
      </List>
    </Box>
  );
}