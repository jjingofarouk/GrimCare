// pharmacy/PharmacyCard.jsx
'use client';
import React from 'react';
import styles from './PharmacyCard.module.css';

const PharmacyCard = ({ prescription }) => {
  return (
    <div className={styles.card}>
      <h3>{prescription.patientName}</h3>
      <p>Prescription ID: {prescription.prescriptionId}</p>
      <p>Medication: {prescription.medication}</p>
      <p>Status: {prescription.status}</p>
      <p>Date: {new Date(prescription.date).toLocaleDateString()}</p>
    </div>
  );
};

export default PharmacyCard;
