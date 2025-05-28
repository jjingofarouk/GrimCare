"use client";

import React, { useState, useEffect } from 'react';
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

  return (
    <div className={styles.container}>
      <NotificationBanner />
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'form' ? styles.active : ''}`}
            onClick={() => setActiveTab('form')}
          >
            Book
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'list' ? styles.active : ''}`}
            onClick={() => setActiveTab('list')}
          >
            List
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'history' ? styles.active : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'schedule' ? styles.active : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            Schedule
          </button>
        </div>
      </div>
      <div className={styles.content}>
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
          <div>
            <select
              onChange={(e) => setActiveTab(`history-${e.target.value}`)}
              className={styles.select}
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {activeTab.startsWith('history-') && (
          <AppointmentHistory patientId={activeTab.split('-')[1]} />
        )}
        {activeTab === 'schedule' && (
          <div>
            <select
              onChange={(e) => setActiveTab(`schedule-${e.target.value}`)}
              className={styles.select}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {activeTab.startsWith('schedule-') && (
          <DoctorSchedule doctorId={activeTab.split('-')[1]} />
        )}
      </div>
      {showConfirmation && (
        <AppointmentConfirmation
          appointment={showConfirmation}
          onClose={() => setShowConfirmation(null)}
        />
      )}
    </div>
  );
}
