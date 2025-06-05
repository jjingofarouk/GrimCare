'use client';
import React, { useState } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
import PharmacyInventory from './PharmacyInventory';
import PharmacyOrders from './PharmacyOrders';
import PharmacySuppliers from './PharmacySuppliers';
import PharmacyReports from './PharmacyReports';
import PharmacyForm from './PharmacyForm';
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
        Pharmacy Management
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
          {activeTab === 1 && <PharmacyOrders />}
          {activeTab === 2 && <PharmacySuppliers />}
          {activeTab === 3 && <PharmacyBilling />}
          {activeTab === 4 && <PharmacyFormulary />}
          {activeTab === 5 && <PharmacyNarcotics />}
          {activeTab === 6 && <PharmacyReports />}
          {activeTab === 7 && <PharmacyForm />}
          {activeTab === 8 && <PharmacyPharmacists />}
        </Box>
      </Paper>
    </Container>
  );
};

export default PharmacyPage;