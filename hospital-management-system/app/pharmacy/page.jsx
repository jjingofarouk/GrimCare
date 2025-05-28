"use client";

import React, { useState } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
import PharmacyInventory from './PharmacyInventory';
import PharmacyOrders from './PharmacyOrders';
import PharmacySuppliers from './PharmacySuppliers';
import PharmacyReports from './PharmacyReports';
import PharmacySettings from './PharmacySettings';
import PharmacyForm from './PharmacyForm';
import styles from './PharmacyPage.module.css';

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
                flexWrap: 'nowrap', // Prevent tabs from wrapping
              },
              '& .MuiTab-root': {
                minWidth: { xs: 100, sm: 120 }, // Smaller tabs on mobile
                fontSize: { xs: '0.8rem', sm: '0.875rem' }, // Responsive font size
              },
            }}
          >
            <Tab label="Inventory" />
            <Tab label="Orders" />
            <Tab label="Suppliers" />
            <Tab label="Reports" />
            <Tab label="Settings" />
            <Tab label="Add Medication" />
          </Tabs>
        </Box>
        <Box className={styles.tabContent}>
          {activeTab === 0 && <PharmacyInventory />}
          {activeTab === 1 && <PharmacyOrders />}
          {activeTab === 2 && <PharmacySuppliers />}
          {activeTab === 3 && <PharmacyReports />}
          {activeTab === 4 && <PharmacySettings />}
          {activeTab === 5 && <PharmacyForm />}
        </Box>
      </Paper>
    </Container>
  );
};

export default PharmacyPage;