
// clinical/ClinicalList.jsx
'use client';
import React, { useState, useEffect } from 'react';
import styles from './ClinicalList.module.css';
import ClinicalCard from './ClinicalCard';
import { getClinicalRecords } from './clinicalService';
import SearchBar from '../components/SearchBar';

export default function ClinicalList() {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getClinicalRecords();
        setRecords(data);
        setFilteredRecords(data);
      } catch (err) {
        setError('Failed to fetch clinical records');
      }
    };
    fetchRecords();
  }, []);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredRecords(records);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = records.filter(
      (record) =>
        record.patient.name.toLowerCase().includes(lowerQuery) ||
        record.ipNumber?.toLowerCase().includes(lowerQuery) ||
        record.diagnosis.toLowerCase().includes(lowerQuery)
    );
    setFilteredRecords(filtered);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Clinical Records</h2>
      <SearchBar onSubmit={handleSearch} />
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {filteredRecords.map((record) => (
          <ClinicalCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}
