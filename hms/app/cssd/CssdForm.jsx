'use client';
import React, { useState } from 'react';
import styles from './CssdForm.module.css';
import { createCssdRecord } from './cssdService';

export default function CssdForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    itemName: '',
    sterilizationDate: '',
    status: 'PENDING',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCssdRecord(formData);
      onSuccess();
      setFormData({ itemName: '', sterilizationDate: '', status: 'PENDING' });
    } catch (err) {
      setError('Failed to create CSSD record');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Item Name</label>
        <input
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label>Sterilization Date</label>
        <input
          type="datetime-local"
          name="sterilizationDate"
          value={formData.sterilizationDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="PENDING">Pending</option>
          <option value="STERILIZED">Sterilized</option>
          <option value="USED">Used</option>
        </select>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button}>
        Create Record
      </button>
    </form>
  );
}
