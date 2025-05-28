
// clinical/ClinicalPage.jsx
'use client';
import React, { useState, useEffect } from 'react';
import OutPatientRecords from './OutPatientRecords';
import InpatientRecords from './InpatientRecords';
import EmergencyRecords from './EmergencyRecords';
import { getPatients } from '../patient/patientService';
import styles from './ClinicalPage.module.css';

export default function ClinicalPage() {
  const [patients, setPatients] = useState([]);
  const [activeTab, setActiveTab] = useState('outpatient');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        console.error('Failed to fetch patients');
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'outpatient' ? styles.active : ''}`}
            onClick={() => setActiveTab('outpatient')}
          >
            Outpatient
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'inpatient' ? styles.active : ''}`}
            onClick={() => setActiveTab('inpatient')}
          >
            Inpatient
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'emergency' ? styles.active : ''}`}
            onClick={() => setActiveTab('emergency')}
          >
            ER
          </button>
        </div>
      </div>
      <div className={styles.content}>
        {activeTab === 'outpatient' && <OutpatientRecords patients={patients} />}
        {activeTab === 'inpatient' && <InpatientRecords patients={patients} />}
        {activeTab === 'emergency' && <EmergencyRecords patients={patients} />}
      </div>
    </div>
  );
}
