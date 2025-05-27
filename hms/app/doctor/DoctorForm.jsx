'use client';
import React, { useState } from 'react';
import styles from './DoctorForm.module.css';
import { createDoctor } from './doctorService';

export default function DoctorForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    phone: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDoctor(formData);
      onSuccess();
      setFormData({ name: '', specialty: '', phone: '' });
    } catch (err) {
      setError('Failed to create doctor');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label>Specialty</label>
        <input
          type="text"
          name="specialty"
          value={formData.specialty}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button}>
        Create Doctor
      </button>
    </form>
  );
}
