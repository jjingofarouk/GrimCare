
// clinical/ClinicalPage.jsx
'use client';
import React, { useState, useEffect } from 'react';
import ClinicalList from './ClinicalList';
import ClinicalForm from './ClinicalForm';
import { getPatients } from '../patient/patientService';

export default function ClinicalPage() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        console.error('Failed to fetch patients');
      }
    };
    fetchPatients();
  }, []);

  const handleSuccess = () => {
    console.log('Clinical record created');
    // Trigger refresh of clinical list
    window.dispatchEvent(new Event('refreshClinicalList'));
  };

  return (
    <div>
      <ClinicalForm patients={patients} onSuccess={handleSuccess} />
      <ClinicalList />
    </div>
  );
}
