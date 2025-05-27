// medical-records/MedicalRecordsList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './MedicalRecordsList.module.css';
import { getMedicalRecords } from './medicalRecordsService';
import MedicalRecordsCard from './MedicalRecordsCard';

const MedicalRecordsList = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getMedicalRecords();
        setRecords(data);
      } catch (error) {
        console.error('Error fetching medical records:', error);
      }
    };
    fetchRecords();
  }, []);

  return (
    <div className={styles.list}>
      {records.map((record) => (
        <MedicalRecordsCard key={record.id} record={record} />
      ))}
    </div>
  );
};

export default MedicalRecordsList;
