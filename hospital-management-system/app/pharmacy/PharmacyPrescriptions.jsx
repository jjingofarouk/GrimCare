// pharmacy/PharmacyPrescriptions.jsx
// Prescription management with drug interaction checker iframe

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem } from '@mui/material';
import PharmacyCard from './PharmacyCard';
import { getPrescriptions, createPrescription, updatePrescriptionStatus, checkDrugInteractions } from './pharmacyService';
import styles from './PharmacyPrescriptions.module.css';

const PharmacyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [newPrescription, setNewPrescription] = useState({
    patientId: '',
    doctorId: '',
    items: [],
  });
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    const data = await getPrescriptions();
    setPrescriptions(data);
  };

  const handleAddPrescription = async () => {
    const prescription = await createPrescription(newPrescription);
    setPrescriptions([...prescriptions, prescription]);
    setNewPrescription({ patientId: '', doctorId: '', items: [] });
    
    const medicationIds = newPrescription.items.map(item => item.medicationId);
    const interactionData = await checkDrugInteractions(medicationIds);
    setInteractions(interactionData);
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Prescription Management</Typography>
      <Box className={styles.form}>
        <TextField
          label="Patient ID"
          value={newPrescription.patientId}
          onChange={(e) => setNewPrescription({ ...newPrescription, patientId: e.target.value })}
        />
        <TextField
          label="Doctor ID"
          value={newPrescription.doctorId}
          onChange={(e) => setNewPrescription({ ...newPrescription, doctorId: e.target.value })}
        />
        <Button variant="contained" onClick={handleAddPrescription}>
          Create Prescription
        </Button>
      </Box>
      <iframe
        src="https://mediq.vercel.app/"
        title="Drug Interaction Checker"
        width="100%"
        height="400px"
        style={{ border: 'none', marginTop: '20px' }}
      />
      <Box className={styles.list}>
        {prescriptions.map((prescription) => (
          <PharmacyCard key={prescription.id} prescription={prescription} />
        ))}
      </Box>
    </Box>
  );
};

export default PharmacyPrescriptions;