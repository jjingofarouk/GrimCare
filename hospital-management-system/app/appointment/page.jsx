"use client";

import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Box, Alert, CircularProgress } from '@mui/material';
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';
import AppointmentHistory from './AppointmentHistory';
import DoctorSchedule from './DoctorSchedule';
import QueueManagement from './QueueManagement';
import DoctorAvailability from './DoctorAvailability';
import AvailableDoctorsList from './AvailableDoctorsList';
import DepartmentForm from './DepartmentForm';
import Dashboard from './Dashboard';
import axios from 'axios';
import api from '../../api';
import styles from './page.module.css';

export default function AppointmentPage({ user }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        const [patientsRes, doctorsRes, departmentsRes] = await Promise.all([
          axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=patients`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=doctors`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=departments`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setPatients(patientsRes.data);
        setDoctors(doctorsRes.data);
        setDepartments(departmentsRes.data);
        setUserId(JSON.parse(atob(token.split('.')[1])).id);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSuccess = () => {
    setSelectedAppointment(null);
    setRefreshKey((prev) => prev + 1);
    setActiveTab('list');
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
        {error && (
          <Alert severity="error" className={styles.alert}>
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
                <AppointmentHistory patients={patients} key={refreshKey} />
              )}
              {activeTab === 'schedule' && (
                <DoctorSchedule doctors={doctors} key={refreshKey} />
              )}
              {activeTab === 'queue' && (
                <QueueManagement doctors={doctors} key={refreshKey} />
              )}
              {activeTab === 'availability' && (
                <DoctorAvailability doctors={doctors} key={refreshKey} />
              )}
              {activeTab === 'availableDoctors' && (
                <AvailableDoctorsList key={refreshKey} />
              )}
              {activeTab === 'departments' && <DepartmentForm key={refreshKey} />}
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}