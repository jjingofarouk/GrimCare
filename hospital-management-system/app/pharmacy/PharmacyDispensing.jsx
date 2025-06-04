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
  const [error, setError] = useState(null);

  const handleDispense = async () => {
    try {
      // Validate inputs
      if (
        !dispensingData.prescriptionId ||
        !dispensingData.medicationId ||
        !dispensingData.quantity ||
        !dispensingData.dispensedById
      ) {
        setError('All fields are required');
        return;
      }

      // Convert string IDs and quantity to integers
      const payload = {
        prescriptionId: parseInt(dispensingData.prescriptionId),
        medicationId: parseInt(dispensingData.medicationId),
        quantity: parseInt(dispensingData.quantity),
        patientType: dispensingData.patientType,
        dispensedById: parseInt(dispensingData.dispensedById),
      };

      await dispenseMedication(payload);
      setDispensingData({
        prescriptionId: '',
        medicationId: '',
        quantity: 0,
        patientType: 'OUTPATIENT',
        dispensedById: '',
      });
      setError(null);
    } catch (err) {
      setError('Failed to dispense medication: ' + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDispensingData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Dispense Medication</Typography>
      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      <Box className={styles.form}>
        <TextField
          label="Prescription ID"
          name="prescriptionId"
          value={dispensingData.prescriptionId}
          onChange={handleChange}
          fullWidth
          type="number"
          margin="normal"
        />
        <TextField
          label="Medication ID"
          name="medicationId"
          value={dispensingData.medicationId}
          onChange={handleChange}
          fullWidth
          type="number"
          margin="normal"
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={dispensingData.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Select
          name="patientType"
          value={dispensingData.patientType}
          onChange={handleChange}
          fullWidth
          margin="normal"
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
          type="number"
          margin="normal"
        />
        <Button
          variant="contained"
          onClick={handleDispense}
          sx={{ mt: 2 }}
        >
          Dispense
        </Button>
      </Box>
    </Box>
  );
};

export default PharmacyDispensing;