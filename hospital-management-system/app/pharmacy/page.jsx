// pharmacy/page.jsx
import React, { useState } from 'react';
import { Container, Grid, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
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
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          className={styles.tabs}
        >
          <Tab label="Inventory" />
          <Tab label="Orders" />
          <Tab label="Suppliers" />
          <Tab label="Reports" />
          <Tab label="Settings" />
          <Tab label="Add Medication" />
        </Tabs>
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
