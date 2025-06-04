import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem, Autocomplete } from '@mui/material';
import { dispenseMedication, getPrescriptions, getInventory, getPharmacists } from './pharmacyService';
import styles from './PharmacyDispensing.module.css';

const PharmacyDispensing = () => {
  const [dispensingData, setDispensingData] = useState({
    prescriptionId: '',
    medicationId: '',
    quantity: 0,
    patientType: 'OUTPATIENT',
    pharmacistId: '',
  });
  const [prescriptions, setPrescriptions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [pharmacists, setPharmacists] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prescriptionData, medicationData, pharmacistData] = await Promise.all([
          getPrescriptions(),
          getInventory(),
          getPharmacists(),
        ]);
        setPrescriptions(prescriptionData.filter(p => p.status === 'PENDING'));
        setMedications(medicationData);
        setPharmacists(pharmacistData);
        if (prescriptionData.length > 0) {
          setDispensingData(prev => ({ ...prev, prescriptionId: prescriptionData[0].id }));
        }
        if (medicationData.length > 0) {
          setDispensingData(prev => ({ ...prev, medicationId: medicationData[0].id }));
        }
        if (pharmacistData.length > 0) {
          setDispensingData(prev => ({ ...prev, pharmacistId: pharmacistData[0].id }));
        }
      } catch (err) {
        setError('Failed to fetch data: ' + err.message);
      }
    };
    fetchData();
  }, []);

  const handleDispense = async () => {
    try {
      if (
        !dispensingData.prescriptionId ||
        !dispensingData.medicationId ||
        !dispensingData.quantity ||
        !dispensingData.pharmacistId
      ) {
        setError('All fields are required');
        return;
      }

      const payload = {
        prescriptionId: parseInt(dispensingData.prescriptionId),
        medicationId: parseInt(dispensingData.medicationId),
        quantity: parseInt(dispensingData.quantity),
        patientType: dispensingData.patientType,
        pharmacistId: parseInt(dispensingData.pharmacistId),
      };

      await dispenseMedication(payload);
      setDispensingData({
        prescriptionId: prescriptions.length > 0 ? prescriptions[0].id : '',
        medicationId: medications.length > 0 ? medications[0].id : '',
        quantity: 0,
        patientType: 'OUTPATIENT',
        pharmacistId: pharmacists.length > 0 ? pharmacists[0].id : '',
      });
      setError(null);
    } catch (err) {
      setError('Failed to dispense medication: ' + err.message);
    }
  };

  const handleChange = (name, value) => {
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
        <Autocomplete
          options={prescriptions}
          getOptionLabel={(option) => `ID: ${option.id} - Patient: ${option.patient?.user?.name || 'Unknown'}`}
          onChange={(e, value) => handleChange('prescriptionId', value ? value.id : '')}
          renderInput={(params) => (
            <TextField {...params} label="Select Prescription" fullWidth margin="normal" />
          )}
          fullWidth
        />
        <Autocomplete
          options={medications}
          getOptionLabel={(option) => `${option.name} (Stock: ${option.stockQuantity})`}
          onChange={(e, value) => handleChange('medicationId', value ? value.id : '')}
          renderInput={(params) => (
            <TextField {...params} label="Select Medication" fullWidth margin="normal" />
          )}
          fullWidth
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={dispensingData.quantity}
          onChange={(e) => handleChange('quantity', e.target.value)}
          fullWidth
          margin="normal"
        />
        <Select
          name="patientType"
          value={dispensingData.patientType}
          onChange={(e) => handleChange('patientType', e.target.value)}
          fullWidth
          margin="normal"
        >
          <MenuItem value="INPATIENT">Inpatient</MenuItem>
          <MenuItem value="OUTPATIENT">Outpatient</MenuItem>
        </Select>
        <Autocomplete
          options={pharmacists}
          getOptionLabel={(option) => `${option.user.name} (License: ${option.licenseNumber})`}
          onChange={(e, value) => handleChange('pharmacistId', value ? value.id : '')}
          renderInput={(params) => (
            <TextField {...params} label="Select Pharmacist" fullWidth margin="normal" />
          )}
          fullWidth
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