// medical-records/MedicalRecordsCard.jsx
'use client';
import React from 'react';
import styles from './MedicalRecordsCard.module.css';

const MedicalRecordsCard = ({ record }) => {
  return (
    <div className={styles.card}>
      <h3>{record.patientName}</h3>
      <p>Record ID: {record.recordId}</p>
      <p>Diagnosis: {record.diagnosis}</p>
      <p>Date: {new Date(record.date).toLocaleDateString()}</p>
      <p>Doctor: {record.doctorName}</p>
    </div>
  );
};

export default MedicalRecordsCard;
