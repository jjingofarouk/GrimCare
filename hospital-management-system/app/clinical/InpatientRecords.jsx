"use client";

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import ClinicalCard from './ClinicalCard';
import ClinicalForm from './ClinicalForm';
import SearchBar from '../components/SearchBar';
import { getClinicalRecords, createClinicalRecord } from './clinicalService';
import styles from './ClinicalRecords.module.css';

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
    <Container maxWidth="xl" className={styles.container}>
      <Typography variant="h5" className={styles.title}>
        Inpatient Records
      </Typography>
      <ClinicalForm patients={patients} onSuccess={handleSuccess} patientType="inpatient" />
      <SearchBar onSubmit={handleSearch} />
      {error && (
        <Typography color="error" className={styles.error}>
          {error}
        </Typography>
      )}
      <Box className={styles.list}>
        {filteredRecords.map((record) => (
          <ClinicalCard key={record.id} record={record} />
        ))}
      </Box>
    </Container>
  );
}