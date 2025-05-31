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
  const [errors, setErrors] = useState([]);

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
        setErrors((prev) => [...prev, `General: Failed to fetch data. Please try again later.`]);
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

  const [tabValue, setTabValue] = useState(0);

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
      {errors.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {errors.map((error, index) => (
            <Alert key={index} severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          ))}
          <Alert severity="warning">
            No patients, doctors, or wards found. Please add data using the respective tabs.
          </Alert>
        </Box>
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