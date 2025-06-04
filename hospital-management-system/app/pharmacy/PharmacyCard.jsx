

// pharmacy/PharmacyCard.jsx
// Prescription card component

import React from 'react';
import styles from './PharmacyCard.module.css';

const PharmacyCard = ({ prescription }) => {
  return (
    <div className={styles.card}>
      <h3>{prescription.patient.name}</h3>
      <p>Prescription ID: {prescription.id}</p>
      <p>Medications: {prescription.items.map(item => item.medication.name).join(', ')}</p>
      <p>Status: {prescription.status}</p>
      <p>Date: {new Date(prescription.prescriptionDate).toLocaleDateString()}</p>
    </div>
  );
};

export default PharmacyCard;