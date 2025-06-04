import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem, Autocomplete, Alert } from '@mui/material';
import { dispenseMedication, getUsers, getInventory } from './pharmacyService';
import styles from './PharmacyDispensing.module.css';

const PharmacyDispensing = () => {
  const [dispensingData, setDispensingData] = useState({
    prescriptionId: '',
    medicationId: '',
    quantity: '',
    patientType: 'OUTPATIENT',
    dispensedBy: 'Default Pharmacist', // Hardcoded pharmacist name
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medications, setMedications] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, medicationData] = await Promise.all([
          getUsers(),
          getInventory(),
        ]);
        setPatients(userData.filter(u => u.role === 'PATIENT'));
        setDoctors(userData.filter(u => u.role === 'DOCTOR'));
        setMedications(medicationData);
      } catch (err) {
        setError('Failed to fetch data: ' + err.message);
      }
    };
    fetchData();
  }, []);

  const validateDispense = () => {
    if (!dispensingData.prescriptionId || !dispensingData.medicationId || !dispensingData.quantity) {
      setError('Prescription ID, Medication, and Quantity are required');
      return false;
    }
    if (isNaN(parseInt(dispensingData.quantity)) || parseInt(dispensingData.quantity) <= 0) {
      setError('Quantity must be a positive number');
      return false;
    }
    return true;
  };

  const handleDispense = async () => {
    if (!validateDispense()) return;
    try {
      const payload = {
        prescriptionId: parseInt(dispensingData.prescriptionId),
        medicationId: parseInt(dispensingData.medicationId),
        quantity: parseInt(dispensingData.quantity),
        patientType: dispensingData.patientType,
        dispensedById: 1, // Hardcoded pharmacist ID
      };
      await dispenseMedication(payload);
      setDispensingData({
        prescriptionId: '',
        medicationId: '',
        quantity: '',
        patientType: 'OUTPATIENT',
        dispensedBy: 'Default Pharmacist',
      });
      setSuccess('Medication dispensed successfully');
      setError(null);
    } catch (err) {
      setError('Failed to dispense medication: ' + err.message);
      setSuccess(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDispensingData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Dispense Medication</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Box className={styles.form}>
        <TextField
          label="Prescription ID"
          name="prescriptionId"
          value={dispensingData.prescriptionId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Autocomplete
          options={medications}
          getOptionLabel={(option) => `${option.name} (Generic: ${option.genericName || 'N/A'}, Category: ${option.category}, Stock: ${option.stockQuantity})`}
          onChange={(e, value) => {
            setDispensingData(prev => ({
              ...prev,
              medicationId: value ? value.id.toString() : '',
            }));
            setError(null);
            setSuccess(null);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Medication"
              margin="normal"
              fullWidth
              required
            />
          )}
          value={medications.find(m => m.id.toString() === dispensingData.medicationId) || null}
          renderOption={(props, option) => (
            <li {...props}>{`${option.name} (Generic: ${option.genericName || 'N/A'}, Category: ${option.category}, Stock: ${option.stockQuantity})`}</li>
          )}
        />
        <TextField
          label="Medication ID"
          name="medicationId"
          value={dispensingData.medicationId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={dispensingData.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
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
          label="Dispensed By"
          value={dispensingData.dispensedBy}
          fullWidth
          margin="normal"
          disabled
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