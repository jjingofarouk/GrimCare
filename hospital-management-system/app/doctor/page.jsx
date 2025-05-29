
'use client';
import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import DoctorList from './DoctorList';
import DoctorForm from './DoctorForm';
import DoctorDetails from './DoctorDetails';
import ErrorBoundary from '../components/ErrorBoundary';
import api from '../api';

const DoctorPage = () => {
  const [tabValue, setTabValue] = useState(0');
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
    setSelectedDoctor({ id: doctorId });
    setTabValue('2');
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
          <Tab label="Schedules" disabled={!selectedDoctor} />
          <Tab label="Patients" disabled={!selectedDoctor} />
          <Tab label="Appointments" disabled={!selectedDoctor} />
          <Tab label="Prescriptions" disabled={!selectedDoctor} />
          <Tab label="Case Notes" disabled={!selectedDoctor} />
          <Tab label="Diagnostic Orders" disabled={!selectedDoctor} />
          <Tab label="Leave Requests" disabled={!selectedDoctor} />
          <Tab label="Performance" disabled={!selectedDoctor} />
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
        {tabValue >= '2' && selectedDoctor && (
          <DoctorDetails
            doctorId={selectedDoctor.id}
            initialTab={parseInt(tabValue) - 2}
          />
        )}
      </Box>
    </ErrorBoundary>
  );
};

export default DoctorPage;
