// clinical/InpatientRecords.jsx
'use client';
import React, { useState, useEffect } from 'react';
import styles from './ClinicalRecords.module.css';
import ClinicalCard from './ClinicalCard';
import ClinicalForm from './ClinicalForm';
import SearchBar from '../components/SearchBar';
import { getClinicalRecords, createClinicalRecord } from './clinicalService';

export default function InpatientRecords({ patients }) {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getClinicalRecords();
        const inpatientRecords = data.filter((record) => record.patientType === 'inpatient');
        setRecords(inpatientRecords);
        setFilteredRecords(inpatientRecords);
      } catch (err) {
        setError('Failed to fetch inpatient records');
      }
    };
    fetchRecords();

    const handleRefresh = () => fetchRecords();
    window.addEventListener('refreshInpatientRecords', handleRefresh);
    return () => window.removeEventListener('refreshInpatientRecords', handleRefresh);
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

  const handleSuccess = async (formData) => {
    try {
      await createClinicalRecord({ ...formData, patientType: 'inpatient' });
      window.dispatchEvent(new Event('refreshInpatientRecords'));
    } catch (err) {
      setError('Failed to create inpatient record');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Inpatient Records</h2>
      <ClinicalForm patients={patients} onSuccess={handleSuccess} patientType="inpatient" />
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
