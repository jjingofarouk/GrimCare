"use client";

import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import AdmissionForm from './AdmissionForm';
import AdmissionList from './AdmissionList';
import { getPatients, getDoctors, getWards } from './adtService';

export default function AdtPage() {
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [wards, setWards] = useState([]);
  const [refresh, setRefresh] = useState(false);

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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  const handleFormSubmit = () => {
    setRefresh(!refresh);
    setSelectedAdmission(null);
  };

  const handleClearSelection = () => {
    setSelectedAdmission(null);
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
      <AdmissionForm
        admission={selectedAdmission}
        onSubmit={handleFormSubmit}
        patients={patients}
        doctors={doctors}
        wards={wards}
      />
      <AdmissionList onSelectAdmission={setSelectedAdmission} refresh={refresh} />
    </Container>
  );
}