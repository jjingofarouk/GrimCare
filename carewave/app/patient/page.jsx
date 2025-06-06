'use client';
import React, { useState, useEffect } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
import PatientForm from './PatientForm';
import PatientList from './PatientList';
import HistoryTakingForm from './HistoryTakingForm';
import MedicalRecordsList from './MedicalRecordsList';
import { getPatients } from './patientService';
import { getMedicalRecords } from '../medical-records/medicalRecordsService';

export default function PatientPage() {
  const [patients, setPatients] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsData, recordsData] = await Promise.all([getPatients(), getMedicalRecords()]);
        setPatients(patientsData);
        setMedicalRecords(recordsData);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    fetchData();
  }, [refreshKey]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue !== 1 && newValue !== 2) {
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
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Patient Management</Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-flexContainer': { flexWrap: 'nowrap' },
              '& .MuiTab-root': { minWidth: { xs: 100, sm: 120 }, fontSize: { xs: '0.8rem', sm: '0.875rem' } },
            }}
          >
            <Tab label="All Patients" />
            <Tab label={selectedPatient ? 'Edit Patient' : 'Add Patient'} />
            <Tab label="History Taking" />
            <Tab label="Medical Records" />
          </Tabs>
        </Box>
        <Box>
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
          {tabValue === 2 && (
            <HistoryTakingForm
              patients={patients}
              onSuccess={handleSuccess}
            />
          )}
          {tabValue === 3 && (
            <MedicalRecordsList
              medicalRecords={medicalRecords}
              onSuccess={handleSuccess}
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
}