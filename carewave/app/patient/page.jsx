'use client';

import React, { useState, useEffect } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
import PatientForm from './PatientForm';
import PatientList from './PatientList';
import { getPatients } from '../adt/adtService';
import styles from './PatientPage.module.css';

export default function PatientPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsData = await getPatients();
        setPatients(patientsData);
      } catch (err) {
        console.error('Failed to fetch patients', err);
      }
    };
    fetchData();
  }, [refreshKey]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue !== 1) {
      setSelectedPatient(null);
    }
  };

  const handleSuccess = () => {
    setSelectedPatient(null);
    setTabValue(0);
    setRefreshKey(prev => prev + 1);
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setTabValue(1);
  };

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Typography variant="h4" gutterBottom className={styles.title}>
        Patient Management
      </Typography>
      <Paper elevation={3} className={styles.paper}>
        <Box className={styles.tabsWrapper}>
          <Tabs
            value={tabValue}
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
            <Tab label="Patient List" />
            <Tab label={selectedPatient ? 'Edit Patient' : 'Add Patient'} />
          </Tabs>
        </Box>
        <Box className={styles.tabContent}>
          {tabValue === 0 && (
            <PatientList
              key={refreshKey}
              patients={patients}
              onEdit={handleEdit}
            />
          )}
          {tabValue === 1 && (
            <PatientForm
              patient={selectedPatient}
              onSuccess={handleSuccess}
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
}