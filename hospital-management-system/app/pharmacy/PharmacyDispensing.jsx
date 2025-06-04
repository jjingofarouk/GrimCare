// pharmacy/PharmacyDispensing.jsx
// Medication dispensing for inpatients and outpatients

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem } from '@mui/material';
import { dispenseMedication } from './pharmacyService';
import styles from './PharmacyDispensing.module.css';

const PharmacyDispensing = () => {
  const [dispensingData, setDispensingData] = useState({
    prescriptionId: '',
    medicationId: '',
    quantity: 0,
    patientType: 'OUTPATIENT',
    dispensedById: '',
  });

  const handleDispense = async () => {
    await dispenseMedication(dispensingData);
    setDispensingData({
      prescriptionId: '',
      medicationId: '',
      quantity: 0,
      patientType: 'OUTPATIENT',
      dispensedById: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDispensingData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Dispense Medication</Typography>
      <Box className={styles.form}>
        <TextField
          label="Prescription ID"
          name="prescriptionId"
          value={dispensingData.prescriptionId}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Medication ID"
          name="medicationId"
          value={dispensingData.medicationId}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={dispensingData.quantity}
          onChange={handleChange}
          fullWidth
        />
        <Select
          name="patientType"
          value={dispensingData.patientType}
          onChange={handleChange}
          fullWidth
        >
          <MenuItem value="INPATIENT">Inpatient</MenuItem>
          <MenuItem value="OUTPATIENT">Outpatient</MenuItem>
        </Select>
        <TextField
          label="Dispensed By ID"
          name="dispensedById"
          value={dispensingData.dispensedById}
          onChange={handleChange}
          fullWidth
        />
        <Button variant="contained" onClick={handleDispense}>
          Dispense
        </Button>
      </Box>
    </Box>
  );
};

export default PharmacyDispensing;