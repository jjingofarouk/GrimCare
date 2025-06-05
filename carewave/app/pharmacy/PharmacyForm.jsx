// pharmacy/PharmacyForm.jsx
// Medication addition form

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, MenuItem, FormControlLabel, Checkbox, Alert } from '@mui/material';
import { addMedication, getSuppliers, getFormularies } from './pharmacyService';
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
  const [suppliers, setSuppliers] = useState([]);
  const [formularies, setFormularies] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [supplierData, formularyData] = await Promise.all([
          getSuppliers(),
          getFormularies(),
        ]);
        setSuppliers(supplierData);
        setFormularies(formularyData);
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
        setError(`Missing required field: ${field}`);
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

  const handleMedicationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMedicationData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
    setSuccess(null);
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
        supplierId: medicationData.supplierId ? parseInt(medicationData.supplierId) : null,
        formularyId: medicationData.formularyId ? parseInt(medicationData.formularyId) : null,
      };
      await addMediation(payload);
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

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Add New Medication</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
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
  );
};

export default PharmacyForm;