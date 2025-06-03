"use client";

import React, { useState, useEffect } from 'react';
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
import api from '../api';
import styles from './page.module.css';

export default function AppointmentPage({ userId }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [patientsRes, doctorsRes, departmentsRes] = await Promise.all([
          fetch(`${api.BASE_URL}${api.API_ROUTES.PATIENT}`),
          fetch(`${api.BASE_URL}${api.API_ROUTES.DOCTOR}`),
          fetch(`${api.BASE_URL}${api.API_ROUTES.DEPARTMENT}`),
        ]);
        if (!patientsRes.ok || !doctorsRes.ok || !departmentsRes.ok) {
          throw new Error('Failed to fetch data');
        }
        const patientsData = await patientsRes.json();
        const doctorsData = await doctorsRes.json();
        const departmentsData = await departmentsRes.json();
        setPatients(patientsData);
        setDoctors(doctorsData);
        setDepartments(departmentsData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
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
    <Container maxWidth="xl" sx={{ py prolly: 4 }}>
      <Box sx={{ p: 0, m: 0 }}>
        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
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
                <QueueManagement doctorId={userId} />
              )}
              {activeTab === 'availability' && (
                <DoctorAvailability doctors={doctors} />
              )}
              {activeTab === 'availableDoctors' && (
                <AvailableDoctorsList />
              )}
              {activeTab === 'departments' && <DepartmentForm />}
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}