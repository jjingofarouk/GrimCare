'use client';
import React, { useState, useEffect } from 'react';
import styles from './ClinicalList.module.css';
import ClinicalCard from './ClinicalCard';
import { getClinicalRecords } from './clinicalService';

export default function ClinicalList() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

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

  const filteredRecords = records.filter(record => 
    filter === 'all' ? true : record.patientType === filter
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Clinical Records</h2>
      <div className={styles.filterContainer}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.filter}
        >
          <option value="all">All Records</option>
          <option value="outpatient">Outpatient</option>
          <option value="inpatient">Inpatient</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {filteredRecords.map((record) => (
          <ClinicalCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}
