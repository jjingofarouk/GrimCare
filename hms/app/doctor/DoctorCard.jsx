'use client';
import React from 'react';
import styles from './DoctorCard.module.css';

export default function DoctorCard({ doctor }) {
  const { id, name, specialty, phone } = doctor;

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Doctor #{id}</h3>
      <p>
        <strong>Name:</strong> {name}
      </p>
      <p>
        <strong>Specialty:</strong> {specialty}
      </p>
      <p>
        <strong>Phone:</strong> {phone || 'N/A'}
      </p>
    </div>
  );
}
