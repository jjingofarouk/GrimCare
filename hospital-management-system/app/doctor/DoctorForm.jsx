'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, MenuItem, Input } from '@mui/material'; // Removed FormControlLabel, Switch
import styles from './DoctorForm.module.css';
import * as doctorService from './doctorService';

const DoctorForm = ({ doctor, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    specialty: '',
    department: '',
    ward: '',
    email: '',
    phone: '',
    designation: '',
    qualifications: '',
    experience: '',
    availabilityStatus: 'Available',
    hospital: 'Mulago National Referral Hospital',
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
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
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <Input
        type="file"
        name="photo"
        onChange={handleFileChange}
        fullWidth
        inputProps={{ accept: 'image/*' }}
        sx={{ mt: 2 }}
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
        {['Cardiology', 'Pediatrics', 'Orthopedics', 'Neurology', 'General Medicine'].map((option) => (
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
        {['Cardiology Unit', 'Pediatrics Unit', 'Orthopedics Unit', 'Neurology Unit', 'General Ward'].map((option) => (
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
        label="Designation"
        name="designation"
        value={formData.designation}
        onChange={handleChange}
        fullWidth
        margin="normal"
        select
      >
        {['Consultant', 'Registrar', 'Senior Medical Officer', 'Medical Officer'].map((option) => (
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
      <TextField
        label="Availability Status"
        name="availabilityStatus"
        value={formData.availabilityStatus}
        onChange={handleChange}
        fullWidth
        margin="normal"
        select
      >
        {['Available', 'On Leave', 'On Duty', 'In Surgery', 'In Consultation'].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>
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