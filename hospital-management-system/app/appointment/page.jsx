"use client";

import React, { useState } from 'react';
import { Container, Tabs, Tab, Box, Alert } from '@mui/material';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';
import AppointmentHistory from './AppointmentHistory';
import DoctorSchedule from './DoctorSchedule';
import QueueManagement from './QueueManagement';
import DoctorAvailability from './DoctorAvailability';
import AvailableDoctorsList from './AvailableDoctorsList';
import DepartmentForm from './DepartmentForm';
import Dashboard from './Dashboard';
import { useApiData } from '../utils/api';
import { getDepartments, getDoctors, getPatients } from './appointmentService';
import styles from './page.module.css';

export default function AppointmentPage({ userId }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: patients, error: patientsError, loading: patientsLoading } = useApiData(getPatients);
  const { data: doctors, error: doctorsError, loading: doctorsLoading } = useApiData(getDoctors);
  const { data: departments, error: departmentsError, loading: departmentsLoading } = useApiData(getDepartments);

  const handleSuccess = () => {
    setSelectedAppointment(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setActiveTab('form');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedAppointment(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ p: 0, m: 0 }}>
        {(patientsError || doctorsError || departmentsError) && (
          <Alert severity="error">
            {patientsError || doctorsError || departmentsError}
          </Alert>
        )}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          <Tab label="Dashboard" value="dashboard" />
          <Tab label="Book" value="form" />
          <Tab label="List" value="list" />
          <Tab label="History" value="history" />
          <Tab label="Schedule" value="schedule" />
          <Tab label="Queue" value="queue" />
          <Tab label="Availability" value="availability" />
          <Tab label="Available Doctors" value="availableDoctors" />
          <Tab label="Departments" value="departments" />
        </Tabs>
        <Box>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'form' && (
            <AppointmentForm
              patients={patients}
              doctors={doctors}
              departments={departments}
              onSuccess={handleSuccess}
              appointment={selectedAppointment}
              userId={userId}
            />
          )}
          {activeTab === 'list' && (
            <AppointmentList
              key={refreshKey}
              onEdit={handleEdit}
            />
          )}
          {activeTab === 'history' && (
            <AppointmentHistory patients={patients} />
          )}
          {activeTab === 'schedule' && (
            <DoctorSchedule doctors={doctors} />
          )}
          {activeTab === 'queue' && (
            <QueueManagement doctors={doctors} doctorId={userId} />
          )}
          {activeTab === 'availability' && (
            <DoctorAvailability doctors={doctors} />
          )}
          {activeTab === 'availableDoctors' && (
            <AvailableDoctorsList />
          )}
          {activeTab === 'departments' && <Department

Form />}
        </Box>
      </Box>
    </Container>
  );
}