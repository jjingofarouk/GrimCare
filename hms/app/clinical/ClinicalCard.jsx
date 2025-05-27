'use client';
import React from 'react';
import styles from './ClinicalCard.module.css';

export default function ClinicalCard({ record }) {
  const { id, patient, diagnosis, treatment, createdAt } = record;
  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Clinical Record #{id}</h3>
      <p>
        <strong>Patient:</strong> {patient.name}
      </p>
      <p>
        <strong>Diagnosis:</strong> {diagnosis}
      </p>
      <p>
        <strong>Treatment:</strong> {treatment}
      </p>
      <p>
        <strong>Created:</strong> {formattedDate}
      </p>
    </div>
  );
}
