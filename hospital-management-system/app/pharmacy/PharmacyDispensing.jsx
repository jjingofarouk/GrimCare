
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem } from '@mui/material';
import { dispenseMedication, getPrescriptions, getInventory, getUsers } from './pharmacyService';
import styles from './PharmacyDispensing.module.css';

const PharmacyDispensing = () => {
  const [dispensingData, setDispensingData] = useState({
    prescriptionId: '',
    medicationId: '',
    quantity: 0,
    patientType: 'OUTPATIENT',
    dispensedById: '',
  });
  const [prescriptions, setPrescriptions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prescriptionData, medicationData, userData] = await Promise.all([
          getPrescriptions(),
          getInventory(),
          getUsers(),
        ]);
        setPrescriptions(prescriptionData.filter(p => p.status === 'PENDING'));
        setMedications(medicationData);
        setUsers(userData.filter(u => u.role === 'PHARMACIST' || u.role === 'ADMIN'));
        if (prescriptionData.length > 0) {
          setDispensingData(prev => ({ ...prev, prescriptionId: prescriptionData[0].id }));
        }
        if (medicationData.length > 0) {
          setDispensingData(prev => ({ ...prev, medicationId: medicationData[0].id }));
        }
        if (userData.length > 0) {
          setDispensingData(prev => ({ ...prev, dispensedById: userData[0].id }));
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
        !dispensingData.dispensedById
      ) {
        setError('All fields are required');
        return;
      }

      const payload = {
        prescriptionId: parseInt(dispensingData.prescriptionId),
        medicationId: parseInt(dispensingData.medicationId),
        quantity: parseInt(dispensingData.quantity),
        patientType: dispensingData.patientType,
        dispensedById: parseInt(dispensingData.dispensedById),
      };

      await dispenseMedication(payload);
      setDispensingData({
        prescriptionId: prescriptions.length > 0 ? prescriptions[0].id : '',
        medicationId: medications.length > 0 ? medications[0].id : '',
        quantity: 0,
        patientType: 'OUTPATIENT',
        dispensedById: users.length > 0 ? users[0].id : '',
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
        <Select
          name="prescriptionId"
          value={dispensingData.prescriptionId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          displayEmpty
        >
          <MenuItem value="" disabled>Select Prescription</MenuItem>
          {prescriptions.map(prescription => (
            <MenuItem key={prescription.id} value={prescription.id}>
              {`ID: ${prescription.id} - Patient: ${prescription.patient?.user?.name || 'Unknown'}`}
            </MenuItem>
          ))}
        </Select>
        <Select
          name="medicationId"
          value={dispensingData.medicationId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          displayEmpty
        >
          <MenuItem value="" disabled>Select Medication</MenuItem>
          {medications.map(medication => (
            <MenuItem key={medication.id} value={medication.id}>
              {`${medication.name} (Stock: ${medication.stockQuantity})`}
            </MenuItem>
          ))}
        </Select>
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
        <Select
          name="dispensedById"
          value={dispensingData.dispensedById}
          onChange={handleChange}
          fullWidth
          margin="normal"
          displayEmpty
        >
          <MenuItem value="" disabled>Select Pharmacist</MenuItem>
          {users.map(user => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
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