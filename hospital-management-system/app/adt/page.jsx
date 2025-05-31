// app/adt/page.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Alert, Tabs, Tab } from '@mui/material';
import AdmissionForm from './AdmissionForm';
import AdmissionList from './AdmissionList';
import DoctorForm from './DoctorForm';
import PatientForm from './PatientForm';
import WardForm from './WardForm';
import DoctorList from './DoctorList';
import PatientList from './PatientList';
import WardList from './WardList';
import TriageDashboard from './TriageDashboard';
import FinancialSummary from './FinancialSummary';
import { getPatients, getDoctors, getWards } from './adtService';
import styles from './page.module.css';

export default function AdtPage() {
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [wards, setWards] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [errors, setErrors] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setErrors([]);
      try {
        const [patientData, doctorData, wardData] = await Promise.all([
          getPatients().catch((err) => {
            setErrors((prev) => [...prev, `Patients: ${err.response?.data?.details || err.message}`]);
            return [];
          }),
          getDoctors().catch((err) => {
            setErrors((prev) => [...prev, `Doctors: ${err.response?.data?.details || err.message}`]);
            return [];
          }),
          getWards().catch((err) => {
            setErrors((prev) => [...prev, `Wards: ${err.response?.data?.details || err.message}`]);
            return [];
          }),
        ]);
        setPatients(patientData);
        setDoctors(doctorData);
        setWards(wardData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrors((prev) => [...prev, 'General: Failed to fetch data. Please try again later.']);
      }
    }
    fetchData();
  }, [refresh]);

  const handleFormSubmit = () => {
    setRefresh(!refresh);
    setSelectedAdmission(null);
  };

  const handleClearSelection = () => {
    setSelectedAdmission(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box className={styles.container}>
      <Container className={styles.contentBox}>
        <Typography variant="h4" className={styles.mainTitle}>
          Admissions, Discharge, and Triage (ADT)
        </Typography>
        {selectedAdmission && (
          <Button
            variant="contained"
            onClick={handleClearSelection}
            className={styles.clearButton}
          >
            Clear Selection
          </Button>
        )}
        {errors.length > 0 && (
          <Box className={styles.errorContainer}>
            {errors.map((error, index) => (
              <Alert key={index} severity="error" className={styles.errorAlert}>
                {error}
              </Alert>
            ))}
          </Box>
        )}
        {(patients.length === 0 && doctors.length === 0 && wards.length === 0 && errors.length === 0) && (
          <Alert severity="info" className={styles.infoAlert}>
            No patients, doctors, or wards found. Please add data using the respective tabs.
          </Alert>
        )}
        <Box className={styles.tabsContainer}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            className={styles.tabs}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Admissions" className={styles.tab} classes={{ selected: styles.tabSelected }} />
            <Tab label="Patients" className={styles.tab} classes={{ selected: styles.tabSelected }} />
            <Tab label="Doctors" className={styles.tab} classes={{ selected: styles.tabSelected }} />
            <Tab label="Wards" className={styles.tab} classes={{ selected: styles.tabSelected }} />
            <Tab label="Triage Dashboard" className={styles.tab} classes={{ selected: styles.tabSelected }} />
            <Tab label="Financial Summary" className={styles.tab} classes={{ selected: styles.tabSelected }} />
          </Tabs>
          <Box className={`${styles.tabContent} ${styles.fadeIn}`}>
            {tabValue === 0 && (
              <Box className={styles.sectionContainer}>
                <Box className={styles.formSection}>
                  <AdmissionForm
                    selectedAdmission={selectedAdmission}
                    onSubmit={handleFormSubmit}
                    patients={patients}
                    doctors={doctors}
                    wards={wards}
                  />
                </Box>
                <AdmissionList onSelectAdmission={setSelectedAdmission} refresh={refresh} />
              </Box>
            )}
            {tabValue === 1 && (
              <Box className={styles.sectionContainer}>
                <Box className={styles.formSection}>
                  <PatientForm onSubmit={handleFormSubmit} />
                </Box>
                <PatientList />
              </Box>
            )}
            {tabValue === 2 && (
              <Box className={styles.sectionContainer}>
                <Box className={styles.formSection}>
                  <DoctorForm onSubmit={handleFormSubmit} />
                </Box>
                <DoctorList />
              </Box>
            )}
            {tabValue === 3 && (
              <Box className={styles.sectionContainer}>
                <Box className={styles.formSection}>
                  <WardForm onSubmit={handleFormSubmit} />
                </Box>
                <WardList />
              </Box>
            )}
            {tabValue === 4 && (
              <Box className={styles.sectionContainer}>
                <TriageDashboard />
              </Box>
            )}
            {tabValue === 5 && (
              <Box className={styles.sectionContainer}>
                <FinancialSummary />
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}