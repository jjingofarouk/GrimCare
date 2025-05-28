'use client';

import React, { useState, useEffect } from 'react';
import PatientForm from './PatientForm';
import PatientListWithFilter from './PatientListWithFilter';
import PatientDetails from './PatientDetails';
import AppointmentHistory from '../appointment/AppointmentHistory';
import PatientNotification from './PatientNotification';
import SearchBar from './SearchBar';
import { getPatients } from './patientService';
import styles from './PatientPage.module.css';

export default function PatientPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('form');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsData = await getPatients();
        setPatients(patientsData);
      } catch (err) {
        console.error('Failed to fetch patients');
      }
    };
    fetchData();
  }, [refreshKey]);

  const handleSuccess = () => {
    setSelectedPatient(null);
    setActiveTab('list');
    setRefreshKey((prev) => prev + 1);
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setActiveTab('edit');
  };

  const handleViewHistory = (patientId) => {
    setActiveTab(`history-${patientId}`);
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setActiveTab('details');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className={styles.container}>
      <PatientNotification />
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'form' || activeTab === 'edit' ? styles.active : ''}`}
            onClick={() => { setActiveTab('form'); setSelectedPatient(null); }}
          >
            Register
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'list' ? styles.active : ''}`}
            onClick={() => setActiveTab('list')}
          >
            List
          </button>
        </div>
      </div>
      <div className={styles.content}>
        {(activeTab === 'form' || activeTab === 'edit') && (
          <PatientForm
            patient={selectedPatient}
            onSuccess={handleSuccess}
          />
        )}
        {activeTab === 'list' && (
          <>
            <SearchBar onSubmit={handleSearch} />
            <PatientListWithFilter
              key={refreshKey}
              onEdit={handleEdit}
              onViewHistory={handleViewHistory}
              onSelect={handleViewDetails}
              searchQuery={searchQuery}
            />
          </>
        )}
        {activeTab.startsWith('history-') && (
          <AppointmentHistory patientId={activeTab.split('-')[1]} />
        )}
        {activeTab === 'details' && (
          <PatientDetails
            patient={selectedPatient}
            onBack={() => setActiveTab('list')}
          />
        )}
      </div>
    </div>
  );
}