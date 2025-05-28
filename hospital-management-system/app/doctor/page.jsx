"use client";

import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import DoctorList from './DoctorList';
import DoctorForm from './DoctorForm';

const DoctorPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedDoctor(null);
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setTabValue(1);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Doctor Management
      </Typography>
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Doctor List" />
        <Tab label={selectedDoctor ? 'Edit Doctor' : 'Add Doctor'} />
      </Tabs>
      {tabValue === 0 && <DoctorList onEdit={handleEdit} />}
      {tabValue === 1 && (
        <DoctorForm
          doctor={selectedDoctor}
          onSave={() => setTabValue(0)}
          onCancel={() => setTabValue(0)}
        />
      )}
    </Box>
  );
};

export default DoctorPage;
