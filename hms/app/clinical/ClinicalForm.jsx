'use client';
import React, { useState } from 'react';
import styles from './ClinicalForm.module.css';
import { createClinicalRecord } from './clinicalService';

export default function ClinicalForm({ patients, onSuccess }) {
  const [formData, setFormData] = useState({
    patientId: '',
    diagnosis: '',
    treatment: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createClinicalRecord(formData);
      onSuccess();
      setFormData({ patientId: '', diagnosis: '', treatment: '' });
    } catch (err) {
      setError('Failed to create clinical record');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Patient</label>
        <select
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          required
        >
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label>Diagnosis</label>
        <input
          type="text"
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label>Treatment</label>
        <textarea
          name="treatment"
          value={formData.treatment}
          onChange={handleChange}
          required
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button}>
        Create Record
      </button>
    </form>
  );
}
