'use client';
import React, { useState } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
import PharmacyInventory from './PharmacyInventory';
import PharmacyOrders from './PharmacyOrders';
import PharmacySuppliers from './PharmacySuppliers';
import PharmacyReports from './PharmacyReports';
import PharmacyForm from './PharmacyForm';
import PharmacyDispensing from './PharmacyDispensing';
import PharmacyBilling from './PharmacyBilling';
import PharmacyFormulary from './PharmacyFormulary';
import PharmacyNarcotics from './PharmacyNarcotics';
import PharmacyPharmacists from './PharmacyPharmacists';
import styles from './page.module.css';

const PharmacyPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Typography variant="h4" gutterBottom className={styles.title}>
        Pharmacy Management System
      </Typography>
      <Paper elevation={3} className={styles.paper}>
        <Box className={styles.tabsWrapper}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            className={styles.tabs}
            sx={{
              '& .MuiTabs-flexContainer': {
                flexWrap: 'nowrap',
              },
              '& .MuiTab-root': {
                minWidth: { xs: 100, sm: 120 },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
              },
            }}
          >
            <Tab label="Inventory" />
            <Tab label="Dispensing" />
            <Tab label="Orders" />
            <Tab label="Suppliers" />
            <Tab label="Billing" />
            <Tab label="Formulary" />
            <Tab label="Narcotics" />
            <Tab label="Reports" />
            <Tab label="Add Medication" />
            <Tab label="Add Pharmacists" />
          </Tabs>
        </Box>
        <Box className={styles.tabContent}>
          {activeTab === 0 && <PharmacyInventory />}
          {activeTab === 1 && <PharmacyDispensing />}
          {activeTab === 2 && <PharmacyOrders />}
          {activeTab === 3 && <PharmacySuppliers />}
          {activeTab === 4 && <PharmacyBilling />}
          {activeTab === 5 && <PharmacyFormulary />}
          {activeTab === 6 && <PharmacyNarcotics />}
          {activeTab === 7 && <PharmacyReports />}
          {activeTab === 8 && <PharmacyForm />}
          {activeTab === 9 && <PharmacyPharmacists />}
        </Box>
      </Paper>
    </Container>
  );
};

export default PharmacyPage;