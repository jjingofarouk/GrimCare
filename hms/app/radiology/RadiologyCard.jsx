// radiology/RadiologyCard.jsx
'use client';
import React from 'react';
import styles from './RadiologyCard.module.css';

const RadiologyCard = ({ scan }) => {
  return (
    <div className={styles.card}>
      <h3>{scan.patientName}</h3>
      <p>Scan ID: {scan.scanId}</p>
      <p>Type: {scan.scanType}</p>
      <p>Status: {scan.status}</p>
      <p>Date: {new Date(scan.date).toLocaleDateString()}</p>
    </div>
  );
};

export default RadiologyCard;
