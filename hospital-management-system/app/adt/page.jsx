"use client";

import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Alert, Tabs, Tab } from '@mui/material';
import AdmissionForm from './AdtForm';
import AdmissionList from './AdtList';
import DoctorForm from './DoctorForm';
import PatientForm from './PatientForm';
import WardForm from './WardForm';
import { getPatients, getDoctors, getWards } from './adtService';

export default function AdtPage() {
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [wards, setWards] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [patientData, doctorData, wardData] = await Promise.all([
          getPatients(),
          getDoctors(),
          getWards(),
        ]);
        setPatients(patientData);
        setDoctors(doctorData);
        setWards(wardData);
        if (patientData.length === 0 || doctorData.length === 0 || wardData.length === 0) {
          setError('No patients, doctors, or wards found. Please add data using the respective tabs.');
        } else {
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          Admissions, Discharge, and Triage (ADT)
        </Typography>
        {selectedAdmission && (
          <Button variant="outlined" color="secondary" onClick={handleClearSelection}>
            Clear Selection
          </Button>
        )}
      </Box>
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 2 }}>
        <Tab label="Admissions" />
        <Tab label="Add Patient" />
        <Tab label="Add Doctor" />
        <Tab label="Add Ward" />
      </Tabs>
      {tabValue === 0 && (
        <>
          <AdmissionForm
            admission={selectedAdmission}
            onSubmit={handleFormSubmit}
            patients={patients}
            doctors={doctors}
            wards={wards}
          />
          <AdmissionList onSelectAdmission={setSelectedAdmission} refresh={refresh} />
        </>
      )}
      {tabValue === 1 && <PatientForm onSubmit={handleFormSubmit} />}
      {tabValue === 2 && <DoctorForm onSubmit={handleFormSubmit} />}
      {tabValue === 3 && <WardForm onSubmit={handleFormSubmit} />}
    </Container>
  );
}