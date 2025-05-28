// pharmacy/PharmacyForm.jsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, MenuItem } from '@mui/material';
import { addMedication } from './pharmacyService';
import styles from './PharmacyForm.module.css';

const PharmacyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    stock: 0,
    price: 0,
    expiry: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addMedication(formData);
    setFormData({ name: '', category: '', stock: 0, price: 0, expiry: '' });
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
        </TextField>
        <TextField
          label="Stock"
          name="stock"
          type="number"
          value={formData.stock}
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
          name="expiry"
          type="date"
          value={formData.expiry}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <Button type="submit" variant="contained">
          Add Medication
        </Button>
      </form>
    </Box>
  );
};

export default PharmacyForm;
