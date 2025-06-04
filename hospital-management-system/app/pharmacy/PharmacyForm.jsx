
// pharmacy/PharmacyForm.jsx
// Form for adding new medications

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Select } from '@mui/material';
import { addMedication } from './pharmacyService';
import styles from './PharmacyForm.module.css';

const PharmacyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    category: '',
    batchNumber: '',
    barcode: '',
    rfid: '',
    stockQuantity: 0,
    minStockThreshold: 10,
    price: 0,
    expiryDate: '',
    supplierId: '',
    formularyId: '',
    narcotic: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addMedication(formData);
    setFormData({
      name: '',
      genericName: '',
      category: '',
      batchNumber: '',
      barcode: '',
      rfid: '',
      stockQuantity: 0,
      minStockThreshold: 10,
      price: 0,
      expiryDate: '',
      supplierId: '',
      formularyId: '',
      narcotic: false,
    });
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Add New Medication</Typography>
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField
          label="Medication Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Generic Name"
          name="genericName"
          value={formData.genericName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="Analgesics">Analgesics</MenuItem>
          <MenuItem value="Antibiotics">Antibiotics</MenuItem>
          <MenuItem value="Antivirals">Antivirals</MenuItem>
          <MenuItem value="Narcotics">Narcotics</MenuItem>
        </TextField>
        <TextField
          label="Batch Number"
          name="batchNumber"
          value={formData.batchNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Barcode"
          name="barcode"
          value={formData.barcode}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="RFID"
          name="rfid"
          value={formData.rfid}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Stock Quantity"
          name="stockQuantity"
          type="number"
          value={formData.stockQuantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Minimum Stock Threshold"
          name="minStockThreshold"
          type="number"
          value={formData.minStockThreshold}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Expiry Date"
          name="expiryDate"
          type="date"
          value={formData.expiryDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Supplier ID"
          name="supplierId"
          value={formData.supplierId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Formulary ID"
          name="formularyId"
          value={formData.formularyId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginTop: 2 }}>
          <input
            type="checkbox"
            name="narcotic"
            checked={formData.narcotic}
            onChange={handleChange}
          />
          <Typography>Narcotic</Typography>
        </Box>
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Add Medication
        </Button>
      </form>
    </Box>
  );
};

export default PharmacyForm;