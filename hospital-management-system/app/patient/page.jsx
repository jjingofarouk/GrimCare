// patient/page.jsx


// patient/PatientPage.jsx
'use client';
import React, { useState } from 'react';
import PatientForm from './PatientForm';
import PatientList from './PatientList';
import AppointmentHistory from '../AppointmentHistory';
import SearchBar from '../SearchBar';
import styles from './PatientPage.module.css';

const PatientPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('form');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setSelectedPatient(null);
    setActiveTab('list');
    setRefreshKey((prev) => prev + 1);
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setActiveTab('form');
  };

  const handleViewHistory = (patientId) => {
    setActiveTab(`history-${patientId}`);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'form' ? styles.active : ''}`}
            onClick={() => setActiveTab('form')}
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
        {activeTab === 'form' && (
          <PatientForm patient={selectedPatient} onSuccess={handleSuccess} />
        )}
        {activeTab === 'list' && (
          <>
            <SearchBar onSearch={handleSearch} />
            <PatientList
              key={refreshKey}
              onEdit={handleEdit}
              onViewHistory={handleViewHistory}
              searchQuery={searchQuery}
            />
          </>
        )}
        {activeTab.startsWith('history-') && (
          <AppointmentHistory patientId={activeTab.split('-')[1]} />
        )}
      </div>
    </div>
  );
};

export default PatientPage;
