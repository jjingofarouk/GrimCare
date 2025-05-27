// laboratory/LaboratoryCard.jsx
import React from 'react';
import styles from './LaboratoryCard.module.css';

const LaboratoryCard = ({ test }) => {
  return (
    <div className={styles.card}>
      <h3>{test.testName}</h3>
      <p>Test ID: {test.testId}</p>
      <p>Patient: {test.patientName}</p>
      <p>Status: {test.status}</p>
      <p>Date: {new Date(test.testDate).toLocaleDateString()}</p>
    </div>
  );
};

export default LaboratoryCard;
