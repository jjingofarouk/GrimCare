// pharmacy/PharmacyForm.jsx
'use client';
import React, { useState } from 'react';
import styles from './PharmacyForm.module.css';
import { createPrescription } from './pharmacyService';

const PharmacyForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    prescriptionId: '',
    medication: '',
    status: '',
    date: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPrescription(formData);
      alert('Prescription created');
    } catch (error) {
      alert('Error creating prescription');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="patientName"
        placeholder="Patient Name"
        value={formData.patientName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="prescriptionId"
        placeholder="Prescription ID"
        value={formData.prescriptionId}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="medication"
        placeholder="Medication"
        value={formData.medication}
        onChange={handleChange}
        required
      />
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
      >
        <option value="">Select Status</option>
        <option value="Filled">Filled</option>
        <option value="Pending">Pending</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default PharmacyForm;
