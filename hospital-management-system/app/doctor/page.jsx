// app/doctor/page.js
'use client';
import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import DoctorList from './DoctorList';
import DoctorForm from './DoctorForm';
import ErrorBoundary from '../components/ErrorBoundary';

const DoctorPage = () => {
  const [tabValue, setTabValue] = useState('0');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue !== '1') {
      setSelectedDoctor(null);
    }
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setTabValue('1');
  };

  const handleDoctorSelect = (doctorId) => {
    // No navigation needed since DoctorDetails is removed
    console.log('Selected doctor ID:', doctorId);
  };

  return (
    <ErrorBoundary>
      <Box sx={{ padding: '24px' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          sx={{ marginBottom: '24px' }}
        >
          <Tab label="Doctor List" />
          <Tab label={selectedDoctor ? 'Edit Doctor' : 'Add Doctor'} />
        </Tabs>
        {tabValue === '0' && (
          <DoctorList onEdit={handleEdit} onSelect={handleDoctorSelect} />
        )}
        {tabValue === '1' && (
          <DoctorForm
            doctor={selectedDoctor}
            onSave={() => setTabValue('0')}
            onCancel={() => setTabValue('0')}
          />
        )}
      </Box>
    </ErrorBoundary>
  );
};

export default DoctorPage;