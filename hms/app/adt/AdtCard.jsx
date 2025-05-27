import React from 'react';
import styles from './AdtCard.module.css';

export default function AdtCard({ admission }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{admission.patientName}</h3>
        <span className={`${styles.status} ${admission.status === 'ADMITTED' ? styles.admitted : styles.discharged}`}>
          {admission.status}
        </span>
      </div>
      <div className={styles.body}>
        <p><strong>Admission ID:</strong> {admission.id}</p>
        <p><strong>Ward:</strong> {admission.ward}</p>
        <p><strong>Admission Date:</strong> {new Date(admission.admissionDate).toLocaleDateString()}</p>
        <p><strong>Doctor:</strong> {admission.doctor}</p>
      </div>
      <div className={styles.footer}>
        <button className={styles.button}>View Details</button>
      </div>
    </div>
  );
}