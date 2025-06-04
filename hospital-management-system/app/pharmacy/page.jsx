

// pharmacy/PharmacyPage.jsx
// Main pharmacy module dashboard with all features

"use client";

import React, { useState } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
import PharmacyInventory from './PharmacyInventory';
import PharmacyOrders from './PharmacyOrders';
import PharmacySuppliers from './PharmacySuppliers';
import PharmacyReports from './PharmacyReports';
import PharmacyForm from './PharmacyForm';
import PharmacyPrescriptions from './PharmacyPrescriptions';
import PharmacyDispensing from './PharmacyDispensing';
import PharmacyBilling from './PharmacyBilling';
import PharmacyFormulary from './PharmacyFormulary';
import PharmacyNarcotics from './PharmacyNarcotics';
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
            <Tab label="Prescriptions" />
            <Tab label="Dispensing" />
            <Tab label="Orders" />
            <Tab label="Suppliers" />
            <Tab label="Billing" />
            <Tab label="Formulary" />
            <Tab label="Narcotics" />
            <Tab label="Reports" />
            <Tab label="Add Medication" />
          </Tabs>
        </Box>
        <Box className={styles.tabContent}>
          {activeTab === 0 && <PharmacyInventory />}
          {activeTab === 1 && <PharmacyPrescriptions />}
          {activeTab === 2 && <PharmacyDispensing />}
          {activeTab === 3 && <PharmacyOrders />}
          {activeTab === 4 && <PharmacySuppliers />}
          {activeTab === 5 && <PharmacyBilling />}
          {activeTab === 6 && <PharmacyFormulary />}
          {activeTab === 7 && <PharmacyNarcotics />}
          {activeTab === 8 && <PharmacyReports />}
          {activeTab === 9 && <PharmacyForm />}
        </Box>
      </Paper>
    </Container>
  );
};

export default PharmacyPage;