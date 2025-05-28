
// patient/PatientList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './PatientList.module.css';
import PatientCard from './PatientCard';
import SearchBar from '../SearchBar';
import { getPatients } from './patientService';

const PatientList = ({ onEdit, onViewHistory, searchQuery }) => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        setError('Failed to fetch patients');
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(
    (patient) =>
      !searchQuery ||
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Patient List</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {filteredPatients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onEdit={onEdit}
            onViewHistory={onViewHistory}
          />
        ))}
      </div>
    </div>
  );
};

export default PatientList;
