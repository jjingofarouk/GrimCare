import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, MenuItem, Select, FormControlLabel, Checkbox, Alert } from '@mui/material';
import { addMedication, getSuppliers, getFormularies } from './pharmacyService';
import styles from './PharmacyForm.module.css';

const PharmacyForm = () => {
  const [formData, setFormData] = useState({
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
        setError('Failed to fetch suppliers or formularies: ' + err.message);
      }
    };
    fetchData();
  }, []);

  const validateForm = () => {
    const requiredFields = ['name', 'category', 'batchNumber', 'stockQuantity', 'price', 'expiryDate'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Missing required field: ${field}`);
        return false;
      }
    }
    if (isNaN(parseInt(formData.stockQuantity)) || parseInt(formData.stockQuantity) < 0) {
      setError('Stock Quantity must be a non-negative number');
      return false;
    }
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      setError('Price must be a non-negative number');
      return false;
    }
    if (new Date(formData.expiryDate) <= new Date()) {
      setError('Expiry Date must be in the future');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const payload = {
        ...formData,
        stockQuantity: parseInt(formData.stockQuantity),
        minStockThreshold: parseInt(formData.minStockThreshold) || 10,
        price: parseFloat(formData.price),
        supplierId: formData.supplierId ? parseInt(formData.supplierId) : undefined,
        formularyId: formData.formularyId ? parseInt(formData.formularyId) : undefined,
      };
      await addMedication(payload);
      setFormData({
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
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField
          label="Medication Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
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
          value={formData.batchNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
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
          required
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
          required
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
          required
        />
        <TextField
          select
          label="Supplier"
          name="supplierId"
          value={formData.supplierId}
          onChange={handleChange}
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
          value={formData.formularyId}
          onChange={handleChange}
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
              checked={formData.narcotic}
              onChange={handleChange}
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