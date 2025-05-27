// radiology/RadiologyForm.jsx
'use client';
import React, { useState } from 'react';
import styles from './RadiologyForm.module.css';
import { createRadiologyScan } from './radiologyService';

const RadiologyForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    scanId: '',
    scanType: '',
    status: '',
    date: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRadiologyScan(formData);
      alert('Radiology scan created');
    } catch (error) {
      alert('Error creating radiology scan');
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
        name="scanId"
        placeholder="Scan ID"
        value={formData.scanId}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="scanType"
        placeholder="Scan Type"
        value={formData.scanType}
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
        <option value="Scheduled">Scheduled</option>
        <option value="Completed">Completed</option>
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

export default RadiologyForm;
