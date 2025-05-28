import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, FormControlLabel, Switch } from '@mui/material';
import styles from './DoctorForm.module.css';
import * as doctorService from './doctorService';

const DoctorForm = ({ doctor, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    department: '',
    ward: '',
    email: '',
    phone: '',
    availability: true,
    qualifications: '',
    experience: '',
  });

  useEffect(() => {
    if (doctor) {
      setFormData(doctor);
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (e) => {
    setFormData({ ...formData, availability: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (doctor) {
      await doctorService.updateDoctor(doctor.id, formData);
    } else {
      await doctorService.createDoctor(formData);
    }
    onSave();
  };

  return (
    <Box component="form" className={styles.form} onSubmit={handleSubmit}>
      <TextField
        label="Name"
 strolled="true"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Specialty"
        name="specialty"
        value={formData.specialty}
        onChange={handleChange}
        fullWidth
        margin="normal"
        select
      >
        {['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine'].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Department"
        name="department"
        value={formData.department}
        onChange={handleChange}
        fullWidth
        margin="normal"
        select
      >
        {['Cardiology Dept', 'Neurology Dept', 'Pediatrics Dept', 'Orthopedics Dept', 'General Ward'].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Ward"
        name="ward"
        value={formData.ward}
        onChange={handleChange}
        fullWidth
        margin="normal"
        select
      >
        {['Ward A', 'Ward B', 'Ward C', 'ICU', 'Emergency'].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="email"
      />
      <TextField
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="tel"
      />
      <TextField
        label="Qualifications"
        name="qualifications"
        value={formData.qualifications}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={3}
      />
      <TextField
        label="Years of Experience"
        name="experience"
        value={formData.experience}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="number"
      />
      <FormControlLabel
        control={<Switch checked={formData.availability} onChange={handleSwitchChange} />}
        label="Available"
      />
      <Box mt={2} display="flex" gap={2}>
        <Button type="submit" variant="contained" color="primary">
          {doctor ? 'Update' : 'Add'} Doctor
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default DoctorForm;
