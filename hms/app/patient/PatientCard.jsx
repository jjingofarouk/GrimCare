// patient/PatientCard.jsx
'use client';
import React from 'react';
import styles from './PatientCard.module.css';

const PatientCard = ({ patient }) => {
  return (
    <div className={styles.card}>
      <h3>{patient.name}</h3>
      <p>Patient ID: {patient.patientId}</p>
      <p>Age: {patient.age}</p>
      <p>Gender: {patient.gender}</p>
      <p>
        Registration Date:{' '}
        {new Date(patient.registrationDate).toLocaleDateString()}
      </p>
    </div>
  );
};

export default PatientCard;
