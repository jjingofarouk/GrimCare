// clinical/OutpatientRecords.jsx
'use client';
import React, { useState, useEffect } from 'react';
import styles from './ClinicalRecords.module.css';
import ClinicalCard from './ClinicalCard';
import ClinicalForm from './ClinicalForm';
import SearchBar from '../components/SearchBar';
import { getClinicalRecords, createClinicalRecord } from './clinicalService';

export default function OutpatientRecords({ patients }) {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getClinicalRecords();
        const outpatientRecords = data.filter((record) => record.patientType === 'outpatient');
        setRecords(outpatientRecords);
        setFilteredRecords(outpatientRecords);
      } catch (err) {
        setError('Failed to fetch outpatient records');
      }
    };
    fetchRecords();

    const handleRefresh = () => fetchRecords();
    window.addEventListener('refreshOutpatientRecords', handleRefresh);
    return () => window.removeEventListener('refreshOutpatientRecords', handleRefresh);
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
        record.diagnosis.toLowerCase().includes(lowerQuery)
    );
    setFilteredRecords(filtered);
  };

  const handleSuccess = async (formData) => {
    try {
      await createClinicalRecord({ ...formData, patientType: 'outpatient' });
      window.dispatchEvent(new Event('refreshOutpatientRecords'));
    } catch (err) {
      setError('Failed to create outpatient record');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Outpatient Records</h2>
      <ClinicalForm patients={patients} onSuccess={handleSuccess} patientType="outpatient" />
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
