import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Select, FormControlLabel, Checkbox, Alert, Autocomplete } from '@mui/material';
import { addMedication, getSuppliers, getFormularies, getUsers, createPrescription } from './pharmacyService';
import styles from './PharmacyForm.module.css';

const PharmacyForm = () => {
  const [medicationData, setMedicationData] = useState({
    name: '',
    genericName: '',
    category: '',
    batchNumber: '',
    barcode: '',
    rfid: '',
    stockQuantity: '',
    minStockThreshold: 10,
    price: '',
    expiryDate: '',
    supplierId: '',
    formularyId: '',
    narcotic: false,
  });
  const [prescriptionData, setPrescriptionData] = useState({
    patientId: '',
    doctorId: '',
    notes: '',
    items: [{ medicationId: '', quantity: '', dosage: '' }],
  });
  const [suppliers, setSuppliers] = useState([]);
  const [formularies, setFormularies] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medications, setMedications] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [supplierData, formularyData, userData, medicationData] = await Promise.all([
          getSuppliers(),
          getFormularies(),
          getUsers(),
          getInventory(),
        ]);
        setSuppliers(supplierData);
        setFormularies(formularyData);
        setPatients(userData.filter(u => u.role === 'PATIENT'));
        setDoctors(userData.filter(u => u.role === 'DOCTOR'));
        setMedications(medicationData);
      } catch (err) {
        setError('Failed to fetch data: ' + err.message);
      }
    };
    fetchData();
  }, []);

  const validateMedication = () => {
    const requiredFields = ['name', 'category', 'batchNumber', 'stockQuantity', 'price', 'expiryDate'];
    for (const field of requiredFields) {
      if (!medicationData[field]) {
        setError(`Missing required field in medication form: ${field}`);
        return false;
      }
    }
    if (isNaN(parseInt(medicationData.stockQuantity)) || parseInt(medicationData.stockQuantity) < 0) {
      setError('Stock Quantity must be a non-negative number');
      return false;
    }
    if (isNaN(parseFloat(medicationData.price)) || parseFloat(medicationData.price) < 0) {
      setError('Price must be a non-negative number');
      return false;
    }
    if (new Date(medicationData.expiryDate) <= new Date()) {
      setError('Expiry Date must be in the future');
      return false;
    }
    return true;
  };

  const validatePrescription = () => {
    if (!prescriptionData.patientId || !prescriptionData.doctorId) {
      setError('Patient and Doctor are required for prescription');
      return false;
    }
    if (!prescriptionData.items.length || prescriptionData.items.some(item => !item.medicationId || !item.quantity || !item.dosage)) {
      setError('At least one valid prescription item with medication, quantity, and dosage is required');
      return false;
    }
    if (prescriptionData.items.some(item => isNaN(parseInt(item.quantity)) || parseInt(item.quantity) <= 0)) {
      setError('All item quantities must be positive numbers');
      return false;
    }
    return true;
  };

  const handleMedicationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMedicationData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handlePrescriptionChange = (e) => {
    const { name, value } = e.target;
    setPrescriptionData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleItemChange = (index, field, value) => {
    setPrescriptionData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? { ...item, [field]: value } : item),
    }));
    setError(null);
    setSuccess(null);
  };

  const addItem = () => {
    setPrescriptionData(prev => ({
      ...prev,
      items: [...prev.items, { medicationId: '', quantity: '', dosage: '' }],
    }));
  };

  const removeItem = (index) => {
    setPrescriptionData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleMedicationSubmit = async (e) => {
    e.preventDefault();
    if (!validateMedication()) return;

    try {
      const payload = {
        ...medicationData,
        stockQuantity: parseInt(medicationData.stockQuantity),
        minStockThreshold: parseInt(medicationData.minStockThreshold) || 10,
        price: parseFloat(medicationData.price),
        supplierId: medicationData.supplierId ? parseInt(medicationData.supplierId) : undefined,
        formularyId: medicationData.formularyId ? parseInt(medicationData.formularyId) : undefined,
      };
      await addMedication(payload);
      setMedicationData({
        name: '',
        genericName: '',
        category: '',
        batchNumber: '',
        barcode: '',
        rfid: '',
        stockQuantity: '',
        minStockThreshold: 10,
        price: '',
        expiryDate: '',
        supplierId: '',
        formularyId: '',
        narcotic: false,
      });
      setSuccess('Medication added successfully');
      setError(null);
    } catch (err) {
      setError('Failed to add medication: ' + err.message);
      setSuccess(null);
    }
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!validatePrescription()) return;

    try {
      const payload = {
        patientId: parseInt(prescriptionData.patientId),
        doctorId: parseInt(prescriptionData.doctorId),
        notes: prescriptionData.notes,
        items: prescriptionData.items.map(item => ({
          medicationId: parseInt(item.medicationId),
          quantity: parseInt(item.quantity),
          dosage: item.dosage,
        })),
      };
      const newPrescription = await createPrescription(payload);
      setPrescriptionData({
        patientId: '',
        doctorId: '',
        notes: '',
        items: [{ medicationId: '', quantity: '', dosage: '' }],
      });
      setSuccess(`Prescription created successfully (ID: ${newPrescription.id})`);
      setError(null);
    } catch (err) {
      setError('Failed to create prescription: ' + err.message);
      setSuccess(null);
    }
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Pharmacy Management</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Medication Form */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>Add New Medication</Typography>
        <form onSubmit={handleMedicationSubmit} className={styles.form}>
          <TextField
            label="Medication Name"
            name="name"
            value={medicationData.name}
            onChange={handleMedicationChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Generic Name"
            name="genericName"
            value={medicationData.genericName}
            onChange={handleMedicationChange}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Category"
            name="category"
            value={medicationData.category}
            onChange={handleMedicationChange}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="Analgesics">Analgesics</MenuItem>
            <MenuItem value="Antibiotics">Antibiotics</MenuItem>
            <MenuItem value="Antivirals">Antivirals</MenuItem>
            <MenuItem value="Narcotics">Narcotics</MenuItem>
          </TextField>
          <TextField
            label="Batch Number"
            name="batchNumber"
            value={medicationData.batchNumber}
            onChange={handleMedicationChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Barcode"
            name="barcode"
            value={medicationData.barcode}
            onChange={handleMedicationChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="RFID"
            name="rfid"
            value={medicationData.rfid}
            onChange={handleMedicationChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Stock Quantity"
            name="stockQuantity"
            type="number"
            value={medicationData.stockQuantity}
            onChange={handleMedicationChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Minimum Stock Threshold"
            name="minStockThreshold"
            type="number"
            value={medicationData.minStockThreshold}
            onChange={handleMedicationChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={medicationData.price}
            onChange={handleMedicationChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Expiry Date"
            name="expiryDate"
            type="date"
            value={medicationData.expiryDate}
            onChange={handleMedicationChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            select
            label="Supplier"
            name="supplierId"
            value={medicationData.supplierId}
            onChange={handleMedicationChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="">None</MenuItem>
            {suppliers.map(supplier => (
              <MenuItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Formulary"
            name="formularyId"
            value={medicationData.formularyId}
            onChange={handleMedicationChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="">None</MenuItem>
            {formularies.map(formulary => (
              <MenuItem key={formulary.id} value={formulary.id}>
                {formulary.name}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                name="narcotic"
                checked={medicationData.narcotic}
                onChange={handleMedicationChange}
              />
            }
            label="Narcotic"
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Add Medication
          </Button>
        </form>
      </Box>

      {/* Prescription Form */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>Add New Prescription</Typography>
        <form onSubmit={handlePrescriptionSubmit} className={styles.form}>
          <Autocomplete
            options={patients}
            getOptionLabel={(option) => `${option.name} (ID: ${option.id})`}
            onChange={(e, value) => {
              setPrescriptionData(prev => ({
                ...prev,
                patientId: value ? value.id.toString() : '',
              }));
              setError(null);
              setSuccess(null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Patient"
                margin="normal"
                fullWidth
                required
              />
            )}
            value={patients.find(p => p.id.toString() === prescriptionData.patientId) || null}
            renderOption={(props, option) => (
              <li {...props}>{`${option.name} (ID: ${option.id})`}</li>
            )}
          />
          <TextField
            label="Patient ID"
            name="patientId"
            value={prescriptionData.patientId}
            onChange={handlePrescriptionChange}
            fullWidth
            margin="normal"
            disabled
          />
          <Autocomplete
            options={doctors}
            getOptionLabel={(option) => `${option.name} (ID: ${option.id})`}
            onChange={(e, value) => {
              setPrescriptionData(prev => ({
                ...prev,
                doctorId: value ? value.id.toString() : '',
              }));
              setError(null);
              setSuccess(null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Doctor"
                margin="normal"
                fullWidth
                required
              />
            )}
            value={doctors.find(d => d.id.toString() === prescriptionData.doctorId) || null}
            renderOption={(props, option) => (
              <li {...props}>{`${option.name} (ID: ${option.id})`}</li>
            )}
          />
          <TextField
            label="Doctor ID"
            name="doctorId"
            value={prescriptionData.doctorId}
            onChange={handlePrescriptionChange}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            label="Notes"
            name="notes"
            value={prescriptionData.notes}
            onChange={handlePrescriptionChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <Typography variant="subtitle2" sx={{ mt: 2 }}>Prescription Items</Typography>
          {prescriptionData.items.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <Autocomplete
                options={medications}
                getOptionLabel={(option) => `${option.name} (Generic: ${option.genericName || 'N/A'}, Category: ${option.category})`}
                onChange={(e, value) => handleItemChange(index, 'medicationId', value ? value.id.toString() : '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Medication"
                    fullWidth
                    required
                  />
                )}
                value={medications.find(m => m.id.toString() === item.medicationId) || null}
                renderOption={(props, option) => (
                  <li {...props}>{`${option.name} (Generic: ${option.genericName || 'N/A'}, Category: ${option.category})`}</li>
                )}
                sx={{ flex: 2 }}
              />
              <TextField
                label="Quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                type="number"
                fullWidth
                required
                sx={{ flex: 1 }}
              />
              <TextField
                label="Dosage"
                value={item.dosage}
                onChange={(e) => handleItemChange(index, 'dosage', e.target.value)}
                fullWidth
                required
                sx={{ flex: 1 }}
              />
              <Button variant="outlined" color="error" onClick={() => removeItem(index)}>
                Remove
              </Button>
            </Box>
          ))}
          <Button variant="outlined" onClick={addItem} sx={{ mb: 2 }}>
            Add Item
          </Button>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Create Prescription
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default PharmacyForm;