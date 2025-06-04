"use client";

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import ClinicalCard from './ClinicalCard';
import ClinicalForm from './ClinicalForm';
import SearchBar from '../components/SearchBar';
import { getClinicalRecords, createClinicalRecord } from './clinicalService';
import styles from './ClinicalRecords.module.css';

export default function EmergencyRecords({ patients }) {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getClinicalRecords();
        const emergencyRecords = data.filter((record) => record.patientType === 'emergency');
        setRecords(emergencyRecords);
        setFilteredRecords(emergencyRecords);
      } catch (err) {
        setError('Failed to fetch emergency records');
      }
    };
    fetchRecords();

    const handleRefresh = () => fetchRecords();
    window.addEventListener('refreshEmergencyRecords', handleRefresh);
    return () => window.removeEventListener('refreshEmergencyRecords', handleRefresh);
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
        record.diagnosis.toLowerCase().includes(lowerQuery) ||
        record.triageStatus?.toLowerCase().includes(lowerQuery)
    );
    setFilteredRecords(filtered);
  };

  const handleSuccess = async (formData) => {
    try {
      await createClinicalRecord({ ...formData, patientType: 'emergency' });
      window.dispatchEvent(new Event('refreshEmergencyRecords'));
    } catch (err) {
      setError('Failed to create emergency record');
    }
  };

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Typography variant="h5" className={styles.title}>
        ER Records
      </Typography>
      <ClinicalForm patients={patients} onSuccess={handleSuccess} patientType="emergency" />
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