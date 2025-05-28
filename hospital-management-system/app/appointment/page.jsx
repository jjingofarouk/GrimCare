"use client";

import React, { useState, useEffect } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography, MenuItem, Select, FormControl } from '@mui/material';
import AppointmentList from './AppointmentList';
import AppointmentForm from './AppointmentForm';
import AppointmentConfirmation from './AppointmentConfirmation';
import AppointmentHistory from './AppointmentHistory';
import DoctorSchedule from './DoctorSchedule';
import NotificationBanner from './NotificationBanner';
import SearchBar from './SearchBar';
import { getAppointments, getDoctors, getPatients } from './appointmentService';
import styles from './AppointmentPage.module.css';

export default function AppointmentPage() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(null);
  const [activeTab, setActiveTab] = useState('form');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsData, doctorsData] = await Promise.all([
          getPatients(),
          getDoctors(),
        ]);
        setPatients(patientsData);
        setDoctors(doctorsData);
      } catch (err) {
        console.error('Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  const handleSuccess = (appointment) => {
    setSelectedAppointment(null);
    setShowConfirmation(appointment);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setActiveTab('form');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Typography variant="h4" gutterBottom className={styles.title}>
        Appointment Management
      </Typography>
      <NotificationBanner />
      <Paper elevation={3} className={styles.paper}>
        <Box className={styles.tabsWrapper}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            className={styles.tabs}
            sx={{
              '& .MuiTabs-flexContainer': {
                flexWrap: 'nowrap',
              },
              '& .MuiTab-root': {
                minWidth: { xs: 100, sm: 120 },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
              },
            }}
          >
            <Tab label="Book" value="form" />
            <Tab label="List" value="list" />
            <Tab label="History" value="history" />
            <Tab label="Schedule" value="schedule" />
          </Tabs>
        </Box>
        <Box className={styles.content}>
          {activeTab === 'form' && (
            <AppointmentForm
              patients={patients}
              doctors={doctors}
              onSuccess={handleSuccess}
              appointment={selectedAppointment}
            />
          )}
          {activeTab === 'list' && (
            <>
              <SearchBar onSearch={handleSearch} />
              <AppointmentList
                key={refreshKey}
                onEdit={handleEdit}
                searchQuery={searchQuery}
              />
            </>
          )}
          {activeTab === 'history' && (
            <FormControl fullWidth className={styles.select}>
              <Select
                value=""
                onChange={(e) => setActiveTab(`history-${e.target.value}`)}
                displayEmpty
              >
                <MenuItem value="">Select Patient</MenuItem>
                {patients.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {activeTab.startsWith('history-') && (
            <AppointmentHistory patientId={activeTab.split('-')[1]} />
          )}
          {activeTab === 'schedule' && (
            <FormControl fullWidth className={styles.select}>
              <Select
                value=""
                onChange={(e) => setActiveTab(`schedule-${e.target.value}`)}
                displayEmpty
              >
                <MenuItem value="">Select Doctor</MenuItem>
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {activeTab.startsWith('schedule-') && (
            <DoctorSchedule doctorId={activeTab.split('-')[1]} />
          )}
        </Box>
      </Paper>
      {showConfirmation && (
        <AppointmentConfirmation
          appointment={showConfirmation}
          onClose={() => setShowConfirmation(null)}
        />
      )}
    </Container>
  );
}