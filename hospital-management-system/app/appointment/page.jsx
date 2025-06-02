"use client";

import React, { useState, useEffect } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';
import AppointmentHistory from './AppointmentHistory';
import DoctorSchedule from './DoctorSchedule';
import QueueManagement from './QueueManagement';
import DoctorAvailability from './DoctorAvailability';
import DepartmentForm from './DepartmentForm';
import Dashboard from './Dashboard';
import { getDepartments, getDoctors, getPatients } from './appointmentService';

export default function AppointmentPage({ userId }) {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsData, doctorsData, departmentsData] = await Promise.all([
          getPatients(),
          getDoctors(),
          getDepartments(),
        ]);
        setPatients(patientsData);
        setDoctors(doctorsData);
        setDepartments(departmentsData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

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
      <Typography variant="h4" gutterBottom>Appointment Management</Typography>
      <Paper elevation={3} sx={{ p: 2 }}>
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
            <QueueManagement doctors={doctors} />
          )}
          {activeTab === 'availability' && (
            <DoctorAvailability doctors={doctors} />
          )}
          {activeTab === 'departments' && <DepartmentForm />}
        </Box>
      </Paper>
    </Container>
  );
}