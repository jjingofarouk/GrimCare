'use client';
import React, { useState, useEffect } from 'react';
import styles from './ClinicalList.module.css';
import ClinicalCard from './ClinicalCard';
import { getClinicalRecords } from './clinicalService';

export default function ClinicalList() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getClinicalRecords();
        setRecords(data);
      } catch (err) {
        setError('Failed to fetch clinical records');
      }
    };
    fetchRecords();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Clinical Records</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {records.map((record) => (
          <ClinicalCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}
