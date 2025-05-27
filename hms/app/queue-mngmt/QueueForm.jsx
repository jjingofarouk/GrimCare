// queue-mngmt/QueueForm.jsx
'use client';
import React, { useState } from 'react';
import styles from './QueueForm.module.css';
import { createQueue } from './queueService';

const QueueForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    queueId: '',
    department: '',
    status: '',
    queueTime: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createQueue(formData);
      alert('Queue entry created');
    } catch (error) {
      alert('Error creating queue entry');
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
        name="queueId"
        placeholder="Queue ID"
        value={formData.queueId}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="department"
        placeholder="Department"
        value={formData.department}
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
        <option value="Waiting">Waiting</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <input
        type="datetime-local"
        name="queueTime"
        value={formData.queueTime}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default QueueForm;
