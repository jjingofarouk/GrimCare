import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Autocomplete } from '@mui/material';
import PharmacyCard from './PharmacyCard';
import { getPrescriptions, createPrescription, checkDrugInteractions, getDoctors, getPatients } from './pharmacyService';
import styles from './PharmacyPrescriptions.module.css';

const PharmacyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [newPrescription, setNewPrescription] = useState({
    patientId: '',
    doctorId: '',
    items: [],
  });
  const [interactions, setInteractions] = useState([]);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [patientSearch, setPatientSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [prescriptionData, doctorData, patientData] = await Promise.all([
        getPrescriptions(),
        getDoctors(),
        getPatients(),
      ]);
      setPrescriptions(prescriptionData);
      setDoctors(doctorData.map(d => ({
        id: d.id,
        name: d.user?.name || 'N/A',
        doctorId: d.doctorId || 'N/A',
        email: d.user?.email || 'N/A',
      })));
      setPatients(patientData.map(p => ({
        id: p.id,
        name: p.user?.name || 'N/A',
        patientId: p.patientId || 'N/A',
        email: p.user?.email || 'N/A',
      })));
    };
    fetchData();
  }, []);

  const handleAddPrescription = async () => {
    const prescription = await createPrescription(newPrescription);
    setPrescriptions([...prescriptions, prescription]);
    setNewPrescription({ patientId: '', doctorId: '', items: [] });
    setDoctorSearch('');
    setPatientSearch('');
    const medicationIds = newPrescription.items.map(item => item.medicationId);
    const interactionData = await checkDrugInteractions(medicationIds);
    setInteractions(interactionData);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    doctor.email.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    doctor.doctorId.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    patient.email.toLowerCase().includes(patientSearch.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(patientSearch.toLowerCase())
  );

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Prescription Management</Typography>
      <Box className={styles.form}>
        <Autocomplete
          options={filteredDoctors}
          getOptionLabel={(option) => `${option.name} (${option.doctorId})`}
          onChange={(e, value) => setNewPrescription({ ...newPrescription, doctorId: value?.id || '' })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Doctor"
              value={doctorSearch}
              onChange={(e) => setDoctorSearch(e.target.value)}
            />
          )}
          sx={{ width: 250, mr: 2 }}
        />
        <Autocomplete
          options={filteredPatients}
          getOptionLabel={(option) => `${option.name} (${option.patientId})`}
          onChange={(e, value) => setNewPrescription({ ...newPrescription, patientId: value?.id || '' })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Patient"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
            />
          )}
          sx={{ width: 250, mr: 2 }}
        />
        <Button variant="contained" onClick={handleAddPrescription}>
          Create Prescription
        </Button>
      </Box>
      <Box className={styles.list}>
        {prescriptions.map((prescription) => (
          <PharmacyCard key={prescription.id} prescription={prescription} />
        ))}
      </Box>
    </Box>
  );
};

export default PharmacyPrescriptions;