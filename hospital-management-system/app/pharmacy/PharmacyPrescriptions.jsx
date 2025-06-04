import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem, Autocomplete } from '@mui/material';
import PharmacyCard from './PharmacyCard';
import { getPrescriptions, createPrescription, updatePrescriptionStatus, checkDrugInteractions, getPharmacists } from './pharmacyService';
import styles from './PharmacyPrescriptions.module.css';

const PharmacyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [newPrescription, setNewPrescription] = useState({
    patientId: '',
    doctorId: '',
    pharmacistId: '',
    items: [],
  });
  const [interactions, setInteractions] = useState([]);
  const [pharmacists, setPharmacists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prescriptionData, pharmacistData] = await Promise.all([
          getPrescriptions(),
          getPharmacists(),
        ]);
        setPrescriptions(prescriptionData);
        setPharmacists(pharmacistData);
        if (pharmacistData.length > 0) {
          setNewPrescription(prev => ({ ...prev, pharmacistId: pharmacistData[0].id }));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const handleAddPrescription = async () => {
    const prescription = await createPrescription(newPrescription);
    setPrescriptions([...prescriptions, prescription]);
    setNewPrescription({ patientId: '', doctorId: '', pharmacistId: pharmacists.length > 0 ? pharmacists[0].id : '', items: [] });
    
    const medicationIds = newPrescription.items.map(item => item.medicationId);
    const interactionData = await checkDrugInteractions(medicationIds);
    setInteractions(interactionData);
  };

  const handleChange = (name, value) => {
    setNewPrescription(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Prescription Management</Typography>
      <Box className={styles.form}>
        <TextField
          label="Patient ID"
          value={newPrescription.patientId}
          onChange={(e) => handleChange('patientId', e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Doctor ID"
          value={newPrescription.doctorId}
          onChange={(e) => handleChange('doctorId', e.target.value)}
          fullWidth
          margin="normal"
        />
        <Autocomplete
          options={pharmacists}
          getOptionLabel={(option) => `${option.user.name} (License: ${option.licenseNumber})`}
          onChange={(e,

 value) => handleChange('pharmacistId', value ? value.id : '')}
          renderInput={(params) => (
            <TextField {...params} label="Select Pharmacist" fullWidth margin="normal" />
          )}
          fullWidth
        />
        <Button variant="contained" onClick={handleAddPrescription} sx={{ mt: 2 }}>
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