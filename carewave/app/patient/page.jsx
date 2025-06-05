'use client';

import React, { useState, useEffect } from 'react';
import PatientForm from './PatientForm';
import PatientList from './PatientList';
import { getPatients } from './patientService';
import styles from './PatientPage.module.css';

export default function PatientPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('form');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsData = await getPatients();
        setPatients(patientsData);
      } catch (err) {
        console.error('Failed to fetch patients', err);
      }
    };
    fetchData();
  }, [refreshKey]);

  const handleSuccess = () => {
    setSelectedPatient(null);
    setActiveTab('list');
    setRefreshKey(prev => prev + 1);
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setActiveTab('edit');
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Patient Management</div>
      <div className={styles.paper}>
        <div className={styles.tabsWrapper}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${['form', 'edit'].includes(activeTab) ? styles.active : ''}`}
              onClick={() => {
                setActiveTab('form');
                setSelectedPatient(null);
              }}
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

        <div className={styles.tabContent}>
          {(activeTab === 'form' || activeTab === 'edit') && (
            <PatientForm
              patient={selectedPatient}
              onSuccess={handleSuccess}
            />
          )}

          {activeTab === 'list' && (
            <PatientList
              key={refreshKey}
              patients={patients}
              onEdit={handleEdit}
            />
          )}
        </div>
      </div>
    </div>
  );
}