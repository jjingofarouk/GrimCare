'use client';
import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import DoctorList from './DoctorList';
import DoctorForm from './DoctorForm';
import DoctorDetails from './DoctorDetails';

const DoctorPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue !== 1) setSelectedDoctor(null);
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setTabValue(1);
  };

  const handleViewDetails = (doctorId) => {
    setSelectedDoctor({ id: doctorId });
    setTabValue(2);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        variant="scrollable" 
        scrollButtons
        allowScrollButtonsMobile
        sx={{ mb: 3 }}
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
      {tabValue === 0 && <DoctorList onEdit={handleEdit} onViewDetails={handleViewDetails} />}
      {tabValue === 1 && (
        <DoctorForm
          doctor={selectedDoctor}
          onSave={() => setTabValue(0)}
          onCancel={() => setTabValue(0)}
        />
      )}
      {tabValue >= 2 && selectedDoctor && (
        <DoctorDetails
          doctorId={selectedDoctor.id}
          initialTab={tabValue - 2}
        />
      )}
    </Box>
  );
};

export default DoctorPage;