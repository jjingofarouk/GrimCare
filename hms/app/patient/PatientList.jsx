// patient/PatientList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './PatientList.module.css';
import { getPatients } from './patientService';
import PatientCard from './PatientCard';

const PatientList = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className={styles.list}>
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
    </div>
  );
};

export default PatientList;
