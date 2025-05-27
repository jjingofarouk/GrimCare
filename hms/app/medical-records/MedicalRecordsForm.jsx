// medical-records/MedicalRecordsForm.jsx
'use client';
import React, { useState } from 'react';
import styles from './MedicalRecordsForm.module.css';
import { createMedicalRecord } from './medicalRecordsService';

const MedicalRecordsForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    recordId: '',
    diagnosis: '',
    date: '',
    doctorName: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMedicalRecord(formData);
      alert('Medical record created');
    } catch (error) {
      alert('Error creating medical record');
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
        name="recordId"
        placeholder="Record ID"
        value={formData.recordId}
        onChange={handleChange}
        required
      />
      <textarea
        name="diagnosis"
        placeholder="Diagnosis"
        value={formData.diagnosis}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="doctorName"
        placeholder="Doctor Name"
        value={formData.doctorName}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default MedicalRecordsForm;
